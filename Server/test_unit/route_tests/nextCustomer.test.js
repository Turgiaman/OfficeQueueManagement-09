import {test, describe, jest, expect, afterEach} from "@jest/globals";
import request from 'supertest';
import OfficerDao from "../../dao/officerDao.mjs";
import {app} from "../../index.mjs";

jest.mock("../../dao/officerDao");

afterEach(() => {
    jest.clearAllMocks();
})

describe("GET /api/counters/:counterId/next", () => {
    const mockCounterId = 1;
    const mockServiceIds = [1, 2];
    const mockServices = ['ab', 'cd'];

    test("it should return the next ticket to serve. Case 1: first queue longer than second", async () => {
        const mockCounts = [7, 3];
        const mockRes = { tag: 'ab', id: 7 };

        jest.spyOn(OfficerDao.prototype, "getCounterServices").mockResolvedValue(mockServiceIds);

        const spyServiceFromId = jest.spyOn(OfficerDao.prototype, "getServiceFromId")
            .mockResolvedValueOnce(mockServices[0])  // First call returns 'ab'
            .mockResolvedValueOnce(mockServices[1]); // Second call returns 'cd'

        const spyTicketCount = jest.spyOn(OfficerDao.prototype, "getTicketCount")
            .mockResolvedValueOnce(mockCounts[0])  // First call returns 7
            .mockResolvedValueOnce(mockCounts[1]); // Second call returns 3

        const spyRes = jest.spyOn(OfficerDao.prototype, "getNextCustomer").mockResolvedValue(mockRes); 

        const response = await request(app).get(`/api/counters/${mockCounterId}/next`);

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(mockRes);
        expect(spyServiceFromId).toHaveBeenCalledTimes(2);
        expect(spyTicketCount).toHaveBeenCalledTimes(2);
        expect(spyRes).toHaveBeenCalled();
    });

    test("it should return the next ticket to serve. Case 2: queues with same lenght, the first is choosen", async () => {
        const mockCounts = [7, 7];
        const mockTimes = [15, 10];
        const mockRes = { tag: 'ab', id: 7 };

        jest.spyOn(OfficerDao.prototype, "getCounterServices").mockResolvedValue(mockServiceIds);

        const spyServiceFromId = jest.spyOn(OfficerDao.prototype, "getServiceFromId")
            .mockResolvedValueOnce(mockServices[0])  // First call returns 'ab'
            .mockResolvedValueOnce(mockServices[1]); // Second call returns 'cd'

        const spyTicketCount = jest.spyOn(OfficerDao.prototype, "getTicketCount")
            .mockResolvedValueOnce(mockCounts[0])  // First call returns 7
            .mockResolvedValueOnce(mockCounts[1]); // Second call returns 7

        const spyTime = jest.spyOn(OfficerDao.prototype, "getServiceTime")
        .mockResolvedValueOnce(mockTimes[0])  // First call returns 15
        .mockResolvedValueOnce(mockTimes[1]); // Second call returns 10

        const spyRes = jest.spyOn(OfficerDao.prototype, "getNextCustomer").mockResolvedValue(mockRes); 

        const response = await request(app).get(`/api/counters/${mockCounterId}/next`);

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(mockRes);
        expect(spyServiceFromId).toHaveBeenCalledTimes(2);
        expect(spyTicketCount).toHaveBeenCalledTimes(2);
        expect(spyTime).toHaveBeenCalledTimes(2);
        expect(spyRes).toHaveBeenCalled();
    });

    test("it should return the next ticket to serve. Case 3: queues with same lenght, the second is choosen", async () => {
        const mockCounts = [7, 7];
        const mockTimes = [10, 15];
        const mockRes = { tag: 'ab', id: 7 };

        jest.spyOn(OfficerDao.prototype, "getCounterServices").mockResolvedValue(mockServiceIds);

        const spyServiceFromId = jest.spyOn(OfficerDao.prototype, "getServiceFromId")
            .mockResolvedValueOnce(mockServices[0])  // First call returns 'ab'
            .mockResolvedValueOnce(mockServices[1]); // Second call returns 'cd'

        const spyTicketCount = jest.spyOn(OfficerDao.prototype, "getTicketCount")
            .mockResolvedValueOnce(mockCounts[0])  // First call returns 7
            .mockResolvedValueOnce(mockCounts[1]); // Second call returns 7

        const spyTime = jest.spyOn(OfficerDao.prototype, "getServiceTime")
        .mockResolvedValueOnce(mockTimes[0])  // First call returns 10
        .mockResolvedValueOnce(mockTimes[1]); // Second call returns 15

        const spyRes = jest.spyOn(OfficerDao.prototype, "getNextCustomer").mockResolvedValue(mockRes); 

        const response = await request(app).get(`/api/counters/${mockCounterId}/next`);

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(mockRes);
        expect(spyServiceFromId).toHaveBeenCalledTimes(2);
        expect(spyTicketCount).toHaveBeenCalledTimes(2);
        expect(spyTime).toHaveBeenCalledTimes(2);
        expect(spyRes).toHaveBeenCalled();
    });

    test("it should return the next ticket to serve. Case 4: queues with same lenght and time, the first is choosen", async () => {
        const mockCounts = [7, 7];
        const mockTimes = [10, 10];
        const mockRes = { tag: 'ab', id: 7 };

        jest.spyOn(OfficerDao.prototype, "getCounterServices").mockResolvedValue(mockServiceIds);

        const spyServiceFromId = jest.spyOn(OfficerDao.prototype, "getServiceFromId")
            .mockResolvedValueOnce(mockServices[0])  // First call returns 'ab'
            .mockResolvedValueOnce(mockServices[1]); // Second call returns 'cd'

        const spyTicketCount = jest.spyOn(OfficerDao.prototype, "getTicketCount")
            .mockResolvedValueOnce(mockCounts[0])  // First call returns 7
            .mockResolvedValueOnce(mockCounts[1]); // Second call returns 7

        const spyTime = jest.spyOn(OfficerDao.prototype, "getServiceTime")
        .mockResolvedValueOnce(mockTimes[0])  // First call returns 10
        .mockResolvedValueOnce(mockTimes[1]); // Second call returns 10

        const spyRes = jest.spyOn(OfficerDao.prototype, "getNextCustomer").mockResolvedValue(mockRes); 

        const response = await request(app).get(`/api/counters/${mockCounterId}/next`);

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(mockRes);
        expect(spyServiceFromId).toHaveBeenCalledTimes(2);
        expect(spyTicketCount).toHaveBeenCalledTimes(2);
        expect(spyTime).toHaveBeenCalledTimes(2);
        expect(spyRes).toHaveBeenCalled();
    });
});

describe("PUT /api/tickets/:ticketId", () => {
    const mockCounterId =  {counterId : 1};
    const mockTicketId = 5;

    test("it should return the counter associated to a ticket", async () => {
        jest.spyOn(OfficerDao.prototype, "setCounterTicket").mockResolvedValue(mockCounterId);

        const response = await request(app).put(`/api/tickets/${mockTicketId}`).send(mockCounterId);
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual({
                message: 'Ticket state updated', 
                counterId: mockCounterId
        });
    });

    test("it should return a generic error", async () => {
        jest.spyOn(OfficerDao.prototype, "setCounterTicket").mockRejectedValue({
            message: "Internal Server Error",
            statusCode: 503
        });
        const response = await request(app).put(`/api/tickets/${mockTicketId}`).send(mockCounterId);
        expect(response.status).toBe(503);
        expect(response.body).toStrictEqual({"error": "Internal Server Error"});
    });

    test("it should return an error due to a missing counter id", async () => {
        const response = await request(app).put(`/api/tickets/${mockTicketId}`).send();
        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({"error": "counterId!"});
    });
});

describe("GET /api/officers", () => {
    test("it should return an array of officers", async () => {
        const mockOfficers = [{id: "1", key_name: "admin1"}, {id: "2", key_name: "emp1"}];
        jest.spyOn(OfficerDao.prototype, "getOfficers").mockResolvedValue(mockOfficers);

        const response = await request(app).get(`/api/officers`);
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(mockOfficers);
    });

    test("it should return a generic error", async () => {
        jest.spyOn(OfficerDao.prototype, "getOfficers").mockRejectedValue({
            message: "Internal Server Error",
            statusCode: 503
        });
        const response = await request(app).get(`/api/officers`);
        expect(response.status).toBe(503);
        expect(response.body).toStrictEqual({"error": "Internal Server Error"});
    });
})

describe("PUT /api/counters/:counterId", () => {
    const mockCounterId = 1;
    const mockEmployeeId = {employeeId: 5};

    test("it should return the counter id associate to an officer", async () => {
        jest.spyOn(OfficerDao.prototype, "setOfficerCounter").mockResolvedValue(mockCounterId);

        const response = await request(app).put(`/api/counters/${mockCounterId}`).send(mockEmployeeId);
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual({
                message: 'Counter state updated', 
                counterId: mockCounterId
        });
    });

    test("it should return a generic error", async () => {
        jest.spyOn(OfficerDao.prototype, "setOfficerCounter").mockRejectedValue({
            message: "Internal Server Error",
            statusCode: 503
        });
        const response = await request(app).put(`/api/counters/${mockCounterId}`).send(mockEmployeeId);
        expect(response.status).toBe(503);
        expect(response.body).toStrictEqual({"error": "Internal Server Error"});
    });

    test("it should return an error due to a missing employee id", async () => {
        const response = await request(app).put(`/api/counters/${mockCounterId}`).send();
        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({"error": "employeeId missing!"});
    });
});
