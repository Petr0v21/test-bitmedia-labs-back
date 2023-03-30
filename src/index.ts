import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import dbConnect from './dbConnect';
import transactionRouter from './controllers/transactions.controller';
import { updatingDB } from './services/etherscan-api.sevice';

const app = express();
dotenv.config();

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

dbConnect();

app.use(express.json());
app.use(cors());
app.use('/api/transactions', transactionRouter);

updatingDB();

app.get('/:hash', async (req, res) => {
  try {
    await fetch(
      `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${req.params.hash}&apikey=${ETHERSCAN_API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const transaction = data.result;
        res.json(transaction);
      });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: true, message: 'Something went wrong!' });
  }
});

app.get('/', async (req, res) => {
  try {
    res.send('test');
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: true, message: 'Something went wrong!' });
  }
});

const port = process.env.PORT || 4040;
app.listen(port, () => console.log(`Server is running on port: ${port}`));
