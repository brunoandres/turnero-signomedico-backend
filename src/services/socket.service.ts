import { Get, Injectable } from "@nestjs/common";
import { get } from "http";


@Injectable()
export class SocketService {
  constructor() { }
    @Get('mensaje')
  async mensaje() {
    return "algo";
  }

}
