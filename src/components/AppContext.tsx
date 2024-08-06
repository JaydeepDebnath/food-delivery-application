'use client'

import {SessionProvider} from 'next-auth/react'
import { createContext,useEffect,useState,ReactNode } from 'react'
import {Toast} from '@/components/ui/toast'

interface Extra {
  price: number;
}

interface Size {
  price: number;
}

interface CartProduct {
  prices: number;
  size?: Size;
  extras?: Extra[];
}

interface CartContextType {
  cartProducts: CartProduct[];
  setCartProducts: React.Dispatch<React.SetStateAction<CartProduct[]>>;
  addToCart: (product: CartProduct, size?: Size, extras?: Extra[]) => void;
  removeCartProduct: (indexToRemove: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function cartProductPrice(cartProduct:CartProduct){
let price = cartProduct.prices;
if(cartProduct.size){
  price += cartProduct.size.price;
}
if(cartProduct.extras?.lenght > 0){
 for (const extra of cartProduct.extras){
   price += extra.price;
 }
}
return price;
}

export function AppProvider ({children}:any){
const {toast} = Toast
 const [cartProducts,setCartProducts ] = useState([]);
 const ls = typeof window !== 'undefined' ? window.localStorage:null;

 useEffect(() => {
   if(ls && ls.getItem('cart')){
     setCartProducts(JSON.parse(ls.getItem('cart')));
   }
 },[]);

 function clearCart(){
   setCartProducts([]);
   saveCartProductsToLocalStorage([]);
 }
  function saveCartProductsToLocalStorage(cartProducts:any) {
    if (ls) {
      ls.setItem('cart', JSON.stringify(cartProducts));
    }
  }

   function removeCartProduct(indexToRemove:any) {
    setCartProducts(prevCartProducts => {
      const newCartProducts = prevCartProducts
        .filter((v,index) => index !== indexToRemove);
      saveCartProductsToLocalStorage(newCartProducts);
      return newCartProducts;
    });
    toast.success('Product removed');
  }

    function addToCart(product, size=null, extras=[]) {
    setCartProducts(prevProducts => {
      const cartProduct = {...product, size, extras};
      const newProducts = [...prevProducts, cartProduct];
      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
  }

  return (
    <SessionProvider>
      <CartContext.Provider value={{
        cartProducts, setCartProducts,
        addToCart, removeCartProduct, clearCart,
      }}>
        {children}
      </CartContext.Provider>
    </SessionProvider>
  );
} 