import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

interface ExchangeApiResponse {
  USDBRL: {
    bid: string;
  };
}

@Injectable()
export class ExchangeService {
  private readonly apiUrl =
    'https://economia.awesomeapi.com.br/json/last/USD-BRL';

  async getUsdToBrlRate(): Promise<number> {
    try {
      const response = await axios.get<ExchangeApiResponse>(this.apiUrl);

      const rate = Number(response.data.USDBRL.bid);

      if (isNaN(rate)) {
        throw new Error('Invalid exchange rate');
      }

      return rate;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new InternalServerErrorException(
        'Failed to fetch USD to BRL exchange rate',
      );
    }
  }
}
