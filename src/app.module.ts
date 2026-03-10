import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TurnosModule } from './turnos/turnos.module';
import { SectoresModule } from './sectores/sectores.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrinterModule } from './printer/printer.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/jwt.constants';
import { TurnosGateway } from './gateways/turnos.gateway';
import { AuthMiddleware } from './auth/auth.middleware';
import { ThermalprinterService } from './thermalprinter/thermalprinter.service';
import { ThermalprinterController } from './thermalprinter/thermalprinter.controller';
import { AfiliadosModule } from './afiliados/afiliados.module';

const GATEWAYS = [TurnosGateway];
@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/turnero'), TurnosModule,
    SectoresModule, UsersModule, AuthModule, PrinterModule, UsersModule, TurnosGateway, AfiliadosModule,
  JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '8h' },
  }) ],
  controllers: [AppController, ThermalprinterController],
  providers: [AppService, ...GATEWAYS, ThermalprinterService,]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}