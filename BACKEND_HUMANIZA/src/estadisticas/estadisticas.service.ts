import { Injectable } from '@nestjs/common';
import { CreateEstadisticaDto } from './dto/create-estadistica.dto';
import { UpdateEstadisticaDto } from './dto/update-estadistica.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Estadistica } from './entities/estadistica.entity';
import { Between, Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class EstadisticasService {

  constructor(@InjectRepository(Estadistica) private estadisticaRepository: Repository<Estadistica>, @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>) { }

  async create(createEstadisticaDto: CreateEstadisticaDto) {
    const usuario = await this.usuarioRepository.findOneBy({
      id: parseInt(createEstadisticaDto.idUsuario),
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Día de la fecha enviada
    const inicioDia = new Date(createEstadisticaDto.fechadia);
    inicioDia.setHours(0, 0, 0, 0);
    const finDia = new Date(createEstadisticaDto.fechadia);
    finDia.setHours(23, 59, 59, 999);

    // Buscar estadística del mismo día y plan
    const estadisticaExists = await this.estadisticaRepository.findOne({
      where: {
        usuario: { id: usuario.id },
        plan: createEstadisticaDto.plan,
        fechadia: Between(inicioDia, finDia),
      },
    });

    if (estadisticaExists) {
      estadisticaExists.totalpeticiones += 1;
      return await this.estadisticaRepository.save(estadisticaExists);
    }

    // Si no existe, crear nueva fila
    const nuevaEstadistica = this.estadisticaRepository.create({
      usuario,
      fechadia: createEstadisticaDto.fechadia,
      totalpeticiones: 1,
      plan: createEstadisticaDto.plan,
    });

    return await this.estadisticaRepository.save(nuevaEstadistica);
  }


  async findAll() {
    const estadisticas = await this.estadisticaRepository.find({
      order: { id: 'DESC' },
    });

    return estadisticas;
  }

  findOne(id: number) {
    return `This action returns a #${id} estadistica`;
  }

  update(id: number, updateEstadisticaDto: UpdateEstadisticaDto) {
    return `This action updates a #${id} estadistica`;
  }

  remove(id: number) {
    return `This action removes a #${id} estadistica`;
  }
}
