import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AudioEntity } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AudioService {
  private readonly ttsUrl: string;
  private readonly ttsToken: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {
    this.ttsUrl = this.configService.get<string>('TTS_URL');
    this.ttsToken = this.configService.get<string>('TTS_TOKEN');
  }

  async createTtsAudio(text: string, speakerId: number): Promise<AudioEntity> {
    const audioBuffer = await this.getAudioFromService(text, speakerId);
    return this.saveAudioFile(audioBuffer, `tts-audio-${Date.now()}.mp3`);
  }

  private async getAudioFromService(
    text: string,
    speakerId: number,
  ): Promise<Buffer> {
    const response = await lastValueFrom(
      this.httpService.post(
        this.ttsUrl,
        { text, speaker_id: speakerId },
        {
          responseType: 'arraybuffer',
          headers: { Authorization: `Bearer ${this.ttsToken}` },
        },
      ),
    );
    return Buffer.from(response.data);
  }

  private async saveAudioFile(
    audio: Buffer,
    fileName: string,
  ): Promise<AudioEntity> {
    return this.prisma.audioEntity.create({
      data: { audio, fileName, isSended: false },
    });
  }

  async getAudioById(id: number): Promise<AudioEntity | null> {
    return this.prisma.audioEntity.findUnique({ where: { id } });
  }

  async getLastAudioEntry(): Promise<AudioEntity | null> {
    return this.prisma.audioEntity.findFirst({ orderBy: { id: 'desc' } });
  }

  async toggleSended(id: number): Promise<void> {
    await this.prisma.audioEntity.update({
      where: { id },
      data: { isSended: true },
    });
  }
}
