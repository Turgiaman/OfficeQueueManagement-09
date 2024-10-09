import express from "express";
import morgan from "morgan";
import cors from "cors";
import CounterDao from "./dao/counterDao.mjs";
import TotemDao from "./dao/totemDao.mjs";
import { getNextCustomer } from "./dao/officerDao.mjs";

const counterDao = new CounterDao();
const totemDao = new TotemDao();

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

// ROUTES
app.get('/api/counters', async (req, res) => {
  try {
    const counters = await counterDao.getCounters();
    return res.status(200).json(counters);
  }
  catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/services',async (req,res)=>{
    try {
        let services=await totemDao.getServices();
        res.status(200).json(services);
    } catch (error) {
        res.status(503).json({ error: error.message });
    }
})

app.get('/api/next/:counterId',async (req,res)=>{
    try {
        let next=await getNextCustomer(req.params.counterId);
        res.status(200).json(next);
    } catch (error) {
        res.status(503).json({ error: error.message });
    }
})

app.get('api/ticket/:service', async(req, res) => {
    try{
        result = await totemDao.getTicket(req.params.service);
        res.status(200).json(result);
    }catch(error){
        res.status(503).json({error: error.message});
    }
})

// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });