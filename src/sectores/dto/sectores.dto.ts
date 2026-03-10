import { IsString } from "class-validator";

export class SectorDto{
    id?: string
    @IsString()
    sector: string
    @IsString()
    descripcion: string
    letra: string
}