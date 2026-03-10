import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterAuthDto } from './dto/register.auth.dto';
import * as bcrypt from 'bcryptjs';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthToken } from 'src/interfaces/authtoken.interface';
import { UsersService } from 'src/users/users.service';
import { PayLoad } from 'src/interfaces/payload.interface';
import { User } from 'src/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private userModel: Model<User>, private jwtService: JwtService, private userService: UsersService) { }

  async register(userRegister: RegisterAuthDto) {
    try {
      const { password } = userRegister;
      const salt = await bcrypt.genSaltSync(10);
      const encriptar = bcrypt.hashSync(password, salt);
      userRegister = { ...userRegister, password: encriptar };
      const registro = this.userModel.create(userRegister);
      return registro;
    } catch (error) {
      throw new HttpException('Error registrando usuario: ${error.message}', 404);
    }

  }

  async login(userLogin: LoginAuthDto) {
    const { email, password } = userLogin;
    const user = await this.userModel.findOne({ email });

    if (!user) return { ok: false, token: null, message: `*EMAIL_INEXISTENTE` };

    const isMatch = await bcrypt.compare(password, user.password);
    const payload = { id: user.id, username: user.username }
    const token = await this.jwtService.sign(payload)

    if (!isMatch) return { ok: false, token: null, message: `*PASSWORD_INCORRECTO` };
    else
      return { ok: true, token: token, message: `*LOGIN_SUCCESSFULLY` };
  }

  async getTokenByUser(userId: string): Promise<AuthToken> {
    try {
      const usuario = await this.userService.read(userId);
      if (!usuario) {
        return { ok: false, token: null, message: `*USUARIO_INEXISTENTE` };
      }
      const tokenUser = this.getJwtToken(this.getUserPayload(usuario));
      return { ok: true, token: tokenUser, message: '' };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  private getJwtToken(payload: PayLoad): string {
    return this.jwtService.sign(payload);
  }

  private getUserPayload(usuario: User, userSessionId?: string): PayLoad {
    return {
      _id: usuario.id,
      email: usuario.email,
    };
  }

}
