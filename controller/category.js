const Category = require('../models/category');


exports.categoryById =(req,res,next,id)=>{
    Category.findById(id).exec((err,category)=>{
        if(err || !category){
            return res.status(400).json({
                error: 'we get error in fetching category'
            })
        }
        req.category = category
        next();
    });
};


exports.create = (req,res)=>{
    const category = new Category(req.body)
    category.save((err,data)=>{
        if(err){
            return res.status(400).json({
                error: `we got error ${err}`
            });
        }
        res.json({data});
    })
}


exports.read = (req,res)=>{
    return res.json(req.category);
}





exports.update =(req,res)=>{
    const category = req.category
    category.name = req.body.name
    category.save((err,data)=>{
        if(err){
            return res.status(400).json({
                error:'error while updating '
            })
        }
        res.json(data);
    })
}

exports.remove =(req,res)=>{
    const category = req.category
    
    category.remove((err,data)=>{
        if(err){
            return res.status(400).json({
                error:'error while updating '
            })
        }
        res.json({
            message:'category deleted'
        })
    });
};


exports.list =(req,res)=>{
    Category.find().exec((err,data)=>{
        if(err){
            return res.status(400).json({
                error:'error while finding data'
            });
        }
        res.json(data);
    })
}