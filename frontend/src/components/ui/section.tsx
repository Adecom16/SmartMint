import React, { useEffect, useState } from "react"
import CheckBox from "./checkbox"
import { CheckedState } from "@radix-ui/react-checkbox"

interface SectionInterface {
    title: string,
    children: React.ReactNode,
    checkbox?: boolean,
    disabled?: boolean,
    value?: string | boolean | CheckedState,
    label?: string,
    handleOnchange?: (n: string, e: string | boolean) => void,
}

const sectionDefaultValues: any = {
    votes: 'Block Number',
    access: 'ownable',
    upgradeable: 'transparent'
}

export default function Section({ title, checkbox, disabled, value, label, handleOnchange, children }: SectionInterface) {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (value !== false) {
            setChecked(true);
        } else {
            setChecked(false);
        }
    }, [value])

    const handleStateChange = (e: any) => {
        if (handleOnchange && label) {
            e ? handleOnchange(label, sectionDefaultValues[label]) : handleOnchange(label, e)
        }
    }
    return (
        <div className="flex flex-col gap-2">
            <hr className="my-5" />
            <div className="flex flex-row gap-1 items-center">
                <p className="uppercase font-bold text-gray-400 text-xs">{title}</p>
                {checkbox && <CheckBox disabled={disabled as boolean} checked={checked as CheckedState} onCheckedChange={handleStateChange} className="shadow-blackA4 hover:bg-violet3 flex h-[15px] w-[15px] appearance-none items-center justify-center bg-white shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px_black]" />}
            </div>
            {children}
        </div>
    )
}