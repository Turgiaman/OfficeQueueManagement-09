import { afterEach, describe, expect, jest, test } from "@jest/globals";
import TicketDao from "../../dao/TicketDao.mjs";
import { db } from "../../db/db.mjs";

jest.setTimeout(1000);

const dao = new TicketDao();

afterEach(() => {
  jest.clearAllMocks();
});

describe('Class ticketDao', () => {
  
  describe('test getTicketCountsByCounter', () => {
    
    test('getTicketCountsByCounter - daily', async () => {
      const mockService = { tag: 'BA' };
      const mockTickets = [{ c_id: 1, period: '2024-10-15', ticket_count: 10 }];
      
      const dbGetMock = jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
        callback(null, mockService);
      });
      const dbAllMock = jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
        callback(null, mockTickets);
      });

      const result = await dao.getTicketCountsByCounter('daily', 'Bank Account', '2024-10-15');
      expect(result).toEqual(mockTickets);
      dbGetMock.mockRestore();
      dbAllMock.mockRestore();
    });

    test('getTicketCountsByCounter - service not found', async () => {
      const dbGetMock = jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
        callback(null, null); // No service found
      });

      await expect(dao.getTicketCountsByCounter('daily', 'Invalid Service', '2024-10-15')).rejects.toThrow('Service not found.');
      dbGetMock.mockRestore();
    });

    test('getTicketCountsByCounter - weekly', async () => {
      const mockService = { tag: 'BA' };
      const mockTickets = [{ c_id: 1, period: '2024-42', ticket_count: 50 }];

      const dbGetMock = jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
        callback(null, mockService);
      });
      const dbAllMock = jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
        callback(null, mockTickets);
      });

      const result = await dao.getTicketCountsByCounter('weekly', 'Bank Account', '2024-10-15');
      expect(result).toEqual(mockTickets);
      dbGetMock.mockRestore();
      dbAllMock.mockRestore();
    });

    test('getTicketCountsByCounter - invalid period', async () => {
      await expect(dao.getTicketCountsByCounter('yearly', 'Bank Account', '2024-10-15')).rejects.toThrow('Invalid period. Use daily, weekly, or monthly.');
    });
  });

  describe('test getTicketCountsByService', () => {

    test('getTicketCountsByService - daily', async () => {
      const mockTickets = [{ s_tag: 'BA', period: '2024-10-15', ticket_count: 20 }];

      const dbAllMock = jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
        callback(null, mockTickets);
      });

      const result = await dao.getTicketCountsByService('daily', '2024-10-15');
      expect(result).toEqual(mockTickets);
      dbAllMock.mockRestore();
    });

    test('getTicketCountsByService - weekly', async () => {
      const mockTickets = [{ s_tag: 'BA', period: '2024-42', ticket_count: 100 }];

      const dbAllMock = jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
        callback(null, mockTickets);
      });

      const result = await dao.getTicketCountsByService('weekly', '2024-10-15');
      expect(result).toEqual(mockTickets);
      dbAllMock.mockRestore();
    });

    test('getTicketCountsByService - invalid period', async () => {
      await expect(dao.getTicketCountsByService('yearly', '2024-10-15')).rejects.toThrow('Invalid period. Use daily, weekly, or monthly.');
    });

    test('getTicketCountsByService - db error', async () => {
      const dbAllMock = jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
        callback(new Error('Database error'), null);
      });

      await expect(dao.getTicketCountsByService('daily', '2024-10-15')).rejects.toThrow('Database error');
      dbAllMock.mockRestore();
    });
  });
});
