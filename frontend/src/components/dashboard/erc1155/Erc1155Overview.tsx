import { Erc1155Table } from './Erc1155Table';
import { CreateErc1155 } from './CreateErc1155';
import { useERC721 } from '@/hooks/useSmartMintProtocol';

export function Erc1155Overview({ fullPage, tokens }: { fullPage: boolean, tokens: any[] }) {
  // console.log(tableData)
  const { loading, nfts } = useERC721(tokens);
  // console.log(nfts);


  return (
    <div className="mt-20">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            NFT Contracts ERC1155
          </h3>
          <small className="text-lg font-light text-gray-200">
            The list of NFT instances that you have deployed with smartMint on the CoreDao
            Network.
          </small>
        </div>

        <CreateErc1155 />
      </div>
      <Erc1155Table tableData={nfts} isLoading={false} fullPage={fullPage} />
    </div>
  )
}
