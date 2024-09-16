"use client";

import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function ConnectButton() {
  const { open } = useWeb3Modal();
  const { isConnected } = useWeb3ModalAccount();
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])
 
  return (
    <>
      {isClient && isConnected ? (
        <w3m-button />
      ) : (
        <Button
          onClick={() => open()}
          variant={"outline"}
          className="h-[4rem] min-w-[4rem] gap-2 rounded-xl border border-purple-700 px-4 py-3 font-bold text-foreground lg:min-w-[8rem] lg:rounded-2xl"
          translate="no"
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
}
