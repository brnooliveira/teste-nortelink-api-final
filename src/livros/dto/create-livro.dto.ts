import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { StatusLivro } from '../entities/livro.entity';

export class CreateLivroDto {
  @IsString({ message: 'O título deve ser uma string' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  titulo: string;

  @IsUUID('all', { message: 'O ID do autor deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O autor é obrigatório' })
  autor_id: string;

  @IsUUID('all', { message: 'O ID do assunto deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O assunto é obrigatório' })
  assunto_id: string;

  @IsString({ message: 'A URL do livro deve ser uma string' })
  @IsNotEmpty({ message: 'A URL do livro é obrigatória' })
  url_livro: string;

  @IsEnum(StatusLivro, {
    message: 'Status inválido. Use "lendo", "lido" ou "a_ler".',
  })
  @IsOptional()
  status?: StatusLivro = StatusLivro.LENDO;
}
