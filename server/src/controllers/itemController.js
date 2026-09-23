import { Item } from '../models/Item.js';
import Joi from 'joi';

// TODO: write a validation schema for create/update per README.md section 2.

const itemValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  category: Joi.string().valid('electronics', 'clothing', 'documents', 'accessories', 'other').default('other'),
  status: Joi.string().valid('lost', 'found', 'claimed').default('lost'),
  location: Joi.string().optional(),
  reportedBy: Joi.string().hex().length(24).optional() // Validates MongoDB ObjectId
});

// GET /api/items
// TODO: implement per README.md section 3.

export async function getAllItems(req, res, next) {
  try {
    const { status, category } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    const items = await Item.find(filter).populate('reportedBy', 'name email');
    res.status(200).json(items);
    // TODO
  } catch (err) { next(err); }
}

// GET /api/items/:id
// TODO: implement per README.md section 3.
export async function getItem(req, res, next) {
  try {
    const item = await Item.findById(req.params.id).populate('reportedBy', 'name email');
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json(item);
    // TODO
  } catch (err) { next(err); }
}

export async function createItem(req, res, next) {
  try {
    const { error } = itemValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
    // TODO
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req, res, next) {
  try {
    const { error } = itemValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // { new: true } ensures the updated document is returned, not the old one
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json(item);
    // TODO
  } catch (err) { next(err); }
}

export async function deleteItem(req, res, next) {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json({ message: 'Item deleted successfully' });
    // TODO
  } catch (err) { next(err); }
}