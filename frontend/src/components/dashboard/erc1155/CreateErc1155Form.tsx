import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { generateErc1155Code, validateInputs } from "@/utils";
import { compile, verifyContract } from "@/context";
import deploy from "@/context/deploy";
import InputComp from "@/components/ui/inputcomp";
import CheckBoxComp from "@/components/ui/checkboxcomp";
import Section from "@/components/ui/section";
import { useSmartMintProtocol } from "@/hooks/useSmartMintProtocol";
import { Switch } from "@/components/ui/switch";
import { StatusComponent } from "../shared/StatusModal";
import RadioContainer from "@/components/ui/radio";
import RadioComp from "@/components/ui/radiocomp";
import { Loader2 } from "lucide-react";

interface Erc1155InputValues {
  name: string;
  symbol: string;
  description: string;
  baseUri: string;
  mintable: boolean;
  burnable: boolean;
  pausable: boolean;
  supply: boolean;
  updatableUri: boolean;
  access: boolean | string;
  upgradeable: boolean | string;
}

export default function CreateErc1155Form({
  onSubmit,
}: {
  onSubmit?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [cid, setCid] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputFile = useRef<HTMLInputElement>(null);
  const { walletProvider } = useWeb3ModalProvider();
  const { address } = useWeb3ModalAccount();
  const { addContract } = useSmartMintProtocol();
  const [loading, setLoading] = useState(false);
  const [imageBlobUrl, setImageBlobUrl] = useState("");

  const [developerMode, setDeveloperMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [adding, setAdding] = useState(false);
  const readWriteProvider = getProvider(walletProvider);

  const [inputValues, setInputValues] = useState<Erc1155InputValues>({
    name: "MyERC1155",
    symbol: "ME1155",
    description: "",
    baseUri: "",
    mintable: true,
    burnable: false,
    pausable: false,
    supply: false,
    updatableUri: false,
    access: false,
    upgradeable: false,
  });

  const [contractArguments, setContractArguments] = useState<any>({
    ownable: {
      initialOwner: address,
    },
    roles: {
      defaultAdmin: address,
      pauser: address,
      minter: address,
      upgrader: address,
    },
  });

  const [contract, setContract] = useState("");

  useEffect(() => {
    setContract(generateErc1155Code(inputValues));
  }, [inputValues]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
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

  const handleContractArgumentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setContractArguments({
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

  async function uploadToIpfs(file: File, metadata: object) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("metadata", JSON.stringify(metadata));

    const response = await fetch("/api/files", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return response.json();
  }

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadToIpfs(file, {
        name: inputValues.name,
        description: inputValues.description,
      });

      setInputValues({
        ...inputValues,
        baseUri: `ipfs://${result.metadataHash}`,
      });

      setUploading(false);
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // setFile(selectedFile);
      handleUpload(selectedFile);
      const blobUrl = URL.createObjectURL(selectedFile);
      setImageBlobUrl(blobUrl);
    }
  };

  async function createERC1155() {
    setLoading(true);
    setOpenStatusModal(true);
    const signer = readWriteProvider
      ? await readWriteProvider.getSigner()
      : null;

    if (!signer) {
      console.error("No signer available");
      setLoading(false);
      setOpenStatusModal(false);
      return;
    }

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
        2,
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

  return (
    <DialogContent
      className={`${developerMode ? "sm:max-w-[425px] md:max-w-[90%]" : "full"
        }`}
    >
      <DialogHeader>
        <DialogTitle>Create ERC1155 Token</DialogTitle>
        <DialogDescription>
          Set the parameters for your ERC1155 token collection.
        </DialogDescription>
      </DialogHeader>
      <div
        className={`${developerMode ? "flex flex-row items-stretch gap-2" : ""
          }`}
      >
        <div className="py-4 mx-5 max-h-[500px] overflow-y-auto h-fit">
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
          <InputComp
            label="description"
            handleOnchange={handleInputChange}
            value={inputValues.description}
          />
          <InputComp
            label="baseUri"
            handleOnchange={handleInputChange}
            value={inputValues.baseUri}
          />

          <div className="flex w-full items-center justify-center mt-4">
            <label className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border">
              {imageBlobUrl ? (
                <div className="h-64 rounded-lg">
                  <img
                    src={imageBlobUrl}
                    alt="Selected"
                    className="h-full rounded-lg w-full"
                  />
                  {uploading && (
                    <p className="text-white">Image is uploading...</p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <svg
                    className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
              )}
              <input
                className="hidden"
                type="file"
                id="file"
                ref={inputFile}
                onChange={handleChange}
              />
            </label>
          </div>

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
              label="pausable"
              handleOnchange={handleCheckChange}
              value={inputValues.pausable}
            />
            <CheckBoxComp
              label="supply"
              handleOnchange={handleCheckChange}
              value={inputValues.supply}
            />
            <CheckBoxComp
              label="updatableUri"
              handleOnchange={handleCheckChange}
              value={inputValues.updatableUri}
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
                      handleOnchange={handleContractArgumentChange}
                      value={contractArguments.ownable.initialOwner}
                    />
                  )}
                  <RadioComp label="Roles" value="roles" />
                  {inputValues.access === "roles" && (
                    <>
                      <InputComp
                        label="defaultAdmin"
                        handleOnchange={handleContractArgumentChange}
                        value={contractArguments.roles.defaultAdmin}
                      />
                      {inputValues.pausable && (
                        <InputComp
                          label="pauser"
                          handleOnchange={handleContractArgumentChange}
                          value={contractArguments.roles.pauser}
                        />
                      )}
                      {inputValues.mintable && (
                        <InputComp
                          label="minter"
                          handleOnchange={handleContractArgumentChange}
                          value={contractArguments.roles.minter}
                        />
                      )}
                      {inputValues.upgradeable === "uups" && (
                        <InputComp
                          label="upgrader"
                          handleOnchange={handleContractArgumentChange}
                          value={contractArguments.roles.upgrader}
                        />
                      )}
                    </>
                  )}
                  <RadioComp label="Managed" value="managed" />
                  {inputValues.access === "managed" && (
                    <InputComp
                      label="initialAuthority"
                      handleOnchange={handleContractArgumentChange}
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
        {developerMode && (
          <div className="w-[75%] relative max-h-[500px]">
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
        )}
      </div>
      {uploading || loading ? (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          {uploading && <p className="text-white">Image is uploading...</p>}
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
          onClick={createERC1155}
          disabled={loading || uploading || error.length > 0}
        >
          {loading ? "Loading..." : "Deploy"}
        </Button>
      </DialogFooter>
      {/* {openStatusModal && (
        <StatusComponent
          compiling={compiling}
          deploying={deploying}
          verifying={verifying}
        />
      )} */}
    </DialogContent>
  );
}
