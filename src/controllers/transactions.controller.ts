import { Router } from 'express';
import { filteredTransaction } from '../services/transactions-for-client.service';

const router = Router();

router.post('/:page', async (req, res) => {
  const transactions = await filteredTransaction(
    req.body,
    Number(req.params.page)
  );
  if (transactions?.error) {
    return res.status(400).json(transactions);
  }
  return res.status(200).json(transactions);
});

export default router;
