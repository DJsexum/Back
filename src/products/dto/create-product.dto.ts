import { IsString, Length, IsNumber, IsPositive, IsInt } from "class-validator";

export class CreateProductDto 
{

    @IsString()
    @Length(3, 50, { message: 'El nombre debe tener entre 3 y 50 caracteres' })
    name!: string;

    @IsNumber()
    @IsPositive()
    priceUnit!: number;

    @IsInt()
    categoryId!: number;
}