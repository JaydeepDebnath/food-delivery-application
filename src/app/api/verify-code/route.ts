import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";

export async function POST (request:Request){
 await dbConnect()

 try {
   const {username,code} = await request.json()
   const decodedUsername = decodeURIComponent(username)
   const user = await UserModel.findOne({username:decodedUsername})

   if(!user){
    return Response.json({
      message:'User not found',
      success:false,
    },{status:404})
   }

   const isCodeValid = user.verifyCode == code
   const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
   if(isCodeValid && isCodeNotExpired){
      user.isVerified = true
      await user.save()
      return Response.json({
         success:true,
         message:"Account verified successfully"
        },{status:200})  
   }else if(!isCodeNotExpired){
     return Response.json({
        success:false,
        message:"Verification code expired"
        },{status:400}) 
   }else {
     return Response.json({
       success:false,
       message:"Incorrect verification code"
       },{status:400}) 
  }
 } catch (error) {
   console.log('Error verifyig User',error)
   return Response.json({
     message:'Error verifyig User',
     success:false,
   },{status:500})           
 }
}