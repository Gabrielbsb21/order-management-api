import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ReportsService } from './reports.service';
import { Order } from '../orders/schemas';

describe('ReportsService', () => {
  let service: ReportsService;

  const aggregateResult = [
    { _id: 'customer-1', totalSpent: 1500 },
    { _id: 'customer-2', totalSpent: 900 },
  ];

  const orderModelMock = {
    aggregate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getModelToken(Order.name),
          useValue: orderModelMock,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return top customers ordered by total spent', async () => {
    orderModelMock.aggregate.mockResolvedValue(aggregateResult);

    const result = await service.getTopCustomers(2);

    expect(orderModelMock.aggregate).toHaveBeenCalledWith([
      {
        $group: {
          _id: '$customerId',
          totalSpent: { $sum: '$totalValueBRL' },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 2 },
    ]);

    expect(result).toEqual(aggregateResult);
  });

  it('should use default limit when none is provided', async () => {
    orderModelMock.aggregate.mockResolvedValue(aggregateResult);

    await service.getTopCustomers();

    expect(orderModelMock.aggregate).toHaveBeenCalledWith(
      expect.arrayContaining([{ $limit: 5 }]),
    );
  });
});
