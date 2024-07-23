import { NextApiRequest } from "next";
import ProductModel from "@/model/ProductModel";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { UserType } from "@/model/UserModel";
import dbConnect from "@/lib/dbConnect";

export async function POST(request:NextApiRequest){
  await dbConnect();
  const { title,description,prices,categoryId,img} = await request.body
  const session = await getServerSession(authOptions)
  const user : User = session?.user as User;

  if(!session || !user){
    return Response.json({
     success:false,
      message:"Not Authenticated"
    },{status:400})
  }
  if(user.role !== UserType.Admin && user.role !== UserType.Seller){
    return Response.json({
      message:"Product can only create by a Admin or Seller",
      success:true,
    },{status:403})
  }
  try {
     const newProduct = await ProductModel.create({
        title,
        description,
        prices,
        category:categoryId,
        img,
     }) 
     await newProduct.save();
     
     return Response.json({
     message:"Product created successfully",
     success:true,
     productId : newProduct._id,
     },{status:200})
  } catch (error) {
    console.error("Failed to create Product")
    return Response.json({
      message:"Failed to create Product",
      success:false
    },{status:500})           
  }
}