import { Request, Response } from "express";
import { compileContract, verifyContract } from "../utils";

export async function compile(req: Request, res: Response) {
  let { name, contract } = req.body;
  console.log("loading", contract);
  try {
    const compiledContract = await compileContract(name, contract);
    res.status(200).json({ data: compiledContract });
  } catch (e: any) {
    res.status(500).json(e);
  }
}

export async function verify(req: Request, res: Response) {
  let {
    contractAddress,
    contractSourceCode,
    contractName,
    constructorArguments,
  } = req.body;
  try {
    const verified = await verifyContract(
      contractAddress,
      contractSourceCode,
      contractName,
      constructorArguments
    );
    res.status(200).json({ data: verified });
  } catch (e: any) {
    res.status(500).json(e);
  }
}
