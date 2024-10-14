import { jest, test, expect, afterEach, describe } from "@jest/globals";
import { db } from "../../db/db.mjs";
import CounterDao from "../../dao/counterDao.mjs";

const dao = new CounterDao();

afterEach(() => {
    jest.clearAllMocks();
});

describe('Class CounterDao', () => {

    test("test getCounters", async () => {
        const mockCounters = [{ id: 1 }, { id: 2 }];

        const dbAllMock = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, mockCounters);
        });

        const result = await dao.getCounters();
        expect(result).toEqual(mockCounters);
        expect(dbAllMock).toHaveBeenCalledTimes(1);
        expect(dbAllMock).toBeCalledWith("SELECT id FROM counter", []);
    });

    test("test getServicesByCounterId", async () => {
        const mockCounterId = 1;
        const mockServices = [{ id: 1, name: "Bank Account" }, { id: 2, name: "Payment Card" }];

        const dbAllMock = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, mockServices);
        });

        const result = await dao.getServicesByCounterId(mockCounterId);
        expect(result).toEqual(mockServices);
        console.log(result);
        expect(dbAllMock).toHaveBeenCalledTimes(1);
        expect(dbAllMock).toBeCalledWith(
            `SELECT s.id, s.name 
             FROM service s
             JOIN counter_service cs ON s.id = cs.service_id
             WHERE cs.counter_id = ?`, 
            [mockCounterId]);
        dbAllMock.mockRestore();
    });

    test("test getTicketFromAllCounters", async () => {
        const mockCounters = [{ id: 1, actual_t_id: 10 }, { id: 2, actual_t_id: null }];
        const mockTag = { s_tag: 'BA', id: 10 };
        const mockQueue = { ticketInQueue: 5 };

        const dbAllMock = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, mockCounters);
        });
        
        const dbGetTagMock = jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null, mockTag);
        });

        const dbGetQueueMock = jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null, mockQueue);
        });

        const result = await dao.getTicketFromAllCounters();
        expect(result).toStrictEqual([
            { id: 1, tag: 'BA10', num: mockQueue },
            { id: 2, tag: null, num: null }
        ]);

        expect(dbAllMock).toHaveBeenCalledTimes(1);
        expect(dbGetTagMock).toHaveBeenCalledTimes(1);
        expect(dbGetQueueMock).toHaveBeenCalledTimes(1);
    });

    test("test getTicketTag", async () => {
        const mockTicketTag = { s_tag: 'BA', id: 10 };

        const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, mockTicketTag);
        });

        const result = await dao.getTicketTag(10);
        expect(result).toEqual('BA10');
        expect(dbGetMock).toHaveBeenCalledTimes(1);
        expect(dbGetMock).toBeCalledWith("SELECT id, s_tag FROM ticket WHERE id = ?", [10]);
    });

    test("test getNumberOfTicketsInQueue", async () => {
        const mockQueueCount = { ticketInQueue: 5 };

        const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, mockQueueCount);
        });

        const result = await dao.getNumberOfTicketsInQueue(10);
        expect(result).toEqual(mockQueueCount);
        expect(dbGetMock).toHaveBeenCalledTimes(1);
        expect(dbGetMock).toBeCalledWith(expect.stringContaining('SELECT COUNT(*) as ticketInQueue'), [10]);
    });
});
