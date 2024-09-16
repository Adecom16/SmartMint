import { Label } from "./label";
import RadioItem from "./radioitem";

interface RadioCompInterface {
    label: string,
    value: string
}
export default function RadioComp({ label, value }: RadioCompInterface) {
    return (
        <div className="flex items-center gap-1">
            <RadioItem value={value} id={label} />
            <Label htmlFor={label}>{label}</Label>
        </div>
    )
}