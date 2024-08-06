import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import { User as UserInfo } from "@/model/UserModel";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function PUT(req:Request){
 await dbConnect()
 const data = await req.json()
 const {_id, username,fullname,contactNumber} = data;

 let filtered = {};
 if(_id){
  filtered = {_id}
 }
 else {
  const session = await getServerSession(authOptions)
  const email = session?.user.email;
  filtered = {email}
 }

 const user = await UserModel.findOne(filtered);
 await UserModel.updateOne(filtered,{username,fullname,contactNumber});
 await UserModel.findOneAndUpdate({email:user?.email})
 return Response.json({
  message: 'User data Updated',
  success:false,
}, {status:200});

}

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