"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface CategoryClientProps{
  data: CategoryColumn[]
}

export const CategoryClient: React.FC<CategoryClientProps> = ({
  data
}) => {
    const router = useRouter();
    const params = useParams();

  return (
    <>
        <div className="flex items-center justify-between">
          <Heading
           title={`Categories (${data.length})`}
           description="Manage categories for your store"
          />
          <Button onClick={()=>router.push(`/${params.storeid}/categories/new`)}>
            <PlusIcon className="mr-2 h-4 w-4"/>
            Add New
          </Button>
        </div>
        <Separator/>
        <DataTable columns={columns} data={data} searchKey="name"/>
        <Heading title="API" description="Api calls for categories"/>
        <Separator/>
        <ApiList
        enitityName="categories"
        entityIdName="categoryId"
        />
    </>
  )
}

