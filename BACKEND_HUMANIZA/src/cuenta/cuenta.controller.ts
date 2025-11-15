import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CuentaService } from './cuenta.service';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import GetCuentaDto from './dto/get-cuenta.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@ApiTags('Cuenta')
@Controller('cuenta')
export class CuentaController {
  constructor(private readonly cuentaService: CuentaService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCuentaDto: CreateCuentaDto) {
    return this.cuentaService.create(createCuentaDto);
  }

  @ApiBody({ type: [GetCuentaDto] })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.cuentaService.findAll();
  }

  @ApiBody({ type: GetCuentaDto })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.cuentaService.findOne(+id);
  }

  @ApiBody({ type: UpdateCuentaDto })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateCuentaDto: UpdateCuentaDto) {
    return this.cuentaService.update(+id, updateCuentaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cuentaService.remove(+id);
  }
}
