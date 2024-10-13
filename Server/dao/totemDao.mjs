import { db } from "../db/db.mjs";
import dayjs from 'dayjs';

export default function TotemDao() {
    this.getServices = () => {
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

    this.getTicket = (serviceTag) => {
        return new Promise((resolve, reject) => {
            const date = dayjs().format('YYYY-MM-DD').toString();
            const sql = "INSERT INTO ticket (date, s_tag, c_id) VALUES (?, ?, null)";
            db.run(sql, [date, serviceTag], function (err) {
                if (err) {
                    return reject(err);
                }
                else {
                    const result = serviceTag + this.lastID;
                    resolve(result);
                }
            })
        });
    }

}




