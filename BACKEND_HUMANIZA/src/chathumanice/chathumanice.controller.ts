import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ChathumaniceService } from './chathumanice.service';
import { CreateChathumaniceDto } from './dto/create-chathumanice.dto';
import { UpdateChathumaniceDto } from './dto/update-chathumanice.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Chathumanice')
@Controller('chathumanice')
export class ChathumaniceController {
  constructor(private readonly chathumaniceService: ChathumaniceService) { }

  @ApiBody({ type: CreateChathumaniceDto })
  // @Throttle({ limit: 2, ttl: 60 } as any) // Limita a 20 solicitudes por minuto
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createChathumaniceDto: CreateChathumaniceDto, @Req() request: Request) {
    const userid = request['user'].sub; // Obtiene el ID del usuario del token decodificado
    console.log('ID del usuario:', userid);
    return this.chathumaniceService.create4(createChathumaniceDto, userid);
  }

  // @Get()
  // findAll() {
  //   return this.chathumaniceService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.chathumaniceService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateChathumaniceDto: UpdateChathumaniceDto) {
  //   return this.chathumaniceService.update(+id, updateChathumaniceDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.chathumaniceService.remove(+id);
  // }
}
