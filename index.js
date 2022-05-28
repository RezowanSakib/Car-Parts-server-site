// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const { MongoClient, ServerApiVersion } = require("mongodb");
// const app = express();
// const port = process.env.PORT || 5000;
// app.use(cors());
// app.use(express.json);
// //sakib
// //ZcrZTstbXWI56EMC

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@carpartcluster.pau1djg.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });

// async function run() {
//   try {
//     await client.connect();
//     const productCollection = client.db("CarPars").collection("Parts");

//     //get all data
//     app.get("/product", async (req, res) => {
//       const query = {};
//       const cursor = productCollection.find(query);
//       const products = await cursor.toArray();
//       res.send(products);
//     });
//   } finally {
//   }
// }

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion , ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@carpartcluster.pau1djg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const productCollection = client.db("CarPars").collection("Parts");
    const orderCollection = client.db("CarPars").collection("CustomarOrders");
    const reviewCollection = client.db("CarPars").collection("reviews");
    const userCollection = client.db('CarPars').collection('users');
    //get all data
    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    app.get("/order", async (req, res) => {
      const query = {};
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });
     // create a new data
     app.post("/order", async (req, res) => {
      const newOrder = req.body;
      const result = await orderCollection.insertOne(newOrder);
      res.send(result);
    });
     app.post("/reviews", async (req, res) => {
      const newReview = req.body;
      const result = await reviewCollection.insertOne(newReview);
      res.send(result);
    });
    //loading by email
    app.get('/order', async(req, res) =>{
      const email = req.query.email;
      const query = {email:email};
      const orders = await orderCollection.find(query).toArray();
      res.send(orders);
    })
    //   DELETE
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
    app.put('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
      res.send({ result, token });
    })
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World! ");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
