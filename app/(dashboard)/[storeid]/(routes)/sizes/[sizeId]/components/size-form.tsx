"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Size } from "@prisma/client";
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

interface SizeFormProps{
    initialData: Size | null
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
})

type SizeFormValues = z.infer<typeof formSchema>;

export const SizeForm: React.FC<SizeFormProps> = ({
initialData
}) => {

const [open, setOpen] = useState(false);
const [loading, setLoading] = useState(false);
const params = useParams();
const router = useRouter();

const title = initialData ? "Edit Size" : "Create Size";
const description = initialData ? "Edit a Size" : "Create a Size";
const toastMessage = initialData ? "Size updated." : "Size created.";
const action = initialData ? "Save changes" : "Create";




    
const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: ''
    }
    
})

const onSubmit = async (data: SizeFormValues) => {
   try{
      setLoading(true); 
      if(initialData){
        await axios.patch(`/api/${params.storeid}/sizes/${params.sizeId}`, data);
      }
      else{
        await axios.post(`/api/${params.storeid}/sizes`, data);
      }     
      router.push(`/${params.storeid}/sizes`)
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
      await axios.delete(`/api/${params.storeid}/sizes/${params.sizeId}`);
      router.push(`/${params.storeid}/sizes`);
      router.refresh();
      toast.success("Size deleted");
  }
  catch(err){
    toast.error("Be sure to remove all products using this size");
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
                                    <Input placeholder="Size name" disabled={loading} {...field}/>
                                  </FormControl> 
                                  <FormMessage/>
                                </FormItem>
                     )}/>

                    <FormField control={form.control} 
                               name="value"
                               render={({field})=>(
                                <FormItem>
                                  <FormLabel>Value</FormLabel>  
                                  <FormControl>
                                    <Input placeholder="Size value" disabled={loading} {...field}/>
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