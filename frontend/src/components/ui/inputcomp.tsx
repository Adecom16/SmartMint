import { ChangeEventHandler } from "react";
import { Input } from "./input";
import { Label } from "./label";

interface InputComp {
    label: string,
    handleOnchange: ChangeEventHandler<HTMLInputElement>,
    value: string | number,
}
export default function InputComp({ label, handleOnchange, value }: InputComp) {
    return (
        <div className="mb-5 items-center gap-4">
            <Label htmlFor={label} className="text-right capitalize">
                {label}
            </Label>
            <Input
                id={label}
                name={label}
                onChange={handleOnchange}
                className="mt-2"
                value={value}
            />
        </div>
    )
}