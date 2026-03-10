import { Controller, Get, Post } from '@nestjs/common';
import { PrinterTypes, ThermalPrinter } from 'node-thermal-printer';
import { PrinterService } from './printer.service';

const printerService = new PrinterService();

@Controller('printer')
export class PrinterController {
    constructor(private printerService: PrinterService) { }

    @Get()
    async printer() {
        /*const data = 'Vale por $ 1000 ARG.';
        await this.printerService.print(data);*/
    }
}
