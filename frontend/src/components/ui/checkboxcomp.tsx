import { boolean } from "zod";
import CheckBox from "./checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

interface CheckBoxCompInteface {
    label: string,
    handleOnchange: (l: string, e: string | boolean) => void,
    value: string | boolean | CheckedState,
}
export default function CheckBoxComp({ label, handleOnchange, value }: CheckBoxCompInteface) {
    return (
        <div className="flex items-center">
            <CheckBox id={label} checked={value as CheckedState} name={label} onCheckedChange={(e) => handleOnchange(label, e)} />
            <label className="pl-[15px] text-[15px] leading-none text-white capitalize" htmlFor="c1">
                {label}
            </label>
        </div>
    )
}