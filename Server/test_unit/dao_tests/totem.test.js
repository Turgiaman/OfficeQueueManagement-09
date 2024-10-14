import {jest, test, expect, afterEach, describe } from "@jest/globals";
import { db } from "../../db/db.mjs";
import totemDao from "../../dao/totemDao.mjs";

jest.setTimeout(100000);

const dao = new totemDao();
afterEach(() => {
    jest.clearAllMocks();
});

describe('Class TotemDao', () => {
    describe('Test getServices', ()=>{
        test("It should return all the services", async() => {
            const dbAllMock=jest.spyOn(db,"all").mockImplementation((sql,params,callback) => {
                callback(null, [{name: "servizio 1 "},{name: "servizio 2"}]);
            })
            const result = await dao.getServices();
            expect(result).toStrictEqual([{name: "servizio 1 "},{name: "servizio 2"}]);
            dbAllMock.mockRestore();
        });
        test("It should return nothing", async() => {
            const dbAllMock=jest.spyOn(db,"all").mockImplementation((sql,params,callback) => {
                callback(null, []);
            })
            const result = await dao.getServices();
            expect(result).toStrictEqual([]);
            dbAllMock.mockRestore();
        });
    })
    describe('Test getTicket', ()=>{
        test("It should return the ticket tag", async() => {
            const dbRunMock=jest.spyOn(db,"run").mockImplementation((sql,params,callback) => {
                callback(null);
                
            })
            const dbGetMock=jest.spyOn(db,"get").mockImplementation((sql,params,callback) => {
                callback(null,{max:18});
                
            })
            const result = await dao.getTicket("DB");
            expect(result).toStrictEqual("DB18");
            dbRunMock.mockRestore();
            dbGetMock.mockRestore();
        });
        test("It should return error", async() => {
            const dbRunMock=jest.spyOn(db,"run").mockImplementation((sql,params,callback) => {
                callback(new Error('Database Error'));
                
            })
            await expect(dao.getTicket("DB")).rejects.toThrow('Database Error');
            dbRunMock.mockRestore();
        });
        test("It should return the ticket tag", async() => {
            const dbRunMock=jest.spyOn(db,"run").mockImplementation((sql,params,callback) => {
                callback(null);
                
            })
            const dbGetMock=jest.spyOn(db,"get").mockImplementation((sql,params,callback) => {
                callback(new Error('Database Error'));
                
            })
            await expect(dao.getTicket("DB")).rejects.toThrow('Database Error');
            dbRunMock.mockRestore();
            dbGetMock.mockRestore();
        });
    })
    
});