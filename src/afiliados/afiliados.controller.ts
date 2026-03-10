import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { AfiliadosService } from './afiliados.service';
import { CreateAfiliadoDto } from './dto/create-afiliado.dto';

@Controller('afiliados')
export class AfiliadosController {

  constructor(private afiliadosService: AfiliadosService) {}

  @Get('dni/:dni')
  buscarPorDni(@Param('dni') dni: string) {
    return this.afiliadosService.findByDni(dni);
  }

  @Post()
  crear(@Body() dto: CreateAfiliadoDto) {
    return this.afiliadosService.create(dto);
  }

}