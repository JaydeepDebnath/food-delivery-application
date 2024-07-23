import OrderModel from "@/model/OrderModel";
import { NextApiRequest,NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";


export async function GET(request:NextApiRequest){
 try {
  await dbConnect();
  const session = await getServerSession(authOptions)
  const user : User = session?.user as User;

  if(!session || !user){
    return Response.json({
      message:"Not Authenticated",
    },{status:401})
  }

  const orders = await OrderModel.find()
  return Response.json({
    message:"Order fatched successfully",
    success:true,
  },{status:200})   
 } catch (error) {
   console.error("Failed to fetch all orders")
   return Response.json({
   message:"Failed to fetch all orders",
   success:false
   },{status:500})              
 }
}