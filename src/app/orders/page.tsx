'use client'

import axios,{AxiosError} from "axios"
import { useState,useEffect } from "react"
import Link from "next/link"
import { UserProfile } from "@/components/UserProfile"
import { toast } from "@/components/ui/use-toast"
import { Order  } from "@/model/OrderModel"


export default function (){
   const [orders,setOrders] =useState<Order[]>([])
   const [loadingOrders,setLoadingOrders] = useState(true)
   const profile = UserProfile()

   useEffect(() => {
     fetchOrders()
   },[])

   async function fetchOrders(){
     setLoadingOrders(true)
      try {
         const response = await axios.get('/api/order/create')
         setOrders(response.data)
         return response.data
      } catch (error) {
         const axiosError = error as AxiosError;
         toast({
           title:'Error',
          description:axiosError.message,
         })       
      }
   }
   return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Your Orders</h1>
        {loadingOrders ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id} className="py-4">
                <Link href={`/orders/${order.id}`}>
                  <a className="text-blue-600 hover:underline">
                    Order #{order.id}
                  </a>
                </Link>
                {/* Render other order details here */}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
}