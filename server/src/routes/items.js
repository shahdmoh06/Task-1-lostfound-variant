import { Router } from 'express';
import {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/itemController.js';

const router = Router();

// TODO: wire up the routes described in README.md section 3.

router.post('/', createItem);
router.get('/', getAllItems);
router.get('/:id', getItem);
router.patch('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;
