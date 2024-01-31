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
const port = 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const {MongoClient,ObjectId} = require("mongodb");
const url = "mongodb://localhost:27017";
const dbName = "studentDB";
const client = new MongoClient(url);

app.get("/students",async function(req,res){
    try{
        await client.connect();
        let db = client.db(dbName);
        let collection = db.collection("students");
        let data = await collection.find().toArray();
        res.send(data);
    }catch(error){
        console.log(error)
    }
});
app.get("/students/:id",async function(req,res){
    try{
        let id = req.params.id;
        await client.connect();
        let db = client.db(dbName);
        let collection = db.collection("students");
        let data = await collection.findOne({_id: new ObjectId(id)});
        res.send(data);
    }catch(error){
        console.log(error)
    }
});
app.post("/students",async function(req,res){
    try{
        let body = req.body;
        await client.connect();
        let db = client.db(dbName);
        let collection = db.collection("students");
        let data = await collection.insertOne(body);
        res.send(data);
    }catch(error){
        console.log(error)
    }
});
app.delete("/students/:id",async function(req,res){
    try{
        let id = req.params.id;
        await client.connect();
        let db = client.db(dbName);
        let collection = db.collection("students");
        let data = await collection.deleteOne({_id: new ObjectId(id)});
        res.send(data);
    }catch(error){
        console.log(error)
    }
});
app.put("/students/:id",async function(req,res){
    try{
        let body = req.body;
        let id = req.params.id;
        await client.connect();
        let db = client.db(dbName);
        let collection = db.collection("students");
        let data = await collection.updateOne({_id: new ObjectId(id)},{$set:body});
        res.send(data);
    }catch(error){
        console.log(error)
    }
});