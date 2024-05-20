import categoryModel from '../../../DB/model/category.model.js'
import cloudinary from '../../utls/cloudinary.js';
import slugify from 'slugify';
export const create =async (req, res) => {
    req.body.name =req.body.name.toLowerCase();
    if(await categoryModel.findOne({ name:req.body.name})){
        return res.status(409).json({ message: "category already exist" });
        }
        req.body.slug =slugify(req.body.name);
        const {secure_url ,public_id}=await cloudinary.uploader.upload(req.file.path,
            {folder:'tshop5/categories'
            });
            req.body.image ={secure_url ,public_id};
            const category = await categoryModel.create(req.body);
            return res.json({ message:category });
}
export const getAll = async (req, res) => {
    const categories = await categoryModel.find({});
    return res.status(200).json({message:"success" ,categories});
}
export const getActive = async (req, res) => {
    const categories = await categoryModel.find({status: "Active"}).select("name");
    return res.status(200).json({message:"success" ,categories});
}

export const getDetails = async (req, res) => {
    const category = await categoryModel.findById(req.params.id);
    return res.status(200).json({message:"success" ,category});
}
export const update= async (req, res) => {
    const category = await categoryModel.findById(req.params.id);
    if (!category){
        return res.status(404).json({ message: "category not found" });
    }
    if(await categoryModel.findOne({name:req.body.name,_id:{$ne: req.params.id}})){
    return res.status(409).json({ message: "name already exists" });
    }
    category.slug = slugify(req.body.name);
    if(req.file){  
    const {secure_url ,public_id}=await cloudinary.uploader.upload(req.file.path,{
        folder:'tshop5/categories'
    });
    cloudinary.uploader.destroy(category.image.public_id);
    category.image={secure_url,public_id};
}
    category.status = req.body.status;
    await category.save();
    return res.json({message:"success", category});
}
export const destory = async (req, res) => {
    const category = await categoryModel.findByIdAndDelete(req.params.id);
    if (!category){
        return res.status(404).json({ message: "category not found" });
    }
    await cloudinary.uploader.destroy(category.image.public_id);
    return res.status(200).json({message:"success", category});
}
