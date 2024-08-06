'use client'

import { Button } from "../ui/button"
export default function AddToCartBtn ({hasSizesOrExtras, onClick, basePrice}:any){
 return (
  <div className="mt-4">
   {!hasSizesOrExtras ? (
    <Button
    type="button"
    onClick={onClick}
    className="bg-blue-600 text-white rounded-full px-8 py-2"
    >
                  Add to cart${basePrice}
    </Button>
   ):(
    <Button
    type="button"
    onClick={onClick}
    className="bg-green-600 text-white rounded-full px-8 py-2"
    >
                  Add to cart(`from ${basePrice}`)
    </Button>
   )}
  </div>
 )
}