import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';

export type SectorDocumento = HydratedDocument<Sector>;

@Schema()
export class Sector {
  @IsString()
  @IsOptional()
  @Prop()
  id: String;

  @IsString()
  @Prop({required: true, unique: true})
  sector: String;

  @IsString()
  @Prop()
  descripcion: String;

  @IsBoolean()
  @Prop( {type: Boolean, default: true},)
  activo: Boolean;

  @Prop({required: true, unique: true})
  letra: String
}

export const SectorSchema = SchemaFactory.createForClass(Sector);
SectorSchema.set('versionKey', false);