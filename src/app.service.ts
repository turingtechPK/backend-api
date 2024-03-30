import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  checkHealth(): string {
    return 'The app is running';
  }
}
