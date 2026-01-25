const admin = require("firebase-admin");
const { faker } = require('@faker-js/faker');
const serviceAccount = require("../firebase/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function generateProducts(count = 20) {
  console.log(`Se generează ${count} produse...`);
  const batch = db.batch();
  
  const MY_USER_ID = "hc42aPVJHNZnARk67xmbe84hzgx1"; 

  for (let i = 0; i < count; i++) {
    const docRef = db.collection('products').doc();
    
    const product = {
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price()),
      category: {
        name: faker.commerce.department(),
        type: "Standard"
      },
      specifications: {
        material: faker.commerce.productMaterial(),
        color: faker.color.human()
      },
      stock: {
        quantity: faker.number.int({ min: 0, max: 100 }),
        warehouse: faker.location.city()
      },
      createdBy: MY_USER_ID,
      createdAt: new Date().toISOString()
    };

    batch.set(docRef, product);
  }

  await batch.commit();
  console.log("Generare completă!");
}

generateProducts();
