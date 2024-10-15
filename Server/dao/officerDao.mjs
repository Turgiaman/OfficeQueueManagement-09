import { db } from "../db/db.mjs";

export default function OfficerDao() {
    this.getNextCustomer = (nextService) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT T.id, T.s_tag FROM ticket T, service S WHERE T.s_tag =  S.tag AND T.c_id IS NULL AND S.name = ?";
            db.all(sql, [nextService], (err, row) => {
                if(err)
                    reject(err);
                else
                resolve({tag: row[0].s_tag, id: row[0].id});
            })
        })
    }

    this.getCounterServices = (counterId) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT service_id FROM counter_service WHERE counter_id = ?"
            db.all(sql, [counterId], async (err, rows) => {
                if (err) {
                    return reject(err);
                }
                else {
                    const serviceIds = rows.map(row => row.service_id);
                    resolve(serviceIds);
                }
            })
        });
    }

    this.getServiceFromId = (id) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT name FROM service WHERE id = ?";
            db.get(sql, [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                else {
                    resolve(row.name);
                }
            })
        });
    }

    this.getTicketCount = (service) => {
        return new Promise((resolve, reject) => {
            const sql2 = "SELECT COUNT(T.id) AS count FROM ticket T, service S WHERE T.s_tag =  S.tag AND T.c_id IS NULL AND S.name = ?";
            db.get(sql2, [service], (err, row) => {
                if (err) {
                    return reject(err);
                }
                else if (!row) {
                    resolve(0)
                }
                else {
                    resolve(row.count)
                }
            })
        });
    }

    this.getServiceTime = (service) => {
        return new Promise((resolve, reject) => {
            const sql2 = "SELECT time FROM service WHERE name = ? ";
            db.get(sql2, [service], (err, row) => {
                if (err) {
                    return reject(err);
                }
                else {
                    resolve(row.time)
                }
            })
        });
    }

    this.getServiceTag = (service) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT tag FROM service WHERE name = ?";
            db.get(sql, [service], (err, row) => {
                if (err) {
                    return reject(err);
                }
                else {
                    resolve(row.tag);
                }
            })
        });
    }

    this.setCounterTicket = (ticketId, counterId) => {
        return new Promise((resolve, reject) => {
            const sql1 = `
            UPDATE ticket
            SET c_id = ?
            WHERE id = ?`

            const sql2 = `
            UPDATE counter
            SET actual_t_id = ?
            WHERE id = ?`

            db.run(sql1, [counterId, ticketId], function (err) {
                if (err) {
                    return reject(err);
                }
                db.run(sql2, [ticketId, counterId], function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(counterId);
                });

            });
        });
    }

    this.getOfficers = () => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT id, name, surname
                FROM employee
                WHERE role = ?`;
            
            db.all(sql, ['employee'], (err, rows) => {
                if (err) {
                    return reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    this.setOfficerCounter = (employeeId,counterId) => {
        return new Promise((resolve, reject) => {
            const sql = `
            UPDATE counter
            SET e_id = ?
            WHERE id = ?`;

            db.run(sql, [employeeId, counterId], function (err) {
                if (err) {
                    return reject(err);
                }
                else {
                    resolve(counterId);
                }
            });
        });
    }
}