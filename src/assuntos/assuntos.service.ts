import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAssuntoDto } from './dto/create-assunto.dto';
import { UpdateAssuntoDto } from './dto/update-assunto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Assunto } from './entities/assunto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AssuntosService {
  constructor(
    @InjectRepository(Assunto)
    private readonly assuntosRepository: Repository<Assunto>,
  ) {}

  async create(createAssuntoDto: CreateAssuntoDto) {
    const exists = await this.assuntosRepository.exists({
      where: { descricao: createAssuntoDto.descricao },
    });

    if (exists) {
      throw new ConflictException('Já existe um assunto com esta descrição');
    }

    const novoAssunto = this.assuntosRepository.create(createAssuntoDto);
    return await this.assuntosRepository.save(novoAssunto);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    sortBy: 'id' | 'descricao' = 'id',
    order: 'ASC' | 'DESC' = 'ASC',
  ) {
    const skip = (page - 1) * limit;

    const [assuntos, total] = await this.assuntosRepository.findAndCount({
      skip,
      take: limit,
      order: {
        [sortBy]: order,
      },
    });

    return {
      data: assuntos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Assunto> {
    const assunto = await this.assuntosRepository.findOne({
      where: { id },
      relations: ['livros'],
    });

    if (!assunto) {
      throw new NotFoundException(`Assunto com ID ${id} não encontrado`);
    }

    return assunto;
  }

  async update(id: string, updateAssuntoDto: UpdateAssuntoDto) {
    const assunto = await this.assuntosRepository.findOne({ where: { id } });

    if (!assunto) {
      throw new NotFoundException(`Assunto com ID ${id} não encontrado`);
    }

    if (
      updateAssuntoDto.descricao &&
      updateAssuntoDto.descricao !== assunto.descricao
    ) {
      const descricaoExists = await this.assuntosRepository.exists({
        where: { descricao: updateAssuntoDto.descricao },
      });

      if (descricaoExists) {
        throw new ConflictException('Já existe um assunto com esta descrição');
      }
    }

    await this.assuntosRepository.update(id, updateAssuntoDto);

    return await this.assuntosRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    const assunto = await this.assuntosRepository.findOne({
      where: { id },
      relations: ['livros'],
    });

    if (!assunto) {
      throw new NotFoundException(`Assunto com ID ${id} não encontrado`);
    }

    if (assunto.livros && assunto.livros.length > 0) {
      throw new ConflictException(
        'Não é possível excluir um assunto que possui livros cadastrados',
      );
    }

    await this.assuntosRepository.remove(assunto);

    return {
      message: 'Assunto removido com sucesso',
      id,
    };
  }
}
