import OrderModel from "@/model/OrderModel";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextApiRequest, NextApiResponse} from "next";
import { getServerSession } from "next-auth";
import ProductModel from "@/model/ProductModel";
import { PaymentType } from "@/model/OrderModel";
import { handleCreditCardPayment,handelUPIPayment } from "@/helpers/paymentMethod";
import dbConnect from "@/lib/dbConnect";


export async function POST (request:NextApiRequest,response:NextApiResponse){
  await dbConnect();
  const { customer,address,quantity,paymentMethod,productId} = await request.body;
  const session = await getServerSession(authOptions);
  const user : User = session?.user as User

  if(!session || !user){
    return Response.json({
     success:false,
      message:"Not Authenticated"
    },{status:404})
  }
  try {

    const product = await ProductModel.findById(productId);

    if (!product) {
      return Response.json({
        message: 'Product not found',
        success: false,
      },{status:404});
    }

    const newOrder = await OrderModel.create({
      customer,
      address,
      item:productId,
      quantity,
      paymentMethod,
    })
    if(!newOrder){
      return Response.json({
       message:'Error occured while ordering product',
       success: false,
      },{status:404})
    }
    await newOrder.save();

    let paymentResult;
    if(paymentMethod === PaymentType.Card){
      const amount = calculateOrderAmount(product.prices,quantity);
      paymentResult = await handleCreditCardPayment(amount,request.body.stripePaymentMethod,response)
    }else if (paymentMethod === PaymentType.UPI){
      const amount = calculateOrderAmount(product.prices,quantity);
      paymentResult = await handelUPIPayment(amount,newOrder._id,response);
    }else if (paymentMethod === PaymentType.Cash){
      const amonut = calculateOrderAmount(product.prices,quantity);
      return Response.json({
        amonut,
      })
    }else {
      return Response.json({
        message:'Unsupported payment method',
        success:false,
      },{status:200})
    }

    if(paymentResult.status == 200){
      return Response.json({
        message:'Order placed and payment successful',
        success:true,
        orderId : newOrder._id,
        paymentDetails : paymentResult.stripePayment || paymentResult.payment,
      },{status:200})
    }else {
      return Response.json({
        success:false,
        message:'Payment failed'
      },{status:404})
    }
  } catch (error) {
    console.error('Error occured while ordering product') 
    return Response.json({
     message:'Error occured while ordering product',
     success: false,
     },{status:404})           
  }
}

function calculateOrderAmount(quantity:number,price:number){
  return price*quantity;
}