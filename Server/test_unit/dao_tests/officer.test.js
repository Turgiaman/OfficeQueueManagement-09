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

    test("blabla", async() => {
        /*robe a caso*/
        const dbRunMock = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {};
        });

        await expect(dao.getNextCustomer(1)).resolves.toBe(4);
    });
    
});

describe("Class OfficerDao, function getServiceTag", () => {
    test("test getServiceTag", async() => {

    });
});

describe("Class OfficerDao, function setCounterTicket", () => {
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

