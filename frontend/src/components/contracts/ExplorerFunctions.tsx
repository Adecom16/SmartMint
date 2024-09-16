import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const ExplorerFunctions = ({
  functionData,
  handleFunction,
  result,
}: {
  functionData: any;
  handleFunction: (name: string, args: any[]) => Promise<void>;
  result: any;
}) => {
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = async () => {
    setIsLoading(true);
    try {
      const args = functionData.inputs.map(
        (input: any) => inputValues[input.name]
      );
      await handleFunction(functionData.name, args);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  return (
    <>
      <div className="mt-5">
        {functionData.inputs.map((input: any, index: number) => (
          <div key={index} className="mb-5 items-center gap-4">
            <Label
              htmlFor={input.name}
              className="text-right text-lg capitalize text-gray-100"
            >
              {input.name} ({input.type})
            </Label>
            <Input
              name={input.name}
              id={input.name}
              value={inputValues[input.name] || ""}
              onChange={handleChange}
              placeholder={input.type}
              className="mt-2"
              type={input.type.startsWith("uint") ? "number" : "text"}
            />
          </div>
        ))}

        {result !== null && (
          <div className="mb-5 items-center gap-4">
            <Label
              htmlFor="Result"
              className="text-right text-lg capitalize text-gray-100"
            >
              Result
            </Label>
            <Input
              name="Result"
              id="Result"
              readOnly={true}
              value={String(result)}
              placeholder="Result"
              className="mt-2"
            />
          </div>
        )}

        <Button onClick={handleRun} disabled={isLoading}>
          {isLoading ? "Running..." : "Run"}
        </Button>
      </div>
    </>
  );
};
