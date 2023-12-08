import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request,
{ params }: {params: {storeid: string}}){

    try{
      const {userId} = auth();

      const body = await req.json();
      const {name, value} = body;

      

      if(!userId){
        return new NextResponse("Unauthenticated", {status:401});
      }
      if(!name){
        return new NextResponse("name Required", {status: 400});
      }
      if(!value){
        return new NextResponse("Value Required", {status: 400});
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


      const color = await prismadb.color.create({
        data:{
           name,
           value,
           storeid: params.storeid
        }
      })
      return NextResponse.json(color);
    }
    catch(err){
        console.log("[COLOR_POST]", err);
        return new NextResponse("Internal Error", {status: 500});        
    }
}


export async function GET(req: Request,
  { params }: {params: {storeid: string}}){
  
      try{

        if(!params.storeid){
          return new NextResponse("StoreId Required", {status: 400});
        }
  
        const colors = await prismadb.color.findMany({
         where: {
           storeid: params.storeid
         }
        })

        return NextResponse.json(colors);
      }
      catch(err){
          console.log("[COLORS_GET]", err);
          return new NextResponse("Internal Error", {status: 500});
          
      }
  }