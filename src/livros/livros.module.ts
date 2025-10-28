import { Module } from '@nestjs/common';
import { LivrosService } from './livros.service';
import { LivrosController } from './livros.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Livro } from './entities/livro.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Autor } from 'src/autores/entities/autor.entity';
import { Assunto } from 'src/assuntos/entities/assunto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Livro, Autor, Assunto]),
    MulterModule.register({
      dest: './uploads/livros',
    }),
  ],
  controllers: [LivrosController],
  providers: [LivrosService],
})
export class LivrosModule {}
