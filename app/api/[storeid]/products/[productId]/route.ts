import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


export async function GET(
    req: Request,
    { params }: { params: { productId: string } }
  ) {
    try {
  
      if (!params.productId) {
        return new NextResponse("product id is required", { status: 400 });
      }
  
      const product = await prismadb.product.findUnique({
        where: {
          id: params.productId,
        },
        include:{
          images: true,
          category: true,
          color:true,
          size: true,
        }
      });
    
      return NextResponse.json(product);
    } catch (error) {
      console.log('[PRODUCT_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  

export async function PATCH(
  req: Request,
  { params }: { params: { storeid: string, productId: string } }
) {
  try {
    const { userId } = auth();
    
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

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
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
    if(!params.productId){
      return new NextResponse("productId Required", {status: 400});
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

   await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany:{}
        },
        isFeatured,
        isArchived
      }
    });

    const product = await prismadb.product.update({
      where:{
        id: params.productId
    },
    data: {
      images:{
        createMany: {
          data: [...images.map((image: {url: String})=>image)]
        }
      }
    }
  })
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { storeid: string, productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("product id is required", { status: 400 });
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

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,

      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


