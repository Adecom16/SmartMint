import * as RadioGroup from '@radix-ui/react-radio-group';

export default function RadioItem({ value, id }: { value: string, id: string }) {
    return (
        <RadioGroup.Item
            className="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-blackA4 hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black outline-none cursor-default"
            value={value}
            id={id}
        >
            <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-violet11" />
        </RadioGroup.Item>
    )
}