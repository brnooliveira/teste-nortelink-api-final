import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAssuntoDto {
  @IsString({ message: 'A descrição deve ser uma string' })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @MaxLength(100, { message: 'A descrição deve ter no máximo 100 caracteres' })
  descricao: string;
}
