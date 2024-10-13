import {jest, test, expect, afterEach, describe } from "@jest/globals";
import {db} from "../../db/db.mjs";
import officerDao from "../../dao/officerDao.mjs";


jest.setTimeout(100000);

const dao = new officerDao();

afterEach(() => {
    jest.clearAllMocks();
});

describe('blabla', () => {

    test("blabla", async() => {
        /*robe a caso*/
        const dbRunMock = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {};
        });

        await expect(dao.getNextCustomer(1)).resolves.toBe(4);
    });
    
});


