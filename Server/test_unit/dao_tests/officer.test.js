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

    describe("test getNextCustomer", () => {
        const mockNextService = 'Service1';

        test("it should returns the ticket of the next customer to be served", async() => {
            const mockTicket = {tag: 'AB', id: '1'};
            const dbAllMock = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(null, mockTicket);
            });
    
            const result = await dao.getNextCustomer(mockNextService);
            expect(result).toBe(mockTicket);
            expect(dbAllMock).toHaveBeenCalledTimes(1);
            expect(dbAllMock).toBeCalledWith("SELECT T.id, T.s_tag FROM ticket T, service S WHERE T.s_tag =  S.tag AND T.c_id IS NULL AND S.name = ?", [mockService]);
        });

        test("it should returns an error", async() => {
            const mockError = "Database error"
            const dbAllMock = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(new Error(mockError));
            });

            await expect(dao.getNextCustomer(mockNextService)).rejects.toThrow(mockError);
            expect(dbAllMock).toHaveBeenCalledTimes(1);
        });
    })
    
    describe("test getCounterServices", () => {
        const mockCounterId = 1;

        test("it should returns an array of service's id associate to a counter", async() => {
            const mockServices = [1, 2];
            const dbAllMock = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(null, mockServices);
            });
    
            const result = await dao.getCounterServices(mockCounterId);
            expect(result).toBe(mockServices);
            expect(dbAllMock).toHaveBeenCalledTimes(1);
            expect(dbAllMock).toBeCalledWith("SELECT service_id FROM counter_service WHERE counter_id = ?", [mockCounterId]);
        });

        test("it should returns an error", async() => {
            const mockError = "Database error"
            const dbAllMock = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(new Error(mockError));
            });

            await expect(dao.getCounterServices(mockCounterId)).rejects.toThrow(mockError);
            expect(dbAllMock).toHaveBeenCalledTimes(1);
        });
    })
    
    describe("test getServiceFromId", () => {
        const mockServiceId = 1;

        test("it should returns the name of the service by its id", async() => {
            const mockService = 'service1';
            const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, mockService);
            });
    
            const result = await dao.getServiceFromId(mockServiceId);
            expect(result).toBe(mockService);
            expect(dbGetMock).toHaveBeenCalledTimes(1);
            expect(dbGetMock).toBeCalledWith("SELECT name FROM service WHERE id = ?", [mockServiceId]);
        });

        test("it should returns an error", async() => {
            const mockError = "Database error"
            const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(new Error(mockError));
            });

            await expect(dao.getServiceFromId(mockServiceId)).rejects.toThrow(mockError);
            expect(dbGetMock).toHaveBeenCalledTimes(1);
        });
    })
    

    describe("test getTicketCount", () => {
        const mockService = 'service1';

        test("it should returns the number of customers waiting for a specific service", async() => {
            const mockCount = 5;
            const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, mockCount);
            });
    
            const result = await dao.getTicketCount(mockService);
            expect(result).toBe(mockCount);
            expect(dbGetMock).toHaveBeenCalledTimes(1);
            expect(dbGetMock).toBeCalledWith("SELECT COUNT(T.id) AS count FROM ticket T, service S WHERE T.s_tag =  S.tag AND T.c_id IS NULL AND S.name = ?", [mockService]);
        });
    
        test("it should returns 0 if there is no ticket pending", async() => {
            const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, null);
            });
    
            const result = await dao.getTicketCount(mockService);
            expect(result).toBe(0);
            expect(dbGetMock).toHaveBeenCalledTimes(1);
            expect(dbGetMock).toBeCalledWith("SELECT COUNT(T.id) AS count FROM ticket T, service S WHERE T.s_tag =  S.tag AND T.c_id IS NULL AND S.name = ?", [mockService]);
        });

        test("it should returns an error", async() => {
            const mockError = "Database error"
            const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(new Error(mockError));
            });
            
            await expect(dao.getTicketCount(mockService)).rejects.toThrow(mockError);
            expect(dbGetMock).toHaveBeenCalledTimes(1);
        });
    })
    
    describe("test getServiceTime", () => {
        const mockService = 'service1';

        test("it should returns the waiting time associate to a service", async() => {
            const mockTime = 10;
            const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, mockTime);
            });
    
            const result = await dao.getServiceTime(mockService);
            expect(result).toBe(mockTime);
            expect(dbGetMock).toHaveBeenCalledTimes(1);
            expect(dbGetMock).toBeCalledWith("SELECT time FROM service WHERE name = ? ", [mockService]);
        });

        test("it should returns an error", async() => {
            const mockError = "Database error"
            const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(new Error(mockError));
            });
            
            await expect(dao.getServiceTime(mockService)).rejects.toThrow(mockError);
            expect(dbGetMock).toHaveBeenCalledTimes(1);
        });
    })
    

    describe("test getServiceTag", () => {
        const mockService = 'Bank Account';

        test("it should return the tag associate to a service", async() => {
            const mockTag = 'BA';
            const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, mockTag);
            });
    
            const result = await dao.getServiceTag(mockService);
            expect(result).toBe(mockTag);
            expect(dbGetMock).toHaveBeenCalledTimes(1);
            expect(dbGetMock).toBeCalledWith("SELECT tag FROM service WHERE name = ?", [mockService]);
        });

        test("it should returns an error", async() => {
            const mockError = "Database error"
            const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(new Error(mockError));
            });
            
            await expect(dao.getServiceTag(mockService)).rejects.toThrow(mockError);
            expect(dbGetMock).toHaveBeenCalledTimes(1);
        });
    });
});

describe("Class OfficerDao, function for API /api/tickets/:ticketId/counter", () => {
    const mockTicketId = 3;
    const mockCounterId = 1;

    test("test setCounterTicket", async() => {
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

    test("it should returns an error from the first query", async() => {
        const mockError = "Database error"
        const dbRunMock1 = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error(mockError));
        });
        const dbRunMock2 = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error(mockError));
        });
        
        await expect(dao.setCounterTicket(mockTicketId, mockCounterId)).rejects.toThrow(mockError);
        expect(dbRunMock1).toHaveBeenCalledTimes(1);
        expect(dbRunMock2).toHaveBeenCalledTimes(0);
    });

    test("it should returns an error from the second query", async() => {
        const mockError = "Database error"
        const dbRunMock1 = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
        });
        const dbRunMock2 = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error(mockError));
        });
        
        await expect(dao.setCounterTicket(mockTicketId, mockCounterId)).rejects.toThrow(mockError);
        expect(dbRunMock1).toHaveBeenCalledTimes(1);
        expect(dbRunMock2).toHaveBeenCalledTimes(1);
    });
})