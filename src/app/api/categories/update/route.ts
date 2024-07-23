import CategoryModel from "@/model/CategoryModel";
import { NextApiRequest,NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { UserType } from "@/model/UserModel";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";


export async function PUT(request:NextApiRequest,response:NextApiResponse){
 try {
  await dbConnect();
  const {id,title} = await request.body;
  const session = await getServerSession(authOptions)
  const user : User = session?.user as User;

  if(!session || !user){
    return Response.json({
      message:"Not Authenticated",
    },{status:401})
  }
  if(user.role !== UserType.Admin){
    return Response.json({
      success:true,
      message:"User type must be Admin"},
      {status:403})
  }

  const updateCategory = await CategoryModel.findByIdAndUpdate(id,{title},{new:true})
  return Response.json({
    message:"Category updated successfully",
    success:true,
  },{status:200})   
 } catch (error) {
   console.error("Failed to create category")
   return Response.json({
   message:"Failed to Update category",
   success:false
   },{status:500})              
 }
}