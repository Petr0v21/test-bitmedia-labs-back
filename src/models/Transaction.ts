import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export type TransactionType = {
  from: string;
  to: string;
  blockNumber: string;
  hash: string;
  timeStamp: string;
  value: string;
  gas: string;
  gasPrice: string;
  blockConfirmations: string;
};

const transactionSchema = new Schema({
  hash: { type: String, required: true, unique: true },
  from: { type: String, required: true },
  to: { type: String, required: false },
  blockNumber: { type: String, required: true },
  blockConfirmations: { type: String, required: true },
  timeStamp: { type: String, required: true },
  value: { type: String, required: true },
  gas: { type: String, required: true },
  gasPrice: { type: String, required: true }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
