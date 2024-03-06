import { ConfigService } from '@nestjs/config';

export const getToken = async (configService: ConfigService): Promise<string> =>
  configService.get('TTS_TOKEN');
