import React, { useState } from "react";
import InfoCard from "../shared/InfoCard";
import { TokenOverview } from "../erc20/TokenOverview";
import { NFTOverview } from "../nft/NFTOverview";

import { useSmartMintProtocol, useERC20, useERC721 } from "@/hooks/useSmartMintProtocol";
import NoToken from "../NoTokens";
import { useGetAllERC721 } from "@/hooks/useERC721Factory";
import { Erc1155Overview } from "../erc1155/Erc1155Overview";
import { DaoOverview } from "../dao/DaoOverview";

export function OverviewComponent({ tokens }: { tokens: any }) {
  const [contractCreated, setContractCreated] = useState(false);


  const { data } = useERC20(tokens.data);
  const { nfts } = useERC721(tokens.data);


  // console.log(data);

  return (
    <div className="mt-14 rounded-lg  border-dashed border-gray-200 p-8  dark:border-gray-700">
      {data.length < 1 ? (
        <div>
          <NoToken />
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold lg:text-3xl">Overview</h2>

          <div className="mt-4 flex">
            <InfoCard title="Contracts Deployed" content={data.length + nfts.length} />
            <InfoCard title="Tokens Deployed" content={data.length} />
            <InfoCard title="NFTs Deployed" content={nfts.length} />
          </div>

          <TokenOverview fullPage={false} tokens={tokens.data} />
          <NFTOverview fullPage={false} tokens={tokens.data} />
          <Erc1155Overview fullPage={false} tokens={tokens.data} />
          {/* <DaoOverview fullPage={false} tokens={tokens.data} /> */}
          {/* <NFTOverview /> */}
        </div>
      )}
      {/* {!contractCreated && (
        <div className="mt-4 text-red-500">
          No account found. Please create an account.
        </div>
      )} */}
    </div>
  );
}
