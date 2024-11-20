const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 3000;

// MongoDB connection URI
const uri = "mongodb+srv://rajeswarirajaselvam:C8UXsj4ZoDj7XgtU@raji.ffdc5.mongodb.net/?retryWrites=true&w=majority&appName=raji";
const client = new MongoClient(uri);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

async function connectToDatabase() {
  await client.connect();
  return client.db('inventoryDB').collection('items'); // Replace 'inventoryDB' and 'items' with your database and collection names
}

app.get('/', async (req, res) => {
  const collection = await connectToDatabase();
  const items = await collection.find({}).toArray();
  res.render('index', { items });
});

app.post('/add', async (req, res) => {
  const { name, quantity, price } = req.body;
  const collection = await connectToDatabase();
  await collection.insertOne({ name, quantity, price });
  res.redirect('/');
});

app.post('/update/:id', async (req, res) => {
  const id = req.params.id;
  const { name, quantity, price } = req.body;
  const collection = await connectToDatabase();
  await collection.updateOne({ _id: new ObjectId(id) }, { $set: { name, quantity, price } });
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  const id = req.params.id;
  const collection = await connectToDatabase();
  await collection.deleteOne({ _id: new ObjectId(id) });
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
