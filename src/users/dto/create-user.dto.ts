import { IsEmail, IsString, Length, MinLength} from 'class-validator'

export class CreateUserDto 
{
    @IsString({ message: 'La contraseña debe ser solo texto' })
    @Length(5, 50, { message: 'El nombre debe tener entre 5 y 50 caracteres' })
    fullName!: string

    @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
    @Length(5, 100, { message: 'El correo electrónico debe tener entre 5 y 100 caracteres' })
    email!: string

    @IsString({ message: 'La contraseña debe ser solo texto' })
    @MinLength (6, { message: 'La contraseña debe tener como minimo 6 caracteres' })
    password!: string
}