
import React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';

interface RadioProps extends RadioGroup.RadioGroupProps {
    className: string,
    children: React.ReactNode
}
const RadioContainer = ({ className, children, ...props }: RadioProps) => {
    return (
        <RadioGroup.Root
            className={className}
            {...props}
        >
            {children}
        </RadioGroup.Root>);
}

export default RadioContainer;