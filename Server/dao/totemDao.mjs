import { db } from "../db/db.mjs";
import dayjs from 'dayjs';

export default class TotemDao{
    getServices () {
        return new Promise((resolve, reject) => {
            const sql = "SELECT name FROM  service";
            db.all(sql, [], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                else resolve(rows);
            })
        });
    }

    getTicket (serviceTag)  {
        return new Promise((resolve, reject) => {
            const date = dayjs().format('YYYY-MM-DD').toString();
            const sql = "INSERT INTO ticket (date, s_tag, c_id) VALUES (?, ?, null)";
            db.run(sql, [date, serviceTag], function(err){
                if (err) {
                    return reject(err);
                }
                else {
                    const sql2="SELECT MAX(id) as max FROM ticket WHERE s_tag = ?";
                    db.get(sql2,[serviceTag],(err,row)=>{
                        if (err) {
                            return reject(err);
                        }
                        else{
                            const result=serviceTag+row.max;
                            resolve(result);
                        }
                    })

                }
            })
        });
    }

}




