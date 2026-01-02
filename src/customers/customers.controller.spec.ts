import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

describe('CustomersController', () => {
  let controller: CustomersController;

  const mockCustomersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockCustomer = {
    _id: 'customer-id',
    name: 'Gabriel Silva',
    email: 'gabriel@email.com',
    country: 'Brasil',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a customer', async () => {
    mockCustomersService.create.mockResolvedValue(mockCustomer);

    const result = await controller.create({
      name: 'Gabriel Silva',
      email: 'gabriel@email.com',
      country: 'Brasil',
    });

    expect(result).toEqual(mockCustomer);
    expect(mockCustomersService.create).toHaveBeenCalled();
  });

  it('should return all customers', async () => {
    mockCustomersService.findAll.mockResolvedValue([mockCustomer]);

    const result = await controller.findAll();

    expect(result).toEqual([mockCustomer]);
  });

  it('should return a customer by id', async () => {
    mockCustomersService.findById.mockResolvedValue(mockCustomer);

    const result = await controller.findOne('customer-id');

    expect(result).toEqual(mockCustomer);
  });

  it('should update a customer', async () => {
    mockCustomersService.update.mockResolvedValue(mockCustomer);

    const result = await controller.update('customer-id', {
      name: 'Novo Nome',
    });

    expect(result).toEqual(mockCustomer);
  });

  it('should delete a customer', async () => {
    mockCustomersService.remove.mockResolvedValue(undefined);

    await expect(controller.remove('customer-id')).resolves.not.toThrow();
  });
});
