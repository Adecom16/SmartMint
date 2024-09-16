import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CodeBlock, dracula } from "react-code-blocks";

import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { getProvider } from "@/constants/providers";
import { getFactoryContract } from "@/constants/contracts";
import { generateErc20Code, validateInputs } from "@/utils";
import RadioContainer from "@/components/ui/radio";
import RadioItem from "@/components/ui/radioitem";
import CheckBox from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { compile, verifyContract } from "@/context";
import deploy, { objectValuesToArray } from "@/context/deploy";
import InputComp from "@/components/ui/inputcomp";
import CheckBoxComp from "@/components/ui/checkboxcomp";
import Section from "@/components/ui/section";
import RadioComp from "@/components/ui/radiocomp";
import { AddressLike } from "ethers";
import { useSmartMintProtocol } from "@/hooks/useSmartMintProtocol";
import { Switch } from "@/components/ui/switch";
import { StatusComponent } from "../shared/StatusModal";
import { Loader2 } from "lucide-react";

interface erc20InputValues {
  name: string;
  symbol: string;
  premint: number;
  decimal: number;
  description: string;
  mintable: boolean | string | CheckedState;
  burnable: boolean | string | CheckedState;
  pausable: boolean | string | CheckedState;
  permit: boolean | string | CheckedState;
  flashmint: boolean | string | CheckedState;
  votes: boolean | string | CheckedState;
  access: boolean | string;
  upgradeable: boolean | string;
}
const CreateErc20Form = ({ onSubmit }: { onSubmit?: () => void }) => {
  const { walletProvider } = useWeb3ModalProvider();
  const { address } = useWeb3ModalAccount();
  const readWriteProvider = getProvider(walletProvider);
  const { addContract } = useSmartMintProtocol();

  const [loading, setLoading] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [adding, setAdding] = useState(false)

  const [inputValues, setInputValues] = useState<erc20InputValues>({
    name: "MyToken",
    symbol: "MTK",
    premint: 0,
    decimal: 18,
    description: "",
    mintable: false,
    burnable: false,
    pausable: false,
    permit: false,
    flashmint: false,
    votes: false,
    access: false,
    upgradeable: false,
  });
  const [contractArguments, setConntractArguments] = useState<any>({
    ownable: {
      initialOwner: address,
    },
    roles: {
      defaultAdmin: address,
      pauser: address,
      minter: address,
      upgrader: address,
    },
    managed: {
      initialAuthority: address,
    },
  });
  const [contract, setContract] = useState("");

  useEffect(() => {
    setContract(generateErc20Code(inputValues));
  }, [inputValues]);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    // console.log(name, value);
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleCheckChange = (name: string, value: boolean | string) => {
    if (
      (name === "mintable" || name === "pausable" || value === "uups") &&
      inputValues.access === false
    ) {
      setInputValues({ ...inputValues, [name]: value, access: "ownable" });
    } else {
      setInputValues({ ...inputValues, [name]: value });
    }
  };

  const handelContractArgumentChange = (event: any) => {
    const { name, value } = event.target;
    setConntractArguments({
      ...contractArguments,
      [inputValues.access as string]: {
        ...contractArguments[inputValues.access as string],
        [name]: value,
      },
    });
  };

  const generateContractArgs = (): string[] => {
    if (inputValues.access === "ownable" && !inputValues.upgradeable) {
      return [contractArguments[inputValues.access as string].initialOwner];
    }
    if (inputValues.access === "managed" && !inputValues.upgradeable) {
      return [contractArguments[inputValues.access as string].initialAuthority];
    }
    if (inputValues.access === "roles" && !inputValues.upgradeable) {
      const args = [];
      args.push(contractArguments[inputValues.access as string].defaultAdmin);
      inputValues.pausable &&
        args.push(contractArguments[inputValues.access as string].pauser);
      inputValues.mintable &&
        args.push(contractArguments[inputValues.access as string].minter);
      inputValues.upgradeable === "uups" &&
        args.push(contractArguments[inputValues.access as string].upgrader);
      return args;
    }
    return [];
  };

  async function createToken() {
    setLoading(true);
    setOpenStatusModal(true);
    const signer = readWriteProvider
      ? await readWriteProvider.getSigner()
      : null;
    try {
      const args = generateContractArgs();
      setCompiling(true);
      const { compiling, result } = await compile(contract, inputValues.name);
      setCompiling(false);

      setDeploying(true);

      const { deploying, contractAddress } = await deploy(
        JSON.parse(result),
        signer,
        args
      );

      setDeploying(false);
      setAdding(true);

      await addContract(
        contractAddress,
        inputValues.name,
        JSON.stringify(JSON.parse(result).abi),
        0,
        contract
      );
      setAdding(false);
      setVerifying(true);
      const { verifying } = await verifyContract(
        contractAddress,
        contract,
        JSON.parse(result).contractName,
        args
      );
      setVerifying(false);
      setLoading(false);
      setOpenStatusModal(false);
    } catch (error) {
      console.error("error: ", error);
      setLoading(false);
      setOpenStatusModal(false);
    }
  }

  const error = validateInputs(inputValues, contractArguments);
  console.log(error);

  return (
    <>
      <DialogContent
        className={`${developerMode ? "sm:max-w-[425px] md:max-w-[90%]" : "full"
          }`}
      >
        <DialogHeader>
          <DialogTitle>Create Token</DialogTitle>
          <DialogDescription>
            {/* Make changes to your profile here. Click save when you are done. */}
            Parameters the contract specifies to be passed in during deployment.
          </DialogDescription>
        </DialogHeader>
        <div
          className={`${developerMode ? "flex flex-row items-stretch gap-2" : ""
            }`}
        >
          <div className=" p-4 flex-[0.6] mx-5 max-h-[500px] overflow-y-auto h-fit scrollbar-thin">
            <InputComp
              label="name"
              handleOnchange={handleInputChange}
              value={inputValues.name}
            />
            <InputComp
              label="symbol"
              handleOnchange={handleInputChange}
              value={inputValues.symbol}
            />
            {/* <InputComp
              label="description"
              handleOnchange={handleInputChange}
              value={inputValues.description}
            /> */}
            <InputComp
              label="premint"
              handleOnchange={handleInputChange}
              value={inputValues.premint}
            />
            {/* <InputComp
              label="decimal"
              handleOnchange={handleInputChange}
              value={inputValues.decimal}
            /> */}

            <Section title="features">
              <CheckBoxComp
                label="mintable"
                handleOnchange={handleCheckChange}
                value={inputValues.mintable}
              />
              <CheckBoxComp
                label="burnable"
                handleOnchange={handleCheckChange}
                value={inputValues.burnable}
              />
              <CheckBoxComp
                label="permit"
                handleOnchange={handleCheckChange}
                value={inputValues.permit}
              />
              <CheckBoxComp
                label="pausable"
                handleOnchange={handleCheckChange}
                value={inputValues.pausable}
              />
              <CheckBoxComp
                label="flashmint"
                handleOnchange={handleCheckChange}
                value={inputValues.flashmint}
              />
            </Section>

            <Section title="Advanced Options">
              <CheckBoxComp
                label="Show Advanced Options"
                handleOnchange={() => {
                  setShowAdvanced(!showAdvanced);
                }}
                value={showAdvanced}
              />
              <div className={`${showAdvanced ? "block" : "hidden"}`}>
                <Section
                  title="votes"
                  checkbox={true}
                  value={inputValues.votes}
                  label="votes"
                  handleOnchange={handleCheckChange}
                >
                  <RadioContainer
                    value={inputValues.votes as string}
                    onValueChange={(e) => handleCheckChange("votes", e)}
                    className="flex flex-col gap-2.5"
                  >
                    <RadioComp label="Block Number" value="Block Number" />
                    <RadioComp label="Time Stamp" value="Time Stamp" />
                  </RadioContainer>
                </Section>

                <Section
                  title="access control"
                  checkbox={true}
                  label="access"
                  value={inputValues.access}
                  handleOnchange={handleCheckChange}
                  disabled={
                    (inputValues.mintable as boolean) ||
                    (inputValues.pausable as boolean) ||
                    inputValues.upgradeable === "uups"
                  }
                >
                  <RadioContainer
                    value={inputValues.access as string}
                    onValueChange={(e) => handleCheckChange("access", e)}
                    className="flex flex-col gap-2.5"
                  >
                    <RadioComp label="Ownable" value="ownable" />
                    {inputValues.access === "ownable" && (
                      <InputComp
                        label="initialOwner"
                        handleOnchange={handelContractArgumentChange}
                        value={contractArguments.ownable.initialOwner}
                      />
                    )}
                    <RadioComp label="Roles" value="roles" />
                    {inputValues.access === "roles" && (
                      <>
                        <InputComp
                          label="defaultAdmin"
                          handleOnchange={handelContractArgumentChange}
                          value={contractArguments.roles.defaultAdmin}
                        />
                        {inputValues.pausable && (
                          <InputComp
                            label="pauser"
                            handleOnchange={handelContractArgumentChange}
                            value={contractArguments.roles.pauser}
                          />
                        )}
                        {inputValues.mintable && (
                          <InputComp
                            label="minter"
                            handleOnchange={handelContractArgumentChange}
                            value={contractArguments.roles.minter}
                          />
                        )}
                        {inputValues.upgradeable === "uups" && (
                          <InputComp
                            label="upgrader"
                            handleOnchange={handelContractArgumentChange}
                            value={contractArguments.roles.upgrader}
                          />
                        )}
                      </>
                    )}
                    <RadioComp label="Managed" value="managed" />
                    {inputValues.access === "managed" && (
                      <InputComp
                        label="initialAuthority"
                        handleOnchange={handelContractArgumentChange}
                        value={contractArguments.managed.initialAuthority}
                      />
                    )}
                  </RadioContainer>
                </Section>

                <Section
                  title="upgradability"
                  checkbox={true}
                  value={inputValues.upgradeable}
                  label="upgradeable"
                  handleOnchange={handleCheckChange}
                >
                  <RadioContainer
                    value={inputValues.upgradeable as string}
                    onValueChange={(e) => handleCheckChange("upgradeable", e)}
                    className="flex flex-col gap-2.5"
                  >
                    <RadioComp label="Transparent" value="transparent" />
                    <RadioComp label="UUPS" value="uups" />
                  </RadioContainer>
                </Section>
              </div>
            </Section>
          </div>
          {/* Display Codes Here */}
          <div
            className={`${developerMode ? "flex-1  relative max-h-[500px] scrollbar-thin" : "hidden"
              }`}
          >
            <CodeBlock
              text={contract}
              language={"solidity"}
              showLineNumbers={false}
              theme={dracula}
              customStyle={{
                height: "100%",
                position: "absolute",
                left: "0",
                top: "0",
                width: "100%",
              }}
            />
          </div>
        </div>
        {loading ? (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            {compiling && <p className="text-white">Compiling...</p>}
            {verifying && <p className="text-white">Verifying...</p>}
            {adding && <p className="text-white">Adding...</p>}
            {deploying && <p className="text-white">Deploying...</p>}
          </div>
        ) : (
          ""
        )}
        <DialogFooter className="w-full flex flex-row sm:justify-between items-center">
          <div className="flex flex-row items-center">
            <Switch
              id="developer-mode"
              checked={developerMode}
              onCheckedChange={setDeveloperMode}
              className="mr-3"
            />
            <Label htmlFor="developer-mode" className="text-xs">
              Developer Mode
            </Label>
          </div>
          <Button
            type="submit"
            onClick={() => {
              createToken();
            }}
            disabled={loading || error.length > 0}
          >
            {loading ? "Loading..." : "Deploy"}
          </Button>
        </DialogFooter>
      </DialogContent>
      {/* {openStatusModal && (
        <StatusComponent
        compiling={compiling}
        deploying={deploying}
        verifying={verifying}
        />
      )} */}
    </>
  );
};

export default CreateErc20Form;
