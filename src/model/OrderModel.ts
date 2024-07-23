import mongoose,{Schema,Document} from "mongoose";
import { Product } from "./ProductModel";
import { UserType } from "./UserModel";

export enum PaymentType {
  Cash = "cash",
  Card = "credit_card",
  UPI = 'upi'
 }

 export interface Payment{
  amonut:number,
  method:PaymentType,
  currency:string,
  status: 'pending'| 'completed' | 'failed'
 }

export interface Order extends Document{
 _id:string,
 customer:UserType,
 address:string,
 item:Product,
 quantity:number,
 status:boolean,
 paymentMethod:string,
 payment:Payment,
 createdAt:Date
}

const OrderSchema:Schema<Order> = new Schema({
 customer:{
  type: String,
  required:true,
 },
 address:{
  type:String,
  required:true,
 },
 item:{
  type : mongoose.Types.ObjectId,
  ref:'Product',
  required : true,
 },
 quantity:{
  type : Number,
  required : true,
 },
 status:{
  type:Boolean,
  default:null,
 },
 paymentMethod:{
  type : String,
  required:true,
 },
 payment:{
  type:Object,
  default:null,
 },
 createdAt:{
  type : Date,
  required : true,
  default : Date.now()
 }
});


const OrderModel = 
  (mongoose.models.Order as mongoose.Model<Order>) || 
  mongoose.model<Order>('Order',OrderSchema);

export default OrderModel;