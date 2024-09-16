"use client";

import { useEffect, useMemo, useState } from "react";

import ContractDetails from "@/components/contracts/ContractInfo";

import { NavBar } from "@/components/shared/nav-bar";
import ContractOverviewNav from "@/components/contracts/ContractOverviewNav";
import { ContractOverview } from "@/components/contracts/ContractOverview";
import { Explorer } from "@/components/contracts/Explorer";
import { getTokenMetadata, useGetSingleERC20 } from "@/hooks/useGetSingleTokens";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import EmptyPage from "@/components/shared/EmptyPage";
import { getAllEvents, getLogs } from "@/hooks/useGetERC20Events";
import EventTable from "@/components/contracts/ERC20Event";
import { toUtf8String } from "ethers";

const SingleContract = ({ params }: { params: { id: string } }) => {
  const { isConnected, address } = useWeb3ModalAccount();
  const [tokenMeta, setTokenMeta] = useState<any>();

  const [tab, setTab] = useState(0);

  const selectedToken = useGetSingleERC20(params.id);

  const logs = getLogs(params.id);
  // console.log(logs);

  useEffect(() => {
    async function getMeta() {
      const { symbol, supply, decimals, userBalance } = await getTokenMetadata(selectedToken?._abi, selectedToken?._contract, address);
      setTokenMeta({ symbol, supply, decimals, userBalance });
      await getAllEvents(selectedToken?._contractAddress, selectedToken?._abi);
    }
    getMeta();
  }, [selectedToken?._abi, selectedToken?._contract])
  return (
    <>
      <NavBar isDashboard={true} />
      {isConnected ? (
        <div className="relative mt-24">
          <ContractOverviewNav tab={tab} setTab={setTab} />
          <ContractDetails
            name={selectedToken?._name}
            description={selectedToken?.description}
            address={selectedToken?._contract}
          />

          <div className="p-4 sm:container sm:mx-auto">
            <div>
              {tab == 0 ? (
                <ContractOverview
                  supply={Number(tokenMeta?.supply)?.toString()}
                  symbol={tokenMeta?.symbol}
                  decimal={Number(tokenMeta?.decimals)}
                  userBalance={Number(tokenMeta?.userBalance)}
                  name={selectedToken?._name}
                  address={selectedToken?._contract}
                  logs={logs}

                />
              ) : (
                ""
              )}
              {tab == 1 ? (
                <EventTable logs={logs} address={params.id} />
              ) : (
                ""
              )}
              {tab == 2 ? <Explorer metadata={selectedToken} abi={JSON.parse(toUtf8String(selectedToken?._abi))} /> : ""}
            </div>
          </div>
        </div>
      ) : (
        <EmptyPage />
      )}
    </>
  );
};

export default SingleContract;
