import mongoose,{Schema,Document} from "mongoose";
import { Category } from "./CategoryModel";

export interface Product extends Document{
 title:string,
 description:string,
 prices:number,
 category:Category,
 img:string,
}

const ProductSchema:Schema<Product> = new Schema({
 title:{
  type: String,
  required:true,
 },
 description:{
  type:String,
  required:true,
 },
 prices:{
  type : Number,
  required : true,
 },
 category:{
  type : Schema.Types.ObjectId,
  ref:'Category',
  required : true,
 },
 img:{
  type:String,
  required:true,
 },
});


const ProductModel = 
  (mongoose.models.Product as mongoose.Model<Product>) || 
  mongoose.model<Product>('Product',ProductSchema);

export default ProductModel;