import React, { ReactNode, MouseEvent } from "react"
import Button, { ButtonProps } from "@mui/material/Button"

interface CustomButtonProps {
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'primary' | 'secondary' | 'default';
    size?: 'small' | 'medium' | 'large';
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode;
}

function CustomButton({
    variant = 'contained',
    color = 'primary',
    size = 'medium',
    startIcon = null,
    endIcon = null,
    onClick,
    children,
    ...restProps
}: CustomButtonProps & ButtonProps) {
    return (
        <Button
            variant={variant}
            color={color}
            size={size}
            startIcon={startIcon}
            endIcon={endIcon}
            onClick={onClick}
            {...restProps}
        >
            {children}
        </Button>
    );
}

export default CustomButton
