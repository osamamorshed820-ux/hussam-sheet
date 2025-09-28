// Initial inventory data categorized
const inventoryCategories = {
    age: [
        { category: "العمر 20-29", total: 20, remaining: 20 },
        { category: "العمر 30-40", total: 30, remaining: 30 }
    ],
    income: [
        { category: "الدخل 401-500 (C2)", total: 60, remaining: 60 },
        { category: "الدخل 501-600 (C1)", total: 41, remaining: 41 },
        { category: "الدخل 601+ (A&B)", total: 48, remaining: 48 }
    ],
    milk: [
        { category: "نيدو", total: 90, remaining: 90 },
        { category: "حليبنا", total: 29, remaining: 29 },
        { category: "إنجوي", total: 29, remaining: 29 }
    ]
};

// Flatten inventory for easier access
let inventory = [
    ...inventoryCategories.age,
    ...inventoryCategories.income,
    ...inventoryCategories.milk
];

// Selected categories
let selectedCategories = [];

// Transaction history
let transactions = [];

// DOM Elements
const inventoryTableBody = document.getElementById('inventoryTable').querySelector('tbody');
const transactionTableBody = document.getElementById('transactionTable').querySelector('tbody');
const selectedCategoriesContainer = document.getElementById('selected-categories');

// Last sync timestamp
let lastSync = Date.now();

// Sync interval (5 seconds)
const SYNC_INTERVAL = 5000;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadData(); // Load data from localStorage
    renderInventoryTable();
    createCategoryButtons();
    renderTransactionTable();
    
    // Start periodic sync
    setInterval(syncData, SYNC_INTERVAL);
});

// Save data to localStorage
function saveData() {
    // Update sync timestamp
    lastSync = Date.now();
    
    const data = {
        inventory: inventory,
        transactions: transactions.map(t => ({
            ...t,
            timestamp: t.timestamp.toISOString() // Convert Date to string for storage
        })),
        lastSync: lastSync
    };
    localStorage.setItem('inventoryData', JSON.stringify(data));
}

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem('inventoryData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Restore inventory
        if (data.inventory) {
            inventory = data.inventory;
        }
        
        // Restore transactions with Date objects
        if (data.transactions) {
            transactions = data.transactions.map(t => ({
                ...t,
                timestamp: new Date(t.timestamp) // Convert string back to Date object
            }));
        }
        
        // Restore last sync timestamp
        if (data.lastSync) {
            lastSync = data.lastSync;
        }
    }
    
    // Ensure remaining quantities are not greater than total quantities
    validateInventory();
}

// Sync data with localStorage
function syncData() {
    const savedData = localStorage.getItem('inventoryData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Check if there's newer data
        if (data.lastSync > lastSync) {
            // Load the newer data
            loadData();
            
            // Update UI
            renderInventoryTable();
            renderTransactionTable();
            
            console.log('Data synchronized with newer version from localStorage');
        }
    }
}

// Validate inventory to ensure remaining <= total
function validateInventory() {
    inventory.forEach(item => {
        if (item.remaining > item.total) {
            item.remaining = item.total;
        }
        if (item.remaining < 0) {
            item.remaining = 0;
        }
    });
}

// Render inventory table
function renderInventoryTable() {
    inventoryTableBody.innerHTML = '';
    
    inventory.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.category}</td>
            <td>${item.total}</td>
            <td>${item.remaining}</td>
        `;
        
        inventoryTableBody.appendChild(row);
    });
}

// Create category buttons
function createCategoryButtons() {
    // Age categories
    const ageContainer = document.getElementById('age-categories');
    ageContainer.innerHTML = '';
    inventoryCategories.age.forEach(item => {
        const button = document.createElement('div');
        button.className = 'category-btn';
        button.textContent = item.category;
        button.dataset.category = item.category;
        button.onclick = () => toggleCategory(item.category);
        ageContainer.appendChild(button);
    });
    
    // Income categories
    const incomeContainer = document.getElementById('income-categories');
    incomeContainer.innerHTML = '';
    inventoryCategories.income.forEach(item => {
        const button = document.createElement('div');
        button.className = 'category-btn';
        button.textContent = item.category;
        button.dataset.category = item.category;
        button.onclick = () => toggleCategory(item.category);
        incomeContainer.appendChild(button);
    });
    
    // Milk categories
    const milkContainer = document.getElementById('milk-categories');
    milkContainer.innerHTML = '';
    inventoryCategories.milk.forEach(item => {
        const button = document.createElement('div');
        button.className = 'category-btn';
        button.textContent = item.category;
        button.dataset.category = item.category;
        button.onclick = () => toggleCategory(item.category);
        milkContainer.appendChild(button);
    });
}

// Toggle category selection
function toggleCategory(category) {
    const index = selectedCategories.indexOf(category);
    
    if (index === -1) {
        // Add category to selection
        selectedCategories.push(category);
    } else {
        // Remove category from selection
        selectedCategories.splice(index, 1);
    }
    
    updateSelectedCategoriesDisplay();
    updateCategoryButtonStyles();
}

// Update selected categories display
function updateSelectedCategoriesDisplay() {
    if (selectedCategories.length === 0) {
        selectedCategoriesContainer.innerHTML = '<p>لم يتم اختيار أي فئات بعد</p>';
        return;
    }
    
    selectedCategoriesContainer.innerHTML = '';
    
    selectedCategories.forEach(category => {
        const tag = document.createElement('span');
        tag.className = 'selected-category-tag';
        tag.innerHTML = `
            ${category}
            <button class="remove-btn" onclick="removeCategory('${category}')">×</button>
        `;
        selectedCategoriesContainer.appendChild(tag);
    });
}

// Remove category from selection
function removeCategory(category) {
    const index = selectedCategories.indexOf(category);
    if (index !== -1) {
        selectedCategories.splice(index, 1);
        updateSelectedCategoriesDisplay();
        updateCategoryButtonStyles();
    }
}

// Update category button styles based on selection
function updateCategoryButtonStyles() {
    // Remove selected class from all buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selected class to selected buttons
    selectedCategories.forEach(category => {
        const button = document.querySelector(`.category-btn[data-category="${category}"]`);
        if (button) {
            button.classList.add('selected');
        }
    });
}

// Record consumption for selected categories
function recordConsumption() {
    if (selectedCategories.length === 0) {
        alert('الرجاء اختيار فئة واحدة على الأقل');
        return;
    }
    
    const notes = document.getElementById('notes').value.trim();
    const timestamp = new Date();
    
    // Create a transaction record for each selected category
    selectedCategories.forEach(category => {
        const transaction = {
            category: category,
            notes: notes,
            timestamp: timestamp
        };
        
        transactions.push(transaction);
        
        // Update inventory (reduce by 1 for each selection)
        updateInventory(category, 1);
    });
    
    // Save data to localStorage
    saveData();
    
    // Clear selection and notes
    selectedCategories = [];
    document.getElementById('notes').value = '';
    
    // Update UI
    updateSelectedCategoriesDisplay();
    updateCategoryButtonStyles();
    renderInventoryTable();
    renderTransactionTable();
    
    alert('تم تسجيل الاستهلاك بنجاح');
}

// Update inventory when a transaction is added
function updateInventory(category, consumedQuantity) {
    const item = inventory.find(item => item.category === category);
    
    if (item) {
        item.remaining = Math.max(0, item.remaining - consumedQuantity);
    }
}

// Render transaction table grouped by category type
function renderTransactionTable() {
    transactionTableBody.innerHTML = '';
    
    // Group transactions by time (to show in rows)
    const groupedTransactions = groupTransactionsByTime();
    
    groupedTransactions.forEach(group => {
        const row = document.createElement('tr');
        
        // Get categories for each type in this transaction
        const ageCategory = getTransactionCategory(group.transactions, 'age');
        const incomeCategory = getTransactionCategory(group.transactions, 'income');
        const milkCategory = getTransactionCategory(group.transactions, 'milk');
        
        // Format date to show time
        const time = new Date(group.timestamp).toLocaleTimeString('ar-SA');
        
        row.innerHTML = `
            <td>${ageCategory || '-'}</td>
            <td>${incomeCategory || '-'}</td>
            <td>${milkCategory || '-'}</td>
            <td>${group.notes || '-'}</td>
            <td>${time}</td>
            <td>
                <button class="delete-btn" onclick="deleteTransactionGroup('${group.timestamp.toISOString()}')">حذف</button>
            </td>
        `;
        
        transactionTableBody.appendChild(row);
    });
}

// Group transactions by timestamp
function groupTransactionsByTime() {
    const groups = {};
    
    transactions.forEach(transaction => {
        const timeKey = transaction.timestamp.toISOString();
        
        if (!groups[timeKey]) {
            groups[timeKey] = {
                timestamp: transaction.timestamp,
                notes: transaction.notes,
                transactions: []
            };
        }
        
        groups[timeKey].transactions.push(transaction);
    });
    
    // Convert to array and sort by timestamp (newest first)
    return Object.values(groups).sort((a, b) => b.timestamp - a.timestamp);
}

// Get category of specific type from transaction group
function getTransactionCategory(transactions, type) {
    for (const transaction of transactions) {
        const category = transaction.category;
        
        if (type === 'age' && inventoryCategories.age.some(item => item.category === category)) {
            return category;
        }
        
        if (type === 'income' && inventoryCategories.income.some(item => item.category === category)) {
            return category;
        }
        
        if (type === 'milk' && inventoryCategories.milk.some(item => item.category === category)) {
            return category;
        }
    }
    
    return null;
}

// Delete a group of transactions
function deleteTransactionGroup(timestampString) {
    if (confirm('هل أنت متأكد من حذف هذا الاستهلاك؟')) {
        const timestamp = new Date(timestampString);
        
        // Find and remove transactions with this timestamp
        const transactionsToRemove = transactions.filter(t => 
            t.timestamp.getTime() === timestamp.getTime()
        );
        
        // Update inventory for each removed transaction
        transactionsToRemove.forEach(transaction => {
            updateInventory(transaction.category, -1);
        });
        
        // Remove transactions from array
        transactions = transactions.filter(t => 
            t.timestamp.getTime() !== timestamp.getTime()
        );
        
        // Save data to localStorage
        saveData();
        
        // Re-render tables
        renderInventoryTable();
        renderTransactionTable();
    }
}

// Reset all data to initial values
function resetData() {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع البيانات؟ هذا سيحذف جميع السجلات.')) {
        // Reset inventory to initial values
        inventory = [
            ...inventoryCategories.age,
            ...inventoryCategories.income,
            ...inventoryCategories.milk
        ];
        
        // Clear transactions
        transactions = [];
        
        // Clear selected categories
        selectedCategories = [];
        
        // Clear notes
        document.getElementById('notes').value = '';
        
        // Update UI
        updateSelectedCategoriesDisplay();
        updateCategoryButtonStyles();
        renderInventoryTable();
        renderTransactionTable();
        
        // Save to localStorage
        saveData();
        
        alert('تم إعادة تعيين البيانات بنجاح');
    }
}