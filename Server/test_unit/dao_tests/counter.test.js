import { jest, test, expect, afterEach, describe } from "@jest/globals";
import { db } from "../../db/db.mjs";
import counterDao from "../../dao/counterDao.mjs";

jest.setTimeout(100000);

const dao = new counterDao();

afterEach(() => {
    jest.clearAllMocks();
});

describe('Class CounterDao', () => {

    test("test getCounters", async () => {
        const mockCounters = [
            { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
            { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }
        ];
        const dbAllMock = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, mockCounters);
        });
        const result = await dao.getCounters();
        expect(result).toEqual(mockCounters);
        // expect(dbAllMock).toHaveBeenCalledTimes(1);
        dbAllMock.mockRestore();
    });

    test("test getServicesByCounterId", async () => {
        const mockCounterId = 1;
        const mockServices = [{ id: 1, name: "Bank Account" }, { id: 2, name: "Payment Card" }];
        const dbAllMock = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, mockServices);
        });
        const result = await dao.getServicesByCounterId(mockCounterId);
        expect(result).toEqual(mockServices);
        // expect(dbAllMock).toHaveBeenCalledTimes(1);
        dbAllMock.mockRestore();
    });

    test("test getTicketFromAllCounters", async () => {
        const mockCounters = [{ id: 1, actual_t_id: 10 }, { id: 2, actual_t_id: null }];
        const mockTag = { s_tag: 'BA', id: 10 };
        const mockQueue = { ticketInQueue: 3 };

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
        expect(result).toEqual([
            { id: 1, tag: 'BA13', num: mockQueue },
            { id: 2, tag: 'DB3', num: mockQueue },
            { id: 3, tag: null, num: null },
            { id: 4, tag: null, num: null },
            { id: 5, tag: null, num: null },
            { id: 6, tag: null, num: null },
            { id: 7, tag: null, num: null },
            { id: 8, tag: null, num: null },
            { id: 9, tag: null, num: null },
            { id: 10, tag: null, num: null }
        ]);
        // expect(dbAllMock).toHaveBeenCalledTimes(1);
        // expect(dbGetTagMock).toHaveBeenCalledTimes(1);
        // expect(dbGetQueueMock).toHaveBeenCalledTimes(1);
        dbAllMock.mockRestore();
        dbGetTagMock.mockRestore();
        dbGetQueueMock.mockRestore();
    });

    test("test getTicketTag", async () => {
        const mockTicketTag = { s_tag: 'BA', id: 10 };

        const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, mockTicketTag);
        });

        const result = await dao.getTicketTag(10);
        expect(result).toEqual('BA10');
        // expect(dbGetMock).toHaveBeenCalledTimes(1);

        dbGetMock.mockRestore();
    });

    test("test getNumberOfTicketsInQueue", async () => {
        const mockQueueCount = { ticketInQueue: 3 };

        const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, mockQueueCount);
        });

        const result = await dao.getNumberOfTicketsInQueue(10);
        expect(result).toEqual(mockQueueCount);
        // expect(dbGetMock).toHaveBeenCalledTimes(1);

        dbGetMock.mockRestore();
    });
});
