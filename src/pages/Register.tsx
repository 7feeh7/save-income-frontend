import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../components/Button";
import CustomTextField from "../components/TextField";
import PasswordField from "../components/PasswordField";
import PhoneField from "../components/PhoneField";
import { register } from "../service/user-service";
import SnackbarAlert from "../components/SnackbarAlert";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneFormatted, setPhoneFormatted] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneValid = phoneDigits.length === 11;
  const passwordValid = password.length >= 6;
  const passwordsMatch = confirmPassword === password;

  const isValid =
    name.trim().length >= 3 &&
    emailRegex.test(email) &&
    phoneValid &&
    passwordValid &&
    passwordsMatch;

  async function handleRegister() {
    try {
      setLoading(true);

      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phoneDigits,
        password,
        role_id: 1
      };

      await register(payload);

      setSnackbarMessage("Usuário cadastrado com sucesso!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setSnackbarMessage("Não foi possível concluir o cadastro.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100vh", display: "flex" }}
    >
      <Stack spacing={2} width={360}>
        <Typography variant="h4">Criar conta</Typography>

        <CustomTextField
          label="Nome"
          placeholder="Seu nome completo"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <CustomTextField
          label="Email"
          placeholder="exemplo@dominio.com"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!email && !emailRegex.test(email)}
          helperText={!!email && !emailRegex.test(email) ? "Email inválido" : ""}
        />

        <PhoneField
          value={phoneFormatted}
          onChange={setPhoneFormatted}
          onChangeRaw={setPhoneDigits}
        />

        <PasswordField
          label="Senha"
          placeholder="Mínimo de 6 caracteres"
          onChange={(e) => setPassword(e.target.value)}
          error={!!password && !passwordValid}
          helperText={!passwordValid && password ? "Senha muito curta" : ""}
        />

        <PasswordField
          label="Confirmar senha"
          placeholder="Repita sua senha"
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!confirmPassword && !passwordsMatch}
          helperText={
            !!confirmPassword && !passwordsMatch ? "As senhas não conferem" : ""
          }
        />

        <CustomButton
          variant="contained"
          color="primary"
          onClick={handleRegister}
          disabled={loading || !isValid}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </CustomButton>

        <Typography variant="body2" align="center">
          Já tem uma conta?{" "}
          <Link to="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
            Entrar
          </Link>
        </Typography>
      </Stack>
      <SnackbarAlert
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </Stack>
  );
}

export default Register;
