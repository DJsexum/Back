import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';

@Controller('movements')
export class MovementsController 
{
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  create(@Body() createMovementDto: CreateMovementDto) 
  {
    return this.movementsService.create(createMovementDto);
  }

  @Get()
  findAll() 
  {
    return this.movementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) 
  {
    return this.movementsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string)
  {
    return this.movementsService.remove(+id);
  }
}