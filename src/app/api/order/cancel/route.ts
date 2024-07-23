import OrderModel from "@/model/OrderModel";
import { NextApiRequest} from "next";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";

export async function DELETE(request:NextApiRequest){
 try {
  await dbConnect();
  const {id} = await request.body;
  const session = await getServerSession(authOptions)
  const user : User = session?.user as User;

  if(!session || !user){
    return Response.json({
      message:"Not Authenticated",
    },{status:401})
  }

  const canceledOrder = await OrderModel.findByIdAndDelete(id)
  if (!canceledOrder) {
    return Response.json({ success: false, message: "Order not found" },{status:403});
    }

  return Response.json({
    message:"Order deleted successfully",
    success:true,
  },{status:200})   
 } catch (error) {
   console.error("Failed to delete order")
   return Response.json({
   message:"Failed to delete order",
   success:false
   },{status:500})              
 }
}