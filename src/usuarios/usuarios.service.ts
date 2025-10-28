import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { HashingService } from 'src/common/hashing/hashing.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const exists = await this.usuariosRepository.exists({
      where: {
        email: createUsuarioDto.email,
      },
    });

    if (exists) throw new ConflictException('E-mail já existe');

    const hashedPassword = await this.hashingService.hash(
      createUsuarioDto.senha,
    );

    const newUser = this.usuariosRepository.create({
      ...createUsuarioDto,
      senha: hashedPassword,
    });

    const created = await this.usuariosRepository.save(newUser);

    const { senha, ...result } = created;
    return result;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    sortBy: 'id' | 'email' | 'nome' = 'id',
    order: 'ASC' | 'DESC' = 'ASC',
  ) {
    const skip = (page - 1) * limit;

    const [usuarios, total] = await this.usuariosRepository.findAndCount({
      select: ['id', 'nome', 'email', 'admin', 'createdAt', 'updatedAt'],
      skip,
      take: limit,
      order: {
        [sortBy]: order,
      },
    });

    return {
      data: usuarios,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneById(id: string): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      select: ['id', 'nome', 'email', 'admin', 'createdAt', 'updatedAt'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return usuario;
  }

  async findOneByEmail(email: string): Promise<Usuario | null> {
    return this.usuariosRepository.findOne({ where: { email } });
  }

  async updateRefreshToken(user: Usuario) {
    const { id, ...data } = user;
    await this.usuariosRepository.update(id, data);
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    if (updateUsuarioDto.email && updateUsuarioDto.email !== usuario.email) {
      const emailExists = await this.usuariosRepository.exists({
        where: { email: updateUsuarioDto.email },
      });

      if (emailExists) {
        throw new ConflictException('E-mail já está em uso');
      }
    }

    if (updateUsuarioDto.senha) {
      updateUsuarioDto.senha = await this.hashingService.hash(
        updateUsuarioDto.senha,
      );
    }

    await this.usuariosRepository.update(id, updateUsuarioDto);

    const updated = await this.usuariosRepository.findOne({
      where: { id },
      select: ['id', 'nome', 'email', 'admin', 'createdAt', 'updatedAt'],
    });

    return updated;
  }

  async remove(id: string) {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    await this.usuariosRepository.remove(usuario);

    return {
      message: 'Usuário removido com sucesso',
      id,
    };
  }
}
