import OrderModel from "@/model/OrderModel";
import { NextApiRequest,NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";


export async function PUT(request:NextApiRequest,response:NextApiResponse){
 try {
  await dbConnect();
  const {id,customer,address,productId,quantity} = await request.body;
  const session = await getServerSession(authOptions)
  const user : User = session?.user as User;

  if(!session || !user){
    return Response.json({
      message:"Not Authenticated",
    },{status:401})
  }

  const updatedOrder = await OrderModel.findByIdAndUpdate(id,
   {customer,
    address,
    item:productId,
    quantity},
    {new:true})

  if (!updatedOrder) {
    return Response.json({
     success: false,
     message: 'Order not found'
    },{status:404});
    }
  return Response.json({
    message:"Order updated successfully",
    success:true,
  },{status:200})   
 } catch (error) {
   console.error("Failed to Update order")
   return Response.json({
   message:"Failed to Update order",
   success:false
   },{status:500})              
 }
}