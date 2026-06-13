import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { MovementType } from '@generated';

@Injectable()
export class MovementsService 
{
  constructor(private prismaService: PrismaService) {}

  async create(createMovementDto: CreateMovementDto) 
  {
    const user = await this.prismaService.user.findUnique
    (
      {
        where: 
        {
          id: createMovementDto.userId,
        },
      }
    );

    if (!user) 
    {
      throw new NotFoundException('Usuario no encontrado');
    }
    const productIds = createMovementDto.items.map((item) => item.productId);
    const uniqueProductIds = [...new Set(productIds)];

    if (uniqueProductIds.length !== productIds.length) 
    {
      throw new BadRequestException('No se pueden usar productos duplicados en el mismo movimiento');
    }

    const products = await this.prismaService.product.findMany
    (
      {
        where: 
        {
          id: 
          {
            in: uniqueProductIds,
          },
        },
      }
    );

    if (products.length !== uniqueProductIds.length) 
    {
      throw new NotFoundException('Algunos productos no existen');
    }
    const productById = new Map(products.map((product) => [product.id, product]));
    createMovementDto.items.forEach
    (
      (item) => 
      {
        const product = productById.get(item.productId);
        if (!product) 
        {
          throw new NotFoundException('Producto no encontrado');
        }

        if (createMovementDto.type === MovementType.OUT && item.amount > product.stock) 
        {
          throw new BadRequestException(`No hay suficiente stock para el producto ${product.name}`);
        }
      }
    );

    const createdMovements = await this.prismaService.$transaction
    (
      async (prisma) => 
      {
        const records = [] as any[];
        for (const item of createMovementDto.items)
        {
          const product = productById.get(item.productId)!;
          const stockChange = createMovementDto.type === MovementType.IN ? item.amount : -item.amount;

          // ✅ CORREGIDO: Se mapea de forma plana 'productName' requerida por la restricción NOT NULL de la DB
          const createdMovement = await prisma.movements.create
          (
            {
              data:
              {
                type: createMovementDto.type,
                amount: item.amount,
                priceUnit: product.priceUnit,
                productName: product.name, // Satisface la restricción física de la base de datos
                product:
                {
                  connect:
                  {
                    id: item.productId,
                  },
                },
                user:
                {
                  connect:
                  {
                    id: createMovementDto.userId,
                  },
                },
              },
            }
          );
          await prisma.product.update
          (
            {
              where: 
              {
                id: product.id,
              },
              data: 
              {
                stock: product.stock + stockChange,
              },
            }
          );
          records.push(createdMovement);
        }
        return records;
      }
    );

    const movementIds = createdMovements.map((movement) => movement.id);
    return this.prismaService.movements.findMany
    (
      {
        where: 
        {
          id: 
          {
            in: movementIds,
          },
        },
        include: 
        {
          product: true,
          user: true,
        },
      }
    );
  }

  async findAll() 
  {
    return await this.prismaService.movements.findMany
    (
      {
        include: 
        {
          product: true,
          user: true,
        },
        orderBy: 
        {
          date: 'desc',
        },
      }
    );
  }

  async findOne(id: number) 
  {
    return await this.prismaService.movements.findUnique
    (
      {
        where: 
        {
          id,
        },
        include: 
        {
          product: true,
          user: true,
        },
      }
    );
  }

  async remove(id: number)
  {
    return this.prismaService.$transaction
    (
      async (prisma) =>
      {
        const movement = await prisma.movements.findUnique
        (
          {
            where: { id },
            include: { product: true },
          }
        );

        if (!movement)
        {
          throw new NotFoundException('Movimiento no encontrado');
        }

        if (movement.product) 
        {
          const stockChange =
            movement.type === MovementType.IN
              ? -movement.amount
              : movement.amount;

          await prisma.product.update
          (
            {
              where: { id: movement.productId },
              data:
              {
                stock: movement.product.stock + stockChange,
              },
            }
          );
        }
        else 
        {
          console.warn(`[Warning] El movimiento con ID ${id} está huérfano (su productId ${movement.productId} ya no existe). Se eliminará el registro del movimiento directamente sin actualizar stock.`);
        }

        const deleted = await prisma.movements.delete
        (
          {
            where: { id },
            include:
            {
              product: true,
              user: true,
            },
          }
        );

        return deleted;
      }
    );
  }
}