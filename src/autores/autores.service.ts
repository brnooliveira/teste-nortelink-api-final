import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAutorDto } from './dto/create-autor.dto';
import { UpdateAutorDto } from './dto/update-autor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Autor } from './entities/autor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AutoresService {
  constructor(
    @InjectRepository(Autor)
    private readonly autoresRepository: Repository<Autor>,
  ) {}

  async create(createAutorDto: CreateAutorDto) {
    const exists = await this.autoresRepository.exists({
      where: { nome: createAutorDto.nome },
    });

    if (exists) {
      throw new ConflictException('Já existe um autor com este nome');
    }

    const novoAutor = this.autoresRepository.create(createAutorDto);
    return await this.autoresRepository.save(novoAutor);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    sortBy: 'id' | 'nome' = 'id',
    order: 'ASC' | 'DESC' = 'ASC',
  ) {
    const skip = (page - 1) * limit;

    const [autores, total] = await this.autoresRepository.findAndCount({
      skip,
      take: limit,
      order: {
        [sortBy]: order,
      },
    });

    return {
      data: autores,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Autor> {
    const autor = await this.autoresRepository.findOne({
      where: { id },
      relations: ['livros'],
    });

    if (!autor) {
      throw new NotFoundException(`Autor com ID ${id} não encontrado`);
    }

    return autor;
  }

  async update(id: string, updateAutorDto: UpdateAutorDto) {
    const autor = await this.autoresRepository.findOne({ where: { id } });

    if (!autor) {
      throw new NotFoundException(`Autor com ID ${id} não encontrado`);
    }

    if (updateAutorDto.nome && updateAutorDto.nome !== autor.nome) {
      const nomeExists = await this.autoresRepository.exists({
        where: { nome: updateAutorDto.nome },
      });

      if (nomeExists) {
        throw new ConflictException('Já existe um autor com este nome');
      }
    }

    await this.autoresRepository.update(id, updateAutorDto);

    return await this.autoresRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    const autor = await this.autoresRepository.findOne({
      where: { id },
      relations: ['livros'],
    });

    if (!autor) {
      throw new NotFoundException(`Autor com ID ${id} não encontrado`);
    }

    if (autor.livros && autor.livros.length > 0) {
      throw new ConflictException(
        'Não é possível excluir um autor que possui livros cadastrados',
      );
    }

    await this.autoresRepository.remove(autor);

    return {
      message: 'Autor removido com sucesso',
      id,
    };
  }
}
