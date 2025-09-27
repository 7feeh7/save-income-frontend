import { useState } from "react";
import { MuiTelInput, MuiTelInputProps } from "mui-tel-input";

type PhoneFieldProps = Omit<
  MuiTelInputProps,
  "value" | "onChange" | "defaultCountry"
> & {
  value: string;
  onChange?: (formatted: string) => void;
  onChangeRaw?: (digitsBR: string) => void;
  autoValidate?: boolean;
  keepCountryCodeInRaw?: boolean;
};

export default function PhoneField({
  value,
  onChange,
  onChangeRaw,
  autoValidate = true,
  keepCountryCodeInRaw = false,
  label = "Telefone",
  fullWidth = true,
  helperText,
  error,
  ...rest
}: PhoneFieldProps) {
  const [internalError, setInternalError] = useState(false);
  const [internalHelper, setInternalHelper] = useState<string | undefined>();

  const handleChange = (newValue: string) => {
    onChange?.(newValue);

    let digits = newValue.replace(/\D/g, ""); 

    if (!keepCountryCodeInRaw && digits.startsWith("55")) {
      digits = digits.slice(2); // -> "85989465100"
    }

    onChangeRaw?.(digits);

    if (autoValidate) {
      const isValid = digits.length === 11;
      setInternalError(!isValid);
      setInternalHelper(!isValid ? "Informe DDD + 9 + número (11 dígitos)" : undefined);
    }
  };

  return (
    <MuiTelInput
      value={value}
      onChange={handleChange}
      defaultCountry="BR"
      label={label}
      fullWidth={fullWidth}
      error={error ?? internalError}
      helperText={helperText ?? internalHelper}
      {...rest}
    />
  );
}
