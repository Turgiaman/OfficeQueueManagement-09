import sqlite from "sqlite3";

/* OPEN */
export const db = new sqlite.Database("./db/db.sqlite", (err) => {
  if (err) throw err;
});