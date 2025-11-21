const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sobjihaat';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Schemas
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  unit: { type: String, required: true },
  stock: { type: Number, default: 0 },
  category: { type: String, required: true, enum: ['indian', 'exotic', 'leafy', 'others'] }
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  items: [{
    productId: Number,
    name: String,
    price: Number,
    quantity: Number,
    unit: String
  }],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'delivered', 'cancelled'] },
  paymentMethod: { type: String, default: 'COD' }
}, { timestamps: true });

const businessInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  instagram: String,
  facebook: String,
  googleReview: String,
  deliveryFee: { type: Number, default: 20 },
  servicePincodes: [String],
  pincodeCharges: { type: Map, of: Number }
}, { timestamps: true });

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

// Models
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const BusinessInfo = mongoose.model('BusinessInfo', businessInfoSchema);
const Admin = mongoose.model('Admin', adminSchema);

// Initialize default admin if not exists
async function initializeAdmin() {
  const adminExists = await Admin.findOne({ username: 'admin' });
  if (!adminExists) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('sobjihaat2025', 10);
    await Admin.create({ username: 'admin', password: hashedPassword });
    console.log('Default admin created');
  }
}

// Initialize default business info if not exists
async function initializeBusinessInfo() {
  const businessInfo = await BusinessInfo.findOne();
  if (!businessInfo) {
    await BusinessInfo.create({
      name: "Sobji Haat",
      phone: "+919051410591",
      address: "Jadavpur Sandhya Bazar Rd,West Bengal  kolkata-700075",
      instagram: "https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=seyxfz6",
      facebook: "https://www.facebook.com/sobjihaat?mibextid=ZbWKwL",
      googleReview: "https://maps.app.goo.gl/1DNV5UUPp2MXR81fA",
      deliveryFee: 20,
      servicePincodes: ["700047", "700045", "700075", "700094", "700084", "700092", "700040", "700068", "700095", "700032", "700031"],
      pincodeCharges: new Map([
        ["700047", 20],
        ["700045", 25],
        ["700075", 30],
        ["700094", 20],
        ["700084", 25],
        ["700092", 30],
        ["700040", 20],
        ["700068", 25],
        ["700031", 30],
        ["700095", 30],
        ["700032", 20]
      ])
    });
    console.log('Default business info created');
  }
}

// Initialize products from seed data
async function initializeProducts() {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    const products = [
      // Indian vegetables
      { id: 1, name: "Lemon", price: 5, image: "https://images.unsplash.com/photo-1642372849451-18113b4c5cd2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdyZWVuJTIwbGVtb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600", unit: "piece", stock: 50, category: "indian" },
      { id: 2, name: "Gondhoraj Lemon", price: 10, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiQoIPXSEcCvBDZjvxt4_x_uoW077Hqp9NIA&s", unit: "piece", stock: 30, category: "indian" },
      { id: 3, name: "Green Chilli", price: 20, image: "https://cdn.pixabay.com/photo/2016/08/11/08/49/peppers-1587615_1280.jpg", unit: "kg", stock: 40, category: "indian" },
      { id: 4, name: "Coriander", price: 15, image: "https://cdn.pixabay.com/photo/2017/05/07/08/56/coriander-2291395_1280.jpg", unit: "bunch", stock: 35, category: "indian" },
      { id: 5, name: "Radish", price: 30, image: "https://cdn.pixabay.com/photo/2016/11/23/00/22/radish-1851429_1280.jpg", unit: "kg", stock: 25, category: "indian" },
      { id: 6, name: "Cauliflower", price: 35, image: "https://cdn.pixabay.com/photo/2016/11/23/00/22/cauliflower-1851428_1280.jpg", unit: "piece", stock: 20, category: "indian" },
      { id: 7, name: "Brinjal", price: 30, image: "https://cdn.pixabay.com/photo/2015/09/02/12/25/eggplant-918583_1280.jpg", unit: "kg", stock: 15, category: "indian" },
      { id: 8, name: "Cabbage", price: 25, image: "https://cdn.pixabay.com/photo/2018/10/03/22/08/kohl-3722517_1280.jpg", unit: "kg", stock: 18, category: "indian" },
      { id: 9, name: "Beans", price: 40, image: "https://cdn.pixabay.com/photo/2015/05/11/03/58/green-beans-761940_1280.jpg", unit: "kg", stock: 22, category: "indian" },
      { id: 10, name: "Carrot", price: 35, image: "https://cdn.pixabay.com/photo/2016/07/11/00/18/carrots-1508847_1280.jpg", unit: "kg", stock: 28, category: "indian" },
      { id: 11, name: "Tamarind", price: 80, image: "https://cdn.pixabay.com/photo/2023/11/08/05/16/tamarind-8373925_1280.jpg", unit: "kg", stock: 12, category: "indian" },
      { id: 12, name: "Ginger", price: 120, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQImHPZdvqeFGi1WBTN0zSZLWKhyzj1VpgObruNXbCtI1F3KrcEVZLnJs7GqU7KY0fvcYeQ&s", unit: "kg", stock: 16, category: "indian" },
      { id: 13, name: "Garlic Whole", price: 150, image: "https://cdn.pixabay.com/photo/2016/03/05/19/14/garlic-1238337_1280.jpg", unit: "kg", stock: 14, category: "indian" },
      { id: 14, name: "Cucumber", price: 20, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuS3B37HDFWyYVflnzf25xrHpoahLScsaFEeAGXvvG2XNO1UCiaWxqky3Xrx7c1sjpHkukjvlxHDy7OWBGGdFmqVQ5JEoT9vb4H-DwQA&s=10", unit: "kg", stock: 32, category: "indian" },
      { id: 15, name: "Tomato", price: 30, image: "https://cdn.pixabay.com/photo/2019/07/11/10/14/cherry-tomato-4330441_1280.jpg", unit: "kg", stock: 45, category: "indian" },
      { id: 16, name: "Onion", price: 40, image: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", unit: "kg", stock: 38, category: "indian" },
      { id: 17, name: "Chandramukhi Potato", price: 25, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", unit: "kg", stock: 50, category: "indian" },
      { id: 18, name: "Jyoti Potato", price: 30, image: "https://cdn.pixabay.com/photo/2017/02/19/02/40/potatoes-2078775_1280.jpg", unit: "kg", stock: 42, category: "indian" },
      { id: 19, name: "Beet Root", price: 35, image: "https://cdn.pixabay.com/photo/2018/06/22/13/52/beetroot-3490809_1280.jpg", unit: "kg", stock: 20, category: "indian" },
      { id: 20, name: "Spinach", price: 20, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", unit: "kg", stock: 25, category: "indian" },
      { id: 21, name: "Papaya", price: 50, image: "https://cdn.pixabay.com/photo/2014/04/24/11/37/papaya-331273_1280.jpg", unit: "kg", stock: 15, category: "indian" },
      { id: 22, name: "Mustard Leaf", price: 25, image: "https://cdn.pixabay.com/photo/2015/10/05/09/48/blossom-972369_1280.jpg", unit: "bunch", stock: 30, category: "indian" },
      // Exotic vegetables
      { id: 23, name: "Red Cabbage", price: 50, image: "https://cdn.pixabay.com/photo/2019/10/18/15/47/red-cabbage-4559494_1280.jpg", unit: "piece", stock: 12, category: "exotic" },
      { id: 24, name: "Broccoli", price: 80, image: "https://cdn.pixabay.com/photo/2016/03/05/19/02/broccoli-1238250_1280.jpg", unit: "piece", stock: 8, category: "exotic" },
      { id: 25, name: "Bell Pepper", price: 120, image: "https://cdn.pixabay.com/photo/2014/10/22/21/54/bell-peppers-499068_1280.jpg", unit: "kg", stock: 10, category: "exotic" },
      { id: 26, name: "Cherry Tomato", price: 100, image: "https://cdn.pixabay.com/photo/2018/08/21/19/48/tomatoes-3622009_1280.jpg", unit: "kg", stock: 15, category: "exotic" },
      { id: 27, name: "Pakchoi", price: 60, image: "https://cdn.pixabay.com/photo/2020/03/21/12/26/vegetables-4953713_1280.jpg", unit: "kg", stock: 8, category: "exotic" },
      { id: 28, name: "Button Mushroom", price: 150, image: "https://cdn.pixabay.com/photo/2016/04/25/01/57/mushrooms-1351060_1280.jpg", unit: "kg", stock: 5, category: "exotic" },
      { id: 29, name: "Bean Sprouts", price: 60, image: "https://cdn.pixabay.com/photo/2013/07/18/15/08/green-bean-bud-164652_1280.jpg", unit: "kg", stock: 12, category: "exotic" },
      { id: 30, name: "Peeled Garlic", price: 200, image: "https://cdn.pixabay.com/photo/2020/06/21/01/28/garlic-5322921_1280.jpg", unit: "kg", stock: 6, category: "exotic" },
      { id: 31, name: "Sweet Corn", price: 40, image: "https://cdn.pixabay.com/photo/2020/08/23/12/20/corn-5510709_1280.jpg", unit: "kg", stock: 18, category: "exotic" },
      { id: 32, name: "English Cucumber", price: 50, image: "https://images.unsplash.com/photo-1602343244137-a142ba5c7b22?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGN1Y3VtYmVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", unit: "piece", stock: 15, category: "exotic" },
      { id: 33, name: "Iceberg Lettuce", price: 40, image: "https://cdn.pixabay.com/photo/2018/06/29/07/26/salad-3505392_1280.jpg", unit: "piece", stock: 10, category: "exotic" },
      { id: 34, name: "Chinese Cabbage", price: 45, image: "https://cdn.pixabay.com/photo/2019/05/14/08/02/beijing-cabbage-4201754_1280.jpg", unit: "kg", stock: 12, category: "exotic" },
      { id: 35, name: "Thai Ginger", price: 180, image: "https://cdn.pixabay.com/photo/2018/05/21/12/03/ginger-3418066_1280.jpg", unit: "kg", stock: 8, category: "exotic" },
      { id: 36, name: "Lemon Grass", price: 60, image: "https://cdn.pixabay.com/photo/2015/01/27/23/16/lemon-614349_1280.jpg", unit: "bunch", stock: 20, category: "exotic" },
      { id: 37, name: "Mango Ginger", price: 200, image: "https://cdn.pixabay.com/photo/2019/01/31/10/59/ginger-3966502_1280.jpg", unit: "kg", stock: 5, category: "exotic" },
      { id: 38, name: "Asparagus", price: 250, image: "https://cdn.pixabay.com/photo/2019/12/08/18/28/asparagus-4681835_1280.jpg", unit: "kg", stock: 3, category: "exotic" },
      { id: 39, name: "Thyme", price: 100, image: "https://cdn.pixabay.com/photo/2013/06/01/03/07/thyme-115349_1280.jpg", unit: "bunch", stock: 15, category: "exotic" },
      { id: 40, name: "Rosemary", price: 120, image: "https://cdn.pixabay.com/photo/2017/08/15/15/45/rosemary-2644421_1280.jpg", unit: "bunch", stock: 12, category: "exotic" },
      { id: 41, name: "Zucchini", price: 70, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrp6WoTf1KV0DtT4JPA_BGMQhs7BsfETX_GsCoNECe8DnUogsZ3BDGGueO-bI7RryhHHc&usqp=CAU", unit: "kg", stock: 10, category: "exotic" },
      { id: 42, name: "Lotus Stem", price: 150, image: "https://cdn.pixabay.com/photo/2016/07/29/07/36/lotus-1550951_1280.jpg", unit: "kg", stock: 6, category: "exotic" },
      { id: 69, name: "Baby Corn", price: 50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpznDYQajTnFiIGB6AgZrKxSHRJ9KyrVOWWMYyfhFb7pTRcvvpAS0bL6jNUq8qeCgy2aCx&s", unit: "packet", stock: 8, category: "exotic" },
      { id: 70, name: "Kaffir Lime ", price: 25, image: "https://cdn.pixabay.com/photo/2016/07/29/15/46/bergamot-1554227_1280.jpg", unit: "packet", stock: 15, category: "exotic" },
      // Leafy vegetables
      { id: 43, name: "Spring Onion", price: 30, image: "https://cdn.pixabay.com/photo/2017/04/04/17/59/vegetables-2202500_1280.jpg", unit: "bunch", stock: 25, category: "leafy" },
      { id: 44, name: "Garlic Leaf", price: 40, image: "https://cdn.pixabay.com/photo/2019/03/03/10/11/vegetables-4031508_1280.jpg", unit: "bunch", stock: 20, category: "leafy" },
      { id: 45, name: "Basil Leaf", price: 50, image: "https://plus.unsplash.com/premium_photo-1725899523683-838307ab1552?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFzaWwlMjBsZWFmfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", unit: "bunch", stock: 18, category: "leafy" },
      { id: 46, name: "Parsley", price: 60, image: "https://images.unsplash.com/photo-1721117090894-029c81cf0758?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFyc2xleXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600", unit: "bunch", stock: 15, category: "leafy" },
      { id: 47, name: "Leek", price: 70, image: "https://plus.unsplash.com/premium_photo-1723651321795-c659bf9f2f96?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGVla3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600", unit: "bunch", stock: 12, category: "leafy" },
      { id: 48, name: "Dill Leaf", price: 55, image: "https://images.unsplash.com/photo-1694916202336-e49dc321954d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGlsbCUyMGxlYWZ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600", unit: "bunch", stock: 20, category: "leafy" },
      { id: 49, name: "Rocket Lettuce", price: 80, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBdUpRAOg0PFaLqCdLx0pgp1GXsEaxf3MSACnlcd8hPFF3F2v6bQscYo8&s", unit: "bunch", stock: 10, category: "leafy" },
      { id: 50, name: "Mint", price: 25, image: "https://cdn.pixabay.com/photo/2020/03/05/16/43/mint-4904876_1280.jpg", unit: "bunch", stock: 30, category: "leafy" },
      { id: 51, name: "Kale", price: 90, image: "https://media.gettyimages.com/id/1202296635/photo/top-view-of-bowl-of-kale-cutting-board-with-knife-and-chopped-kale.jpg?s=612x612&w=0&k=20&c=q1YQwyoZR18mD1lsS3VFs-v90rACdk5eTuH3eZ10URU=", unit: "bunch", stock: 8, category: "leafy" },
      { id: 52, name: "Celery Leaf", price: 45, image: "https://cdn.pixabay.com/photo/2017/02/21/08/08/vegetables-2085017_1280.jpg", unit: "bunch", stock: 15, category: "leafy" },
      { id: 53, name: "Lemon Leaf", price: 20, image: "https://images.pexels.com/photos/10223092/pexels-photo-10223092.jpeg", unit: "bunch", stock: 25, category: "leafy" },
      { id: 54, name: "English Parsley", price: 65, image: "https://cdn.pixabay.com/photo/2021/07/07/18/34/parsley-6395051_1280.jpg", unit: "bunch", stock: 12, category: "leafy" },
      { id: 55, name: "Lettuce", price: 35, image: "https://cdn.pixabay.com/photo/2018/06/17/14/45/salad-3480649_1280.jpg", unit: "bunch", stock: 18, category: "leafy" },
      { id: 56, name: "Curry Leaf", price: 15, image: "https://cdn.pixabay.com/photo/2017/08/31/16/57/kadipatta-2701445_1280.jpg", unit: "bunch", stock: 40, category: "leafy" },
      { id: 68, name: "Red Lettuce", price: 70, image: "https://cdn.pixabay.com/photo/2019/12/01/15/51/salad-4665745_1280.jpg", unit: "bunch", stock: 10, category: "leafy" },
      // Others
      { id: 57, name: "Green Peas", price: 50, image: "https://cdn.pixabay.com/photo/2020/04/04/09/40/peas-5001525_1280.jpg", unit: "packet", stock: 25, category: "others" },
      { id: 58, name: "French Fries", price: 80, image: "https://cdn.pixabay.com/photo/2022/09/29/11/45/food-7487178_1280.jpg", unit: "packet", stock: 30, category: "others" },
      { id: 59, name: "Panko Bread Crumb", price: 100, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlRPtSfqM213b1BgbFzx2tZJx4eaMNu2zTXvqd_6KM6Ka5XfxvpBYcWvgozyRXI2-9B6aM7w&s", unit: "packet", stock: 12, category: "others" },
      { id: 60, name: "Tomato Puree", price: 70, image: "https://images.pexels.com/photos/3832360/pexels-photo-3832360.jpeg", unit: "tin", stock: 15, category: "others" },
      { id: 61, name: "Mushroom", price: 150, image: "https://cdn.pixabay.com/photo/2017/08/28/17/35/mushrooms-2690529_1280.jpg", unit: "tin", stock: 10, category: "others" },
      { id: 62, name: "Pineapple Slice", price: 60, image: "https://cdn.pixabay.com/photo/2020/05/08/12/45/pineapple-5145473_1280.jpg", unit: "tin", stock: 8, category: "others" },
      { id: 63, name: "Fruit Cocktail", price: 120, image: "https://cdn.pixabay.com/photo/2015/04/16/13/25/cocktail-725578_1280.jpg", unit: "tin", stock: 5, category: "others" },
      { id: 64, name: "Rice Wine", price: 200, image: "https://cdn.pixabay.com/photo/2016/04/18/05/20/alcohol-1335965_1280.jpg", unit: "bottle", stock: 8, category: "others" },
      { id: 65, name: "Sweet Corn", price: 50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnAvi8QlDdKGxEq9RDT9HI-L58A-3XJd48UlGi566E6ZxSj8ege4ToIqnSSwtp_ZqYfend&s", unit: "packet", stock: 18, category: "others" },
      { id: 66, name: "Paneer(200gm)", price: 110, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaWxrnLvlyxIAsS1W9Z6LwgWJw48c-wyCR6lKul-H-zPiA9cyNZNFOaHRdLv_tlw1G7Z4arA&s", unit: "packet", stock: 20, category: "others" },
      { id: 67, name: "Baby Corn", price: 50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpznDYQajTnFiIGB6AgZrKxSHRJ9KyrVOWWMYyfhFb7pTRcvvpAS0bL6jNUq8qeCgy2aCx&s", unit: "packet", stock: 15, category: "others" }
    ];
    
    await Product.insertMany(products);
    console.log('Products initialized');
  }
}

// Auth middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sobjihaat_secret_key_2025');
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sobji Haat API is running' });
});

// Products Routes
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) {
      query.category = category;
    }
    const products = await Product.find(query).sort({ id: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', authenticateAdmin, async (req, res) => {
  try {
    const { id, name, price, image, unit, stock, category } = req.body;
    const product = new Product({ id, name, price, image, unit, stock, category });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Orders Routes
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, customerPhone, address, pincode, items, subtotal, deliveryFee, total } = req.body;
    
    // Generate order ID
    const orderId = `ORD${Date.now()}`;
    
    const order = new Order({
      orderId,
      customerName,
      customerPhone,
      address,
      pincode,
      items,
      subtotal,
      deliveryFee,
      total,
      status: 'pending'
    });
    
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/orders', authenticateAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/:id', authenticateAdmin, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Business Info Routes
app.get('/api/business-info', async (req, res) => {
  try {
    const businessInfo = await BusinessInfo.findOne();
    if (!businessInfo) {
      return res.status(404).json({ error: 'Business info not found' });
    }
    // Convert Map to object for JSON response
    const pincodeChargesObj = {};
    if (businessInfo.pincodeCharges) {
      businessInfo.pincodeCharges.forEach((value, key) => {
        pincodeChargesObj[key] = value;
      });
    }
    res.json({
      ...businessInfo.toObject(),
      pincodeCharges: pincodeChargesObj
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/business-info', authenticateAdmin, async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.pincodeCharges) {
      updateData.pincodeCharges = new Map(Object.entries(updateData.pincodeCharges));
    }
    
    const businessInfo = await BusinessInfo.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true, runValidators: true }
    );
    
    // Convert Map to object for JSON response
    const pincodeChargesObj = {};
    if (businessInfo.pincodeCharges) {
      businessInfo.pincodeCharges.forEach((value, key) => {
        pincodeChargesObj[key] = value;
      });
    }
    
    res.json({
      ...businessInfo.toObject(),
      pincodeCharges: pincodeChargesObj
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Stock Management
app.put('/api/products/:id/stock', authenticateAdmin, async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      { stock },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin Authentication
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const bcrypt = require('bcryptjs');
    const isValid = await bcrypt.compare(password, admin.password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'sobjihaat_secret_key_2025',
      { expiresIn: '24h' }
    );
    
    res.json({ token, username: admin.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize data on startup
async function initialize() {
  await initializeAdmin();
  await initializeBusinessInfo();
  await initializeProducts();
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initialize();
});

