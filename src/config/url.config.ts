import { ConfigService } from '@nestjs/config';

export const getUrl = async (configService: ConfigService): Promise<string> =>
  configService.get('TTS_URL');
