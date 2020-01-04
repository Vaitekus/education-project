const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const Schema = mongoose.Schema;
const app = express();
var bodyParser = require('body-parser');

const productScheme = new Schema(
    {
        productId: String,
        company: String,
        companyColor: String,
        location: String,
        locationColor: String,
        title: String,
        titleColor: String,
        image: mongoose.Mixed,
        type: String,
        typeColor: String,
        price: [],
        priceColor: String,
        information: [],
        informationColor: String
    }
);
const Product = mongoose.model('Product', productScheme);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/xrystofor", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }, function(err){
    if(err) return console.log(err);

    app.listen(3000, function(){
        console.log("Server started....");
    }); 
});

app.get('/api/products', cors(), function(req, res){
    Product.find({}, function(err, products) {
        if(err) {
            return console.log(err)
        };
        res.send(products);
    });

});

app.post(`/api/products`, function(req, res){
    const product = new Product({
        company: req.body.company,
        companyColor: req.body.companyColor,
        location: req.body.location,
        locationColor: req.body.locationColor,
        title: req.body.title,
        titleColor: req.body.titleColor,
        image: req.body.image,
        type: req.body.type,
        typeColor: req.body.typeColor,
        price: req.body.price,
        priceColor: req.body.priceColor,
        information: req.body.information,
        informationColor: req.body.informationColor
    });

    product.save(function (err) {
        mongoose.disconnect();
        if(err) {
            return console.log(err)
        };
        res.send(product);
    })
});

app.delete("/api/products/:id", function(req, res){    
    const id = req.body.id;

    Product.findByIdAndDelete(id, function(err, product){
            
        if(err) {
            return console.log(err)
        };

        return res.status(202).send({
            status: true
        })
    });
});

app.get("/api/products/:id", cors(), function(req, res){     
    const id = req.params.id;

    Product.findOne({_id: id}, function(err, product){
          
        if(err) {
            return console.log(err)
        };
        res.send(product);
    });
});

app.put("/api/products", function(req, res){
         
    if(!req.body) {
        return res.sendStatus(400);
    }
    const id = req.body.productId;
    const newProduct = {
        productId: req.body.productId,
        company: req.body.company,
        companyColor: req.body.companyColor,
        location: req.body.location,
        locationColor: req.body.locationColor,
        title: req.body.title,
        titleColor: req.body.titleColor,
        image: req.body.image,
        type: req.body.type,
        typeColor: req.body.typeColor,
        price: req.body.price,
        priceColor: req.body.priceColor,
        information: req.body.information,
        informationColor: req.body.informationColor
    };
    
    Product.findByIdAndUpdate(id, newProduct, {new: true}, 
        
    function(err, product){
        if(err) {
            return console.log(err);
        } 
        res.send(product);
    });
});

// shortcut ctrl-c close connection
process.on("SIGINT", () => {
    //nodemon.emit('quit');
    process.exit();
});
