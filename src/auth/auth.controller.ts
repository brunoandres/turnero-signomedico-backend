import { Body, Controller, Get, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthToken } from 'src/interfaces/authtoken.interface';
import { User } from 'src/users/users.interface';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register.auth.dto';
import { UserLogon } from './userlogon.decorator';

@ApiBearerAuth()
@UsePipes(new ValidationPipe())

@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) { }

  @Get('/getToken')
  getTokenByUser(@UserLogon('_id') id: string): Promise<AuthToken> {
    console.log(id)
    return this.authService.getTokenByUser(id);
  }

  @UsePipes(ValidationPipe)
  @Post('/register')
  register(@Body() userRegister: RegisterAuthDto) {
    return this.authService.register(userRegister);
  }
  @Post('/login')
  @UsePipes(ValidationPipe)
  login(@Body() userLogin: LoginAuthDto) {
    return this.authService.login(userLogin);
  }

  @Get('/getUserLogueado')
  getUserLogon(@UserLogon() userLogon: User): User {
    console.log(userLogon)
    return userLogon;
  }

  @Get('/verificar')
  verificaToken(@UserLogon() usuario: User, @Res() res: any) {
    res.json({
      ok: true,
      usuario,
      token: 'valido',
    });
  }
}
