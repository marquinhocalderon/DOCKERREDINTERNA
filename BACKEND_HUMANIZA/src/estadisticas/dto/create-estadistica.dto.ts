import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateEstadisticaDto {

    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty({ message: 'El ID de usuario no puede estar vacío' })
    @IsString({ message: 'El ID de usuario debe ser un texto' })
    @MaxLength(100, { message: 'El ID de usuario debe tener menos de 100 caracteres' })
    @MaxLength(1, { message: 'El ID de usuario debe tener más de 1 caracteres' })
    idUsuario: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'La fecha no puede estar vacía' })
    fechadia: Date;

    @ApiProperty()
    @IsNotEmpty({ message: 'El plan no puede estar vacío' })
    @IsString({ message: 'El plan debe ser un texto' })
    @MaxLength(100, { message: 'El plan debe tener menos de 100 caracteres' })
    plan: string;
}
