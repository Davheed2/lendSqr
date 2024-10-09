import { knexDb, connectDb, disconnectDb } from '@/common/config/database';
//import { Knex } from 'knex';

jest.mock('knex', () => {
  const mKnex: jest.Mock = jest.fn(() => ({
    raw: jest.fn(),
    destroy: jest.fn(),
  }));
  return mKnex;
});

describe('Database Connection', () => {
  let mockConsoleLog: jest.SpyInstance;
  let mockConsoleError: jest.SpyInstance;
  let mockExit: jest.SpyInstance;

  beforeEach(() => {
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('connectDb should successfully connect to the database', async () => {
    (knexDb.raw as jest.Mock).mockResolvedValue(true);

    await connectDb();

    expect(knexDb.raw).toHaveBeenCalledWith('SELECT 1');
    expect(mockConsoleLog).toHaveBeenCalledWith('MySQL connected successfully');
  });

  test('connectDb should handle connection errors', async () => {
    const error = new Error('Connection failed');
    (knexDb.raw as jest.Mock).mockRejectedValue(error);

    await connectDb();

    expect(knexDb.raw).toHaveBeenCalledWith('SELECT 1');
    expect(mockConsoleError).toHaveBeenCalledWith('Error connecting to the database: Connection failed');
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  test('disconnectDb should successfully close the database connection', async () => {
    (knexDb.destroy as jest.Mock).mockResolvedValue(undefined);

    await disconnectDb();

    expect(knexDb.destroy).toHaveBeenCalled();
    expect(mockConsoleLog).toHaveBeenCalledWith('MySQL connection closed');
  });

  test('disconnectDb should handle disconnection errors', async () => {
    const error = new Error('Disconnection failed');
    (knexDb.destroy as jest.Mock).mockRejectedValue(error);

    await disconnectDb();

    expect(knexDb.destroy).toHaveBeenCalled();
    expect(mockConsoleError).toHaveBeenCalledWith('Error closing the database: Disconnection failed');
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});