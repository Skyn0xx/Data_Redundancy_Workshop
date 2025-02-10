const express = require('express');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const { write } = require('fast-csv');
const cors = require('cors');
app.use(cors({ origin: 'http://127.0.0.1:5500' }));

const app = express();
app.use(express.json());

const JSON_DIR = path.join(__dirname, 'db');
const CSV_DIR = path.join(__dirname, 'db');

const readJsonData = (filename) => {
    const filePath = path.join(JSON_DIR, filename);
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const writeJsonData = (filename, data) => {
    const filePath = path.join(JSON_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    setTimeout(() => {
        replicationToCsv(filename, data);
    }, 5000);
      
};

const readCsvData = (filename) => {
    const filePath = path.join(CSV_DIR, filename);
    const results = [];

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) return resolve([]);
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

const writeCsvData = (filename, data) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(CSV_DIR, filename);
        const writableStream = fs.createWriteStream(filePath);

        write(data, { headers: true })
            .pipe(writableStream)
            .on('finish', () => resolve())
            .on('error', (error) => reject(error));
    });
};

const replicationToCsv = (jsonFilename, jsonData) => {
    const csvFilename = jsonFilename.replace('.json', '.csv');
    writeCsvData(csvFilename, jsonData);
};

// Routes for products
app.get('/products', (req, res) => {
    const products = readJsonData('products.json');
    res.json(products);
});

app.post('/products', (req, res) => {
    const products = readJsonData('products.json');
    const newProduct = req.body;
    newProduct.id = products.length + 1;

    products.push(newProduct);
    writeJsonData('products.json', products);
    res.status(201).json(newProduct);
});

// Routes for cart
app.get('/cart/:userId', (req, res) => {
    const carts = readJsonData('cart.json');
    const userId = parseInt(req.params.userId);
    const cart = carts.find(c => c.user_id === userId);

    if (!cart) return res.status(404).send('Cart not found');
    res.json(cart);
});

app.post('/cart/:userId', (req, res) => {
    let carts = readJsonData('cart.json');
    const userId = parseInt(req.params.userId);
    const cart = carts.find(c => c.user_id === userId);

    if (!cart) {
        const newCart = { user_id: req.params.userId, products: [req.body] };
        carts.push(newCart);
        writeJsonData('cart.json', carts);
        return res.status(201).json(newCart);
    }

    cart.products.push(req.body);
    writeJsonData('cart.json', carts);
    res.json(cart);
});

app.delete('/cart/:userId', (req, res) => {
    let carts = readJsonData('cart.json');
    const userId = parseInt(req.params.userId);
  
    const updatedCarts = carts.filter(cart => cart.user_id !== userId);
  
    writeJsonData('cart.json', updatedCarts);
    res.status(200).send("Cart cleared successfully");
});

// Routes for orders
app.get('/orders/:userId', (req, res) => {
    const orders = readJsonData('orders.json');
    const userId = parseInt(req.params.userId);

    const userOrders = orders.filter(order => order.user_id === userId);

    if (!userOrders.length) return res.status(404).send('No orders found');
    res.json(userOrders);
});

app.post('/orders', (req, res) => {
    const orders = readJsonData('orders.json');
    const order = req.body;

    order.user_id = parseInt(order.user_id);

    order.id = orders.length + 1;
    order.created_at = new Date().toISOString();
    
    orders.push(order);
    writeJsonData('orders.json', orders);
    res.status(201).json(order);
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
