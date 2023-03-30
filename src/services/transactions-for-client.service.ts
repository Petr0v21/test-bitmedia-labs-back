/* eslint-disable indent */
import { number, object, string } from 'yup';
import Transaction, { TransactionType } from '../models/Transaction';
import { BodyType, FilterBody, FilterKey } from '../types';
import { fetchLatestBlock } from './etherscan-api.sevice';

const filterSchema = object({
  blockNumber: number().positive().integer(),
  address: string().min(1),
  hash: string().min(1)
});

export const filteredTransaction = async (body: BodyType, page: number) => {
  try {
    await filterSchema.validate(body);

    const lastBlockNumber = await fetchLatestBlock();

    if (!lastBlockNumber) {
      return {
        error: true,
        message: 'Something went wrong in Ether API!'
      };
    }
    const filter: any = {};

    if (Object.keys(body).length) {
      switch (true) {
        case !!body.address:
          filter['$or'] = [{ from: body.address }, { to: body.address }];
          break;
        case !!body.blockNumber:
          filter[FilterKey.blockNumber] = `0x${Number(
            body.blockNumber
          )?.toString(16)}`;
          break;
        case !!body.hash:
          filter[FilterKey.hash] = body.hash;
          break;
        default:
          return {
            error: true,
            message: `Invalid filter field`
          };
      }
    }

    const transactions = await Transaction.find(
      filter,
      {},
      {
        limit: 14,
        skip: (page - 1) * 14
      }
    ).sort({
      blockNumber: -1
    });
    const count = await Transaction.find(filter).count();

    return {
      transactions: formatTransactions(
        transactions as TransactionType[],
        lastBlockNumber
      ),
      count: Math.ceil(count / 14)
    };
  } catch (e) {
    return {
      error: true,
      message: 'Something went wrong!',
      content: e
    };
  }
};

export const formatTransactions = (
  transactions: TransactionType[],
  lastBlockNumber: number
) => {
  if (transactions.length) {
    const formatedTransactions = transactions.map((item) => {
      item.blockNumber = parseInt(item.blockNumber, 16).toString();
      item.timeStamp = new Date(
        parseInt(item.timeStamp, 16) * 1000
      ).toLocaleString();
      item.value = (
        parseInt(item.value, 16) /
        1000000000000000 /
        1000
      ).toString();
      item.gas = (
        ((parseInt(item.gasPrice, 16) / 1000000000) * parseInt(item.gas, 16)) /
        1000000000
      ).toString();
      item.gasPrice = (parseInt(item.gasPrice, 16) / 1000000000).toString();
      item.blockConfirmations = (
        lastBlockNumber - Number(item.blockNumber)
      ).toString();
      return item;
    });
    return formatedTransactions;
  }
  return [];
};
