import { knexDb } from '@/common/config';
import { transactionRepository } from '../transactionRepository';

jest.mock('@/common/config');

describe('TransactionRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new transaction', async () => {
    const insertMock = jest.fn().mockResolvedValueOnce([1]);
    (knexDb.table as jest.Mock).mockReturnValue(knexDb);
    (knexDb.insert as jest.Mock).mockImplementationOnce(insertMock);

    const payload = {
      userId: 1,
      amount: 1000,
      type: 'credit',
    };

    const result = await transactionRepository.create(payload);

    expect(knexDb.table).toHaveBeenCalledWith('transactions');
    expect(insertMock).toHaveBeenCalledWith(payload);
    expect(result).toEqual([1]);
  });});

