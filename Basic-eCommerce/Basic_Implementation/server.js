const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
app.use(cors({ origin: 'http://127.0.0.1:5500' }));

app.use(express.json());

const JSON_DIR = path.join(__dirname, 'db');

const readData = (filename) => {
  return JSON.parse(fs.readFileSync(path.join(JSON_DIR, filename), 'utf-8'));
};

const writeData = (filename, data) => {
  fs.writeFileSync(path.join(JSON_DIR, filename), JSON.stringify(data, null, 2), 'utf-8');
};

// Routes for products
app.get('/products', (req, res) => {
  const products = readData('products.json');
  const { category, inStock } = req.query;

  let filteredProducts = products;

  if (category) {
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }
  if (inStock) {
    filteredProducts = filteredProducts.filter(product => product.in_stock === (inStock === 'true'));
  }

  res.json(filteredProducts);
});

app.get('/products/:id', (req, res) => {
  const products = readData('products.json');
  const product = products.find(p => p.id === parseInt(req.params.id));

  if (!product) return res.status(404).send('Product not found');
  res.json(product);
});

app.post('/products', (req, res) => {
  const products = readData('products.json');
  const newProduct = req.body;
  newProduct.id = products.length + 1;

  products.push(newProduct);
  writeData('products.json', products);
  res.status(201).json(newProduct);
});

app.put('/products/:id', (req, res) => {
  const products = readData('products.json');
  const product = products.find(p => p.id === parseInt(req.params.id));

  if (!product) return res.status(404).send('Product not found');

  const { name, description, price, category, inStock } = req.body;
  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.category = category || product.category;
  product.in_stock = inStock || product.in_stock;

  writeData('products.json', products);
  res.json(product);
});

app.delete('/products/:id', (req, res) => {
  let products = readData('products.json');
  const index = products.findIndex(p => p.id === parseInt(req.params.id));

  if (index === -1) return res.status(404).send('Product not found');

  products.splice(index, 1);
  writeData('products.json', products);
  res.send('Product deleted');
});

// Routes for cart
app.post('/cart/:userId', (req, res) => {
  let carts = readData('cart.json');
  
  const userId = parseInt(req.params.userId);
  const cart = carts.find(c => c.user_id === userId);

  if (!cart) {
    const newCart = { user_id: userId, products: [req.body] };
    carts.push(newCart);
    writeData('cart.json', carts);
    return res.status(201).json(newCart);
  }

  cart.products.push(req.body);
  writeData('cart.json', carts);
  res.json(cart);
});


app.get('/cart/:userId', (req, res) => {
  const carts = readData('cart.json');
  const userId = parseInt(req.params.userId);
  const cart = carts.find(c => c.user_id === userId);

  if (!cart) return res.status(404).send('Cart not found');
  res.json(cart);
});


app.delete('/cart/:userId', (req, res) => {
  let carts = readData('cart.json');
  const userId = parseInt(req.params.userId); 

  const updatedCarts = carts.filter(cart => cart.user_id !== userId);

  writeData('cart.json', updatedCarts);
  res.status(200).send("Cart cleared successfully");
});

// Routes for orders
app.post('/orders', (req, res) => {
  const orders = readData('orders.json');
  const order = req.body;

  order.user_id = parseInt(order.user_id);

  order.id = orders.length + 1;
  order.created_at = new Date().toISOString();
  
  orders.push(order);
  writeData('orders.json', orders);
  res.status(200).json(order);
});


app.get('/orders/:userId', (req, res) => {
  const orders = readData('orders.json');
  const userId = parseInt(req.params.userId);

  const userOrders = orders.filter(order => order.user_id === userId);

  if (!userOrders.length) return res.status(404).send('No orders found');
  res.json(userOrders);
});


app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});