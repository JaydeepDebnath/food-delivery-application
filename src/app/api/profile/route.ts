import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET (request:Request){
  await dbConnect()
  const {id} = await request.json()
  const session = await getServerSession(authOptions)
  const user : User = session?.user as User

  if(!session || !user){
    return Response.json({
      message:"Not Authenticated",
    },{status:401})
  }

  try {
    const UserProfile = await UserModel.findById(id)
    
    if (!UserProfile) {
    return Response.json({
      message: 'User not found',
      status: 'Error'
    }, { status: 404 });
  }

    return Response.json({
      message:'User fetched successfully',
      status:'Success',
      data:UserProfile,
    },{status:200})      
  } catch (error) {
     return Response.json({
      message: 'Failed to fetch user',
      success:false,
    }, {status:500});   
  }
}