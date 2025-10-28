import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Autor } from 'src/autores/entities/autor.entity';
import { Assunto } from 'src/assuntos/entities/assunto.entity';

export enum StatusLivro {
  LENDO = 'lendo',
  LIDO = 'lido',
  A_LER = 'a_ler',
}

@Entity('livros')
export class Livro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  titulo: string;

  @ManyToOne(() => Autor)
  @JoinColumn({ name: 'autor_id' })
  autor: Autor;

  @ManyToOne(() => Assunto)
  @JoinColumn({ name: 'assunto_id' })
  assunto: Assunto;

  @Column()
  url_livro: string;

  @Column({ nullable: true })
  url_imagem: string;

  @Column({ type: 'enum', enum: StatusLivro, default: StatusLivro.A_LER })
  status: StatusLivro;

  @Column({
    name: 'data_status',
    type: 'timestamp',
    nullable: true,
  })
  data_status: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
