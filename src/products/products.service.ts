import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService 
{
   constructor(private prismaService: PrismaService) { }
  
    async create(createProductDto: CreateProductDto) 
    {
      try 
      {
        // Validar que el producto no exista
        const existingProduct = await this.prismaService.product.findFirst
        (
          {
            where: 
            { 
              name: createProductDto.name,
            }
          }
        );
  
        if (existingProduct) 
          {
          throw new ConflictException('El producto con ese nombre ya está en uso');
        }
  
        return await this.prismaService.product.create
        (
          {
            data: {
              name: createProductDto.name,
              priceUnit: createProductDto.priceUnit,
              categoryId: createProductDto.categoryId,
            }
          }
        )
      } 
        catch (error) 
        {
          console.log(error);
          throw error;
        }
    }
  
    async findAll() 
    {
      try 
      {
        return await this.prismaService.product.findMany
        (
          {
            include: {
              category: true,
            },
            orderBy: 
            {
              name: 'asc',
            }
          }
        );
      } 
        catch (error) 
        {
          console.log(error);
          throw error;
        }
    }
  
    async findOne(id: number) 
    {
      try 
      {
        return await this.prismaService.product.findUnique
        (
          {
            where: 
            {
              id,
            },
            include: {
              category: true,
            }
          }
        )
      } 
        catch (error) 
        {
          console.log(error);
          throw error;
        }
    }
  
    async update(id: number, updateProductDto: UpdateProductDto) 
    {
      const product = await this.findOne(id);
  
      try 
      {
        if (!product) 
          {
            throw new NotFoundException('Producto no encontrado');
          }
  
        // Validar que el nombre no esté en uso
        const existingProduct = await this.prismaService.product.findFirst
        (
          {
            where: 
            {
              name: updateProductDto.name,
            }
          }
        );
  
        if (existingProduct && existingProduct.id !== id) 
        {
          throw new ConflictException('El nombre del producto ya está en uso');
        }
  
        return await this.prismaService.product.update
        (
          {
            where: 
            {
              id,
            },
            data: updateProductDto,
            include: {
              category: true,
            }
          }
        )
      }
        catch (error) 
        {
          console.log(error);
          throw error;
        }
    }
  
    async remove(id: number) 
    {
      try 
      {
        return await this.prismaService.product.delete
        (
          {
            where: 
            {
              id,
            }
          }
        )
      } 
        catch (error) 
        {
          console.log(error);
          throw error;
        }
    }
}
