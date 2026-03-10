import { Module } from "@nestjs/common";
import { SectoresModule } from "src/sectores/sectores.module";
import { TurnosModule } from "src/turnos/turnos.module";
import { TurnosGateway } from "./turnos.gateway";
import { AfiliadosModule } from "src/afiliados/afiliados.module";

@Module({
    imports: [TurnosModule, SectoresModule, AfiliadosModule],
    providers: [TurnosGateway]
})
export class GatewayModule{}