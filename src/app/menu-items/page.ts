'use client'

import Right from '@/components/icons/Right'
import { UserProfile } from '@/components/UserProfile'
import { Product } from '@/model/ProductModel'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useState,useEffect } from 'react'
import { AxiosError } from 'axios'
import { toast } from '@/components/ui/use-toast'

export default async function MenueItemsPage(){
  const [menuItems,setMenuitems] = useState<Product[]>([])
  const {loading,data}:any = UserProfile()

  useEffect(() => {
  }, []);
  
  async function fetchMenuItems(){
    try {
      const response = await axios.get('/product/list-all-products')
   
      if(loading){
        return 'Loading user data...'
      }
      if(!data.UserType.Admin){
        return Response.json({
          message:'user not an admin'
        },{status:400})
      }
      setMenuitems(response.data)
      return response.data    
     } catch (error) {
       const axiosError = error as AxiosError;
       toast({
         title:'Failed',
         description:axiosError.message
       });               
     }
  }
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Menu Items</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.length === 0 ? (
            <p className="text-gray-600 text-center col-span-3">No menu items found.</p>
          ) : (
            menuItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Link href={`/menu/${item.id}`}>
                  <a className="block">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">{item.name}</h2>
                      <p className="text-gray-600">{item.description}</p>
                      <p className="text-gray-800 mt-2">${item.price.toFixed(2)}</p>
                    </div>
                  </a>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}