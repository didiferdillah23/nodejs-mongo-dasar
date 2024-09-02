const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Koneksi ke MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/crudDB')
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Menggunakan folder 'public' untuk file statis
app.use(express.static('public'));

const Item = require('./models/item');

app.get('/', async (req, res) => {
    const items = await Item.find({});
    res.render('index', { items: items });
});

app.post('/add', async (req, res) => {
    const newItem = new Item({
        name: req.body.name,
        qty: req.body.qty
    });
    await newItem.save();
    res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
    const item = await Item.findById(req.params.id);
    res.render('edit', { item: item });
});

app.post('/edit/:id', async (req, res) => {
    await Item.findByIdAndUpdate(req.params.id, { name: req.body.name, qty: req.body.qty });
    res.redirect('/');
});

app.get('/delete/:id', async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

// Mulai server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
