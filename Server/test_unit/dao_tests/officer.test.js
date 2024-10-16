import {jest, test, expect, afterEach, describe } from "@jest/globals";
import {db} from "../../db/db.mjs";
import officerDao from "../../dao/officerDao.mjs";

jest.mock('sqlite3');
jest.setTimeout(100000);

const dao = new officerDao;

afterEach(() => {
    jest.clearAllMocks();
});

describe("Class OfficerDao, functions for API /api/counters/:counterId/next", () => {

    describe("test getNextCustomer", () => {
        const mockNextService = 'Service1';

        test("it should return the ticket of the next customer to be served", async() => {
            const mockTicket = [{s_tag: 'AB', id: 1}];
            const mockRes = { tag: 'AB', id: 1 };
            const dbAllMock = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(null, mockTicket);
            });
    
            const result = await dao.getNextCustomer(mockNextService);
            expect(result).toStrictEqual(mockRes);
            expect(dbAllMock).toBeCalledWith("SELECT T.id, T.s_tag FROM ticket T, service S WHERE T.s_tag =  S.tag AND T.c_id IS NULL AND S.name = ?",
                [mockNextService], expect.any(Function));
        });

        test("it should return an error", async() => {
            const mockError = "Database error"
            jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(new Error(mockError));
            });

            await expect(dao.getNextCustomer(mockNextService)).rejects.toThrow(mockError);
        });
    })
    
    describe("test getCounterServices", () => {
        const mockCounterId = 1;

        test("it should return an array of service's id associate to a counter", async() => {
            const mockServices = [{ service_id: 1 }, { service_id: 2 }]; //questo è quello che restituisce la chiamata al db! è diverso da cosa ritorna la funzione!
            const mockRes = [1,2];
            const dbAllMock = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(null, mockServices);
            });
    
            const result = await dao.getCounterServices(mockCounterId);
            expect(result).toStrictEqual(mockRes);
            expect(dbAllMock).toBeCalledWith("SELECT service_id FROM counter_service WHERE counter_id = ?",
                [mockCounterId], expect.any(Function));
        });

        test("it should return an error", async() => {
            const mockError = "Database error"
            jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(new Error(mockError));
            });

            await expect(dao.getCounterServices(mockCounterId)).rejects.toThrow(mockError);
        });
    })
    
    
    describe("test getServiceFromId", () => {
        const mockServiceId = 1;

        test("it should return the name of the service by its id", async() => {
            const mockService = {name: 'service1'};
            const mockRes = 'service1';
            const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, mockService);
            });
    
            const result = await dao.getServiceFromId(mockServiceId);
            expect(result).toStrictEqual(mockRes);
            expect(dbGetMock).toBeCalledWith("SELECT name FROM service WHERE id = ?",
                [mockServiceId], expect.any(Function));
        });

        test("it should return an error", async() => {
            const mockError = "Database error"
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(new Error(mockError));
            });

            await expect(dao.getServiceFromId(mockServiceId)).rejects.toThrow(mockError);
        });
    })
    
    
    describe("test getTicketCount", () => {
        const mockService = 'service1';

        test("it should return the number of customers waiting for a specific service", async() => {
            const mockCount = {count: 5};
            const mockRes = 5;
            const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, mockCount);
            });
    
            const result = await dao.getTicketCount(mockService);
            expect(result).toStrictEqual(mockRes);
            expect(dbGetMock).toBeCalledWith("SELECT COUNT(T.id) AS count FROM ticket T, service S WHERE T.s_tag =  S.tag AND T.c_id IS NULL AND S.name = ?",
                [mockService], expect.any(Function));
        });
    
        test("it should return 0 if there is no ticket pending", async() => {
            const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, null);
            });
    
            const result = await dao.getTicketCount(mockService);
            expect(result).toStrictEqual(0);
            expect(dbGetMock).toBeCalledWith("SELECT COUNT(T.id) AS count FROM ticket T, service S WHERE T.s_tag =  S.tag AND T.c_id IS NULL AND S.name = ?",
                [mockService], expect.any(Function));
        });

        test("it should return an error", async() => {
            const mockError = "Database error"
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(new Error(mockError));
            });
            
            await expect(dao.getTicketCount(mockService)).rejects.toThrow(mockError);
        });
    })
    
    
    describe("test getServiceTime", () => {
        const mockService = 'service1';

        test("it should return the waiting time associate to a service", async() => {
            const mockTime = {time: 10};
            const mockRes = 10;
            const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, mockTime);
            });
    
            const result = await dao.getServiceTime(mockService);
            expect(result).toStrictEqual(mockRes);
            expect(dbGetMock).toBeCalledWith("SELECT time FROM service WHERE name = ? ",
                [mockService], expect.any(Function));
        });

        test("it should return an error", async() => {
            const mockError = "Database error"
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(new Error(mockError));
            });
            
            await expect(dao.getServiceTime(mockService)).rejects.toThrow(mockError);
        });
    });
});


describe("Class OfficerDao, function for API /api/tickets/:ticketId", () => {
    describe("test setCounterTicket", () => {
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
        expect(result).toStrictEqual(mockCounterId);
    });

    test("it should return an error from the first query", async() => {
        const mockError = "Database error"
        const dbRunMock1 = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error(mockError));
        });
        const dbRunMock2 = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error(mockError));
        });
        
        await expect(dao.setCounterTicket(mockTicketId, mockCounterId)).rejects.toThrow(mockError);
    });

    test("it should return an error from the second query", async() => {
        const mockError = "Database error"
        const dbRunMock1 = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
        });
        const dbRunMock2 = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error(mockError));
        });
        
        await expect(dao.setCounterTicket(mockTicketId, mockCounterId)).rejects.toThrow(mockError);
    });
    })
});

describe("Class OfficerDao, function for API /api/ticket/:service", () => {
    describe("test getServiceTag", () => {
        const mockService = 'Bank Account';
    
        test("it should return the tag associate to a service", async() => {
            const mockTag = {tag: 'BA'};
            const mockRes = 'BA';
            const dbGetMock = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(null, mockTag);
            });
    
            const result = await dao.getServiceTag(mockService);
            expect(result).toStrictEqual(mockRes);
            expect(dbGetMock).toBeCalledWith("SELECT tag FROM service WHERE name = ?",
                [mockService], expect.any(Function));
        });
    
        test("it should return an error", async() => {
            const mockError = "Database error"
            jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback(new Error(mockError));
            });
            
            await expect(dao.getServiceTag(mockService)).rejects.toThrow(mockError);
        });
    });
})

describe("Class OfficerDao, function for API /api/officers", () => {
    describe("test getOfficers", () => {
        test("it should return an array of officers", async () => {
            const mockOfficers = [{id: 1, name: 'mario', surname: 'rossi'}, {id: 2, name: 'andrea', surname: 'bianchi'}];
            const dbAllMock = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(null, mockOfficers);
            });
    
            const result = await dao.getOfficers();
            expect(result).toStrictEqual(mockOfficers);
            expect(dbAllMock).toBeCalledWith(`
                SELECT id, key_name
                FROM employee
                WHERE role = ?`,
                ['employee'], expect.any(Function));
        });

        test("it should return an error", async() => {
            const mockError = "Database error"
            jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(new Error(mockError));
            });
            
            await expect(dao.getOfficers()).rejects.toThrow(mockError);
        });
    })
})

describe("Class OfficerDao, function for API /api/counters/:counterId", () => {
    describe("test setOfficerCounter", () => {
        const mockCounterId = 1;
        const mockEmployeeId = 5;

        test("it should associate an employee to a counter and return the counter id", async () => {
            const dbRunMock = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback(null, null);
            });
    
            const result = await dao.setOfficerCounter(mockEmployeeId, mockCounterId);
            expect(result).toStrictEqual(mockCounterId);
            expect(dbRunMock).toBeCalledWith(`
            UPDATE counter
            SET e_id = ?
            WHERE id = ?`,
                [mockEmployeeId, mockCounterId], expect.any(Function));
        });

        test("it should return an error", async() => {
            const mockError = "Database error"
            jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback(new Error(mockError));
            });
            
            await expect(dao.setOfficerCounter()).rejects.toThrow(mockError);
        });

    })
})
