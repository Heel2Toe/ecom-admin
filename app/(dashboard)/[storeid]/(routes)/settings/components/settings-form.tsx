"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Store } from "@prisma/client";
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
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface StoreFormProps{
    initialData: Store
}

const formSchema = z.object({
    name: z.string().min(1)
})

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<StoreFormProps> = ({
initialData
}) => {

const [open, setOpen] = useState(false);
const [loading, setLoading] = useState(false);
const params = useParams();
const router = useRouter();
const origin = useOrigin();
    
const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
    
})

const onSubmit = async (data: SettingsFormValues) => {
   try{
      setLoading(true);      
      await axios.patch(`/api/stores/${params.storeid}`, data);
      router.refresh();
      toast.success("Store Updated");
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
      await axios.delete(`/api/stores/${params.storeid}`);
      router.refresh();
      router.push("/");
      toast.success("Store deleted");
  }
  catch(err){
    toast.error("Be sure to remove all products and categories first");
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
                    title='Settings'
                    description='Manage Store Preferences'
                    />
                    <Button
                    disabled={loading}
                    variant='destructive'
                    onClick={()=>{setOpen(true)}}
                    size="sm"
                    >
                    <Trash className="h-4 w-4"/>
                    </Button>
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
                                    <Input placeholder="Store name" disabled={loading} {...field}/>
                                  </FormControl> 
                                  <FormMessage/>
                                </FormItem>
                     )}/>
                  </div>
                  <Button disabled={loading} type="submit">Save Changes</Button>
                </form>
            </Form>
            <Separator/>
            <ApiAlert
             title="NEXT_PUBLIC_API_"
             description={`${origin}/api/${params.storeid}`}
             variant="public"
            />
            </>
    )
}