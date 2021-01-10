const mongoose = require('mongoose');
const Product = mongoose.model("ecomProduct");
const {errorHandler} = require('../helpers/dbErrorHandler');
const formidable = require('formidable')
const _ =require('lodash')
const fs = require('fs');



exports.list = (req,res)=>{
    let order = req.query.order ? req.query.order : "asc"
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,order]])
    .limit(limit)
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({
                error: "Products not found"
            })
        }
        res.json(products)
    })
}

exports.productById = (req,res,next,id)=>{
    Product.findById(id).exec((err,product)=>{
        if(err || !product){
            return res.status(400).json({
            error:"Product not found!"
        })
    }

    req.product = product
    next();
    })
}


exports.remove =(req,res)=>{
    let product = req.product
    product.remove((err,removed)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
           
            "message":"Product removed successfully!"
        })
    })
}





exports.read=(req,res)=>{
    req.product.photo = undefined;
    return res.json(req.product);
}

exports.create =(req,res)=>{
    const form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error: 'Image upload Failed'
            })
        }

        const {name,description,price,category,quantity,shipping} = fields

        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error: "Enter all fields"
            })
        }

        let product =  new Product(fields)
        if(files.photo){

            product.photo.data= fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type 
        }
        product.save((err,result)=>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result)
        })
    })
}

exports.update =(req,res)=>{
    const form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error: 'Image upload Failed'
            })
        }

        

        let product =  req.product ;
        product = _.extend(product, fields);

        if(files.photo){

            product.photo.data= fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type 
        }
        product.save((err,result)=>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result)
        })
    })
}


exports.related =(req,res)=>{
    let limit= req.query.limit ? parseInt(req.query.limit) : 6

    Product.find({_id : {$ne: req.product}, category: req.product.category})
    .limit(limit)
    .populate('category','_id name')
    .exec((err,product)=>{
        if(err){
            return res.status(400).json({
                err:"Products not found"
            })
        }
        res.json(product)
    })
}


exports.listCategories=(req,res)=>{
    Product.distinct("category",{},(err,categories)=>{
        if(err){
            return res.status(400).json({
                err:"Categories not found"
            })
        }
        res.json(categories)
    })
}




exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    for (let i in req.body.filters) {
        if (req.body.filters[i].length > 0) {
            if (i === "price") {
               
                findArgs[i] = {
                    $gte: req.body.filters[i][0],
                    $lte: req.body.filters[i][1]
                };
            } else {
                findArgs[i] = req.body.filters[i];
            }
        }
    }
Product.find(findArgs)
        .select("-photo")
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

exports.photo=(req,res,next)=>{

    if(req.product.photo.data){
        res.set('Content-Type',req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}