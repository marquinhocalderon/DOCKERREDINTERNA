import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCuentaDto } from './create-cuenta.dto';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Max, MaxLength, MinLength } from 'class-validator';

export class UpdateCuentaDto {

    // @ApiProperty()
    // @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    // @IsNotEmpty({ message: 'El id de usuario no puede estar vacío' })
    // @IsString({ message: 'El id de usuario debe ser un texto' })
    // @MaxLength(100, { message: 'El id de usuario no puede exceder los 100 caracteres' })
    // @MinLength(1, { message: 'El id de usuario debe tener al menos 1 carácter' })
    // idUsuario: string;

    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty({ message: 'El plan no puede estar vacío' })
    @IsString({ message: 'El plan debe ser un texto' })
    @MaxLength(100, { message: 'El plan no puede exceder los 100 caracteres' })
    @MinLength(1, { message: 'El plan debe tener al menos 1 carácter' })
    plan: string;

}
