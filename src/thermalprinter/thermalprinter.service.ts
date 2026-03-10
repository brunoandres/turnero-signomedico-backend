import { Injectable } from '@nestjs/common';
import { ThermalPrinter, PrinterTypes } from 'node-thermal-printer';

@Injectable()
export class ThermalprinterService {
    async print(text: string): Promise<void> {
        try {
            const printer = new ThermalPrinter({
                type: PrinterTypes.EPSON,
                interface: '//./COM4',
                options: {
                    timeout: 10000
                },
            });


            printer.alignCenter();
            printer.println(text);

            await printer.execute();
        } catch (error) {
            console.error('Error al imprimir:', error);
        }
    }
}
