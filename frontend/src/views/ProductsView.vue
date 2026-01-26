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
          <v-card-item class="pb-0">
            <div class="d-flex justify-space-between align-start">
              <div class="text-h6 font-weight-bold text-wrap mr-2" style="line-height: 1.2; word-break: break-word;">
                {{ product.name }}
              </div>
              <div class="d-flex flex-column align-end flex-shrink-0">
                  <v-chip size="x-small" color="primary" variant="flat" class="mb-1">
                    {{ product.category?.name }}
                  </v-chip>
                  <v-chip v-if="product.category?.subcategory" size="x-small" color="secondary" variant="tonal">
                    {{ product.category?.subcategory }}
                  </v-chip>
              </div>
            </div>
          </v-card-item>

          <v-card-text class="pt-2 pb-2">
             <v-row dense class="mb-2 mt-1 border-b pb-2">
                <v-col cols="6">
                    <div class="text-caption text-grey">Unit Price</div>
                    <div class="text-body-2 font-weight-bold">${{ product.price }}</div>
                </v-col>
                <v-col cols="6" class="text-right">
                    <div class="text-caption text-grey">Total Value</div>
                    <div class="text-body-2 font-weight-black text-primary">
                        ${{ (product.price * ((product.inventory?.quantity || 0) + (product.inventory?.defective || 0))).toLocaleString() }}
                    </div>
                </v-col>
             </v-row>
          </v-card-text>
          
          <v-card-text class="flex-grow-1 pt-0">
             <v-row dense class="mb-3">
               <v-col cols="6">
                 <div class="text-caption text-grey">Operational</div>
                 <div class="text-h6 text-success font-weight-bold">{{ product.inventory?.quantity || 0 }}</div>
               </v-col>
               <v-col cols="6">
                 <div class="text-caption text-grey">Maintenance</div>
                 <div class="text-h6 text-warning font-weight-bold">{{ product.inventory?.defective || 0 }}</div>
               </v-col>
             </v-row>
             
             <div class="bg-grey-lighten-4 pa-3 rounded border" style="min-height: 100px; font-size: 0.85rem;">
               
               <div v-if="product.category?.name === 'IT & Computers'">
                  <div v-if="product.specifications?.cpu"><strong>Processor:</strong> {{ product.specifications.cpu }}</div>
                  <div v-if="product.specifications?.ram"><strong>RAM:</strong> {{ product.specifications.ram }}</div>
                  <div v-if="product.specifications?.storage"><strong>Storage:</strong> {{ product.specifications.storage }}</div>
                  <div v-if="product.specifications?.os"><strong>OS:</strong> {{ product.specifications.os }}</div>
               </div>
               
               <div v-else-if="product.category?.name === 'Mobile & Phones'">
                  <div v-if="product.specifications?.screen"><strong>Screen Size:</strong> {{ product.specifications.screen }}</div>
                  <div v-if="product.specifications?.storage"><strong>Storage:</strong> {{ product.specifications.storage }}</div>
                  <div v-if="product.specifications?.battery"><strong>Battery:</strong> {{ product.specifications.battery }} mAh</div>
                  <div v-if="product.specifications?.camera"><strong>Camera:</strong> {{ product.specifications.camera }}</div>
               </div>
               
               <div v-else-if="product.category?.name === 'Office Furniture'">
                  <div v-if="product.specifications?.material"><strong>Material:</strong> {{ product.specifications.material }}</div>
                  <div v-if="product.specifications?.color"><strong>Color:</strong> {{ product.specifications.color }}</div>
                  <div v-if="product.specifications?.dimensions"><strong>Dimensions:</strong> {{ product.specifications.dimensions }}</div>
               </div>
               
               <div v-else-if="product.category?.name === 'Peripherals'">
                  <div v-if="product.specifications?.connectivity"><strong>Connectivity:</strong> {{ product.specifications.connectivity }}</div>
                  <div v-if="product.specifications?.type"><strong>Type:</strong> {{ product.specifications.type }}</div>
               </div>

               <div v-else-if="product.category?.name === 'Networking'">
                  <div v-if="product.specifications?.speed"><strong>Speed:</strong> {{ product.specifications.speed }}</div>
                  <div v-if="product.specifications?.ports"><strong>Ports:</strong> {{ product.specifications.ports }}</div>
               </div>

               <div v-else>
                   {{ product.specifications?.description || 'No detailed specs.' }}
               </div>
             </div>

             <div class="mt-2 text-caption text-grey">
                <v-icon icon="mdi-map-marker" size="x-small"></v-icon>
                {{ product.inventory?.warehouse }}
             </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn variant="text" color="blue" size="small" @click="openDialog(product)">Manage</v-btn>
            <v-spacer></v-spacer>
            <v-tooltip text="Move to Maintenance" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-wrench" size="small" color="orange" variant="text"
                        :disabled="(product.inventory?.quantity || 0) <= 0"
                        @click="moveStock(product, 'to_maintenance')">
                    </v-btn>
                </template>
            </v-tooltip>
            <v-tooltip text="Repair Complete" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-check-circle" size="small" color="success" variant="text"
                        :disabled="(product.inventory?.defective || 0) <= 0"
                        @click="moveStock(product, 'to_stock')">
                    </v-btn>
                </template>
            </v-tooltip>
            <v-divider vertical class="mx-2"></v-divider>
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
                    @update:modelValue="onCategoryChange"
                ></v-select>

                <v-select
                    v-if="editedItem.categoryName && subCategoryMapping[editedItem.categoryName]"
                    v-model="editedItem.subCategoryName"
                    :items="subCategoryMapping[editedItem.categoryName]"
                    label="Sub-category"
                    variant="outlined"
                    density="compact"
                    placeholder="Select Type"
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
                        <div v-if="editedItem.categoryName === 'IT & Computers'">
                            <v-row dense>
                                <v-col cols="6"><v-text-field v-model="editedItem.specs.cpu" label="Processor (CPU)" density="compact" bg-color="white"></v-text-field></v-col>
                                <v-col cols="6"><v-text-field v-model="editedItem.specs.os" label="OS" density="compact" bg-color="white"></v-text-field></v-col>
                            </v-row>
                            <v-row dense>
                                <v-col cols="6"><v-text-field v-model="editedItem.specs.ram" label="RAM" density="compact" bg-color="white"></v-text-field></v-col>
                                <v-col cols="6"><v-text-field v-model="editedItem.specs.storage" label="Storage" density="compact" bg-color="white"></v-text-field></v-col>
                            </v-row>
                        </div>

                        <div v-else-if="editedItem.categoryName === 'Mobile & Phones'">
                            <v-row dense>
                                <v-col cols="6"><v-text-field v-model="editedItem.specs.screen" label="Screen Size" density="compact" bg-color="white"></v-text-field></v-col>
                                <v-col cols="6"><v-text-field v-model="editedItem.specs.battery" label="Battery (mAh)" density="compact" bg-color="white"></v-text-field></v-col>
                            </v-row>
                            <v-row dense>
                                <v-col cols="12"><v-text-field v-model="editedItem.specs.camera" label="Camera Details" density="compact" bg-color="white"></v-text-field></v-col>
                                <v-col cols="12"><v-text-field v-model="editedItem.specs.storage" label="Storage" density="compact" bg-color="white"></v-text-field></v-col>
                            </v-row>
                        </div>

                        <div v-else-if="editedItem.categoryName === 'Office Furniture'">
                            <v-row dense>
                                <v-col cols="6"><v-text-field v-model="editedItem.specs.material" label="Material" density="compact" bg-color="white"></v-text-field></v-col>
                                <v-col cols="6"><v-text-field v-model="editedItem.specs.color" label="Color" density="compact" bg-color="white"></v-text-field></v-col>
                            </v-row>
                            <v-text-field v-model="editedItem.specs.dimensions" label="Dimensions (HxWxD)" density="compact" bg-color="white"></v-text-field>
                        </div>

                        <div v-else-if="editedItem.categoryName === 'Peripherals'">
                             <v-select v-model="editedItem.specs.connectivity" :items="['Wired', 'Wireless', 'Bluetooth']" label="Connectivity" density="compact" bg-color="white"></v-select>
                             <v-text-field v-model="editedItem.specs.type" label="Type (e.g. Mechanical, Laser)" density="compact" bg-color="white"></v-text-field>
                        </div>

                        <div v-else-if="editedItem.categoryName === 'Networking'">
                             <v-text-field v-model="editedItem.specs.speed" label="Speed (Mbps)" density="compact" bg-color="white"></v-text-field>
                             <v-text-field v-model="editedItem.specs.ports" label="Number of Ports" type="number" density="compact" bg-color="white"></v-text-field>
                        </div>

                        <div v-else>
                            <v-textarea v-model="editedItem.specs.description" label="General Description" rows="2" density="compact" bg-color="white"></v-textarea>
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

const categories = ['IT & Computers', 'Mobile & Phones', 'Office Furniture', 'Peripherals', 'Networking'];

const subCategoryMapping = {
    'IT & Computers': ['Laptop', 'Desktop', 'Server', 'Workstation'],
    'Mobile & Phones': ['Smartphone', 'Tablet'],
    'Office Furniture': ['Desk', 'Chair', 'Cabinet', 'Lamp', 'Whiteboard'],
    'Peripherals': ['Mouse', 'Keyboard', 'Headset', 'Monitor', 'Docking Station'],
    'Networking': ['Router', 'Switch', 'Modem', 'Access Point']
};

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
  name: '', 
  price: 0, 
  categoryName: '', 
  subCategoryName: '',
  warehouse: 'Central Warehouse',
  quantity: 1, 
  defective: 0,
  specs: { 
      cpu: '', ram: '', storage: '', os: '',            
      screen: '', battery: '', camera: '',              
      material: '', dimensions: '', color: '',          
      connectivity: '', type: '',                       
      speed: '', ports: '',                             
      description: ''                                   
  }
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

const onCategoryChange = () => {
    Object.keys(editedItem.specs).forEach(key => editedItem.specs[key] = '');
    editedItem.subCategoryName = '';
};

const openDialog = (product = null) => {
  if (product) {
    isEditMode.value = true;
    editingId.value = product.id;
    editedItem.name = product.name;
    editedItem.price = product.price;
    
    editedItem.categoryName = (typeof product.category === 'string') ? product.category : (product.category?.name || '');
    editedItem.subCategoryName = product.category?.subcategory || ''; 
    
    editedItem.warehouse = product.inventory?.warehouse;
    editedItem.quantity = product.inventory?.quantity;
    editedItem.defective = product.inventory?.defective || 0;
    
    Object.keys(editedItem.specs).forEach(key => editedItem.specs[key] = '');
    if (product.specifications) {
        Object.assign(editedItem.specs, product.specifications);
    }
  } else {
    isEditMode.value = false;
    resetForm();
  }
  dialog.value = true;
};

const closeDialog = () => { dialog.value = false; resetForm(); };

const resetForm = () => {
  editedItem.name = ''; 
  editedItem.price = 0; 
  editedItem.categoryName = ''; 
  editedItem.subCategoryName = '';
  editedItem.warehouse = 'Central Warehouse'; 
  editedItem.quantity = 1; 
  editedItem.defective = 0;
  Object.keys(editedItem.specs).forEach(key => editedItem.specs[key] = '');
};

const save = async () => {
  const payload = {
    name: editedItem.name,
    price: Number(editedItem.price),
    category: { 
        name: editedItem.categoryName, 
        subcategory: editedItem.subCategoryName,
        id: 'cat_' + editedItem.categoryName.toLowerCase().replace(/\s+/g, '_') 
    },
    specifications: { ...editedItem.specs },
    inventory: { quantity: Number(editedItem.quantity), defective: Number(editedItem.defective), warehouse: editedItem.warehouse }
  };
  try {
    if (isEditMode.value) await productStore.updateProduct(editingId.value, payload);
    else await productStore.addProduct(payload);
    closeDialog();
  } catch (e) { alert(e.message); }
};

const moveStock = async (product, direction) => {
    const currentQty = product.inventory?.quantity || 0;
    const currentDefective = product.inventory?.defective || 0;
    let newQty = currentQty;
    let newDefective = currentDefective;

    if (direction === 'to_maintenance') {
        if (currentQty > 0) { newQty--; newDefective++; }
    } else if (direction === 'to_stock') {
        if (currentDefective > 0) { newDefective--; newQty++; }
    }

    const payload = {
        name: product.name,
        price: product.price,
        category: product.category,
        specifications: product.specifications,
        inventory: {
            ...product.inventory,
            quantity: newQty,
            defective: newDefective,
            warehouse: product.inventory?.warehouse || 'Central Warehouse'
        }
    };

    try {
        await productStore.updateProduct(product.id, payload);
    } catch (e) {
        alert("Error moving stock: " + e.message);
    }
};

const deleteItem = async (id) => {
  if(confirm('Archive this asset?')) await productStore.deleteProduct(id);
};
</script>
