import React, { ChangeEvent } from "react"
import TextField, { TextFieldProps } from "@mui/material/TextField"

interface CustomTextFieldProps {
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    label?: string;
    placeholder?: string;
    fullWidth?: boolean;
    variant?: 'standard' | 'outlined' | 'filled';
    className?: string;
}

function CustomTextField({
    onChange,
    value,
    label,
    placeholder,
    fullWidth = false,
    variant = 'outlined',
    className,
    ...restProps
}: CustomTextFieldProps & TextFieldProps) {
    return (
        <TextField
            onChange={onChange}
            value={value}
            label={label}
            placeholder={placeholder}
            fullWidth={fullWidth}
            variant={variant}
            className={className}
            {...restProps}
        />
    );
}

export default CustomTextField
