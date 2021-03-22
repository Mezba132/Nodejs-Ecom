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
    Product.findById(id).exec((err, product) => {
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
        const { name, description, price, category, shipping, quantity, images} = fields

        if( !name || !description || !price || !category || !shipping || !quantity || images) {
            return res.status(400).json({
                error : 'All Fields are required'
            })
        }

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

