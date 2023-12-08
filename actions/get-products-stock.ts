import prismadb from "@/lib/prismadb"


export const getStockCount = async (storeid : string) => {
    const stockCount = await prismadb.product.count({
        where: {
            storeid: storeid,
            isArchived: false
        },
    });

    return stockCount;
}