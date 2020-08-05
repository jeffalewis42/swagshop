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


///add new products to the catalog
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

///get a list of all products from the catalog
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

///Create a Wishlist

app.post('/wishlist', function (request, response) {
    var wishlist = new WishList();
    wishlist.title = request.body.title;

    wishlist.save(function (err, newWishList) {
        if (err) {
            response.status(500).send({
                error: "Could not save wishlist"
            });
        } else {
            response.status(200).send(newWishList);
        }
    });


})

///Get a list of Wishlists
app.get('/wishlist', function (request, response) {
    WishList
        .find({})
        .populate({
            path: 'products',
            model: 'Product',
            select: 'title'
        })
        .exec(function (err, ListOfWishlists) {

            if (err) {
                response.status(500).send({
                    error: "Could not retrieve list of wishlists"
                });
            } else {
                response.status(200).send(ListOfWishlists);
            }
        });
});

///Add product to a wishlist
app.put('/wishlist/product/add', function (request, response) {
    Product.findOne({
        _id: request.body.productId
    }, function (err, product) {
        if (err) {
            response.status(500).send({
                error: "Could not add item to wishlist"
            });

        } else {
            WishList.update({
                _id: request.body.wishListId
            }, {
                $addToSet: {
                    products: product._id
                }
            }, function (err, wishList) {
                if (err) {
                    response.status(500).send({
                        error: "Could not update wishlist"
                    })
                } else {
                    WishList.find({}, function (err, ListOfWishlists) {

                        if (err) {
                            response.status(500).send({
                                error: "Could not retrieve list of wishlists"
                            });
                        } else {
                            response.send(ListOfWishlists);
                        }
                    });

                }
            });
        }
    });



});

app.listen(3000, function () {
    console.log("Swag Shop API running on port 3000...")
});
