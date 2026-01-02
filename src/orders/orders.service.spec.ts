import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { Order } from './schemas';
import { ExchangeService } from '../exchange/exchange.service';
import { CustomersService } from '../customers/customers.service';
import { NotificationQueue } from '../notifications/notification.queue';
import { UploadService } from '../upload/upload.service';
import { NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';

describe('OrdersService', () => {
  let service: OrdersService;

  const mockOrder = {
    id: 'order-id',
    _id: 'order-id',
    receiptUrl: null,
    save: jest.fn(),
  };

  const orderModelMock = {
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const exchangeServiceMock = {
    getUsdToBrlRate: jest.fn(),
  };

  const customersServiceMock = {
    findById: jest.fn(),
  };

  const notificationQueueMock = {
    notifyOrderCreated: jest.fn(),
  };

  const uploadServiceMock = {
    upload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken(Order.name),
          useValue: orderModelMock,
        },
        {
          provide: ExchangeService,
          useValue: exchangeServiceMock,
        },
        {
          provide: CustomersService,
          useValue: customersServiceMock,
        },
        {
          provide: NotificationQueue,
          useValue: notificationQueueMock,
        },
        {
          provide: UploadService,
          useValue: uploadServiceMock,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an order and send notification', async () => {
    customersServiceMock.findById.mockResolvedValue({
      _id: 'customer-id',
      name: 'Gabriel',
      email: 'gabriel@email.com',
    });

    exchangeServiceMock.getUsdToBrlRate.mockResolvedValue(5);
    orderModelMock.create.mockResolvedValue(mockOrder);

    const dto: CreateOrderDto = {
      customerId: 'customer-id',
      date: '2025-01-01',
      items: [{ product: 'Notebook', quantity: 2, unitPriceUSD: 100 }],
    };

    const result = await service.create(dto);

    expect(exchangeServiceMock.getUsdToBrlRate).toHaveBeenCalled();
    expect(orderModelMock.create).toHaveBeenCalled();
    expect(notificationQueueMock.notifyOrderCreated).toHaveBeenCalled();
    expect(result).toEqual(mockOrder);
  });

  it('should throw NotFoundException if order not found', async () => {
    orderModelMock.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.findById('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should upload receipt and update order', async () => {
    orderModelMock.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockOrder),
    });

    uploadServiceMock.upload.mockResolvedValue(
      'http://localhost/uploads/file.pdf',
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const file = {} as Express.Multer.File;

    const result = await service.uploadReceipt('order-id', file);

    expect(uploadServiceMock.upload).toHaveBeenCalledWith(file);
    expect(mockOrder.save).toHaveBeenCalled();
    expect(result.receiptUrl).toBe('http://localhost/uploads/file.pdf');
  });
});
