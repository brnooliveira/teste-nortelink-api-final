import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AutoresModule } from './autores/autores.module';
import { AssuntosModule } from './assuntos/assuntos.module';
import { LivrosModule } from './livros/livros.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => typeOrmConfig,
    }),
    UsuariosModule,
    AutoresModule,
    AssuntosModule,
    LivrosModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
