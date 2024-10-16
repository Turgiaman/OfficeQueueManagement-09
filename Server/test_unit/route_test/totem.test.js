import {jest, test, expect, afterEach, describe } from "@jest/globals";
import request  from "supertest";
import TotemDao from "../../dao/totemDao.mjs";
import OfficerDao from "../../dao/officerDao.mjs";
import {app} from "../../index.mjs"

jest.mock("../../dao/totemDao")
jest.mock("../../dao/officerDao")
afterEach(() => {
    jest.clearAllMocks();
})

describe('Class TotemRoutes', () => {
    describe('GET /api/services', ()=>{
        test("It should return 200", async() => {
            jest.spyOn(TotemDao.prototype,"getServices" ).mockResolvedValueOnce([{ name: "servizio 1" }, { name: "servizio 2" }]);
            const response=await  request(app).get("/api/services")
            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual([{ name: "servizio 1" }, { name: "servizio 2" }])
        });
        test('It should return 503 on error', async () => {
            // Mock the getServices method to throw an error
            jest.spyOn(TotemDao.prototype, 'getServices').mockRejectedValueOnce(new Error('Database error'));
    
            // Make a GET request to the /api/services route
            const response = await request(app).get('/api/services');
    
            // Assert that the status is 503
            expect(response.status).toBe(503);
    
            // Assert that the response contains the error message
            expect(response.body).toStrictEqual({ error: 'Database error' });
        });
    })
    describe('GET /api/ticket/:service', ()=>{
        test("It should return 200", async() => {
            jest.spyOn(TotemDao.prototype,"getTicket" ).mockResolvedValueOnce("BA21");
            jest.spyOn(OfficerDao.prototype,"getServiceTag").mockResolvedValueOnce("BA");
            const response=await  request(app).get("/api/ticket/1")
            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual("BA21")
        });
        test('It should return 503 on error from officerDao.getServiceTag', async () => {
            // Mock officerDao.getServiceTag to throw an error
            jest.spyOn(OfficerDao.prototype, 'getServiceTag').mockRejectedValueOnce(new Error('Service tag not found'));
    
            // Make a GET request to the /api/ticket/:service route
            const response = await request(app).get('/api/ticket/myservice');
    
            // Assert that the status is 503
            expect(response.status).toBe(503);
    
            // Assert that the response contains the error message
            expect(response.body).toStrictEqual({ error: 'Service tag not found' });
        });
        test('It should return 503 on error from totemDao.getTicket', async () => {
            // Mock officerDao.getServiceTag to return a valid service tag
            jest.spyOn(OfficerDao.prototype, 'getServiceTag').mockResolvedValueOnce('serviceTag123');
    
            // Mock totemDao.getTicket to throw an error
            jest.spyOn(TotemDao.prototype, 'getTicket').mockRejectedValueOnce(new Error('Ticket generation failed'));
    
            // Make a GET request to the /api/ticket/:service route
            const response = await request(app).get('/api/ticket/myservice');
    
            // Assert that the status is 503
            expect(response.status).toBe(503);
    
            // Assert that the response contains the error message
            expect(response.body).toStrictEqual({ error: 'Ticket generation failed' });
        });


    })
    
});