'use client';
import { getTokenMetadata } from "@/hooks/useGetSingleTokens";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function TokenTableRow({ data }: { data: any }) {
    const [symbol, setSymbol] = useState('');
    const [supply, setSupply] = useState('');
    const router = useRouter();


    useEffect(() => {
        async function getMeta() {
            const { symbol, supply } = await getTokenMetadata(data?._abi, data?._contract);
            setSymbol(symbol);
            setSupply(supply);
        }
        getMeta();
    }, []);

    return (
        <tr className="border-b dark:border-gray-70">
            <th
                scope="row"
                className="cursor-pointer whitespace-nowrap px-6 py-4 font-medium text-purple-600 "
                onClick={() => {
                    router.push(`/dashboard/contracts/${data?._contract}`);
                }}
            >
                {data?._name}
            </th>
            <td className="px-6 py-4">{symbol}</td>
            <td className="px-6 py-4">
                {String(data?._contract).substring(0, 8)}...
                {String(data?._contract).substring(
                    String(data?._contract).length - 9,
                    String(data?._contract).length - 1
                )}
            </td>
            <td className="px-6 py-4">{supply?.toString()}</td>
        </tr>
    )
}