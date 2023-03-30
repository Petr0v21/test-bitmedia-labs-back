import Transaction from '../models/Transaction';
import { Block, ResBlock, Transaction as TransactionType } from '../types';

const apiUrl = 'https://api.etherscan.io/api';

const createNew = async (
  transaction: TransactionType,
  time: string,
  blockConfirmations: number
) => {
  try {
    const newTransaction = new Transaction({
      ...transaction,
      timeStamp: time,
      blockConfirmations: blockConfirmations.toString()
    });
    await newTransaction.save();
  } catch (e) {
    console.error(e);
    console.log(transaction);
  }
};

export async function fetchLatestBlock(): Promise<number | undefined> {
  const url = `${apiUrl}?module=proxy&action=eth_getBlockByNumber&tag=latest&boolean=true&apikey=${process
    .env.ETHERSCAN_API_KEY!}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return parseInt(data.result.number, 16);
  } catch (error) {
    console.error(`Failed to fetch latest block`, error);
  }
}

export const getBlock = async (num: string): Promise<Block | undefined> => {
  try {
    let res: Block = {
      timestamp: ''
    };
    await fetch(
      `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${num}&boolean=true&apikey=${process
        .env.ETHERSCAN_API_KEY!}`
    )
      .then((response) => response.json())
      .then((json: ResBlock) => (res = json.result));
    return res;
  } catch (e) {
    console.error(`Failed to fetch block`, e);
  }
};

export const updatingDB = () => {
  try {
    setInterval(async () => {
      const lastDB = await Transaction.findOne({}, { blockNumber: 1 }).sort({
        blockNumber: -1
      });
      const lastAPI = await fetchLatestBlock();
      if (!lastAPI) {
        console.error({ error: true, message: 'EtherscanApi doesn`t work!' });
        return;
      }
      if (lastDB) {
        if (lastAPI !== parseInt(lastDB.blockNumber, 16)) {
          for (
            let i = parseInt(lastDB.blockNumber, 16) + 1;
            i <= lastAPI;
            i++
          ) {
            setTimeout(async () => {
              const block = await getBlock(i.toString(16));
              if (block && block.transactions) {
                console.log('Length', block.transactions.length);
                block.transactions.forEach(
                  async (transaction: TransactionType) => {
                    await createNew(transaction, block.timestamp, lastAPI - i);
                  }
                );
              }
            }, 500);
          }
        }
      } else {
        setTimeout(async () => {
          for (let i = lastAPI - 1000; i <= lastAPI; i++) {
            const block = await getBlock(i.toString(16));
            if (block && block.transactions) {
              block.transactions.forEach(
                async (transaction: TransactionType) => {
                  await createNew(transaction, block.timestamp, 0);
                }
              );
            }
          }
        }, 500);
      }
    }, 10 * 60 * 1000);
  } catch (e) {
    console.error(e);
  }
};
