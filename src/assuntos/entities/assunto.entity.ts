import { Livro } from 'src/livros/entities/livro.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('assuntos')
export class Assunto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  descricao: string;

  @OneToMany(() => Livro, (livro) => livro.assunto)
  livros: Livro[];
}
