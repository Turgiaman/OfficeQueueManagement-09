import express from "express";
import morgan from "morgan";
import cors from "cors";
import CounterDao from "./dao/counterDao.mjs";

const counterDao = new CounterDao();

// init express
const app = new express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan("dev"));
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.get('/api/counters', async (req, res) => {
  try {
    const counters = await counterDao.getCounters();
    return res.status(200).json(counters);
  }
  catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });