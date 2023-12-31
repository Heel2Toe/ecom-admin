"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Billboard, Category } from "@prisma/client";
import { Trash } from "lucide-react";
import * as z from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface CategoryFormProps{
    initialData: Category | null,
    billboards: Billboard[]
}

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1)
})

type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm: React.FC<CategoryFormProps> = ({
initialData,
billboards
}) => {

const [open, setOpen] = useState(false);
const [loading, setLoading] = useState(false);
const params = useParams();
const router = useRouter();

const title = initialData ? "Edit Category" : "Create Category";
const description = initialData ? "Edit a Category" : "Create a Category";
const toastMessage = initialData ? "Category updated." : "Category created.";
const action = initialData ? "Save changes" : "Create";




    
const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      billboardId: ''
    }
    
})

const onSubmit = async (data: CategoryFormValues) => {
   try{
      setLoading(true); 
      if(initialData){
        await axios.patch(`/api/${params.storeid}/categories/${params.categoryId}`, data);
      }
      else{
        await axios.post(`/api/${params.storeid}/categories`, data);
      }     
      router.push(`/${params.storeid}/categories`)
      router.refresh();
      toast.success(toastMessage);
   }
   catch{
    toast.error("Something went wrong");  
   }
   finally{
    setLoading(false);
   }
}

const onDelete = async() => {

  try{
      setLoading(true);
      await axios.delete(`/api/${params.storeid}/categories/${params.categoryId}`);
      router.push(`/${params.storeid}/categories`);
      router.refresh();
      toast.success("Store deleted");
  }
  catch(err){
    toast.error("Be sure to remove all products using this category");
  }
  finally{
    setLoading(false);
    setOpen(false);
  }
}

    return(
            <>
               <AlertModal
                isOpen={open}
                onClose={()=>setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
                
               />
               <div className="flex items-center justify-between">
                    <Heading
                    title={title}
                    description={description}
                    />
                    {initialData && <Button
                    disabled={loading}
                    variant='destructive'
                    onClick={()=>{setOpen(true)}}
                    size="sm"
                    >
                    <Trash className="h-4 w-4"/>
                    </Button>}
               </div>
            <Separator/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                  
                  <div className="grid grid-cols-3 gap-8">
                    <FormField control={form.control} 
                               name="name"
                               render={({field})=>(
                                <FormItem>
                                  <FormLabel>Name</FormLabel>  
                                  <FormControl>
                                    <Input placeholder="Category Name" disabled={loading} {...field}/>
                                  </FormControl> 
                                  <FormMessage/>
                                </FormItem>
                     )}/>

                    <FormField control={form.control} 
                               name="billboardId"
                               render={({field})=>(
                                <FormItem>
                                  <FormLabel>Billboard</FormLabel>  
                                  <Select disabled={loading} 
                                          onValueChange={field.onChange}
                                          value={field.value} 
                                          defaultValue={field.value}>
                                   <FormControl>
                                    <SelectTrigger>
                                     <SelectValue defaultValue={field.value} placeholder="Select any billboard"/>
                                    </SelectTrigger>
                                   </FormControl> 
                                    <SelectContent>
                                     {billboards.map((billboard)=>(
                                      <SelectItem key={billboard.id} value={billboard.id}>
                                        {billboard.label}
                                      </SelectItem>
                                     ))}
                                    </SelectContent>
                                  </Select> 
                                  <FormMessage/>
                                </FormItem>
                     )}/>
                  </div>

                  <Button disabled={loading} type="submit">{action}</Button>
                </form>
            </Form>
            <Separator/>
            
            </>
    )
}