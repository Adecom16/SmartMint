"use client";

import { useState } from "react";
import { NavBar } from "@/components/shared/nav-bar";
import DashboardTabNavigation from "@/components/dashboard/DashboardNav";
import { OverviewComponent } from "@/components/dashboard/dashboardTabs/overview";
import { TokenOverview } from "@/components/dashboard/erc20/TokenOverview";
import { NFTOverview } from "@/components/dashboard/nft/NFTOverview";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import EmptyPage from "@/components/shared/EmptyPage";
import { useSmartMintProtocol } from "@/hooks/useSmartMintProtocol";
import { Erc1155Overview } from "@/components/dashboard/erc1155/Erc1155Overview";
import { DaoOverview } from "@/components/dashboard/dao/DaoOverview";

const Dashboard = () => {
  const [tab, setTab] = useState(0);
  const { isConnected } = useWeb3ModalAccount();
  const { tokens } = useSmartMintProtocol();

  return (
    <>
      <NavBar isDashboard={true} />
      {isConnected ? (
        <div className="relative mt-24">
          <DashboardTabNavigation
            tabs={[
              { id: 0, label: "Overview" },
              { id: 1, label: "Token" },
              { id: 2, label: "NFT" },
              { id: 3, label: "1155" },
              { id: 4, label: "DAO" },
            ]}
            selectedTab={tab}
            setTab={setTab}
          />

          <div className="p-4 sm:container sm:mx-auto">
            <div>
              {tab == 0 ? <OverviewComponent tokens={tokens} /> : ""}
              {tab == 1 ? <TokenOverview fullPage={true} tokens={tokens.data} /> : ""}
              {tab == 2 ? <NFTOverview fullPage={true} tokens={tokens.data} /> : ""}
              {tab == 3 ? <Erc1155Overview fullPage={true} tokens={tokens.data} /> : ""}
              {tab == 4 ? <DaoOverview fullPage={true} tokens={tokens.data} /> : ""}
            </div>
          </div>
        </div>
      ) : (
        <EmptyPage />
      )}
    </>
  );
};

export default Dashboard;
