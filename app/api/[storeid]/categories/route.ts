import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request,
{ params }: {params: {storeid: string}}){

    try{
      const {userId} = auth();

      const body = await req.json();
      const {name, billboardId} = body;

      

      if(!userId){
        return new NextResponse("Unauthenticated", {status:401});
      }
      if(!name){
        return new NextResponse("name Required", {status: 400});
      }
      if(!billboardId){
        return new NextResponse("Billboard id Required", {status: 400});
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


      const category = await prismadb.category.create({
        data:{
            name,
            billboardId,
            storeid: params.storeid
        }
      })
      return NextResponse.json(category);
    }
    catch(err){
        console.log("[CATEGORIES_POST]", err);
        return new NextResponse("Internal Error", {status: 500});
        
    }
}


export async function GET(req: Request,
  { params }: {params: {storeid: string}}){
  
      try{

        if(!params.storeid){
          return new NextResponse("StoreId Required", {status: 400});
        }
  
        const categories = await prismadb.category.findMany({
         where: {
           storeid: params.storeid
         }
        })

        return NextResponse.json(categories);
      }
      catch(err){
          console.log("[CATEGORIES_GET]", err);
          return new NextResponse("Internal Error", {status: 500});
          
      }
  }