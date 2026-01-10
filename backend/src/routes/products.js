const express = require("express");
const router = express.Router();

const { db } = require("../firebase");

const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const product = {
      name,
      price,
      createdBy: req.user.uid,
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection("products").add(product);

    res.status(201).json({
      id: docRef.id,
      ...product
    });
  } catch {
    res.status(500).json({ error: "Failed to create product" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const docRef = db.collection("products").doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Not found" });
    }

    if (doc.data().createdBy !== req.user.uid) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await docRef.delete();
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
