import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TurnosGateway } from 'src/gateways/turnos.gateway';
import { SectorSchema } from './schemas/sectores.schema';
import { SectoresController } from './sectores.controller';
import { SectoresService } from './sectores.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Sector', schema: SectorSchema }])],
  controllers: [SectoresController],
  providers: [SectoresService, TurnosGateway]
})
export class SectoresModule {}
