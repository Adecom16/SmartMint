import fs from "fs";
import fsPromises from "fs/promises";
import { spawn } from "child_process";
import { AbiCoder, Addressable, ethers, solidityPacked } from "ethers";
const code = new AbiCoder();

export async function compileContract(
  name: string,
  contract: string
): Promise<string> {
  name = name.replace(" ", "");
  contract = ethers.toUtf8String(contract);
  (async function main() {
    try {
      await fsPromises.writeFile("contracts/Contract.sol", contract);

      console.log("File written successfully");
      console.log("The written file has" + " the following contents:");

      console.log("" + fs.readFileSync("contracts/Contract.sol"));
    } catch (err) {
      console.error(err);
    }
  })();

  const child = spawn("npx hardhat compile", {
    stdio: "inherit",
    shell: true,
  });

  return new Promise<string>((resolve, reject) => {
    child.on("exit", function (code, signal) {
      if (code === 0) {
        try {
          let compiledContract = fs.readFileSync(
            `artifacts/contracts/Contract.sol/${name}.json`,
            "utf8"
          );
          resolve(compiledContract);
        } catch (err) {
          reject(err);
        }
      } else {
        reject(
          new Error(
            `child process exited with code ${code} and signal ${signal}`
          )
        );
      }
    });
  });
}

export async function verifyContract(
  contractAddress: string | Addressable,
  contractSourceCode: string,
  contractName: string,
  constructorArguments?: string[]
): Promise<string> {
  await compileContract(contractName, contractSourceCode);
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      const child = spawn(
        `npx hardhat verify --network testnet ${contractAddress} ${constructorArguments?.join(
          " "
        )}`,
        {
          stdio: "inherit",
          shell: true,
        }
      );

      child.on("exit", function (code, signal) {
        if (code === 0) {
          resolve("done");
        } else {
          reject(
            new Error(
              `child process exited with code ${code} and signal ${signal}`
            )
          );
        }
      });

      child.on("error", (err) => {
        reject(err);
      });
    }, 60000);
  });
}
