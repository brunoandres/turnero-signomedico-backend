import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { UserDto } from './dto/users.dto';
import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //@UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }
}
