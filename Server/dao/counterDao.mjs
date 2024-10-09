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
            })
        });
    }
}