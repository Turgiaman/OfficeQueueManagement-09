import {jest, test, expect, afterEach, describe } from "@jest/globals";
import { Database } from "sqlite3";
import db from "../../db/db";
import officerDao from "../../dao/officerDao.mjs";

jest.mock('sqlite3');
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

        await expect(dao.getNextCustomer(1)).resolves.toBe();
    });
    
});


