import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CustomersService } from './customers.service';
import { Customer } from './schemas/customer.schema';
import { NotFoundException } from '@nestjs/common';

describe('CustomersService', () => {
  let service: CustomersService;

  const mockCustomer = {
    _id: 'customer-id',
    name: 'Gabriel Silva',
    email: 'gabriel@email.com',
    country: 'Brasil',
  };

  const customerModelMock = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getModelToken(Customer.name),
          useValue: customerModelMock,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a customer', async () => {
    customerModelMock.create.mockResolvedValue(mockCustomer);

    const result = await service.create({
      name: 'Gabriel Silva',
      email: 'gabriel@email.com',
      country: 'Brasil',
    });

    expect(customerModelMock.create).toHaveBeenCalled();
    expect(result).toEqual(mockCustomer);
  });

  it('should return all customers', async () => {
    customerModelMock.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockCustomer]),
    });

    const result = await service.findAll();

    expect(result).toEqual([mockCustomer]);
  });

  it('should return customer by id', async () => {
    customerModelMock.findById.mockResolvedValue(mockCustomer);

    const result = await service.findById('customer-id');

    expect(result).toEqual(mockCustomer);
  });

  it('should throw NotFoundException if customer not found', async () => {
    customerModelMock.findById.mockResolvedValue(null);

    await expect(service.findById('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a customer', async () => {
    customerModelMock.findByIdAndUpdate.mockResolvedValue(mockCustomer);

    const result = await service.update('customer-id', { name: 'Novo Nome' });

    expect(result).toEqual(mockCustomer);
  });

  it('should delete a customer', async () => {
    customerModelMock.findByIdAndDelete.mockResolvedValue(mockCustomer);

    await expect(service.remove('customer-id')).resolves.not.toThrow();
  });
});
