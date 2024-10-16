import { db } from "../db/db.mjs";

export default function TicketDao() {
  this.getTicketCountsByCounter = (period, service, date) => {
    return new Promise((resolve, reject) => {
      const sqlS = `SELECT tag FROM service WHERE name = ?`;
      db.get(sqlS, [service], (err, row) => {
        if (err) {
          console.error('Error fetching service ID:', err);
          return reject(err);
        }
        if (!row) {
          return reject(new Error('Service not found.'));
        }

        let s_tag = row.tag;
        let query;
        let params = [];

        switch (period) {
          case 'daily':
            query = `
                SELECT c_id, DATE(date) as period, COUNT(*) as ticket_count
                FROM ticket
                WHERE c_id IS NOT NULL AND DATE(date) = ? AND s_tag = ?
                GROUP BY c_id
                `;
            params.push(date);
            params.push(s_tag);
            break;
          case 'weekly':
            query = `
                SELECT c_id, strftime('%Y-%W', date) as period, COUNT(*) as ticket_count
                FROM ticket
                WHERE c_id IS NOT NULL AND date >= DATE(?) AND date < DATE(?,'+7 days') AND s_tag = ?
                GROUP BY c_id
                `;
            params.push(date); 
            params.push(date);
            params.push(s_tag);
            break;
          case 'monthly':
            query = `
                SELECT c_id, 
                strftime('%Y-%m', date) as period,
                COUNT(*) AS ticket_count
                FROM ticket
                WHERE c_id IS NOT NULL AND strftime('%Y-%m', date) = strftime('%Y-%m', ?) AND s_tag = ?
                GROUP BY c_id
                `;
            params.push(date); 
            params.push(s_tag);
            break;
          default:
            return reject(new Error('Invalid period. Use daily, weekly, or monthly.'));
        }

        db.all(query, params, (err, rows) => {
          if (err) {
            return reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    });
  }


  this.getTicketCountsByService = (period, date) => {
    return new Promise((resolve, reject) => {
      let query;
      let params = [];
      switch (period) {
        case 'daily':
          query = `
                SELECT s_tag, DATE(date) as period, COUNT(*) as ticket_count
                FROM ticket
                WHERE DATE(date) = ?
                GROUP BY s_tag, period
                `;
          params.push(date); // Correctly add date to parameters
          break;
        case 'weekly':
          query = `
                SELECT s_tag, strftime('%Y-%W', date) as period, COUNT(*) as ticket_count
                FROM ticket
                WHERE date >= DATE(?) AND date < DATE(?,'+7 days')
                GROUP BY s_tag
                `;
          params.push(date); // Correctly add date to parameters
          params.push(date);
          break;
        case 'monthly':
          query = `
                SELECT s_tag, 
                strftime('%Y-%m', date) as period,
                COUNT(*) AS ticket_count
                FROM ticket
                WHERE strftime('%Y-%m', date) = strftime('%Y-%m', ?)
                GROUP BY s_tag
                `;
          params.push(date); // Correctly add date to parameters
          break;
        default:
          return reject(new Error('Invalid period. Use daily, weekly, or monthly.'));
      }

      // Use db.all with parameterized query
      db.all(query, params, (err, rows) => {
        if (err) {
          console.error('Database error:', err); // Log the error for debugging
          return reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}
