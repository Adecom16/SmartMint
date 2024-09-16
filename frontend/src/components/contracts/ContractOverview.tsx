import { GetBalanceOf } from "@/hooks/useGetSingleTokens";
import EventTable from "./ERC20Event";

export function ContractOverview({
  symbol,
  supply,
  decimal,
  userBalance,
  name,
  address,
  logs,
}: {
  symbol: string;
  supply: string;
  decimal: number;
  userBalance: number;
  name: string;
  address: string;
  logs: any[];
}) {
  const balance = GetBalanceOf(address);
  // console.log(balance);

  return (
    <div className="mt-4">
      {/* <div className="mb-10 border-b border-gray-700 pb-6">
        <div className="mb-3 flex items-center">
          <h1 className="mr-2 text-2xl font-bold">JeffToken</h1>
          <button className="mr-2 rounded border px-2 py-1 font-sans text-sm font-semibold  text-white no-underline focus:outline-none">
            Aleph Zero
          </button>
        </div>
        <p className="mb-3 text-gray-300">Simple description</p>
        <div className="mr-2 w-fit cursor-pointer rounded border px-2 py-1 font-sans text-xs  font-semibold text-white no-underline focus:outline-none">
          <span className="flex items-center gap-1 text-xs">
            <Copy /> 1FRMM...hV24fg
          </span>
        </div>
      </div> */}

      <h2 className="text-2xl font-bold">Token Details</h2>

      <div className="mt-6 flex w-[70%]">
        <div className="mr-8 block w-full max-w-sm cursor-pointer rounded-lg border border-gray-600 p-5 shadow overflow-h ">
          <h5 className="mb-2 text-xl font-normal tracking-tight text-gray-900 dark:text-white">
            Total Supply
          </h5>

          <p className="text-xl font-normal text-gray-100 overflow-hidden">
            {Number(supply) / Math.pow(10, decimal)} {symbol}
          </p>
        </div>
        <div className="mr-8 block w-full max-w-sm cursor-pointer rounded-lg border border-gray-600 p-5 shadow">
          <h5 className="mb-2 text-xl font-normal tracking-tight text-white">
            Owned by you
          </h5>
          <p className="text-xl font-normal text-gray-100">
            {Number(balance) / Math.pow(10, decimal)} {symbol}
          </p>
        </div>
        <div className="mr-8 block w-full max-w-sm cursor-pointer rounded-lg border border-gray-600 p-5 shadow">
          <h5 className="mb-2 text-xl font-normal tracking-tight text-white">
            Decimals
          </h5>
          <p className="text-xl font-normal text-gray-100">{decimal || 0}</p>
        </div>
      </div>
      {/* Events */}
      <div className="mt-10">
        <EventTable logs={logs} address={address} />
      </div>
      {/* Permissions */}
      {/* <div className="mt-12">
        <h2 className="mb-4 text-2xl font-bold">Permissions</h2>
        <div className="relative overflow-x-auto rounded">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Member
                </th>
                <th scope="col" className="px-6 py-3">
                  Roles
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                <td scope="col" className="cursor-pointer whitespace-nowrap px-6 py-4 font-medium">
                  5C9xKEs...yyycaN
                </td>
                <td scope="col" className="px-6 py-4">
                  <div className="flex">
                    <div className="mr-2 w-fit rounded border border-gray-500 px-2 py-1 font-sans text-xs font-semibold  text-gray-400 no-underline focus:outline-none">
                      Minter
                    </div>

                    <div className="mr-2 w-fit rounded border border-gray-500 px-2 py-1 font-sans text-xs font-semibold  text-gray-400 no-underline focus:outline-none">
                      Owner
                    </div>
                  </div>
                </td>
                <td scope="col" className="px-6 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}
