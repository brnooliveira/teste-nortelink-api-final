import { Module } from '@nestjs/common';
import { AssuntosService } from './assuntos.service';
import { AssuntosController } from './assuntos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assunto } from './entities/assunto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assunto])],
  controllers: [AssuntosController],
  providers: [AssuntosService],
})
export class AssuntosModule {}
