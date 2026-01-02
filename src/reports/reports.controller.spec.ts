import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;

  const reportsServiceMock = {
    getTopCustomers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: reportsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return top customers with provided limit', async () => {
    const data = [{ customerId: '1', totalSpent: 1000 }];
    reportsServiceMock.getTopCustomers.mockResolvedValue(data);

    const result = await controller.getTopCustomers('3');

    expect(reportsServiceMock.getTopCustomers).toHaveBeenCalledWith(3);
    expect(result).toEqual(data);
  });

  it('should use default limit when none is provided', async () => {
    const data = [{ customerId: '1', totalSpent: 1000 }];
    reportsServiceMock.getTopCustomers.mockResolvedValue(data);

    const result = await controller.getTopCustomers(
      undefined as unknown as string,
    );

    expect(reportsServiceMock.getTopCustomers).toHaveBeenCalledWith(5);
    expect(result).toEqual(data);
  });
});
