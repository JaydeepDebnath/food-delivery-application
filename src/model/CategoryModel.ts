import mongoose,{Schema,Document} from "mongoose";

export interface Category extends Document{
title:string,
}

const CategorySchema:Schema<Category> = new Schema({
 title:{
   type : String,
   required: true,
 }
})

const CategoryModel = 
  (mongoose.models.Category as mongoose.Model<Category>) || 
  mongoose.model<Category>('Category',CategorySchema);

export default CategoryModel;