import sqlite from 'sqlite3'

const db = new sqlite.Database('db/db.sqlite', (err) => {
    if (err) throw err;
})

export default class CounterDao {
    getCounters () {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id FROM counter";
            db.all(sql, [], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                else resolve(rows);
            });
        });
    }

    getServicesByCounterId (counterId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT s.id, s.name
                         FROM service s
                         JOIN counter_service cs ON s.id = cs.service_id
                         WHERE cs.counter_id = ?`;
            db.all(sql, [counterId], (err, rows) => {
                if (err) {
                    return reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    getTicketFromAllCounters () {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id, actual_t_id FROM counter"
            db.all(sql, [], async (err, rows) => {
                if (err) {
                    return reject(err);
                } else {
                    let vet = [];
                    for (let element of rows) {
                        if (element.actual_t_id != null) {
                            vet.push({ id: element.id, tag: await this.getTicketTag(element.actual_t_id), num: await this.getNumberOfTicketsInQueue(element.actual_t_id) })
                        }
                        else {
                            vet.push({ id: element.id, tag: null, num: null })
                        }
                    }
                    resolve(vet);
                }
            });
        });
    }

    getTicketTag (id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id, s_tag FROM ticket WHERE id = ?"
            db.get(sql, [id], (err, row) => {
                if (err) {
                    return reject(err);
                } else {
                    let string = `${row.s_tag}${row.id}`
                    resolve(string)
                }
            });
        });
    }
    
    async getNumberOfTicketsInQueue  (t_id){
        return new Promise((resolve, reject) => {
            const sql = `SELECT COUNT(*) as ticketInQueue
                         FROM ticket t, service s
                         WHERE t.s_tag = s.tag
                         AND t.c_id IS NULL
                         AND s.tag = (SELECT s_tag
                                      FROM ticket
                                      WHERE id = ?)`;
            db.get(sql, [t_id], (err, row) => {
                if (err) {
                    return reject(err);
                } else {
                    resolve(row)
                }
            });
        });
    }
}