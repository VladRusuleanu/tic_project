const { faker } = require('@faker-js/faker');
const { db } = require('../config/db'); // Asigura-te ca calea e corecta catre db.js

// Listele tale din Frontend (ca sa generam date care arata bine in aplicatie)
const categories = ['IT & Computers', 'Mobile & Phones', 'Office Furniture', 'Peripherals', 'Networking'];

const subCategoryMapping = {
    'IT & Computers': ['Laptop', 'Desktop', 'Server', 'Workstation'],
    'Mobile & Phones': ['Smartphone', 'Tablet'],
    'Office Furniture': ['Desk', 'Chair', 'Cabinet', 'Lamp'],
    'Peripherals': ['Mouse', 'Keyboard', 'Headset', 'Monitor'],
    'Networking': ['Router', 'Switch', 'Modem']
};

const warehouses = ['Central Warehouse', 'IT Dept', 'Reception', 'Remote'];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  const products = [];
  
  // Generam 20 de produse (poti pune 50 daca vrei)
  for (let i = 0; i < 20; i++) {
    
    // Alegem random o categorie si o subcategorie valida
    const randomCategory = faker.helpers.arrayElement(categories);
    const randomSubCategory = faker.helpers.arrayElement(subCategoryMapping[randomCategory]);
    
    // Generam un nume real (ex: "Modern Granite Computer")
    const productName = faker.commerce.productName();

    const product = {
      // 1. Numele si versiunea lowercase (CRITIC pentru sistemul tau!)
      name: productName,
      nameLower: productName.toLowerCase(), 
      
      // 2. Pretul (numar, nu string)
      price: parseFloat(faker.commerce.price({ min: 100, max: 2000 })),
      
      // 3. Structura Nested (NoSQL) pentru Categorie
      category: {
        name: randomCategory,
        subcategory: randomSubCategory,
        id: 'cat_' + randomCategory.toLowerCase().replace(/\s+/g, '_')
      },

      // 4. Specificatii (random)
      specifications: {
        description: faker.commerce.productDescription(),
        material: faker.commerce.productMaterial(),
        color: faker.color.human()
      },

      // 5. Inventar (Nested)
      inventory: {
        quantity: faker.number.int({ min: 1, max: 50 }),
        defective: faker.number.int({ min: 0, max: 5 }),
        warehouse: faker.helpers.arrayElement(warehouses)
      },

      // 6. Metadata
      createdBy: 'system_seed', // Marcam ca fiind generat automat
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.push(product);
  }

  // Scriem totul in Firebase (Batch Write - scriere in masa)
  const batch = db.batch();
  
  products.forEach((prod) => {
    const docRef = db.collection('products').doc(); // Generam ID automat
    batch.set(docRef, prod);
  });

  await batch.commit();
  console.log(`✅ Successfully added ${products.length} products to Firestore!`);
  process.exit(0); // Inchidem scriptul cand termina
}

// Rulam functia
seedDatabase().catch(console.error);