import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) { }
  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find().populate('sector').exec();
  }
  async read(id: string): Promise<User> {
    try {
      return await this.userModel.findById(id).exec();
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findUserById(id: string): Promise<any> {
    return this.userModel.findById(id).populate('sector');
  }
}
