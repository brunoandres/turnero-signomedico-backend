import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TurnosModule } from './turnos/turnos.module';
import { SectoresModule } from './sectores/sectores.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrinterModule } from './printer/printer.module';
import { AfiliadosModule } from './afiliados/afiliados.module';

import { TurnosGateway } from './gateways/turnos.gateway';

import { AuthMiddleware } from './auth/auth.middleware';
import { jwtConstants } from './auth/jwt.constants';

import { ThermalprinterService } from './thermalprinter/thermalprinter.service';
import { ThermalprinterController } from './thermalprinter/thermalprinter.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

const GATEWAYS = [TurnosGateway];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const nodeEnv = process.env.NODE_ENV || 'development';

        const uri = configService.get<string>(
          nodeEnv === 'production'
            ? 'MONGODB_URI_PROD'
            : 'MONGODB_URI_DEV',
        );

        return {
          uri,
          dbName: 'turnero',
        };
      },
      inject: [ConfigService],
    }),

    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '8h' },
    }),

    TurnosModule,
    SectoresModule,
    UsersModule,
    AuthModule,
    PrinterModule,
    AfiliadosModule,
  ],

  controllers: [
    AppController,
    ThermalprinterController,
  ],

  providers: [
    AppService,
    ...GATEWAYS,
    ThermalprinterService,
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}