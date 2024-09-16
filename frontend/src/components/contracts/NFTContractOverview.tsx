import { getLogs } from "@/hooks/useGetERC721Events";
import EventTable from "./ERC721Event";

export function NFTContractOverview({
  symbol,
  supply,

  userBalance,
  name,
  address,
  logs,

}: {
  symbol: string;
  supply?: string;
  userBalance: number;
  name: string;
  address: string;
  logs:any[];
}) {
  const log = getLogs(address);
  console.log(log);
  
  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold">NFT Collection Details</h2>

      <div className="mt-6 flex w-[70%]">
        {/* <div className="mr-8 block w-full max-w-sm cursor-pointer rounded-lg border border-gray-600 p-5 shadow">
          <h5 className="mb-2 text-xl font-normal tracking-tight text-gray-900 dark:text-white">
            Total Supply
          </h5>

          <p className="text-xl font-normal text-gray-100">
            {supply} {symbol}
          </p>
        </div> */}
        <div className="mr-8 block w-[200px] max-w-xs cursor-pointer rounded-lg border border-gray-600 p-5 shadow">
          <h5 className="mb-2 text-xl font-normal tracking-tight text-white">
            Owned by you
          </h5>
          <p className="text-xl font-normal text-gray-100">
            {userBalance} {symbol}
          </p>
        </div>
      </div>
      {/* Events */}
      <EventTable logs={logs} address={address}/>
  
    </div>
  );
}
