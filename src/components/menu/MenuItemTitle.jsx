import AddToCartBtn from './AddToCartBtn'

export default function MenuItemTitle({onAddTocart,...item}){
 const {img, title,description,prices,category} = item;

  return (
    <div className="bg-gray-200 p-4 rounded-lg text-center
      group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all">
      <div className="text-center">
        <img src={img} className="max-h-auto max-h-24 block mx-auto" alt="pizza"/>
      </div>
      <h4 className="font-semibold text-xl my-3">{title}</h4>
      <p className="text-gray-500 text-sm line-clamp-3">
        {description}
        {prices}
        {category}
      </p>
      <AddToCartBtn
        image={img}
        onClick={onAddTocart}
        basePrice={basePrice}
      />
    </div>
  );
}