const Product = require("../models/product")
const formidable = require("formidable");
//const _ = require("loadash");
const fs = require('fs');


exports.productById =(req,res,next,id)=>{
    Product.findById(id).exec((err,product)=>{
        if(err || !product){
            return res.status(400).json({
                error:`${err}`
            });
        }
        req.product = product
        // req.param.id = {_id:req.param.id};
        next();
    })
}


exports.read =(req,res)=>{
    req.product.photo = undefined
    return res.json(req.product)
}


exports.create = (req,res)=>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error:'image could not uploaded'
            })
        }

        // check for all fields /*
        const {name,description,price,category,quantity,shipping}= fields
       /*  
        if(!name || !description || !price || category || !quantity || !shipping){
            return res.status(400).json({
                error:'All fields are mandatory'
            })
        }*/
        

        let product = new Product(fields)

        if(files.photo){
           // image validation to a limit size
           /*
            if(files.photo.size > 10000000){
                return res.status(400).json({
                    error:"image should be less than 1MB"
                })
            }*/
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }
        product.save((err,result)=>{
            if(err){
                return res.status(400).json({
                    error: `error -> ${err}`
                })
            }
            res.json(result);
        })
        
    })
};

exports.remove =(req,res)=>{
    let product = req.product
    product.remove((err,deletedProduct)=>{
        if(err){
            return res.status(400).json({
                error:"product not deleted"
            });
        }
        res.json({
            message: 'Product deleted succesfully'
        })
    })
}


    exports.update = (req,res)=>{
            let form = new formidable.IncomingForm()
            form.keepExtensions = true
            form.parse(req,(err,fields,files)=>{
                if(err){
                    return res.status(400).json({
                        error:'image could not uploaded'
                    })
                }
        
                // check for all fields /*
                const {name,description,price,category,quantity,shipping}= fields
                 /*
                if(!name || !description || !price || category || !quantity || !shipping){
                    return res.status(400).json({
                        error:'all fields are mandatory'
                    })
                }
                */
                
               
                let product = req.product
                //product = _.merge(product,fields)
                
                    product.update(req.param.id,req.body)
                    .then(doc=>{
                        if(!doc){
                            return res.status(400).end();
                        }
                        else{
                            return res.status(200).json(doc);
                            console.log(doc);
                        }
                        
                    })
                    .catch(err=> next(err));



        
                if(files.photo){
                   // image validation to a limit size
                   /*
                    if(files.photo.size > 10000000){
                        return res.status(400).json({
                            error:"image should be less than 1MB"
                        })
                    }*/
                    product.photo.data = fs.readFileSync(files.photo.path)
                    product.photo.contentType = files.photo.type
                }
                product.save((err,result)=>{
                    if(err){
                        return res.status(400).json({
                            error: `error -> ${err}`
                        })
                    }
                    res.json(result);
                })
                
            })
        };

        exports.list = (req,res)=>{
            let order = req.query.order ? req.query.order : 'asc'
            let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
            let limit = req.query.limit ? parseInt(req.query.limit) : 6

            Product.find()
                    .select("-photo")
                    .populate('category')
                    .sort([[sortBy,order]])
                    .limit(limit)
                    .exec((err,products)=>{
                        if(err){
                            return res.status(400).json({
                                error:'product not found'
                            })
                        }
                        res.json(products)
                    })
        }

        exports.listCategories = (req,res)=>{
            Product.distinct('category',{},(err,category)=>{
                if(err){
                    return res.status(400).json({
                        error:'category not found'
                    })
                }
                res.json(category);
            })
        }


        /**
         * 
         * it will return product in the req product category
         * other products that has same category will be returned
         */
        exports.listrelated =(req,res)=>{
            let limit = req.query.limit ? parseInt(req.query.limit) :6 ;
            Product.find({_id:{$ne: req.product},category:req.product.category})
            .limit(limit)
            .populate('category','_id name')
            .exec((err,products)=>{
                if(err){
                    return res.status(400).json({
                        error: 'product not found'
                    })
                }
                res.json(products)
            })
        }

        /**
         * sell / arrival
         * by sell = /products?sortBy=sold&order=desc&limit=4
         * by arrival = /products?sortBy=createdAt&order=desc&limit=4
         * if no params are sent,then all product are returned
         * 
         * 
         */






        /**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
 
// route - make sure its post
 
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

exports.photo = (req,res,next)=>{
    if(req.product.photo.data){
        res.set('Content-Type',req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
};