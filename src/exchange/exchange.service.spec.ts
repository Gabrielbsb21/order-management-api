import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeService } from './exchange.service';
import axios from 'axios';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ExchangeService', () => {
  let service: ExchangeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangeService],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return USD to BRL rate when API responds successfully', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        USDBRL: {
          bid: '5.25',
        },
      },
    } as any);

    const rate = await service.getUsdToBrlRate();

    expect(rate).toBe(5.25);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://economia.awesomeapi.com.br/json/last/USD-BRL',
    );
  });

  it('should throw an error when API returns invalid rate', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        USDBRL: {
          bid: 'invalid',
        },
      },
    } as any);

    await expect(service.getUsdToBrlRate()).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw an error when axios request fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    await expect(service.getUsdToBrlRate()).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
