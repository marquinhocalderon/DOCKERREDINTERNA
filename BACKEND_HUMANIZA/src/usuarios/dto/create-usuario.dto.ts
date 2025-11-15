import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Max, MaxLength, MinLength } from "class-validator";

export class CreateUsuarioDto {

    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: 'El avatar debe ser un texto' })
    @MaxLength(255, { message: 'El avatar debe tener menos de 255 caracteres' })
    avatar: string;

    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío' })
    @IsString({ message: 'El nombre de usuario debe ser un texto' })
    @MaxLength(50, { message: 'El nombre de usuario debe tener menos de 50 caracteres' })
    @MinLength(3, { message: 'El nombre de usuario debe tener más de 3 caracteres' })
    nombre: string;

    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty({ message: 'El email de usuario no puede estar vacío' })
    @IsString({ message: 'El email de usuario debe ser un texto' })
    @MaxLength(50, { message: 'El email de usuario debe tener menos de 50 caracteres' })
    @MinLength(3, { message: 'El email de usuario debe tener más de 3 caracteres' })
    email: string;

    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty({ message: 'El usuario no puede estar vacío' })
    @IsString({ message: 'El usuario debe ser un texto' })
    @MaxLength(50, { message: 'El usuario debe tener menos de 50 caracteres' })
    @MinLength(3, { message: 'El usuario debe tener más de 3 caracteres' })
    usuario: string;

    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
    @IsString({ message: 'La contraseña debe ser un texto' })
    @MaxLength(50, { message: 'La contraseña debe tener menos de 50 caracteres' })
    @MinLength(3, { message: 'La contraseña debe tener más de 3 caracteres' })
    password: string;

    // @ApiProperty()
    // @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    // @IsNotEmpty({ message: 'El perfil de usuario no puede estar vacío' })
    // @IsString({ message: 'El perfil de usuario debe ser un texto' })
    // @MaxLength(100, { message: 'El perfil de usuario debe tener menos de 100 caracteres' })
    // @MinLength(1, { message: 'El perfil de usuario debe tener más de 1 caracteres' })
    // id_perfil: string;
}
