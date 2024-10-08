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