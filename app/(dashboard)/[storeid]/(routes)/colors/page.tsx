import prismadb from "@/lib/prismadb"
import { ColorClient } from "./components/client";
import { format } from "date-fns"
import { ColorColumn } from "./components/columns";



const ColorsPage = async({params}:{params: {storeid: string}}) => {

  const colors = await prismadb.color.findMany({
      where: {
        storeid: params.storeid
      },
      orderBy: {
        createdAt: 'desc'
      }
  });
  
  const formattedColors: ColorColumn[] = colors.map((item)=> ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))
  return (
    <div className="flex flex-col flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedColors}/>
    </div>
  )
}

export default ColorsPage
