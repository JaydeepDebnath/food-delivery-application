'user client'

import { DeleteButton } from "@/components/DeleteButton"
import { useEffect,useState } from "react"
import { UserProfile } from "@/components/UserProfile"
import { Category } from "@/model/CategoryModel"
import axios,{AxiosError} from "axios"
import { Toast } from "@/components/ui/toast"

export default function CategoriesPage(){

  const [categoryTitle,setCategoryTitle] = useState<Category []>([])
  const [categories,setCategories] = useState<Category []>([])
  const {loading:profileLoading,data:profileData} = UserProfile()
  const [editedCategory,setEditedCategory] = useState<Category []>([])
  const toast = Toast

  useEffect(()=>{
   fetchCategories();
  },[])

  async function fetchCategories() {
   try {
     const response = await axios.get('/api/categories/list-all-categories')
     setCategories(response.data)
     return response.data,  
   } catch (error) {
     const axiosError = error as AxiosError,
     toast({
       title:'Failed to fetch categories',
       description:axiosError.message
     })
     return axiosError.message
   }
  }

  async function handleNewCategoryCreate(e: React.FormEvent<HTMLFormElement>){
   e.preventDefault();
    try {
      const response = await axios.post('/api/categories/create',{
        title:categoryTitle,     
      })
      setCategories([...categories,response.data]);
      setCategoryTitle([]);
      return response.data     
    } catch (error) {
      const axiosError = error as AxiosError,
      toast({
        title:'Failed to ctreate Category',
        description:axiosError.message
      })            
    }
  }

  async function handleUpdateCategory(e: React.FormEvent<HTMLFormElement>){
    try {
      const response = await axios.put(`/api/categories/update/${categoryId}`,{
       name:editedCategory?.title,
      });
      const updateCategories = categories.map(cat => 
        cat.id === categoryId ? response.data : cat
      );
      setCategories(updateCategories);
      setEditedCategory(null);
      toast({
        title:'Category Updated',
        description:`Category ${response.data.title} updated Succeffully` 
      })
    } catch (error) {
      const axiosError = error as AxiosError;
      toast({
        title:'Failed to update category',
        description:axiosError.message,
      })          
    }
  }

  async function handleDeleteCategory(categoryId){
    try {
      const response = await axios.delete(`/api/categories/delete/${categoryId}`)
      const filteredCategories = categories.filter(cate => cate.id !== categoryId)
      setCategories(filteredCategories)
      toast({
       title:'Category Deleted',
       description:`Category deleted Successfully.`
      })
    } catch (error) {
      const axiosError = error as AxiosError;
       toast({
        title:'Failed to update category',
        description:axiosError.message,
      })         
    }
  }

   return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Categories</h1>
      {/* Form for creating a new category */}
      <form onSubmit={handleNewCategoryCreate} className="mb-4">
        <input
          type="text"
          placeholder="Enter category name"
          className="border border-gray-300 p-2 mr-2"
          value={categoryTitle}
          onChange={(e) => setCategoryTitle(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Create Category
        </button>
      </form>

      {/* List of categories */}
      <ul>
        {categories.map((category) => (
          <li key={category.id} className="flex items-center justify-between border-b border-gray-300 py-2">
            {editedCategory?.id === category.id ? (
              <input
                type="text"
                value={editedCategory.title}
                onChange={(e:any) => setEditedCategory({ ...editedCategory, title: e.target.value })}
                className="border border-gray-300 p-2 mr-2"
              />
            ) : (
              <span>{category.title}</span>
            )}
            <div>
              {editedCategory?.id === category.id ? (
                <button
                  onClick={() => handleUpdateCategory(category.id)}
                  className="bg-green-500 text-white px-4 py-1 rounded-lg mr-2 hover:bg-green-600"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setEditedCategory(category)}
                  className="bg-blue-500 text-white px-4 py-1 rounded-lg mr-2 hover:bg-blue-600"
                >
                  Edit
                </button>
              )}
              <DeleteButton itemId={category.id} onDelete={() => handleDeleteCategory(category.id)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}