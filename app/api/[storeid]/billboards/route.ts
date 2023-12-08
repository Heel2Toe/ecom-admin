import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request,
{ params }: {params: {storeid: string}}){

    try{
      const {userId} = auth();

      const body = await req.json();
      const {label , imageUrl} = body;

      

      if(!userId){
        return new NextResponse("Unauthenticated", {status:401});
      }
      if(!label){
        return new NextResponse("Label Required", {status: 400});
      }
      if(!imageUrl){
        return new NextResponse("Image url Required", {status: 400});
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


      const billboard = await prismadb.billboard.create({
        data:{
            label,
            imageUrl,
            storeid: params.storeid
        }
      })
      return NextResponse.json(billboard);
    }
    catch(err){
        console.log("[BILLBOARDS_POST]", err);
        return new NextResponse("Internal Error", {status: 500});
        
    }
}


export async function GET(req: Request,
  { params }: {params: {storeid: string}}){
  
      try{

        if(!params.storeid){
          return new NextResponse("StoreId Required", {status: 400});
        }
  
        const billboards = await prismadb.billboard.findMany({
         where: {
           storeid: params.storeid
         }
        })

        return NextResponse.json(billboards);
      }
      catch(err){
          console.log("[BILLBOARDS_GET]", err);
          return new NextResponse("Internal Error", {status: 500});
          
      }
  }