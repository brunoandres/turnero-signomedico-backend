import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Afiliado } from './schemas/afiliado.schema';
import { CreateAfiliadoDto } from './dto/create-afiliado.dto';

@Injectable()
export class AfiliadosService {

  constructor(
    @InjectModel(Afiliado.name)
    private afiliadoModel: Model<Afiliado>,
  ) {}

  async findByDni(dni: string) {
    return this.afiliadoModel.findOne({ dni });
  }

  async create(dto: CreateAfiliadoDto) {
    const afiliado = new this.afiliadoModel(dto);
    return afiliado.save();
  }

}