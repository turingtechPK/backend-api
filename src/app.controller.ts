import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller('Test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Check if the app is running',
  })
  healthCheck(): string {
    return this.appService.checkHealth();
  }
}
