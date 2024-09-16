import { Copy, ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
// import { HiOutlineDuplicate } from 'react-icons/hi'

export default function ContractDetails({
  name,
  description,
  address,
  uriHash,
}: {
  name: string;
  description: string;
  address: string;
  uriHash?: string;
}) {
  const copyToClipboard = async () => {
    try {
      // const textToCopy = document.getElementById('textToCopy').innerText
      await navigator.clipboard.writeText(String(address));
      console.log("Address copied to clipboard");
      toast.success("Address copied ");
    } catch (err) {
      toast.error("Failed to copy address: " + String(err));
    }
  };
  // `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}
  return (
    <div className="mt-20 p-4 sm:container">
      <div className="mb-6 border-b border-gray-700 pb-6 flex items-center">
        {uriHash && (
          <Image
            src={`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${uriHash}`}
            width={100}
            height={100}
            alt=""
            className="h-24 w-24 mr-5"
          />
        )}
        <div>
          <div className="mb-3 flex items-center">
            <h1 className="mr-2 text-2xl font-bold">{name}</h1>
            <button className="mr-2 rounded border px-2 py-1 font-sans text-xs font-semibold text-white no-underline focus:outline-none">
              CoreDao
            </button>
          </div>
          <p className="mb-3 text-gray-300">{description}</p>
          <div className="flex">
            <div className="mr-2 w-fit cursor-pointer rounded border px-2 py-1 font-sans text-xs  font-semibold text-white no-underline focus:outline-none">
              <span
                className="flex items-center gap-1 text-xs"
                onClick={copyToClipboard}
              >
                {/* <HiOutlineDuplicat />  */}
                <Copy className="w-4 h-6 mr-1" />
                {String(address).substring(0, 8)}...
                {String(address).substring(
                  String(address).length - 9,
                  String(address).length
                )}
              </span>
            </div>
            <div className="mr-2 w-fit cursor-pointer rounded border px-2 py-1 font-sans text-xs  font-semibold text-white no-underline focus:outline-none">
              <span>
                <a href={`https://scan.test.btcs.network/address/${address}`} target="_blank" className="flex items-center">
                  <ExternalLinkIcon className="w-4 h-6" />
                  <span className="ml-2">{String(`https://scan.test.btcs.network/address/${address}`).substring(8, 18)}...</span>
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
