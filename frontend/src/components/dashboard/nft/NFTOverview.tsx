import { NftTable } from './NftTable';
import { tableData } from '@/constants/dummyTableData';
import { CreateNFT } from './CreateNFT';
import { useGetAllERC721 } from '@/hooks/useERC721Factory';
import { useERC721 } from '@/hooks/useSmartMintProtocol';

export function NFTOverview({ fullPage, tokens }: { fullPage: boolean, tokens: any[] }) {
  // console.log(tableData)
  const { loading, nfts } = useERC721(tokens);
  // console.log(nfts);


  return (
    <div className="mt-20">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            NFT Contracts
          </h3>
          <small className="text-lg font-light text-gray-200">
            The list of NFT instances that you have deployed with SmartMint on the CoreDao
            Network.
          </small>
        </div>

        <CreateNFT />
      </div>
      <NftTable tableData={nfts} isLoading={false} fullPage={fullPage} />
    </div>
  )
}
