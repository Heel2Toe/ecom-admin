import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request,
{ params }: {params: {storeid: string}}){

    try{
      const {userId} = auth();

      const body = await req.json();
      const {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images,
        isFeatured,
        isArchived
      
      } = body;

      

      if(!userId){
        return new NextResponse("Unauthenticated", {status:401});
      }
      if(!name){
        return new NextResponse("name Required", {status: 400});
      }
      if(!price){
        return new NextResponse("price Required", {status: 400});
      }
      if(!categoryId){
        return new NextResponse("name Required", {status: 400});
      }
      if(!colorId){
        return new NextResponse("colorId Required", {status: 400});
      }
      if(!sizeId){
        return new NextResponse("sizeId Required", {status: 400});
      }
      if(!images || !images.length){
        return new NextResponse("images Required", {status: 400});
      }
      if(!params.storeid){
        return new NextResponse("StoreId Required", {status: 400});
      }
      
      const storeByUser = await prismadb.store.findFirst({
        where:{
          id: params.storeid,
          userId
        }
      });
     
      if(!storeByUser){
        return new NextResponse("Unauthorized", {status: 403});
      }


      const product = await prismadb.product.create({
        data:{
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            isFeatured,
            isArchived,
            storeid: params.storeid,
            images:{
              createMany:{
                data:[
                  ...images.map((image: {url: String})=> image)
                ]
              }
            }
        }
      })
      return NextResponse.json(product);
    }
    catch(err){
        console.log("[PRODUCTS_POST]", err);
        return new NextResponse("Internal Error", {status: 500});
        
    }
}


export async function GET(req: Request,
  { params }: {params: {storeid: string}}){

    const {searchParams} = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    
      try{

        if(!params.storeid){
          return new NextResponse("StoreId Required", {status: 400});
        }
  
        const products = await prismadb.product.findMany({
         where: {
           storeid: params.storeid,
           categoryId,
           sizeId,
           colorId,
           isFeatured: isFeatured ? true : undefined,
           isArchived: false
         },
         include:{
          images: true,
          category:true,
          color: true,
          size: true
         },
         orderBy:{
          createdAt: "desc"
         }
        })

        return NextResponse.json(products);
      }
      catch(err){
          console.log("[PRODUCTS_GET]", err);
          return new NextResponse("Internal Error", {status: 500});
          
      }
  }