import { IsString, Length } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @Length(3, 50, { message: 'El nombre debe tener entre 3 y 50 caracteres' })
    name!: string;
}
