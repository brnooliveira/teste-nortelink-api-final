import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LivrosService } from './livros.service';
import { CreateLivroDto } from './dto/create-livro.dto';
import { UpdateLivroDto } from './dto/update-livro.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { StatusLivro } from './entities/livro.entity';

@Controller('livros')
@UseGuards(JwtAuthGuard)
export class LivrosController {
  constructor(private readonly livrosService: LivrosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createLivroDto: CreateLivroDto) {
    return this.livrosService.create(createLivroDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy', new DefaultValuePipe('id'))
    sortBy: 'id' | 'titulo' | 'autor' | 'assunto',
    @Query('order', new DefaultValuePipe('ASC')) order: 'ASC' | 'DESC',
    @Query('autor') autor?: string,
    @Query('assunto') assunto?: string,
    @Query('titulo') titulo?: string,
    @Query('status') status?: StatusLivro,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    return this.livrosService.findAll({
      page,
      limit,
      sortBy,
      order,
      autor,
      assunto,
      titulo,
      status,
      dataInicio,
      dataFim,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.livrosService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateLivroDto: UpdateLivroDto) {
    return this.livrosService.update(id, updateLivroDto);
  }

  @Post(':id/imagem')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('imagem', {
      storage: diskStorage({
        destination: './uploads/livros',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `livro-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(
            new BadRequestException(
              'Apenas arquivos de imagem são permitidos (jpg, jpeg, png, gif, webp)',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadImagem(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    const url_imagem = `/uploads/livros/${file.filename}`;
    return await this.livrosService.updateImagem(id, url_imagem);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.livrosService.remove(id);
  }
}
