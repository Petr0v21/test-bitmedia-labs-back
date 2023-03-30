export type Transaction = {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gas: string;
  blockNumber: string;
  transactionIndex: string;
};

export type Block = {
  baseFeePerGas?: string;
  difficulty?: string;
  extraData?: string;
  gasLimit?: string;
  gasUsed?: string;
  hash?: string;
  logsBloom?: string;
  miner?: string;
  mixHash?: string;
  nonce?: string;
  number?: string;
  parentHash?: string;
  receiptsRoot?: string;
  sha3Uncles?: string;
  size?: string;
  stateRoot?: string;
  timestamp: string;
  totalDifficulty?: string;
  transactionsRoot?: string;
  uncles?: any[];
  transactions?: Transaction[];
};

export type ResBlock = {
  id: number;
  jsonrpc: string;
  result: Block;
};

export type FilterBody = {
  adress?: string;
  blockNumber?: string;
  hash?: string;
};

export enum FilterKey {
  address = 'address',
  blockNumber = 'blockNumber',
  hash = 'hash'
}

export type BodyType = Record<FilterKey, string>;
