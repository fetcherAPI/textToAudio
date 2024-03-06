import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { HttpModule } from '@nestjs/axios';
import { AudioModule } from './audio/audio.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [HttpModule, AudioModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
