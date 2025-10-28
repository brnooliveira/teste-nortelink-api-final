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
import { AutoresService } from './autores.service';
import { CreateAutorDto } from './dto/create-autor.dto';
import { UpdateAutorDto } from './dto/update-autor.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('autores')
@UseGuards(JwtAuthGuard)
export class AutoresController {
  constructor(private readonly autoresService: AutoresService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAutorDto: CreateAutorDto) {
    return this.autoresService.create(createAutorDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy', new DefaultValuePipe('id')) sortBy: 'id' | 'nome',
    @Query('order', new DefaultValuePipe('ASC')) order: 'ASC' | 'DESC',
  ) {
    return this.autoresService.findAll(page, limit, sortBy, order);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.autoresService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateAutorDto: UpdateAutorDto) {
    return this.autoresService.update(id, updateAutorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.autoresService.remove(id);
  }
}
