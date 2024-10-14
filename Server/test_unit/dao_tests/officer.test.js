import {jest, test, expect, afterEach, describe } from "@jest/globals";
import {db} from "../../db/db.mjs";
import officerDao from "../../dao/officerDao.mjs";

jest.mock('sqlite3');
jest.setTimeout(100000);

const dao = new officerDao();

afterEach(() => {
    jest.clearAllMocks();
});

describe("Class OfficerDao, functions for API /api/next/:counterId", () => {

    test("test getNextCustomer", async() => {
        const mockNextService = 'Service1';
        const mockTicket = {tag: 's', id: '1'};

        const dbAllMock = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, mockTicket);
        });

        const result = await dao.getNextCustomer(mockNextService);
        expect(result).toBe(mockTicket);
        expect(dbAllMock).toHaveBeenCalledTimes(1);
        expect(dbAllMock).toBeCalledWith("SELECT T.id, T.s_tag FROM ticket T, service S WHERE T.s_tag =  S.tag AND T.c_id IS NULL AND S.name = ?", [mockService]);
    });

    test("test getCounterServices", async() => {
        const mockCounterId = 1;
        const mockServices = [1, 2];
        const dbAllMock = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, mockServices);
        });

        const result = await dao.getCounterServices(mockCounterId);
        expect(result).toBe(mockServices);
        expect(dbAllMock).toHaveBeenCalledTimes(1);
        expect(dbAllMock).toBeCalledWith("SELECT service_id FROM counter_service WHERE counter_id = ?", [mockCounterId]);
    });

    test("test getServiceFromId", async() => {
        const mockServiceId = 1;
        const mockService = 'service1';
        const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, mockService);
        });

        const result = await dao.getServiceFromId(mockServiceId);
        expect(result).toBe(mockService);
        expect(dbGetMock).toHaveBeenCalledTimes(1);
        expect(dbGetMock).toBeCalledWith("SELECT name FROM service WHERE id = ?", [mockServiceId]);
    });

    test("test getTicketCount", async() => {
        const mockService = 'service1';
        const mockCount = 5;
        const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, mockCount);
        });

        const result = await dao.getServiceFromId(mockService);
        expect(result).toBe(mockCount);
        expect(dbGetMock).toHaveBeenCalledTimes(1);
        expect(dbGetMock).toBeCalledWith("SELECT COUNT(T.id) AS count FROM ticket T, service S WHERE T.s_tag =  S.tag AND T.c_id IS NULL AND S.name = ?", [mockService]);
    });

    test("test getServiceTime", async() => {
        const mockService = 'service1';
        const mockTime = 10;
        const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, mockTime);
        });

        const result = await dao.getServiceTime(mockService);
        expect(result).toBe(mockTime);
        expect(dbGetMock).toHaveBeenCalledTimes(1);
        expect(dbGetMock).toBeCalledWith("SELECT time FROM service WHERE name = ? ", [mockService]);
    });

    test("test getServiceTag", async() => {
        const mockRow = 'BA';
        const mockService = 'Bank Account';

        const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, mockRow);
        });

        const result = await dao.getServiceTag(mockService);
        expect(result).toBe(mockRow);
        expect(dbGetMock).toHaveBeenCalledTimes(1);
        expect(dbGetMock).toBeCalledWith("SELECT tag FROM service WHERE name = ?", [mockService]);
    });
});

describe("Class OfficerDao, functions for API /api/tickets/:ticketId/counter", () => {
    test("test setCounterTicket", async() => {
        const mockTicketId = 3;
        const mockCounterId = 1;

        const dbRunMock1 = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
        });
        const dbRunMock2 = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null, mockCounterId);
        });

        const result = await dao.setCounterTicket(mockTicketId, mockCounterId);
        expect(result).toBe(mockCounterId);
        expect(dbRunMock1).toHaveBeenCalledTimes(1);
        expect(dbRunMock2).toHaveBeenCalledTimes(1);
    });
})