import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovementDto, MovementType } from './dto/create-movement.dto';

@Injectable()
export class MovementsService {
  constructor(private prismaService: PrismaService) {}

  async create(createMovementDto: CreateMovementDto) {
    const user = await this.prismaService.user.findUnique(
      {
        where: {
          id: createMovementDto.userId,
        },
      }
    );

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const productIds = createMovementDto.items.map((item) => item.productId);
    const uniqueProductIds = [...new Set(productIds)];

    if (uniqueProductIds.length !== productIds.length) {
      throw new BadRequestException('No se pueden usar productos duplicados en el mismo movimiento');
    }

    const products = await this.prismaService.product.findMany(
      {
        where: {
          id: {
            in: uniqueProductIds,
          },
        },
      }
    );

    if (products.length !== uniqueProductIds.length) {
      throw new NotFoundException('Algunos productos no existen');
    }

    const productById = new Map(products.map((product) => [product.id, product]));

    createMovementDto.items.forEach((item) => {
      const product = productById.get(item.productId);
      if (!product) {
        throw new NotFoundException('Producto no encontrado');
      }

      if (createMovementDto.type === MovementType.OUT && item.amount > product.stock) {
        throw new BadRequestException(`No hay suficiente stock para el producto ${product.name}`);
      }
    });

    const createdMovements = await this.prismaService.$transaction(async (prisma) => {
      const records = [] as any[];

      for (const item of createMovementDto.items) {
        const product = productById.get(item.productId)!;
        const stockChange = createMovementDto.type === MovementType.IN ? item.amount : -item.amount;

        const createdMovement = await prisma.movements.create(
          {
            data: {
              type: createMovementDto.type,
              amount: item.amount,
              priceUnit: product.priceUnit,
              product: {
                connect: {
                  id: item.productId,
                },
              },
              user: {
                connect: {
                  id: createMovementDto.userId,
                },
              },
            },
          }
        );

        await prisma.product.update(
          {
            where: {
              id: product.id,
            },
            data: {
              stock: product.stock + stockChange,
            },
          }
        );

        records.push(createdMovement);
      }

      return records;
    });

    const movementIds = createdMovements.map((movement) => movement.id);

    return this.prismaService.movements.findMany(
      {
        where: {
          id: {
            in: movementIds,
          },
        },
        include: {
          product: true,
          user: true,
        },
      }
    );
  }

  async findAll() {
    return await this.prismaService.movements.findMany(
      {
        include: {
          product: true,
          user: true,
        },
        orderBy: {
          date: 'desc',
        },
      }
    );
  }

  async findOne(id: number) {
    return await this.prismaService.movements.findUnique(
      {
        where: {
          id,
        },
        include: {
          product: true,
          user: true,
        },
      }
    );
  }

}
