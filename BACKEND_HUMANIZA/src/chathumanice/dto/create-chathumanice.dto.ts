import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateChathumaniceDto {

    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty({ message: 'El parrafo no puede estar vacío' })
    @IsString({ message: 'El parrafo debe ser un texto' })
    @MaxLength(1230, { message: 'El parrafo debe tener menos de 1230 caracteres' })
    @MinLength(100, { message: 'El parrafo debe tener más de 100 caracteres' })
    parrafo: string;
}
