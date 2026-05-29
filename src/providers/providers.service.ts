import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProvidersService {
  constructor(private prismaService: PrismaService) {}

  async create(createProviderDto: CreateProviderDto) {
    try {
      const existingProvider = await this.prismaService.provider.findFirst(
        {
          where: {
            name: createProviderDto.name,
          },
        }
      );

      if (existingProvider) {
        throw new ConflictException('El proveedor con ese nombre ya está en uso');
      }

      return await this.prismaService.provider.create({
        data: createProviderDto,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prismaService.provider.findMany(
        {
          orderBy: {
            name: 'asc',
          },
        }
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prismaService.provider.findUnique(
        {
          where: {
            id,
          },
        }
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(id: number, updateProviderDto: UpdateProviderDto) {
    const provider = await this.findOne(id);

    try {
      if (!provider) {
        throw new NotFoundException('Proveedor no encontrado');
      }

      const existingProvider = await this.prismaService.provider.findFirst(
        {
          where: {
            name: updateProviderDto.name,
          },
        }
      );

      if (existingProvider && existingProvider.id !== id) {
        throw new ConflictException('El nombre del proveedor ya está en uso');
      }

      return await this.prismaService.provider.update(
        {
          where: {
            id,
          },
          data: {
            ...updateProviderDto,
          },
        }
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.provider.delete(
        {
          where: {
            id,
          },
        }
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
