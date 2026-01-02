import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

describe('OrdersController', () => {
  let controller: OrdersController;

  const ordersServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    uploadReceipt: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: ordersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an order', async () => {
    ordersServiceMock.create.mockResolvedValue({ id: 'order-id' });

    const createOrderDto = {} as CreateOrderDto;
    const result = await controller.create(createOrderDto);

    expect(result).toEqual({ id: 'order-id' });
    expect(ordersServiceMock.create).toHaveBeenCalled();
  });

  it('should list orders with pagination', async () => {
    ordersServiceMock.findAll.mockResolvedValue({ data: [] });

    const result = await controller.findAll('1', '10');

    expect(ordersServiceMock.findAll).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual({ data: [] });
  });

  it('should upload receipt', async () => {
    ordersServiceMock.uploadReceipt.mockResolvedValue({ id: 'order-id' });

    const result = await controller.uploadReceipt(
      'order-id',
      {} as Express.Multer.File,
    );

    expect(ordersServiceMock.uploadReceipt).toHaveBeenCalled();
    expect(result).toEqual({ id: 'order-id' });
  });
});
