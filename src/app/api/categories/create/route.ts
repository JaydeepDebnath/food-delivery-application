import CategoryModel from "@/model/CategoryModel";
import { NextApiRequest,NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { UserType } from "@/model/UserModel";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";

export async function POST(request:NextApiRequest,response:NextApiResponse){
  await dbConnect();
  const {title} = await request.body;
  console.log(request.body)
  const session = await getServerSession(authOptions)
  const user : User = session?.user as User;

  if(!session || !user){
    return Response.json({
     success:false,
      message:"Not Authenticated"
    },{status:400})
  }
  if(user.role !== UserType.Admin){
    return Response.json({
      success:true,
      message:"User type should be Admin"},
      {status:403})
  }
  try {
     const newCategory = await CategoryModel.create({title});
     await newCategory.save();
         
     return Response.json({
     message:"Category created successfully",
     categordId:newCategory._id,
     success:true,
     },{status:200})
  } catch (error) {
    console.error("Failed to create category")
    return Response.json({
      message:"Failed to create category",
      success:false
    },{status:500}) 
  }
}