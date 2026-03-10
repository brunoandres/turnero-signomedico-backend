import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from './jwt.constants';

interface TokenPayload {
  id: string;
  username: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const decodedToken = jwt.verify(token, jwtConstants.secret) as TokenPayload; // Asegura el tipo del payload
        req['userId'] = decodedToken.id; // Cambia a decodedToken.id para obtener el ID del usuario
      } catch (err) {
        // Manejar el error de token inválido
        console.error(err);
      }
    }

    next();
  }
}
