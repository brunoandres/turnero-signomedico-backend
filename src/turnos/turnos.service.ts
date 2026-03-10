import { Model } from 'mongoose';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTurnoDto } from './dto/createTurnoDto';
import { Sector } from 'src/sectores/schemas/sectores.schema';
import { User } from 'src/users/schemas/users.chema';
import { UpdateTurnoDto } from './dto/updateTurnoDto';
import { PrinterService } from 'src/printer/printer.service';
import { Turno } from './turnos.interface';
import { TurnosGateway } from '../gateways/turnos.gateway';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
export class TurnosService {
  constructor(
    @InjectModel('Turno') private turnoModel: Model<Turno>,
    @InjectModel(Sector.name) private sectorModel: Model<Sector>,
    @InjectModel(User.name) private userModel: Model<User>, public printerService: PrinterService,
    private turnosGateway: TurnosGateway
  ) { }

  @WebSocketServer() server: Server;

  countDocuments(): any{
    return this.turnoModel.countDocuments();
  }

  async create(createTurno: CreateTurnoDto): Promise<any> {
    try {
      const createdTurno = new this.turnoModel(createTurno);
      const nuevoTurno = await (await createdTurno.save()).populate('sector');
      this.turnosGateway.server.emit('actualizacion-turnos',nuevoTurno);
      return nuevoTurno
    
      /*let nuevoTurno: Turno;
      (await createdTurno.save()).populate('sector').then(turno => {
        nuevoTurno = turno
        //Emito un evento con el turno creado
        this.turnosGateway.server.emit('actualizacion-turnos',turno);
        return nuevoTurno;
      })*/
      

    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error("Error create") });
    }
  }

  // Actualizo estado del turno y además los tiempos de demora
  async update(id: string, updateTurno: UpdateTurnoDto): Promise<Turno> {

    let atender: boolean = false;

    const fechaHoraActual = new Date();
    const fechaTurno = (await this.findTurnoById(id)).fecha;
    const fechaTurnoAtendido = (await this.findTurnoById(id)).horaAtencion;
    if (updateTurno.estado.toUpperCase() == 'ATENDIENDO') {
      const diferenciaEnMinutos = Math.round(
        (fechaHoraActual.getTime() - fechaTurno.getTime()) / (1000 * 60)
      );
      updateTurno.horaAtencion = new Date();
      updateTurno.demoraAtencion = diferenciaEnMinutos;
      atender = true;
      
    }
    if (updateTurno.estado.toUpperCase() == 'FINALIZADO') {
      const minutosAtendidos = Math.round(
        (fechaHoraActual.getTime() - fechaTurnoAtendido.getTime()) / (1000 * 60)
      );
      updateTurno.horaFinalizado = new Date();
      updateTurno.duracionAtencion = minutosAtendidos;
    }
    try {
      const objetoActualizado = await this.turnoModel.findByIdAndUpdate(id, updateTurno, { new: true }).populate('sector');

      //Emito un evento con el turno actualizado
      this.turnosGateway.server.emit('actualizacion-turnos',objetoActualizado);

      this.turnosGateway.server.emit('atender-turno',{atender, objetoActualizado});
      return objetoActualizado;
    } catch (error) {
      console.error(error);
    }
  }

  async findAll(): Promise<Turno[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return this.turnoModel.find({ fecha: { $gte: startOfDay } }).sort({ numero: 1 }).populate('sector').populate('user').exec();
  }

  // Retorna los turnos en estado atendiendo para mostrar la pantalla contribuyente
  async findAllAtendiendo(): Promise<Turno[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return this.turnoModel.find({ estado: 'atendiendo', fecha: { $gte: startOfDay } }).sort({ horaAtencion: -1 }).populate('sector').populate('user').exec();
  }

  // Retorna los turnos en estado finalizados
  async findAllFinalizados(sector: string): Promise<Turno[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return this.turnoModel.find({ estado: 'finalizado', fecha: { $gte: startOfDay }, sector: sector }).sort({ horaAtencion: -1 }).populate('sector').populate('user').exec();
  }

  async findTurnoById(id: string): Promise<Turno> {
    try {
      const turno = await this.turnoModel.findById(id).populate('sector').populate('user');
      return turno;
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error("Error findById") });
    }
  }

  async llamarTurnoFindById(id: string): Promise<Turno> {
    try {
      const turno = await this.turnoModel.findById(id).populate('sector').populate('user');
      this.turnosGateway.server.emit('llamar-turno-refrescar', turno);
      return turno;
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error("Error findById") });
    }
  }

  // Retorna los turnos por sector y estado
  async findTurnosBySectorEstado(id: string, estado: string): Promise<Turno[]> {
    return await this.turnoModel.find({ sector: id, estado: estado }).populate('sector').populate('user').exec();
  }

  // Retorna los turnos por sector
  async findTurnosBySector(id: string): Promise<Turno[]> {
    //return await this.turnoModel.find({ sector: id, estado: {$ne : 'finalizado'}  }).populate('sector').populate('user').exec();
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return await this.turnoModel.find({ sector: id, fecha: { $gte: startOfDay } }).populate('sector').populate('user').exec();
  }

  // Retorna los turnos por usuario
  async findTurnosByUser(id: string): Promise<Turno[]> {
    return await this.turnoModel.find({ user: id }).populate('sector').populate('user').exec();
  }

  // Retorna un turno pendiente con el numero mayor y la fecha de hoy
  async findOneLast(turno: CreateTurnoDto): Promise<Turno> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return await this.turnoModel.findOne({ 'sector': turno.sector, fecha: { $gte: startOfDay } }).sort({ numero: -1 }).populate('sector').exec();
  }

  // Devolver un turno pendiente con el numero mayor y que sea de hoy
  async findOneLastToday(turno: CreateTurnoDto): Promise<Turno> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return await this.turnoModel.findOne({ 'sector': turno.sector, fecha: { $gte: startOfDay } }).sort({ numero: -1 }).populate('sector').exec();
  }

  // Retorna los turnos entre fechas
  async findTurnosBetweenDates(): Promise<Turno[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return await this.turnoModel.find({ fecha: { $gte: startOfDay, $lt: endOfDay } }).exec();
  }

  // Buscar si hay turnos el día de la fecha # retonar la cantidad en caso de haber
  async findTurnosToday(turno: CreateTurnoDto): Promise<number> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return await this.turnoModel.countDocuments({ fecha: { $gte: startOfDay }, 'sector': turno.sector }).sort({ fecha: -1 }).populate('sector').exec();
  }

  // Retorna la cantidad de turnos pendientes
  async countTurnosPendientes(turno: Turno): Promise<number> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return await this.turnoModel.countDocuments({ estado: 'pendiente', 'sector': turno.sector, fecha: { $gte: startOfDay } }).populate('sector').exec();
  }

  async deleteTurnos(id: string){
    return await this.turnoModel.findOneAndDelete({id: id});
  }

}
