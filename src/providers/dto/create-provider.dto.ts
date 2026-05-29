import { IsOptional, IsString, Length } from 'class-validator';

export class CreateProviderDto {
  @IsString({ message: 'El nombre debe ser texto' })
  @Length(3, 255, { message: 'El nombre debe tener entre 3 y 255 caracteres' })
  name!: string;

  @IsString({ message: 'El teléfono debe ser texto' })
  @Length(5, 50, { message: 'El teléfono debe tener entre 5 y 50 caracteres' })
  phone!: string;

  @IsOptional()
  @IsString({ message: 'La información adicional debe ser texto' })
  @Length(0, 1000, { message: 'La información adicional debe tener como máximo 1000 caracteres' })
  additionalInfo?: string;
}
