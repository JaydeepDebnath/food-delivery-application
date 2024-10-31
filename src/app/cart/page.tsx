'use client'

import { CartContext,cartProductPrice } from "@/components/AppContext"
import Trash from "@/components/icons/Trash"
import CartProduct from "@/components/menu/CartProduct"
import { UserProfile } from "@/components/UserProfile"
import axios from "axios"
import Image from "next/image"
import { useContext,useEffect,useState } from "react"
import { toast, useToast } from "@/components/ui/use-toast"
import { AxiosError } from "axios"


export default function CartPage(){
  const {cartProducts,removeCartProduct}:any = useContext(CartContext);
  const [address,setAddress] = useState({})
  const data = UserProfile();
  const {toast} = useToast()
  useEffect(() => {
    if(typeof window!== 'undefined'){
      if(window.location.href.includes('canceled=1')){
        toast({
          title:'Failed',
          description:'Payment failed',
          variant:'destructive'
        })
      }
    }
  },[])
 let total = 0
 for(const p of cartProducts){
   total += cartProductPrice(p)
 }

   function handleAddressChange(propName, value) {
    setAddress(prevAddress => ({...prevAddress, [propName]:value}));
  }

  async function proceedToOredr(e: React.FormEvent<HTMLFormElement>){
   e.preventDefault()
   try {
      const orderData = {
        customer:data,
        address:JSON.stringify(address),
        item:cartProducts.map(product => ({
          id:product.id,
          name:product.name,
          price:product.price,
        }))
        quantity:cartProducts.lenght,
      }
      const response = await axios.get('/api/order/create')
      toast({
           title:'Success',
           description:'Preparing your order.../n Redirecting to payment...',
         }) 
      return response.data;
   } catch (error) {
         const axiosErros = error as AxiosError;
         toast({
                  title:'Failed',
                  description:axiosErros.message,
                  variant:'destructive'
         })         
   }
  }

  if(cartProducts?.length === 0){
   return(
    <section className='mt-8 text-center'>
      <p>Your cart is empty.</p>
    </section>
   )
  }

  return(
  <section className="mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Cart" />
      </div>
      <div className="mt-8 grid gap-8 grid-cols-2">
        <div>
          {cartProducts?.length === 0 && (
            <div>No products in your shopping cart</div>
          )}
          {cartProducts?.length > 0 && cartProducts.map((product: Product) => (
            <CartProduct
              key={product.id}
              product={product}
              onRemove={removeCartProduct}
            />
          ))}
          <div className="py-2 pr-16 flex justify-end items-center">
            <div className="text-gray-500">
              Subtotal:<br />
              Delivery:<br />
              Total:
            </div>
            <div className="font-semibold pl-2 text-right">
              ${subtotal.toFixed(2)}<br />
              $5<br />
              ${(subtotal + 5).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2>Checkout</h2>
          <form onSubmit={proceedToCheckout}>
            <AddressInputs
              addressProps={address}
              setAddressProp={handleAddressChange}
            />
            <button type="submit">Pay ${subtotal + 5}</button>
          </form>
        </div>
      </div>
    </section>
  );
}