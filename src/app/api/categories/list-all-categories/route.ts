import CategoryModel from "@/model/CategoryModel";
import { NextApiRequest,NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function GET(request:Request,response:NextApiResponse){
 try {
  await dbConnect();
  const session = await getServerSession(authOptions)
  const user : User = session?.user as User;

  if(!session || !user){
    return Response.json({
      message:"Not Authenticated",
    },{status:401})
  }

  const categories = await CategoryModel.find()
  return Response.json({
    message:"Categories fatched successfully",
    success:true,
  },{status:200})   
 } catch (error) {
   console.error("Failed to fetch all categories")
   return Response.json({
   message:"Failed to fetch all categories",
   success:false
   },{status:500})              
 }
}