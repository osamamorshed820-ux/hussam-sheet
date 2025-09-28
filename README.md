# Inventory Tracking Application

This is an inventory tracking application that simulates multi-user functionality using localStorage synchronization.

## Features

- Inventory tracking for different categories (Age, Income, Milk Type)
- Transaction history recording
- Data persistence using browser localStorage
- Simulated multi-user support through localStorage synchronization
- Responsive design that works on desktop and mobile devices

## How It Works

Since this is a client-side only application, it simulates multi-user functionality by:
1. Storing all data in the browser's localStorage
2. Periodically checking for updates to the data
3. Synchronizing changes between different tabs/windows of the same browser

**Note:** This simulation only works within the same browser. For true multi-user support across different devices, a backend server would be required.

## Using the Application

1. **Viewing Inventory:**
   - The main inventory table shows all categories with their total and remaining quantities

2. **Recording Consumption:**
   - Select one or more categories by clicking on them
   - Add optional notes in the text area
   - Click "تسجيل الاستهلاك" (Record Consumption)
   - The inventory quantities will update

3. **Viewing Transaction History:**
   - All transactions are displayed in the history table
   - Transactions are grouped by time

4. **Deleting Transactions:**
   - Click the "حذف" (Delete) button next to any transaction group

5. **Resetting Data:**
   - Click the "إعادة تعيين البيانات" (Reset Data) button to restore initial values

## Data Storage

- Data is stored in the browser's localStorage
- The application automatically synchronizes data between different tabs every 5 seconds
- Closing all tabs will preserve the data, which will be loaded when the application is opened again

## Multi-user Simulation

To test the multi-user simulation:

1. Open the application in one tab
2. Open the application in a second tab (same browser)
3. Make changes in one tab (record consumption, delete transactions)
4. Wait up to 5 seconds for the changes to appear in the other tab

## Troubleshooting

1. **Data not synchronizing:**
   - Refresh the page to force a data reload
   - Make sure both tabs are on the same domain

2. **Data inconsistency:**
   - Use the "Reset Data" button to restore initial values

## Technical Details

- The application uses a periodic sync mechanism (every 5 seconds) to check for updates
- When a newer version of the data is detected, it automatically updates the UI
- All data operations are validated to ensure consistency