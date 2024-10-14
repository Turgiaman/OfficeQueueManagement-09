import {jest, test, expect, afterEach, describe } from "@jest/globals";
import {db} from "../../db/db.mjs";
import officerDao from "../../dao/officerDao.mjs";

jest.mock('sqlite3');
jest.setTimeout(100000);

const dao = new officerDao();

afterEach(() => {
    jest.clearAllMocks();
});

describe('Class OfficerDao, function getNextCustomer', () => {

    test("test getNextCustomer", async() => {
        const mockCounter = 1; //input

        //mock getCounterServices
        const mockServices = ['service1', 'service2']; 
        db.all.mockImplementationOnce((sql, params, callback) => {
            callback(null, [{service_id: 1}, {service_id: 2}]);
        })

        //mock serviceFromId (chiamata da getCounterServices) 
        db.get.mockImplementationOnce((sql, params, callback) => {
            callback(null, { name: 'service1' });
        }).mockImplementationOnce((sql, params, callback) => {
            callback(null, { name: 'service2' });
        });

        //mock getTicketCount
        db.get.mockImplementationOnce((sql, params, callback) => {
            callback(null, { count: 5 });  // count for service1
        }).mockImplementationOnce((sql, params, callback) => {
            callback(null, { count: 3 });  // count for service2
        });

        //mock getServiceTime
        db.get.mockImplementationOnce((sql, params, callback) => {
            callback(null, { time: 10 });  // time for service1
        }).mockImplementationOnce((sql, params, callback) => {
            callback(null, { time: 20 });  // time for service2
        });

        //query
        const mockRow = [{id: 123, s_tag: 'abc'}];
        //NOTA: non dovrebbe essere db.get??
        const dbAllMock=jest.spyOn(db,"all").mockImplementation((sql,params,callback) => {
            callback(null, mockRow);
        })

        const res = await dao.getNextCustomer(mockCounter);
        expect(res).toBe(mockRow);
        expect(dbAllMock).toBeCalledTimes(1);
    });

    test("test helper function getCounterServices", async() => {

    });

    test("test helper function getServiceFromId", async() => {

    });

    test("test helper function getTicketCount", async() => {

    });

    test("test helper function getServiceTime", async() => {

    });
    
});

describe("Class OfficerDao, function getServiceTag", () => {
    test("test getServiceTag", async() => {

    });
});

describe("Class OfficerDao, function setCounterTicket", () => {
    test("test setCounterTicket", async() => {

    });
});

