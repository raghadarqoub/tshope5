import mongoose ,{ model, Schema, Types} from "mongoose";
const categorySchema = new Schema({
    categoryName: { 
        type: String,
        required: true,
    },
    slug:{
    type: String,
    required: true,
    },
    image:{
        type: Object,
    },
    status:{
        type: String,
        default: 'Active',
        enum: ["Active", "NotActive"],
    },
    createdBy:{
        type: Types.ObjectId,ref:'User',required:true
    },
    updatedBy:{
        type: Types.ObjectId,ref:'User',required:true  
    },
},
{
    timestamps: true,
});

const categoryModel = model("Category", categorySchema);

export default categoryModel;