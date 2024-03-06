import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AudioService } from './audio.service';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { AudioDto } from './dto/autdio.dto';

@Controller('audio')
@ApiTags('text to audio2')
export class AudioController {
  constructor(private readonly ttsService: AudioService) {}

  @ApiOperation({ summary: 'to generate audio from text' })
  @ApiProduces('audio/mpeg')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          example: 'text for generate to audio',
        },
        speaker_id: {
          type: 'number',
          example: 2,

          description: 'can choose 1 or 2',
        },
      },
    },
  })
  @UsePipes(new ValidationPipe())
  @Post()
  async createAudio(@Body() createAudioDto: AudioDto) {
    const audioEntity = await this.ttsService.createTtsAudio(
      createAudioDto.text,
      createAudioDto.speaker_id,
    );
    return { id: audioEntity.id };
  }

  @Get('byId/:id')
  async get(@Param('id') id: string, @Res() res: Response) {
    const audio = await this.ttsService.getAudioById(parseInt(id));
    if (!audio) {
      return res.status(HttpStatus.NOT_FOUND).send('Audio not found');
    }
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(audio.audio);
  }

  @Get('last')
  async lastAudio(@Res() res: Response) {
    const lastEntry = await this.ttsService.getLastAudioEntry();
    if (!lastEntry) {
      return res.status(404).send('No entries found');
    }

    if (lastEntry.isSended) {
      throw new HttpException(
        'This audio is already sended',
        HttpStatus.NOT_ACCEPTABLE,
      );
    } else {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.send(lastEntry.audio);
    }

    this.ttsService.toggleSended(lastEntry.id);
  }
}
