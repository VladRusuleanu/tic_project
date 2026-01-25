<template>
  <v-container>
    <v-row class="mb-2">
      <v-col cols="12" md="4">
        <v-card color="primary" variant="tonal">
          <v-card-item title="Total Assets" :subtitle="totalAssets.toString()">
            <template v-slot:prepend><v-icon icon="mdi-server" size="x-large"></v-icon></template>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card color="warning" variant="tonal">
          <v-card-item title="In Maintenance" :subtitle="totalDefective.toString() + ' units'">
             <template v-slot:prepend><v-icon icon="mdi-wrench" size="x-large"></v-icon></template>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card color="success" variant="tonal">
          <v-card-item title="Asset Value" :subtitle="`$${totalValue}`">
             <template v-slot:prepend><v-icon icon="mdi-cash-multiple" size="x-large"></v-icon></template>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="align-center mt-2">
      <v-col cols="12" md="6"><h1 class="text-h4">Asset Dashboard</h1></v-col>
      <v-col cols="12" md="6" class="text-right">
         <v-btn color="primary" prepend-icon="mdi-plus" size="large" @click="openDialog()">New Asset</v-btn>
      </v-col>
    </v-row>

    <v-card class="mb-6 mt-4 pa-2">
      <v-row class="align-center" no-gutters>
        <v-col cols="12" md="6">
             <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                label="Search assets..."
                variant="plain"
                hide-details
              ></v-text-field>
        </v-col>

        <v-col cols="12" md="3">
            <v-select
                v-model="filterCategory"
                :items="['All', ...categories]"
                label="Filter Category"
                prepend-inner-icon="mdi-filter"
                variant="underlined"
                density="compact"
                hide-details
            ></v-select>
        </v-col>

        <v-col cols="12" md="3">
            <v-select
                v-model="sortBy"
                :items="sortOptions"
                item-title="text"
                item-value="value"
                label="Sort By"
                prepend-inner-icon="mdi-sort"
                variant="underlined"
                density="compact"
                hide-details
            ></v-select>
        </v-col>
      </v-row>
    </v-card>

    <v-row>
      <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" md="4">
        <v-card class="h-100 d-flex flex-column">
          <v-card-item>
            <v-card-title class="d-flex justify-space-between">
              {{ product.name }}
              <v-chip size="x-small" color="info">{{ product.category?.name }}</v-chip>
            </v-card-title>
          </v-card-item>

          <v-divider></v-divider>
          
          <v-card-text class="flex-grow-1">
             <v-row dense class="mt-1 mb-3">
               <v-col cols="6">
                 <div class="text-caption text-grey">Operational</div>
                 <div class="text-h6 text-success">{{ product.inventory?.quantity || 0 }}</div>
               </v-col>
               <v-col cols="6">
                 <div class="text-caption text-grey">Maintenance</div>
                 <div class="text-h6 text-warning">{{ product.inventory?.defective || 0 }}</div>
               </v-col>
             </v-row>
             
             <div class="text-caption bg-grey-lighten-4 pa-2 rounded">
               <strong>Specs:</strong>
               <span v-if="['Laptops', 'Desktops'].includes(product.category?.name)">
                  {{ product.specifications?.cpu }}, {{ product.specifications?.ram }}
               </span>
               <span v-else-if="product.category?.name === 'Monitors'">
                  {{ product.specifications?.size }}", {{ product.specifications?.resolution }}
               </span>
               <span v-else-if="product.category?.name === 'Office Furniture'">
                  {{ product.specifications?.material }} ({{ product.specifications?.color }})
               </span>
               <span v-else>
                   {{ product.specifications?.description || 'No details' }}
               </span>
             </div>

             <div class="mt-2 text-caption text-grey">
                <v-icon icon="mdi-map-marker" size="x-small"></v-icon>
                {{ product.inventory?.warehouse }}
             </div>
          </v-card-text>

          <v-card-actions>
            <v-btn variant="text" color="blue" size="small" @click="openDialog(product)">Manage</v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="text" color="red" icon="mdi-delete" size="small" @click="deleteItem(product.id)"></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title class="bg-primary text-white">
          {{ isEditMode ? 'Edit Asset' : 'Register New Asset' }}
        </v-card-title>
        
        <v-card-text class="pt-4">
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12" md="6">
                <div class="text-subtitle-2 text-primary mb-2">Basic Info</div>
                <v-select 
                    v-model="editedItem.categoryName" 
                    :items="categories" 
                    label="Category *" 
                    variant="outlined" 
                    density="compact"
                    :rules="[v => !!v || 'Category is required']"
                ></v-select>

                <v-text-field 
                    v-model="editedItem.name" 
                    label="Model Name *" 
                    variant="outlined" 
                    density="compact" 
                    :rules="[v => !!v || 'Name is required']"
                ></v-text-field>

                <v-text-field 
                    v-model="editedItem.price" 
                    label="Value ($) *" 
                    type="number" 
                    min="0"
                    variant="outlined" 
                    density="compact"
                    :rules="[v => !!v || 'Price is required']"
                ></v-text-field>

                <v-card variant="tonal" color="primary" class="mt-2">
                    <v-card-title class="text-subtitle-2">Specifications</v-card-title>
                    <v-card-text>
                        <div v-if="['Laptops', 'Desktops'].includes(editedItem.categoryName)">
                            <v-text-field v-model="editedItem.specs.cpu" label="Processor (CPU)" density="compact" bg-color="white"></v-text-field>
                            <v-row dense>
                                <v-col><v-text-field v-model="editedItem.specs.ram" label="RAM" density="compact" bg-color="white"></v-text-field></v-col>
                                <v-col><v-text-field v-model="editedItem.specs.storage" label="Storage" density="compact" bg-color="white"></v-text-field></v-col>
                            </v-row>
                        </div>
                        <div v-else-if="editedItem.categoryName === 'Monitors'">
                            <v-text-field v-model="editedItem.specs.size" label="Size (inch)" type="number" density="compact" bg-color="white"></v-text-field>
                            <v-text-field v-model="editedItem.specs.resolution" label="Resolution" density="compact" bg-color="white"></v-text-field>
                        </div>
                        <div v-else-if="editedItem.categoryName === 'Peripherals'">
                            <v-select v-model="editedItem.specs.connectivity" :items="['Wired', 'Wireless', 'Bluetooth']" label="Connectivity" density="compact" bg-color="white"></v-select>
                        </div>
                        <div v-else-if="editedItem.categoryName === 'Office Furniture'">
                            <v-text-field v-model="editedItem.specs.material" label="Material" density="compact" bg-color="white"></v-text-field>
                            <v-text-field v-model="editedItem.specs.color" label="Color" density="compact" bg-color="white"></v-text-field>
                        </div>
                        <div v-else>
                            <v-textarea v-model="editedItem.specs.description" label="Description" rows="2" density="compact" bg-color="white"></v-textarea>
                        </div>
                    </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-subtitle-2 text-primary mb-2">Inventory Data</div>
                <v-select 
                    v-model="editedItem.warehouse" 
                    :items="warehouses" 
                    label="Location / Warehouse *" 
                    variant="outlined" 
                    density="compact"
                    :rules="[v => !!v || 'Location is required']"
                ></v-select>

                <v-sheet rounded class="pa-4 bg-grey-lighten-4 mt-2 border">
                  <div class="d-flex justify-space-between align-center mb-4">
                    <span>Operational Units</span>
                    <v-text-field v-model="editedItem.quantity" type="number" min="0" hide-details density="compact" style="max-width: 100px" variant="solo" bg-color="white"></v-text-field>
                  </div>
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-warning font-weight-bold">Defective / Repair</span>
                    <v-text-field v-model="editedItem.defective" type="number" min="0" hide-details density="compact" style="max-width: 100px" variant="solo" bg-color="white"></v-text-field>
                  </div>
                </v-sheet>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" @click="save" :disabled="!valid">Save Changes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useProductStore } from '../stores/productStore';

const productStore = useProductStore();
const dialog = ref(false);
const valid = ref(false);
const isEditMode = ref(false);
const editingId = ref(null);

const searchQuery = ref('');
const filterCategory = ref('All');
const sortBy = ref('category_asc');

const categories = ['Laptops', 'Desktops', 'Monitors', 'Peripherals', 'Office Furniture', 'Others'];
const warehouses = ['Central Warehouse', 'IT Dept', 'Reception', 'Remote'];

const sortOptions = [
  { text: 'Category (A-Z)', value: 'category_asc' },
  { text: 'Category (Z-A)', value: 'category_desc' },
  { text: 'Name (A-Z)', value: 'name_asc' },
  { text: 'Price (Low-High)', value: 'price_asc' },
  { text: 'Price (High-Low)', value: 'price_desc' },
  { text: 'Stock (Low-High)', value: 'stock_asc' }
];

const editedItem = reactive({
  name: '', price: 0, categoryName: '', warehouse: 'Central Warehouse',
  quantity: 1, defective: 0,
  specs: { cpu: '', ram: '', storage: '', size: '', resolution: '', connectivity: '', material: '', color: '', description: '' }
});

onMounted(() => productStore.fetchProducts());

const totalValue = computed(() => productStore.products.reduce((acc, p) => acc + (p.price * ((p.inventory?.quantity || 0) + (p.inventory?.defective || 0))), 0).toLocaleString());
const totalAssets = computed(() => productStore.products.reduce((acc, p) => acc + (p.inventory?.quantity || 0) + (p.inventory?.defective || 0), 0));
const totalDefective = computed(() => productStore.products.reduce((acc, p) => acc + (p.inventory?.defective || 0), 0));

const filteredProducts = computed(() => {
  let items = [...productStore.products];

  if (filterCategory.value !== 'All') {
      items = items.filter(p => p.category?.name === filterCategory.value);
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    items = items.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.category?.name || '').toLowerCase().includes(q)
    );
  }

  items.sort((a, b) => {
    const catA = (a.category?.name || '').toLowerCase();
    const catB = (b.category?.name || '').toLowerCase();
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    switch (sortBy.value) {
      case 'category_asc': return catA.localeCompare(catB) || nameA.localeCompare(nameB);
      case 'category_desc': return catB.localeCompare(catA) || nameA.localeCompare(nameB);
      
      case 'name_asc': return nameA.localeCompare(nameB);
      
      case 'price_asc': return a.price - b.price;
      case 'price_desc': return b.price - a.price;
      
      case 'stock_asc': return (a.inventory?.quantity || 0) - (b.inventory?.quantity || 0);
      
      default: return 0;
    }
  });

  return items;
});

const openDialog = (product = null) => {
  if (product) {
    isEditMode.value = true;
    editingId.value = product.id;
    editedItem.name = product.name;
    editedItem.price = product.price;

    editedItem.categoryName = (typeof product.category === 'string') ? product.category : (product.category?.name || '');
    
    editedItem.warehouse = product.inventory?.warehouse;
    editedItem.quantity = product.inventory?.quantity;
    editedItem.defective = product.inventory?.defective || 0;
    
    Object.keys(editedItem.specs).forEach(key => editedItem.specs[key] = '');
    Object.assign(editedItem.specs, product.specifications || {});
  } else {
    isEditMode.value = false;
    resetForm();
  }
  dialog.value = true;
};

const closeDialog = () => { dialog.value = false; resetForm(); };

const resetForm = () => {
  editedItem.name = ''; editedItem.price = 0; editedItem.categoryName = ''; 
  editedItem.warehouse = 'Central Warehouse'; editedItem.quantity = 1; editedItem.defective = 0;
  Object.keys(editedItem.specs).forEach(key => editedItem.specs[key] = '');
};

const save = async () => {
  const payload = {
    name: editedItem.name,
    price: Number(editedItem.price),
    category: { name: editedItem.categoryName, id: 'cat_' + editedItem.categoryName.toLowerCase() },
    specifications: { ...editedItem.specs },
    inventory: { quantity: Number(editedItem.quantity), defective: Number(editedItem.defective), warehouse: editedItem.warehouse }
  };
  try {
    if (isEditMode.value) await productStore.updateProduct(editingId.value, payload);
    else await productStore.addProduct(payload);
    closeDialog();
  } catch (e) { alert(e.message); }
};

const deleteItem = async (id) => {
  if(confirm('Archive this asset?')) await productStore.deleteProduct(id);
};
</script>
