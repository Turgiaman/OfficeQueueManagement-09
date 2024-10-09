import { db } from "../db/db.mjs";

export const getServices = ()=>{
    return new Promise((resolve, reject) => {
        const sql = "SELECT name FROM  service";
        db.all(sql, [], (err,rows)=>{
            if (err) {
                return reject(err);
            }
            else resolve(rows);
        })
      });
}

export const getTicket = ()=>{
    return new Promise((resolve, reject) => {
        const sql = "SELECT id FROM  ticket";
        db.get(sql, [], (err,row)=>{
            if (err) {
                return reject(err);
            }
            else resolve(row);
        })
      });
}

export const newTicket = (service)=>{
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO ticket (service, served) VALUES (?, 0)";
        db.run(sql, [service], function(err){
            if (err) {
                return reject(err);
            }
            else resolve(this.lastID);
        })
    });
}