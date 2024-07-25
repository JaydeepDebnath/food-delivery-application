import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import * as z from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema =z.object({
username:usernameValidation,
})

export async function POST(request:Request){
  await dbConnect();
  try {
    const {searchParams} = new URL(request.url)
    const queryParams = {
      username:searchParams.get('username')
    }

    const result = UsernameQuerySchema.safeParse(queryParams)

    if(!result.success){
       const userNameErrors = result.error.format()
       .username?._errors || [];

       return Response.json({
         message:userNameErrors?.length > 0
         ? userNameErrors.join(', ')
         : 'Invalid query parameters',
         success:false,
       },{status:404})
    }

    const {username} = result.data;

    const existingVerifiedUser = await UserModel.findOne({
       username,
       isVerified:true,
    })

    if(existingVerifiedUser){
       return Response.json({
          message:'Username already taken',
          success:false,
       },{status:400})
    }

    return Response.json({
      message:'Username is Unique',
      success:true,
    },{status:200})
                  
  } catch (error) {
      console.error('Error checking username',error)
      return Response.json({
         success:false,
         message:"Error checking username"
        },{status:500})           
  }
}