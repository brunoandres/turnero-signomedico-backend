import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Put, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PrinterService } from 'src/printer/printer.service';
import { CreateTurnoDto } from './dto/createTurnoDto';
import { TurnoEstado, UpdateTurnoDto } from './dto/updateTurnoDto';
import { Turno } from './turnos.interface';
import { TurnosService } from './turnos.service';

@ApiBearerAuth()
@Controller('turnos')
export class TurnosController {

  constructor(@Inject(TurnosService) private readonly turnoService: TurnosService, @Inject(PrinterService) private readonly printerService: PrinterService) { }

  // Retorna todos los turnos
  @Get()
  findAll() {
    return this.turnoService.findAll();
  }

  // Retorna todos los turnos en estado atendiendo
  @Get('/atendiendo')
  findAllAtendiendos() {
    return this.turnoService.findAllAtendiendo();
  }

  // Retorna todos los turnos en estado finalizados
  @Get('/finalizados/:sector')
  findAllFinalizados(@Param('sector') sector: string) {
    return this.turnoService.findAllFinalizados(sector);
  }

  // Crea un nuevo turno
  @Post('/create')
  @UsePipes(ValidationPipe)
  async create(@Body() turno: CreateTurnoDto, @Res() response) {
    // Consultar si hay turnos hoy
    const turnosHoy = await this.turnoService.findTurnosToday(turno);
    if (turnosHoy >= 1) { // Hay turnos
      // hay que consultar si estos turnos, alguno es de este tipo
      turno.numero = (await this.turnoService.findOneLast(turno)) ? (await this.turnoService.findOneLast(turno)).numero + 1 : 1;
    } else {
      turno.numero = 1;
    }

    this.turnoService.create(turno).then(async (turnoCreado: Turno) => {
      response.status(HttpStatus.OK).json(turnoCreado);
      // Acá devolver un contador de los turnos pendientes para el sector
      turnoCreado.pendientes = await this.turnoService.countTurnosPendientes(turnoCreado);
      // Mandar a imprimir ticket
      await this.printerService.print(turnoCreado);
      return turnoCreado;

    }).catch((error) => {
      console.log(error);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    });
  }

  // Actualiza un turno específico
  @Put(':id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() turno: UpdateTurnoDto) {
    return this.turnoService.update(id, turno);
  }

  // Retorna un turno específico
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.turnoService.findTurnoById(id);
  }

  // Retorna un turno específico
  @Get('llamar/:id')
  llamarTurnoFindById(@Param('id') id: string) {
    return this.turnoService.llamarTurnoFindById(id);
  }

  @Get('sector/:id/:estado')
  findBySectorEstado(@Param('id') sector: string, @Param('estado') estado: string){
    const turnosBySector = this.turnoService.findTurnosBySectorEstado(sector, estado.toLocaleLowerCase());
    console.log('Turnos by sector: ', turnosBySector)
    return turnosBySector;
  }

  @Get('sector/:id')
  findBySector(@Param('id') sector: string){
    return this.turnoService.findTurnosBySector(sector);
  }

  @Get('user/:id')
  findByUser(@Param('id') user: string){
    return this.turnoService.findTurnosByUser(user);
  }

  @Delete('/delete/:id')
  delete(@Param('id') id: string){
    return this.turnoService.deleteTurnos(id);
  }

}
