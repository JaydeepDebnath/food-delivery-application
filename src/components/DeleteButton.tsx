'use client'

import { useState } from "react"
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

export async function DeleteButton({label,onDelete}:any){
  const [deleteConfrim,setDeleteConfirm] = useState(false);
  const {toast} = useToast()

    const handleDelete = async () => {
    try {
      await onDelete();
      toast({
         title:'Success',
         description:'Item deleted successfully',
         variant:'destructive'
      })
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
         title:'Failed',
         description:'Failed to delete item',
         variant:'destructive'
      })
    }
    setDeleteConfirm(false);
  };

  if(deleteConfrim){
     return (
       <div className="fixed bg-black/80 inset-0 flex items-center h-full justify-center">
         <div className="bg-white p-4 rounded-lg">
           <div>Are you sure you want to delete?</div>
           <Button onClick={() => setDeleteConfirm(false)}>
             Cancel
           </Button>
           <Button
            onClick={handleDelete}
            className="primary"
           >
                  Yes,delete!
           </Button>
         </div>
       </div>
     )
  }
  return(
    <Button onClick={() => setDeleteConfirm(true)}>
       {label}
    </Button>
  )
}