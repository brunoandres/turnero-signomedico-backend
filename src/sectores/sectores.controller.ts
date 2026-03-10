import { Body, Controller, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { SectorDto } from './dto/sectores.dto';
import { SectoresService } from './sectores.service';
import { Sector } from './sectores.interface';
import { UpdateSectorDto } from './dto/updateSector.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('sectores')
@Controller('sectores')
export class SectoresController {

  constructor(private sectorService: SectoresService) { }

  @Get('/getAllActivos')
  getAllSectoresActivos() {
    return this.sectorService.getAllSectoresActivos();
  }

  @Get('/getAll')
  getAllSectores() {
    return this.sectorService.getAllSectores();
  }

  @Get(':id')
  getSectorById(@Param('id') id: string, @Res() response) {
    return this.sectorService.getSectorById(id).then((sector: Sector) => {
      response.status(HttpStatus.OK).json(sector);
    }).catch((error) => { });
  }

  @Post('/create')
  createSector(@Body() sector: SectorDto, @Res() response) {
    return this.sectorService.createSector(sector).then((sector: Sector) => {
      response.status(HttpStatus.OK).json(sector);
    }).catch((error) => {
      response.status(HttpStatus.FORBIDDEN).json({ error });
    })
  }

  @Put('/update/:id')
  updateSector(@Param('id') id: string, @Body() sector: UpdateSectorDto, @Res() response) {
    return this.sectorService.updateSector(id, sector).then((sectorUpdate: Sector) => {
      response.status(HttpStatus.OK).json(sectorUpdate);
    }).catch((error) => { });
  }
}
