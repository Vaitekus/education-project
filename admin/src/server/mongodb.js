const express = require("express");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json(); 
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
const dbName = 'xrystofor';
let dbClient;

const userScheme = new Schema(
    {
        company: String,
        location: String,
        visual: {
            title: String,
            media: Date
        },
        type: String,
        priceList: [Mixed],
        description: [Mixed]
    }, 
    { versionKey: false }
);
const Product = mongoose.model("Product", userScheme);
 
// app.use(express.static(__dirname + "/public"));  ///
 
mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db(dbName).collection("products");
    app.listen(3000, function(){
        console.log("Server started....");
    });
});

app.get("/api/products", function(req, res){
    Product.find({}, function(err, products){
        if(err) return console.log(err);
        res.send(products)
    });   
});
app.get("/api/products/:id", function(req, res){
    const id = req.params.id;
    Product.findOne({_id: id}, function(err, product){
          
        if(err) return console.log(err);
        res.send(product);
    });
});
   
app.post("/api/products", jsonParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
        
    const userName = req.body.name;
    const userAge = req.body.age;
    const product = new Product({name: userName, age: userAge});
        
    product.save(function(err){
        if(err) return console.log(err);
        res.send(product);
    });
});
    
app.delete("/api/products/:id", function(req, res){
    const id = req.params.id;
    Product.findByIdAndDelete(id, function(err, product){
                
        if(err) return console.log(err);
        res.send(product);
    });
});
   
app.put("/api/products", jsonParser, function(req, res){
    if(!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const userName = req.body.name;
    const userAge = req.body.age;
    const newProduct = {age: userAge, name: userName};
     
    Product.findOneAndUpdate({_id: id}, newProduct, {new: true}, function(err, product){
        if(err) return console.log(err); 
        res.send(product);
    });
});


// shortcut ctrl-c close connection
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});
