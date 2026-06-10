import { Module } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module
(
  {
    imports: [],
    controllers: [MovementsController],
    providers: [MovementsService, PrismaService],
  }
)
export class MovementsModule {}
