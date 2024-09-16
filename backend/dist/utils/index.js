"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileContract = compileContract;
exports.verifyContract = verifyContract;
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const child_process_1 = require("child_process");
const ethers_1 = require("ethers");
const code = new ethers_1.AbiCoder();
async function compileContract(name, contract) {
    name = name.replace(" ", "");
    contract = ethers_1.ethers.toUtf8String(contract);
    (async function main() {
        try {
            await promises_1.default.writeFile("contracts/Contract.sol", contract);
            console.log("File written successfully");
            console.log("The written file has" + " the following contents:");
            console.log("" + fs_1.default.readFileSync("contracts/Contract.sol"));
        }
        catch (err) {
            console.error(err);
        }
    })();
    const child = (0, child_process_1.spawn)("npx hardhat compile", {
        stdio: "inherit",
        shell: true,
    });
    return new Promise((resolve, reject) => {
        child.on("exit", function (code, signal) {
            if (code === 0) {
                try {
                    let compiledContract = fs_1.default.readFileSync(`artifacts/contracts/Contract.sol/${name}.json`, "utf8");
                    resolve(compiledContract);
                }
                catch (err) {
                    reject(err);
                }
            }
            else {
                reject(new Error(`child process exited with code ${code} and signal ${signal}`));
            }
        });
    });
}
async function verifyContract(contractAddress, contractSourceCode, contractName, constructorArguments) {
    await compileContract(contractName, contractSourceCode);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const child = (0, child_process_1.spawn)(`npx hardhat verify --network testnet ${contractAddress} ${constructorArguments?.join(" ")}`, {
                stdio: "inherit",
                shell: true,
            });
            child.on("exit", function (code, signal) {
                if (code === 0) {
                    resolve("done");
                }
                else {
                    reject(new Error(`child process exited with code ${code} and signal ${signal}`));
                }
            });
            child.on("error", (err) => {
                reject(err);
            });
        }, 60000);
    });
}
