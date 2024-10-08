import { db } from "../db/db.mjs";
import dayjs from "dayjs";

export default function OfficerDao() {
    this.getNextCustomer = (counterId) => {
        return new Promise(async (resolve, reject) => {
            const services = await getCounterServices(counterId);
            let max = 0;
            let next_service = null;
            for (let service of services) {
                let count = await getTicketCount(service);
                if (count > max) {
                    max = count;
                    next_service = service;
                }
                else if (count == max && max != 0) {
                    if (await getServiceTime(service) < await getServiceTime(next_service)) {
                        max = count;
                        next_service = service;
                    }
                }
            }
            if(max==0){
                resolve(0);
            }
            else {
                const sql = "SELECT number FROM ticket WHERE service = ? AND served!=1"
                db.all(sql, [next_service], (err, row) => {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        resolve(row[0].number)
                    }
                })
            }
          });
    
    }
    
    const getCounterServices=(counterId)=>{
        return new Promise((resolve, reject) => {
            const sql="SELECT service_id FROM counter_service WHERE counter_id = ?"
            let services=[];
            db.all(sql,[counterId],async(err,rows)=>{
                if (err) { 
                    return reject(err);
                }
                else{
                   for(let row of rows){   
                     services.push(await getServiceFromId(row.service_id))
                   }
                   resolve(services)
                }
            })
          });
    }
    
    const getServiceFromId=(id)=>{
        return new Promise((resolve, reject) => {
            const sql="SELECT name FROM service WHERE id = ?";
            db.get(sql,[id],(err,row)=>{
                if (err) { 
                    return reject(err);
                }
                else{
                    resolve(row.name)
                }
            })
        });
    }
    
    this.getServiceTag = (service) =>{
        return new Promise((resolve, reject) => {
            const sql="SELECT tag FROM service WHERE name = ?";
            db.get(sql,[service],(err,row)=>{
                if (err) { 
                    return reject(err);
                }
                else{
                    resolve(row.tag);
                }
            })
        });
    }
    
    const getTicketCount=(service)=>{
        return new Promise((resolve, reject) => {
            const sql2="SELECT COUNT(*) AS count FROM ticket WHERE service = ? AND served!=1";
            db.get(sql2,[service],(err,row)=>{
                if (err) { 
                    return reject(err);
                }
                else if(!row){
                    resolve(0)
                }
                else{
                    resolve(row.count)
                }
            })
        });
    }
    
    const getServiceTime=(service)=>{
        return new Promise((resolve, reject) => {
            const sql2="SELECT time FROM service WHERE name = ? ";
            db.get(sql2,[service],(err,row)=>{
                if (err) { 
                    return reject(err);
                }
                else{
                    resolve(row.time)
                }
            })
        });
    }
}