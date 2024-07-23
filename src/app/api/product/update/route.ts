import ProductModel from "@/model/ProductModel";
import { NextApiRequest,NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { UserType } from "@/model/UserModel";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";


export async function PUT(request:NextApiRequest,response:NextApiResponse){
 try {
  await dbConnect();
  const {id,title,description,prices,categoryId,img,} = await request.body;
  const session = await getServerSession(authOptions)
  const user : User = session?.user as User;

  if(!session || !user){
    return Response.json({
      message:"Not Authenticated",
    },{status:401})
  }
  if(user.role !== UserType.Admin && user.role !== UserType.Seller){
    return Response.json({
      success:true,
      message:"User type must be Admin or Seller"},
      {status:403})
  }

  const updatedProduct = await ProductModel.findByIdAndUpdate(id,
   {title,
    description,
    prices,
    categoryId,
    img},
    {new:true})

  if (!updatedProduct) {
    return Response.json({
     success: false,
     message: 'Product not found'
    },{status:404});
    }
  return Response.json({
    message:"Product updated successfully",
    success:true,
  },{status:200})   
 } catch (error) {
   console.error("Failed to Update product")
   return Response.json({
   message:"Failed to Update Product",
   success:false
   },{status:500})              
 }
}