import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, Min, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export enum MovementType 
{
  IN = 'IN',
  OUT = 'OUT',
}

export class MovementItemDto 
{
  @IsInt()
  @Min(1, { message: 'El id del producto debe ser válido' })
  productId!: number;

  @IsInt()
  @Min(1, { message: 'La cantidad debe ser mayor o igual a 1' })
  amount!: number;
}

export class CreateMovementDto 
{
  @IsEnum(MovementType, { message: 'El tipo de movimiento debe ser IN o OUT' })
  type!: MovementType;

  @IsArray()
  @ArrayMinSize(1, { message: 'Se debe incluir al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => MovementItemDto)
  items!: MovementItemDto[];

  @IsInt()
  @Min(1, { message: 'El id de usuario debe ser válido' })
  userId!: number;
}
