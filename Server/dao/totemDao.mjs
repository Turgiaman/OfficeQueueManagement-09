import { db } from "../db/db.mjs";

export default function TotemDao(){
    this.getServices = ()=>{
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

    this.getTicket = (service)=>{
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

}




