import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class UsersService 
{
  constructor(private prismaService: PrismaService) 
  {

  }

  async create(createUserDto: CreateUserDto) 
  {
    try 
    {
      // Validar el correo electrónico
      const existingUser = await this.prismaService.user.findUnique
      (
        {
          where:
          {
            email: createUserDto.email,
          }
        }
      );

      if (existingUser) 
      {
        throw new ConflictException('El correo electrónico ya está en uso');
      }

      return await this.prismaService.user.create
      (
        {
          data: createUserDto
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
      return await this.prismaService.user.findMany();
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
      return await this.prismaService.user.findUnique
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
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) 
  {
    const user = await this.findOne(id);
    try 
    {
      if (!user) 
      {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Validar el correo electrónico
      const existingUser = await this.prismaService.user.findUnique
      (
        {
          where: 
          {
            email: updateUserDto.email,
          }
        }
      );

      if (existingUser && existingUser.id !== id) 
      {
        throw new ConflictException('El correo electrónico ya está en uso');
      }

      return await this.prismaService.user.update
      (
        {
          where: 
          {
            id,
          },
          data: updateUserDto
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
      return await this.prismaService.user.delete
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