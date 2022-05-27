const express = require("express");
const cors = require("cors");
require("dotenv").config();
 const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json);
//sakib
//ZcrZTstbXWI56EMC

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@carpartcluster.pau1djg.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("CarPars").collection("Parts");
    //get all data
    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
  } finally {
  }
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
