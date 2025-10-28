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
} from '@nestjs/common';
import { AssuntosService } from './assuntos.service';
import { CreateAssuntoDto } from './dto/create-assunto.dto';
import { UpdateAssuntoDto } from './dto/update-assunto.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('assuntos')
@UseGuards(JwtAuthGuard)
export class AssuntosController {
  constructor(private readonly assuntosService: AssuntosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAssuntoDto: CreateAssuntoDto) {
    return this.assuntosService.create(createAssuntoDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy', new DefaultValuePipe('id')) sortBy: 'id' | 'descricao',
    @Query('order', new DefaultValuePipe('ASC')) order: 'ASC' | 'DESC',
  ) {
    return this.assuntosService.findAll(page, limit, sortBy, order);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.assuntosService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateAssuntoDto: UpdateAssuntoDto) {
    return this.assuntosService.update(id, updateAssuntoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.assuntosService.remove(id);
  }
}
