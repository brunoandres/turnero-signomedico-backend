import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SectorDto } from './dto/sectores.dto';
import { Sector } from './sectores.interface';
import { UpdateSectorDto } from './dto/updateSector.dto';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TurnosGateway } from 'src/gateways/turnos.gateway';

@Injectable()
export class SectoresService {S
  constructor(@InjectModel('Sector') private sectorModel: Model<Sector>, private turnosGateway: TurnosGateway) { }

  @WebSocketServer() server: Server;

  async getAllSectores(): Promise<Sector[]> {
    return await this.sectorModel.find().exec();
  }

  async getAllSectoresActivos(): Promise<Sector[]> {
    return await this.sectorModel.find({activo: true}).exec();
  }

  async createSector(sector: SectorDto): Promise<Sector> {
    return await this.sectorModel.create(sector);
  }

  async updateSector(id: string, sector: UpdateSectorDto): Promise<Sector> {
    const sectorUpdate = await this.sectorModel.findByIdAndUpdate(id, sector);
    this.turnosGateway.server.emit('actualizacion-sector',sectorUpdate);
    return sectorUpdate;
  }

  async getSectorById(id: string): Promise<Sector> {
    return await this.sectorModel.findById(id);
  }
}
