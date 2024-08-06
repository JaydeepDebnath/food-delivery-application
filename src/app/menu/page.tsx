'use client'

import MenuItem from "@/components/menu/MenuItems"
import { Category } from "@/model/CategoryModel"
import { useState,useEffect } from "react"
import axios, { Axios, AxiosError } from "axios"
import { Toast } from "@/components/ui/toast"

export default function MenuPage(){
 const [categories,setCategories] = useState<Category []>([])
 const [menuItems,setMenuItems] = useState([])
 const toast = Toast

 useEffect(()=>{
  fetchCategories()
 },[]
)

async function fetchCategories (){
 try {
   const response = await axios.get('/api/categories/list-all-categories')
   setCategories(response.data)
   toast({
   title:'Fetched categories',
   description:response.data
    })
   return response.data;        
 } catch (error) {
  const axiosError = error as AxiosError;
  toast({
   title:'Failed to fetch categories',
   description:axiosError.message
  })
 }
}
}