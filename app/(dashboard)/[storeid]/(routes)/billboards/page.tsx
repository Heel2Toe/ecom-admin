import prismadb from "@/lib/prismadb"
import { BillboardClient } from "./components/client";
import { format } from "date-fns"
import { BillboardColumn } from "./components/columns";



const BillboardsPage = async({params}:{params: {storeid: string}}) => {

  const billboards = await prismadb.billboard.findMany({
      where: {
        storeid: params.storeid
      },
      orderBy: {
        createdAt: 'desc'
      }
  });
  
  const formattedBillboards: BillboardColumn[] = billboards.map((item)=> ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))
  return (
    <div className="flex flex-col flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards}/>
    </div>
  )
}

export default BillboardsPage
