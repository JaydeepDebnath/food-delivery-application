import mongoose,{Schema,Document} from "mongoose";
export enum UserType {
 Seller = "seller",
 Buyer = "buyer",
 Admin = "admin"
}

export interface User extends Document{
 username : string,
 role:UserType,
 fullname : string,
 contactNumber : Number,
 email : string,
 location : string,
 password : string,
 verifyCode : string;
 verifyCodeExpiry:Date;
 isVerified: boolean;
}

const UserSchema : Schema<User> = new mongoose.Schema({
 username:{
 type : String,
 required : [true, 'Username is required'],
 trim: true,
 unique: true,
 },
 role:{
  type:String,
  enum:Object.values(UserType),
 },
 fullname:{
 type : String,
 required: [true, 'Fullname is required'],
 trim: true,
 },
 contactNumber:{
 type : Number,
 required: [true, 'Contact Number is required'],
 unique:true,
 trim : true,
 },
 email: {
  type: String,
  required: [true, 'Email is required'],
  unique: true,
  match: [/.+\@.+\..+/, 'Please use a valid email address'],
 },
 location: {
  type : String,
  required : true,
  default : null,
 },
 verifyCode: {
  type: String,
  required: [true, 'Verify Code is required'],
 },
 verifyCodeExpiry: {
  type: Date,
  required: [true, 'Verify Code Expiry is required'],
 },
 isVerified: {
  type: Boolean,
  default: false,
  },
});

const UserModel = 
  (mongoose.models.User as mongoose.Model<User>) || 
  mongoose.model<User>('User',UserSchema);

export default UserModel;