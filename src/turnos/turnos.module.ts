import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GatewayModule } from 'src/gateways/gateway.module';
import { TurnosGateway } from 'src/gateways/turnos.gateway';
import { PrinterModule } from 'src/printer/printer.module';
import { Sector, SectorSchema } from 'src/sectores/schemas/sectores.schema';
import { SectoresService } from 'src/sectores/sectores.service';
import { User, UserSchema } from 'src/users/schemas/users.chema';
import { Turno, TurnoSchema } from './schemas/turnos.schema';
import { TurnosController } from './turnos.controller';
import { TurnosService } from './turnos.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Turno.name, schema: TurnoSchema },
      { name: Sector.name, schema: SectorSchema },
      { name: User.name, schema: UserSchema }
    ]), PrinterModule
  ],
  controllers: [TurnosController],
  providers: [TurnosService, TurnosGateway, SectoresService]
})
export class TurnosModule { }
