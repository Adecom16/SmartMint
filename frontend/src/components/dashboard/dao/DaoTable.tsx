"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// import { Spinner } from "@/components/ui/spinner";

export function DaoTable({
  tableData,
  isLoading,
  fullPage
}: {
  tableData: any[];
  isLoading: boolean;
  fullPage: boolean;
}) {
  const router = useRouter();
  return (
    <div className="relative overflow-x-auto rounded">
      {tableData.length < 1 ? (
        <div className="mt-6 w-full overflow-hidden">
          <p className="text-center text-red-700">You have not created any nfts</p>
          <div className=" mx-auto h-10 w-10 "></div>
        </div>
      ) : (
        <table className="w-full mx-auto text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-900 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Symbol
              </th>
              <th scope="col" className="px-6 py-3 ">
                Address
              </th>
              {/* <th scope="col" className="px-6 py-3">
                Total Supply
              </th> */}
            </tr>
          </thead>

          <tbody>
            {(fullPage ? tableData : tableData.slice(0, 5))?.map(
              (data, index) => (
                <tr key={index} className="border-b dark:border-gray-70">
                  <td
                    // scope="row"
                    className="cursor-pointer whitespace-nowrap px-6 py-4 font-medium text-purple-700 "
                    onClick={() => {
                      router.push(`/dashboard/contracts/nft/${data?.address}`);
                    }}
                  >
                    {data?.name}
                  </td>
                  <td className="px-6 py-4">{data?.symbol}</td>
                  <td className="px-6 py-4">
                    {String(data?.address).substring(0, 8)}...
                    {String(data?.address).substring(
                      String(data?.address).length - 9,
                      String(data?.address).length - 1
                    )}
                  </td>
                  {/* <td className="px-6 py-4">{data?.supply?.toString()}</td> */}
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
