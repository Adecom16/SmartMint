"use client";

import { Gluten } from "next/font/google";
import Link from "next/link";

import ConnectButton from "@/hooks/useConnectButton";

export const gluten = Gluten({ subsets: ["latin"] });

export const NavBar = (props: { isDashboard?: boolean }) => {
  const { isDashboard } = props;
  return (
    <>
      <div className="fixed top-0 z-50 w-full   bg-opacity-30 backdrop-blur-lg backdrop-filter">
        <div className="mx-auto w-full px-4 sm:w-11/12 md:w-10/12">
          <div className="flex h-24 items-center justify-between">
            <Link
              href="/"
              className={`text-3xl font-semibold text-gray-100 lg:text-5xl ${gluten.className}`}
            >
              SmartMint
            </Link>
            {/* <w3m-button/> */}
            <ConnectButton />
            {/* <div className="space-x-6 text-gray-100"></div> */}
          </div>
        </div>
      </div>
    </>
  );
};
