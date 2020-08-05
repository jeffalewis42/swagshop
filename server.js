var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swagshop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

////Bind connection to error event (to get notification of connection errors)
//db.on('error', console.error.bind(console, 'MongoDB connection error:'));
var Product = require('./model/product');
var WishList = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.post('/product', function (request, response) {
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    product.save(function (err, savedProduct) {
        if (err) {
            response.status(500).send({
                error: "Could not save product"
            });
        } else {
            response.status(200).send(savedProduct);
        }
    });
});

app.get('/product', function (request, response) {


    Product.find({}, function (err, productlist) {

        if (err) {
            response.status(500).send({
                error: "Could not retrieve product"
            });
        } else {
            response.send(productlist);
        }
    });

});



app.listen(3000, function () {
    console.log("Swag Shop API running on port 3000...")
});
