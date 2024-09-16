"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { NftTableRow } from "./NftTableRow";

// import { Spinner } from "@/components/ui/spinner";

export function NftTable({
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
                <NftTableRow key={index} data={data} />
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
