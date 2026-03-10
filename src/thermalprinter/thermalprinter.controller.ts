import { Body, Controller, Post } from '@nestjs/common';
import { ThermalprinterService } from './thermalprinter.service';

@Controller('thermalprinter')
export class ThermalprinterController {
    constructor(private readonly printService: ThermalprinterService) { }
    @Post('text')
    async printText(@Body('text') text: string): Promise<void> {
        await this.printService.print(text);
    }
}
