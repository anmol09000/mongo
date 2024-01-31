var express = require("express");
var app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
    res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  next();
});
const port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const {MongoClient,ObjectId} = require("mongodb");
const url = "mongodb://localhost:27017";
const dbName = "productsDB";
const client = new MongoClient(url);

app.get("/products", async function (req, res) {
    try{
      await client.connect();
      console.log("Connected to the database");
      const db = client.db(dbName);
      const collection = db.collection("products");
      const data = await collection.find().toArray();
      res.send(data);
    }catch(error){
        console.log(error);
    }
  });

app.get("/products/:id", async function (req, res) {
    try{
      let id = req.params.id;
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection("products");
      const data = await collection.findOne({_id: new ObjectId(id)});
      res.send(data);
    }catch(error){
        console.log(error);
    }
  });

  app.get("/products/byName/:name", async function (req, res) {
    try{
      let name = req.params.name;
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection("products");
      const data = await collection.findOne({name:name});
      res.send(data);
    }catch(error){
        console.log(error);
    }
  });
  app.get("/productsByRange", async function (req, res) {
    try{
      let minPrice = req.query.minPrice ? +req.query.minPrice : 0;
      let maxPrice = req.query.maxPrice ? +req.query.maxPrice : 9999;
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection("products");
      const data = await collection.find({price:{$gt:minPrice,$lt:maxPrice}}).toArray();
      res.send(data);
    }catch(error){
        console.log(error);
    }
  });

app.post("/products",async function(req,res){
    try{
        let body = req.body;
        await client.connect();
        let db = client.db(dbName);
        let collection = db.collection("products");
        let data = collection.insertOne(body);
        res.send(body);
    }catch(error){
        console.log(error);
    }
});
app.delete("/products/:id",async function(req,res){
    try{
        let id = req.params.id;
        await client.connect();
        let db = client.db(dbName);
        let collection = db.collection("products");
        let data = collection.deleteOne({_id: new ObjectId(id)});
        res.send(data);
    }catch(error){
        console.log(error);
    }
});
app.put("/products/:id",async function(req,res){
    try{
        let body = req.body;
        let id = req.params.id;
        await client.connect();
        let db = client.db(dbName);
        let collection = db.collection("products");
        let data = collection.updateOne({_id: new ObjectId(id)},{$set:body});
        res.send(data);
    }catch(error){
        console.log(error);
    }
})