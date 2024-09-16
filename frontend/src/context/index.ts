"use server";
import axios from "axios";
import { Addressable, solidityPacked } from "ethers";

export async function compile(contract: string, name: string): Promise<any> {
  "use server";
  name = name.replaceAll(" ", "");
  let compiling;
  try {
    compiling = true;
    const compiledContract = await axios.post(
      "https://badger-backend.onrender.com/v1/api/contract/compile",
      {
        name: name,
        contract: solidityPacked(["string"], [contract]),
      }
    );
    const res = await compiledContract.data;
    console.log(res);
     compiling = false;
    return { compiling:compiling, result:res.data }
    // return res.data;
  } catch (e: any) {
    console.log(e);
  }

  return {};
}

export async function verifyContract(
  contractAddress: string | Addressable,
  contractSourceCode: string,
  contractName: string,
  constructorArguments?: string[]
): Promise<any> {
  "use server";
  let verifying = true;
  try {
    const verifiedContract = await axios.post(
      "https://badger-backend.onrender.com/v1/api/contract/verify",
      {
        contractAddress,
        contractName,
        contractSourceCode: solidityPacked(["string"], [contractSourceCode]),
        constructorArguments,
      }
    );
    const res = await verifiedContract.data;
    console.log(res);
    verifying = false;
    return {verifying, res};
  } catch (e: any) {
    console.log(e);
  }
  return "";
}
