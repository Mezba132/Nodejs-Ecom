const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../Models/product");
const { errorHandler } = require("../Helper/ErrorHandler");

exports.read = (req, res) => {
    req.product.images = undefined;
    return res.json(req.product);
}

exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error : 'Image Upload Failed'
            })
        }
        const { name, description, price, category, shipping, quantity, images} = fields

        if( !name || !description || !price || !category || !shipping || !quantity || images) {
            return res.status(400).json({
                error : 'All Fields are required'
            })
        }

        let product = new Product(fields);

        if(files.images) {
            console.log("Files Image ", files.images);
            if(files.images.size > 1000000) {
                return res.status(400).json({
                    error : 'Image size is too large! Make it less than 1mb'
                })
            }

            // if(files.images.type !== 'image/jpeg' || files.images.type !== 'image/png') {
            //     return res.status(400).json({
            //         error : 'Use jpeg or png or jpg Images'
            //     })
            // }
            product.images.data = fs.readFileSync(files.images.path)
            product.images.contentType = files.images.type
        }

        product.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    error : errorHandler(err)
                })
            }
            res.json(result);
        })
    })
}

exports.productById = (req, res, next, id) => {
    Product.findById(id)
    .populate('category')
    .exec((err, product) => {
        if(err || !product) {
            return res.status(400).json({
                error : "product not found"
            });
        }
        req.product = product;
        next();
    });
};

exports.remove = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if(err) {
            return res.status(400).json({
                error : errorHandler(err)
            })
        }
        res.json({
            message:"Product Deleted successfully"
        })
    })
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error : 'Image Upload Failed'
            })
        }
        // const { name, description, price, category, shipping, quantity, images} = fields
        //
        // if( !name || !description || !price || !category || !shipping || !quantity || images) {
        //     return res.status(400).json({
        //         error : 'All Fields are required'
        //     })
        // }

        let product = req.product;
        product = _.extend(product, fields);

        if(files.images) {
            console.log("Files Image ", files.images);
            if(files.images.size > 1000000) {
                return res.status(400).json({
                    error : 'Image size is too large! Make it less than 1mb'
                })
            }

            product.images.data = fs.readFileSync(files.images.path)
            product.images.contentType = files.images.type
        }

        product.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    error : errorHandler(err)
                })
            }
            res.json(result);
        })
    })
}

/*
-> sell / arrival
-> by sell = /products?sortBy=sold&order=desc&limit=4
-> by arrival = /products?sortsBy=createdAt&order=desc&limit=4
-> if no params are sent, then all products are returned
*/

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    Product.find()
        .select("-images")
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if(err) {
                return res.status(400).json({
                    error : "product not nd"
                })
            }
            res.json(products);
        })
}

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 5

    Product.find({_id: {$ne: req.product}, category: req.product.category })
        .limit(limit)
        .populate("category", "_id name")
        .exec((err, products) => {
            if(err) {
                return res.status(400).json({
                    error : "product not nd"
                })
            }
            res.json(products);
        })
}

exports.listCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if(err) {
            return res.status(400).json({
                error : "Categories Not Found"
            })
        }
        res.json(categories);
    })
}

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-images")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.image = (req, res, next) => {
    if(req.product.images.data) {
        res.set("Content-Type", req.product.images.contentType);
        return res.send(req.product.images.data);
    }
    next();
}

exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    let query = {}
    // assign search value to query.name
    if(req.query.search) {
        query.name = {$regex: req.query.search, $options: 'i'}
        // assign category value to query.category
        if(req.query.category && req.query.category != 'All') {
            query.category = req.query.category
        }

        // find the product based on query object with 2 properties
        // search and category
        Product.find(query, (err, products) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(products)
        }).select('-images')
    }
}

exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map(item => {
        return {
          updateOne: {
            filter: { _id: item._id },
            update: { $inc: { quantity: -item.count, sold: +item.count }}
          }
        };
    });

    Product.bulkWrite(bulkOps, {}, (error, products) => {
      if(error) {
        return res.status(400).json({
           error: "Could not update Product"
        })
      }
      next();
    })
}
