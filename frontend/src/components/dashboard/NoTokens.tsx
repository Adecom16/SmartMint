"use client";

import React from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import CreateErc20Form from "./erc20/CreateErc20Form";
import CreateNftForm from "./nft/CreateNFTForm";
import CreateErc1155Form from "./erc1155/CreateErc1155Form"
import { CreateDAOForm } from "./dao/CreateDAOForm";

const NoToken = () => {
  return (

    <div className=" mt-8">
      <h2 className="text-center text-2xl font-bold lg:text-3xl">
        You have not created any projects
      </h2>

      <p className="mt-2 text-center text-lg leading-7">
        Pick from one one of our available options
      </p>

      <div>
        <div className="mt-16 flex justify-center flex-wrap gap-5">
          <Dialog>
            <DialogTrigger asChild>
              <div className="mr-8 block w-full max-w-xs cursor-pointer rounded-lg border p-5 shadow">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {/* {title} */}
                  Create ERC-20
                </h5>
                <p className="text-lg font-normal text-gray-100">
                  {/* {content} */}
                  Create a currency compliant with ERC-20 standard
                </p>
              </div>
            </DialogTrigger>
            <CreateErc20Form />
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <div className="mr-8 block w-full max-w-xs cursor-pointer rounded-lg border p-5 shadow">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {/* {title} */}
                  Create NFT
                </h5>
                <p className="text-lg font-normal text-gray-100">
                  {/* {content} */}
                  Create a token compliant with ERC-721 standard
                </p>
              </div>
            </DialogTrigger>
            <CreateNftForm />
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <div className="mr-8 block w-full max-w-xs cursor-pointer rounded-lg border p-5 shadow">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {/* {title} */}
                  Create ERC 1155 NFT
                </h5>
                <p className="text-lg font-normal text-gray-100">
                  {/* {content} */}
                  Create a token compliant with ERC-1155 standard
                </p>
              </div>
            </DialogTrigger>
            <CreateErc1155Form />
          </Dialog>
          {/*  */}
        </div>
      </div>

    </div>


  );
};

export default NoToken;
