import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { printer, PrinterTypes, ThermalPrinter } from 'node-thermal-printer';
import { Turno } from 'src/turnos/turnos.interface';

@Injectable()
export class PrinterService {
  private printer: printer;

  constructor() {
    this.printer = new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: '//./COM4',       
      options: {
        timeout: 5000
      }
    });
  }

  async print(turno: Turno) {

    const numero = turno.numero.toString();
    this.printer.setTextQuadArea();  
    this.printer.clear();
    this.printer.setTypeFontB();
    this.printer.alignCenter();
    this.printer.bold(true);
    this.printer.beep();
    //await this.printer.printImage('./assets/logomscb.png');
    this.printer.newLine();
    this.printer.bold(true);
    this.printer.print('\x1B\x21\x10');
    this.printer.setTextSize(5, 5);
    this.printer.setCharacterSet("SLOVENIA");
    this.printer.println(turno.sector.letra + ' ' + numero.padStart(3, '0'));

    this.printer.setTextSize(1, 1);
    this.printer.println(turno.sector.letra + " - " + turno.sector.sector.toUpperCase());
    this.printer.newLine();
    this.printer.setTextNormal();
    this.printer.println(turno.sector.descripcion.toUpperCase());
    this.printer.newLine();
    this.printer.setTextNormal();
    this.printer.bold(true);
    this.printer.print('\x1B\x21\x02');
    this.printer.println("Fecha: " + turno.fecha.toLocaleDateString('es-ES'));
    this.printer.newLine();
    this.printer.println("Hora: " + turno.hora.getHours() + ":" + (turno.hora.getMinutes()<10?'0':'') + turno.hora.getMinutes());
    this.printer.newLine();
    this.printer.println("Turnos en espera: " + turno.pendientes);
    this.printer.newLine();
    this.printer.cut();

    try {
      //await this.printer.execute();
    } catch (error) {
      console.error('Error al imprimir:ERORR ', error);
      throw new Error('Error al imprimir');
    }
  }
}