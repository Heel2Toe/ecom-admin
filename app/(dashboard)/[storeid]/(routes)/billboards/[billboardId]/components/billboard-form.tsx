"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Billboard } from "@prisma/client";
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
import ImageUpload from "@/components/ui/image-upload";

interface BillboardFormProps{
    initialData: Billboard | null
}

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
})

type BillboardFormValues = z.infer<typeof formSchema>;

export const BillboardForm: React.FC<BillboardFormProps> = ({
initialData
}) => {

const [open, setOpen] = useState(false);
const [loading, setLoading] = useState(false);
const params = useParams();
const router = useRouter();

const title = initialData ? "Edit Billboard" : "Create Billboard";
const description = initialData ? "Edit a Billboard" : "Create a Billboard";
const toastMessage = initialData ? "Billboard updated." : "Billboard created.";
const action = initialData ? "Save changes" : "Create";




    
const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: ''
    }
    
})

const onSubmit = async (data: BillboardFormValues) => {
   try{
      setLoading(true); 
      if(initialData){
        await axios.patch(`/api/${params.storeid}/billboards/${params.billboardId}`, data);
      }
      else{
        await axios.post(`/api/${params.storeid}/billboards`, data);
      }     
      router.push(`/${params.storeid}/billboards`)
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
      await axios.delete(`/api/${params.storeid}/billboards/${params.billboardId}`);
      router.push(`/${params.storeid}/billboards`);
      router.refresh();
      toast.success("Billboard deleted");
  }
  catch(err){
    toast.error("Be sure to remove all categories using this billboard");
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
                  
                <FormField control={form.control} 
                               name="imageUrl"
                               render={({field})=>(
                                <FormItem>
                                  <FormLabel>Background Image</FormLabel>  
                                  <FormControl>

                                    <ImageUpload
                                     value={field.value ? [field.value] : []}
                                     disabled={loading}
                                     onChange={(url)=>field.onChange(url)}
                                     onRemove={()=>field.onChange("")}                              
                                    />

                                  </FormControl> 
                                  <FormMessage/>
                                </FormItem>
                     )}/>

                  <div className="grid grid-cols-3 gap-8">
                    <FormField control={form.control} 
                               name="label"
                               render={({field})=>(
                                <FormItem>
                                  <FormLabel>Label</FormLabel>  
                                  <FormControl>
                                    <Input placeholder="Billboard label" disabled={loading} {...field}/>
                                  </FormControl> 
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