const { db } = require('../config/db');
const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().min(3).required(),
  price: Joi.number().positive().required(),
  category: Joi.object({
    name: Joi.string().required(),
    id: Joi.string().allow(null, '')
  }).optional(),
  
  specifications: Joi.object().unknown(true).optional(),

  inventory: Joi.object({
    quantity: Joi.number().integer().min(0).default(0),
    defective: Joi.number().integer().min(0).default(0),
    warehouse: Joi.string().allow('').default('Central Warehouse')
  }).optional()
});

const getProducts = async (req, res) => {
  try {
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const newProduct = {
      ...value,
      createdBy: req.user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('products').add(newProduct);
    
    res.status(201).json({ id: docRef.id, ...newProduct });
  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = productSchema.validate(req.body);
    
    if (error) return res.status(400).json({ error: error.details[0].message });

    const docRef = db.collection('products').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const updatedData = {
      ...value,
      updatedAt: new Date().toISOString()
    };

    await docRef.update(updatedData);
    res.status(200).json({ id, ...updatedData });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection('products').doc(id);
        const doc = await docRef.get();
    
        if (!doc.exists) return res.status(404).json({ error: 'Product not found' });
        if (doc.data().createdBy !== req.user.uid) return res.status(403).json({ error: 'Forbidden' });
    
        await docRef.delete();
        res.status(200).json({ message: 'Product deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
      }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
