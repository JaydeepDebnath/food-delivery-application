import CategoryModel from "@/model/CategoryModel";
import { NextApiRequest} from "next";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { UserType } from "@/model/UserModel";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";


export async function DELETE(request:NextApiRequest){
 try {
  await dbConnect();
  const {id} = request.query;
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

  const deletedCategory = await CategoryModel.findByIdAndDelete(id)
  if (!deletedCategory) {
    return Response.json({ success: false, message: "Category not found" },{status:403});
    }

  return Response.json({
    message:"Category deleted successfully",
    success:true,
  },{status:200})   
 } catch (error) {
   console.error("Failed to delete category")
   return Response.json({
   message:"Failed to delete category",
   success:false
   },{status:500})              
 }
}