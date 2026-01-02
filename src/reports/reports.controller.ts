import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Relatórios')
@Controller('relatorios')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('top-clientes')
  @ApiQuery({ name: 'limit', required: false })
  getTopCustomers(@Query('limit') limit = '5') {
    return this.reportsService.getTopCustomers(Number(limit));
  }
}
