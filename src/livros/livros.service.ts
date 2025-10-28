import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLivroDto } from './dto/create-livro.dto';
import { UpdateLivroDto } from './dto/update-livro.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Livro, StatusLivro } from './entities/livro.entity';
import { Repository } from 'typeorm';
import { Autor } from 'src/autores/entities/autor.entity';
import { Assunto } from 'src/assuntos/entities/assunto.entity';

interface FindAllFilters {
  page?: number;
  limit?: number;
  sortBy?: 'id' | 'titulo' | 'autor' | 'assunto';
  order?: 'ASC' | 'DESC';
  autor?: string;
  assunto?: string;
  titulo?: string;
  status?: StatusLivro;
  dataInicio?: string;
  dataFim?: string;
}

@Injectable()
export class LivrosService {
  constructor(
    @InjectRepository(Livro)
    private readonly livrosRepository: Repository<Livro>,
    @InjectRepository(Autor)
    private readonly autoresRepository: Repository<Autor>,
    @InjectRepository(Assunto)
    private readonly assuntosRepository: Repository<Assunto>,
  ) {}

  async create(createLivroDto: CreateLivroDto) {
    const autor = await this.autoresRepository.findOne({
      where: { id: createLivroDto.autor_id },
    });

    if (!autor) {
      throw new NotFoundException(
        `Autor com ID ${createLivroDto.autor_id} não encontrado`,
      );
    }

    const assunto = await this.assuntosRepository.findOne({
      where: { id: createLivroDto.assunto_id },
    });

    if (!assunto) {
      throw new NotFoundException(
        `Assunto com ID ${createLivroDto.assunto_id} não encontrado`,
      );
    }

    const livro = this.livrosRepository.create({
      titulo: createLivroDto.titulo,
      url_livro: createLivroDto.url_livro,
      status: createLivroDto.status || StatusLivro.A_LER,
      autor: { id: createLivroDto.autor_id },
      assunto: { id: createLivroDto.assunto_id },
    });

    return await this.livrosRepository.save(livro);
  }

  async findAll(filters: FindAllFilters) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      order = 'ASC',
      autor,
      assunto,
      titulo,
      status,
      dataInicio,
      dataFim,
    } = filters;

    const skip = (page - 1) * limit;

    const queryBuilder = this.livrosRepository
      .createQueryBuilder('livro')
      .leftJoinAndSelect('livro.autor', 'autor')
      .leftJoinAndSelect('livro.assunto', 'assunto');

    if (autor) {
      queryBuilder.andWhere('autor.id = :autor', { autor });
    }

    if (assunto) {
      queryBuilder.andWhere('assunto.id = :assunto', { assunto });
    }

    if (titulo) {
      queryBuilder.andWhere('livro.titulo ILIKE :titulo', {
        titulo: `%${titulo}%`,
      });
    }

    if (status) {
      queryBuilder.andWhere('livro.status = :status', { status });
    }

    if (dataInicio && dataFim && status === StatusLivro.LIDO) {
      queryBuilder.andWhere(
        'livro.data_status BETWEEN :dataInicio AND :dataFim',
        {
          dataInicio,
          dataFim,
        },
      );
    }

    let orderField = 'livro.id';
    if (sortBy === 'titulo') orderField = 'livro.titulo';
    if (sortBy === 'autor') orderField = 'autor.nome';
    if (sortBy === 'assunto') orderField = 'assunto.descricao';

    queryBuilder.orderBy(orderField, order).skip(skip).take(limit);

    const [livros, total] = await queryBuilder.getManyAndCount();

    return {
      data: livros,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Livro> {
    const livro = await this.livrosRepository.findOne({
      where: { id },
      relations: ['autor', 'assunto'],
    });

    if (!livro) {
      throw new NotFoundException(`Livro com ID ${id} não encontrado`);
    }

    return livro;
  }

  async update(id: string, updateLivroDto: UpdateLivroDto) {
    const livro = await this.findOne(id);

    if (updateLivroDto.titulo) livro.titulo = updateLivroDto.titulo;
    if (updateLivroDto.url_livro) livro.url_livro = updateLivroDto.url_livro;

    if (updateLivroDto.autor_id) {
      const autor = await this.autoresRepository.findOne({
        where: { id: updateLivroDto.autor_id },
      });

      if (!autor) {
        throw new NotFoundException(
          `Autor com ID ${updateLivroDto.autor_id} não encontrado`,
        );
      }

      livro.autor = autor;
    }

    if (updateLivroDto.assunto_id) {
      const assunto = await this.assuntosRepository.findOne({
        where: { id: updateLivroDto.assunto_id },
      });

      if (!assunto) {
        throw new NotFoundException(
          `Assunto com ID ${updateLivroDto.assunto_id} não encontrado`,
        );
      }

      livro.assunto = assunto;
    }

    if (updateLivroDto.status) {
      livro.status = updateLivroDto.status;
      livro.data_status = new Date();
    }

    await this.livrosRepository.save(livro);

    return await this.findOne(id);
  }

  async updateImagem(id: string, url_imagem: string) {
    const livro = await this.findOne(id);
    livro.url_imagem = url_imagem;
    await this.livrosRepository.save(livro);
    return livro;
  }

  async remove(id: string) {
    const livro = await this.findOne(id);
    await this.livrosRepository.remove(livro);

    return {
      message: 'Livro removido com sucesso',
      id,
    };
  }
}
