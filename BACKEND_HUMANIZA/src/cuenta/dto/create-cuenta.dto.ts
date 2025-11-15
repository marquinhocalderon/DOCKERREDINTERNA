import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmpty, IsNotEmpty, IsString, MaxLength, Min } from "class-validator";

export class CreateCuentaDto {
    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty({ message: 'El ID de usuario no puede estar vacío' })
    @IsString({ message: 'El ID de usuario debe ser un texto' })
    @MaxLength(100, { message: 'El ID de usuario debe tener menos de 100 caracteres' })
    @MaxLength(1, { message: 'El ID de usuario debe tener más de 1 caracteres' })
    idUsuario: string;
}
