'use client'

import { CartContext } from "../AppContext"
import MenuItemTitle from '@/components/menu/MenuItemTitle'
import Image from "next/image"
import { useContext,useState } from "react"
import { Button } from "../ui/button"
import { Toast } from "../ui/toast"
import { resolve } from "path"

export default function MenuItem(MenuItem:any){
 const {img, title,description,prices,category,sizes = [], extraIngredientPrices = []} = MenuItem;
 const [selectedSize,setSelectedSize] = useState(sizes?.[0] || null)
 const [selectedExtras,setSelectedExtras] = useState([])
 const [showPopup,setShowPopup] = useState(false)
 const {addToCart} = useContext(CartContext);


 async function handleAddToCartBtn (){
  console.log('add to cart')
  const hasOptions = sizes.length > 0 || extraIngredientPrices.length > 0;
  if(hasOptions && !showPopup){
    setShowPopup(true)
    return;
  }
  addToCart(MenuItem, selectedSize, selectedExtras);
  await new Promise(resolve => setTimeout(resolve,1000));
  console.log('Hiding popup');
  setShowPopup(false)
 }
 function extrasClick(e: React.ChangeEvent<HTMLInputElement>, extraThing: any){
  const checked = e.target.checked;
  if(checked){
   setSelectedExtras(prev => [...prev,extraThing])
  }else{
   setSelectedExtras(prev => {
     return prev.filter(e => e.name !== extraThing.name)
   })
  }
  let selectedPrice = prices;
  if(selectedSize){
    selectedPrice += selectedSize.price;
  }
  if(selectedExtras?.length > 0){
    for(const extra of selectedExtras){
      selectedPrice += extra.price;
    }
  }

  return (
  <>
    {showPopup && (
      <div
        onClick={() => setShowPopup(false)}
        className="fixed inset-0 bg-black/80 flex items-center justify-center"
      >
        <div
          onClick={ev => ev.stopPropagation()}
          className="my-8 bg-white p-2 rounded-lg max-w-md"
        >
          <div
            className="overflow-y-scroll p-2"
            style={{ maxHeight: 'calc(100vh - 100px)' }}
          >
            <Image src={img} alt={title} width={300} height={200} className="mx-auto" />
            <h2 className="text-lg font-bold text-center mb-2">{title}</h2>
            <p className="text-center text-gray-500 text-sm mb-2">
              {description}
            </p>
            {sizes.length > 0 && (
              <div className="py-2">
                <h3 className="text-center text-gray-700">Pick your size</h3>
                {sizes.map(size => (
                  <label
                    key={size._id}
                    className="flex items-center gap-2 p-4 border rounded-md mb-1"
                  >
                    <input
                      type="radio"
                      onChange={() => setSelectedSize(size)}
                      checked={selectedSize?.name === size.name}
                      name="size"
                    />
                    {size.name} ${prices + size.price}
                  </label>
                ))}
              </div>
            )}
            {extraIngredientPrices.length > 0 && (
              <div className="py-2">
                <h3 className="text-center text-gray-700">Any extras?</h3>
                {extraIngredientPrices.map(extraThing => (
                  <label
                    key={extraThing._id}
                    className="flex items-center gap-2 p-4 border rounded-md mb-1"
                  >
                    <input
                      type="checkbox"
                      onChange={ev => extrasClick(ev, extraThing)}
                      checked={selectedExtras.map(e => e._id).includes(extraThing._id)}
                      name={extraThing.name}
                    />
                    {extraThing.name} +${extraThing.price}
                  </label>
                ))}
              </div>
            )}
            <Button
              targetTop={'5%'}
              targetLeft={'95%'}
              src={img}
            >
              <div className="primary sticky bottom-2" onClick={handleAddToCartBtn}>
                Add to cart ${selectedPrice}
              </div>
            </Button>
            <button className="mt-2" onClick={() => setShowPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
    <MenuItemTitle onAddToCart={handleAddToCartBtn} {...MenuItem} />
  </>
);
 }
}