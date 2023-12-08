"use client";

import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { ApiAlert } from "./api-alert";

interface ApiListProps{
    enitityName: string,
    entityIdName: string
}
export const ApiList: React.FC<ApiListProps> = ({
    entityIdName,
    enitityName
}) =>{
    const params = useParams();
    const origin = useOrigin();

    const baseUrl = `${origin}/api/${params.storeid}`

    return(
        <>
            <ApiAlert
             title="GET"
             description={`${baseUrl}/${enitityName}`}
             variant="public"
             />

            <ApiAlert
             title="GET"
             description={`${baseUrl}/${enitityName}/{${entityIdName}}`}
             variant="public"
             />

            <ApiAlert
             title="POST"
             description={`${baseUrl}/${enitityName}`}
             variant="admin"
             />

            <ApiAlert
             title="PATCH"
             description={`${baseUrl}/${enitityName}/{${entityIdName}}`}
             variant="admin"
             />

            <ApiAlert
             title="DELETE"
             description={`${baseUrl}/${enitityName}/{${entityIdName}}`}
             variant="admin"
             />
        </>
    )
}