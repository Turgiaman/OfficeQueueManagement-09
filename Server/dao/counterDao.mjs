import sqlite from 'sqlite3'

const db = new sqlite.Database('db/db.sqlite', (err) => {
    if (err) throw err;
})

export default function CounterDao(){
    this.getCounters = () => { 
        return new Promise((resolve, reject) => {
            const sql = "SELECT id FROM  counter";
            db.all(sql, [], (err,rows)=>{
                if (err) {
                    return reject(err);
                }
                else resolve(rows);
            });
        });
    }
    
    this.getServicesByCounterId = (counterId) => {
        return new Promise((resolve,reject) => {
            const sql = `
                SELECT s.id, s.name 
                FROM service s
                JOIN counter_service cs ON s.id = cs.service_id
                WHERE cs.counter_id = ?`;
            db.all(sql, [counterId], (err,rows)=> {
                if(err) {
                    return reject(err);
                }else{
                    resolve(rows);
                }
            });
        });
    }

    this.getTicketFromAllCounters = ()=>{
        return new Promise((resolve,reject) => {
            const sql = "SELECT id, actual_t_id  FROM  counter"
            db.all(sql, [], (err,rows)=> {
                if(err) {
                    return reject(err);
                }else{
                    resolve(rows);
                }
            });
        });

    }
}