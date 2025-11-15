import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';
import { In, Repository } from 'typeorm';
import { Cuenta } from './entities/cuenta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { EstadisticasService } from 'src/estadisticas/estadisticas.service';

@Injectable()
export class CuentaService {

  constructor(@InjectRepository(Cuenta) private cuentaRepository: Repository<Cuenta>, @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>, private readonly estadisticasService: EstadisticasService) { }

  async create(createCuentaDto: CreateCuentaDto) {
    const idUsuario = parseInt(createCuentaDto.idUsuario);
    const usuarioEncontrado = await this.usuarioRepository.findOneBy({ id: idUsuario });

    if (!usuarioEncontrado) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    const cuentaExistente = await this.cuentaRepository.findOneBy({ idUsuario });
    const fechaHoy = new Date();

    const limitesPorPlan = {
      free: { minuto: 10, dia: 10 },
      starter: { minuto: 20, dia: 50 },
      plus: { minuto: 30, dia: 150 },
      premium: { minuto: 40, dia: Infinity },
    };

    if (cuentaExistente) {

      if (cuentaExistente.p_fecha !== null) {
        //Verificamos si cuentaExistente.fechaExpiracion es null para ponerle una fecha del dia de mañana
        if (cuentaExistente.fechaExpiracion !== null) {
          // Verificamos expiración
          if (fechaHoy > cuentaExistente.fechaExpiracion) {
            //lo volvemos al free
            cuentaExistente.plan = "free";
            cuentaExistente.fechaExpiracion = null;
            cuentaExistente.p_minuto = 0;
            cuentaExistente.p_dia = 0;

            await this.cuentaRepository.save(cuentaExistente);

            throw new HttpException('El plan ha expirado', 408);
          }
        }


        const esNuevoDia =
          fechaHoy.getFullYear() !== cuentaExistente.p_fecha.getFullYear() ||
          fechaHoy.getMonth() !== cuentaExistente.p_fecha.getMonth() ||
          fechaHoy.getDate() !== cuentaExistente.p_fecha.getDate();

        const minutosPasados = Math.floor((fechaHoy.getTime() - cuentaExistente.p_fecha.getTime()) / 60000);


        if (esNuevoDia) {
          cuentaExistente.p_dia = 1;
          cuentaExistente.p_minuto = 1;
        } else {
          // Mismo día
          if (minutosPasados < 1) {
            cuentaExistente.p_minuto += 1;
          } else {
            cuentaExistente.p_minuto = 1;
          }

          cuentaExistente.p_dia += 1;
        }

        cuentaExistente.p_fecha = fechaHoy;

        const limites = limitesPorPlan[cuentaExistente.plan];

        if (cuentaExistente.p_minuto > limites.minuto) {
          throw new HttpException('Límite de peticiones por minuto excedido', 429);
        }

        if (cuentaExistente.p_dia > limites.dia) {
          throw new HttpException('Límite de peticiones por día excedido', 429);
        }
      }
      else {
        cuentaExistente.p_fecha = new Date();
        cuentaExistente.p_minuto = 1;
        cuentaExistente.p_dia = 1;
      }

      // Registramos la estadística
      await this.estadisticasService.create({
        idUsuario: createCuentaDto.idUsuario,
        fechadia: fechaHoy,
        plan: cuentaExistente.plan,
      });

      return this.cuentaRepository.save(cuentaExistente);
    } else {
      // Si no existe la cuenta, la creamos
      const nuevaCuenta = this.cuentaRepository.create({
        idUsuario,
        usuario: usuarioEncontrado,
        plan: "free",
        fechaCreacion: fechaHoy,
        fechaExpiracion: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        p_fecha: fechaHoy,
        p_minuto: 1,
        p_dia: 1,
      });

      // Registramos la estadística
      await this.estadisticasService.create({
        idUsuario: createCuentaDto.idUsuario,
        fechadia: fechaHoy,
        plan: nuevaCuenta.plan,
      });

      return this.cuentaRepository.save(nuevaCuenta);
    }
  }

  // async create(createCuentaDto: CreateCuentaDto) {
  //   const usuarioEncontrado = await this.usuarioRepository.findOneBy({
  //     id: parseInt(createCuentaDto.idUsuario),
  //   });

  //   if (!usuarioEncontrado) {
  //     throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
  //   }

  //   const cuentaExistente = await this.cuentaRepository.findOneBy({
  //     idUsuario: parseInt(createCuentaDto.idUsuario),
  //   });

  //   if (cuentaExistente) {
  //     // Si la cuenta ya existe solo vamos actualizar la cantidad de peticiones
  //     // logica para actualizar la cantidad de peticiones
  //     //Primero verificamos si la fecha de hoy no excede la fecha de expiracion
  //     const fechaHoy = new Date();
  //     if (fechaHoy > cuentaExistente.fechaExpiracion) {
  //       throw new HttpException('La cuenta ha expirado', HttpStatus.FORBIDDEN);
  //     }

  //     //Verificamos si ya completo un dia desde la ultima peticion
  //     const diasPasados = Math.floor((fechaHoy.getTime() - cuentaExistente.p_fecha.getTime()) / (1000 * 60 * 60 * 24));
  //     if (diasPasados >= 1) {
  //       //Si ya paso un dia, reseteamos el contador de peticiones por minuto y incrimentamos el contador de peticiones por dia
  //       cuentaExistente.p_minuto = 1;
  //       cuentaExistente.p_dia = 1;
  //       cuentaExistente.p_fecha = new Date(); // actualizamos la fecha de la ultima peticion
  //     }
  //     else {
  //       //verificamos cuantos minutos han pasado desde la ultima peticion
  //       const minutosPasados = Math.floor((fechaHoy.getTime() - cuentaExistente.p_fecha.getTime()) / 60000);
  //       //Si es menor a 1 minuto, incrementamos el contador de peticiones por minuto
  //       if (minutosPasados < 1) {
  //         cuentaExistente.p_minuto += 1;
  //         cuentaExistente.p_dia += 1; // incrementamos el contador de peticiones por dia
  //         cuentaExistente.p_fecha = new Date(); // actualizamos la fecha de la ultima peticion
  //       }
  //       else {
  //         // si es mayor entonces ponemos el contador de peticiones por minuto en 0
  //         cuentaExistente.p_minuto = 1;
  //         cuentaExistente.p_dia += 1; // incrementamos el contador de peticiones por dia
  //         cuentaExistente.p_fecha = new Date(); // actualizamos la fecha de la ultima peticion
  //       }
  //     }
  //     //Verificamos el plan para ver cuantas peticiones por minuto y por dia puede hacer, para el plan free 2 por minuto y 10 por dia,
  //     //Para el plan starter 5 por minuto y 50 por dia, para el plan plus 10 por minuto y 150 por dia, para el plan premium 20 por minuto y ilimitado por dia
  //     if (cuentaExistente.plan === 'free') {
  //       if (cuentaExistente.p_minuto > 2) {
  //         throw new HttpException('Limite de peticiones por minuto excedido', HttpStatus.TOO_MANY_REQUESTS);
  //       }
  //       if (cuentaExistente.p_dia > 10) {
  //         throw new HttpException('Limite de peticiones por dia excedido', HttpStatus.TOO_MANY_REQUESTS);
  //       }
  //     }
  //     else if (cuentaExistente.plan === 'starter') {
  //       if (cuentaExistente.p_minuto > 5) {
  //         throw new HttpException('Limite de peticiones por minuto excedido', HttpStatus.TOO_MANY_REQUESTS);
  //       }
  //       if (cuentaExistente.p_dia > 50) {
  //         throw new HttpException('Limite de peticiones por dia excedido', HttpStatus.TOO_MANY_REQUESTS);
  //       }
  //     }
  //     else if (cuentaExistente.plan === 'plus') {
  //       if (cuentaExistente.p_minuto > 10) {
  //         throw new HttpException('Limite de peticiones por minuto excedido', HttpStatus.TOO_MANY_REQUESTS);
  //       }
  //       if (cuentaExistente.p_dia > 150) {
  //         throw new HttpException('Limite de peticiones por dia excedido', HttpStatus.TOO_MANY_REQUESTS);
  //       }
  //     }
  //     else if (cuentaExistente.plan === 'premium') {
  //       if (cuentaExistente.p_minuto > 20) {
  //         throw new HttpException('Limite de peticiones por minuto excedido', HttpStatus.TOO_MANY_REQUESTS);
  //       }
  //       //No hay limite de peticiones por dia para el plan premium
  //     }

  //     return this.cuentaRepository.save(cuentaExistente);
  //   }
  //   else {
  //     // Si la cuenta no existe, creamos una nueva
  //     const nuevaCuenta = this.cuentaRepository.create({
  //       idUsuario: parseInt(createCuentaDto.idUsuario),
  //       usuario: usuarioEncontrado,
  //       plan: "free",
  //       fechaCreacion: new Date(), //calculamos un mes 
  //       fechaExpiracion: new Date(new Date().setMonth(new Date().getMonth() + 1)), // un mes a partir de la fecha de creacion
  //       p_fecha: new Date(), // fecha de la ultima peticion, luego registraremos la peticion
  //       p_minuto: 1, // contador de peticiones por minuto
  //       p_dia: 1, // contador de peticiones por dia
  //     });
  //     return this.cuentaRepository.save(nuevaCuenta);
  //   }
  // }

  async findAll() {
    const cuentas = await this.cuentaRepository.find({
      order: { idUsuario: 'DESC' },
    });
    return cuentas;
  }

  async findOne(id: number) {
    const cuentaExistente = await this.cuentaRepository.findOneBy({
      idUsuario: id,
      estado: true
    });

    if (!cuentaExistente) {
      throw new HttpException('Cuenta no encontrada', HttpStatus.NOT_FOUND);
    }

    return cuentaExistente;
  }

  async update(id: number, updateCuentaDto: UpdateCuentaDto) {
    const cuentaExistente = await this.cuentaRepository.findOneBy({
      idUsuario: id,
      estado: true
    });

    if (!cuentaExistente) {
      throw new HttpException('Cuenta no encontrada', HttpStatus.NOT_FOUND);
    }

    //verificamos que el plan sea free, starter, plus, premium, o que esten asi escritos
    const planesValidos = ['free', 'starter', 'plus', 'premium'];
    if (!planesValidos.includes(updateCuentaDto.plan)) {
      throw new HttpException('Plan no válido', HttpStatus.BAD_REQUEST);
    }

    //Si existe vamos a cambiar su plan, con la siguiente validacion: si es free el campo de fechaExpiracion va vacio, y si es cualquier otro plan sera 1 mes desde hoy
    if (updateCuentaDto.plan === 'free') {
      cuentaExistente.plan = updateCuentaDto.plan;
      cuentaExistente.fechaExpiracion = null;
      cuentaExistente.p_minuto = 0;
      cuentaExistente.p_dia = 0;
    } else {
      cuentaExistente.plan = updateCuentaDto.plan;
      cuentaExistente.fechaExpiracion = new Date(new Date().setMonth(new Date().getMonth() + 1));
      cuentaExistente.p_minuto = 0;
      cuentaExistente.p_dia = 0;
    }

    const actualizar = await this.cuentaRepository.update(cuentaExistente.idUsuario, cuentaExistente);

    console.log(actualizar);

    if (!actualizar) {
      throw new HttpException('Error al actualizar la cuenta', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return { message: 'Cuenta actualizada correctamente' };
  }

  remove(id: number) {
    return `This action removes a #${id} cuenta`;
  }
}
