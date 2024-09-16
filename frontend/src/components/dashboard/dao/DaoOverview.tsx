import { DaoTable } from './DaoTable';
import { tableData } from '@/constants/dummyTableData';
import { CreateDAO } from './CreateDAO';
import { useGetAllERC721 } from '@/hooks/useERC721Factory';
import { useERC721 } from '@/hooks/useSmartMintProtocol';

export function DaoOverview({ fullPage, tokens }: { fullPage: boolean, tokens: any[] }) {
  // console.log(tableData)
  const { loading, nfts } = useERC721(tokens);
  // console.log(nfts);


  return (
    <div className="mt-20">
      <h3 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center'>New Dashboard design for DAO coming soon</h3>
      <p className='text-gray-900 text-center text-xl'>We are currently developing a suitable design for creators to maintain and interact with their DAO</p>
    </div>
  )
}
