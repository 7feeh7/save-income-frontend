import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../components/Button";
import CustomTextField from "../components/TextField";
import PasswordField from "../components/PasswordField";
import SnackbarAlert from "../components/SnackbarAlert";
import { login } from "../service/auth-service";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = emailRegex.test(email);
  const passwordValid = password.length >= 6;
  const formValid = emailValid && passwordValid;

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  async function handleButtonClick() {
    if (!formValid) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Verifique email e senha (mín. 6 caracteres).");
      setSnackbarOpen(true);
      return;
    }

    try {
      setLoading(true);

      const data = await login({ email: email.trim(), password });

      localStorage.setItem("token", data.token);

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Usuário ou senha inválidos.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleButtonClick();
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100vh", display: "flex" }}
    >
      <Stack spacing={2} width={300}>
        <Typography variant="h4">Login</Typography>

        <CustomTextField
          label="Email"
          placeholder="Digite seu email"
          fullWidth
          value={email}
          onChange={handleEmailChange}
          error={!!email && !emailValid}
          helperText={!!email && !emailValid ? "Email inválido" : ""}
          onKeyDown={handleKeyDown}
        />

        <PasswordField
          label="Senha"
          placeholder="Digite sua senha"
          onChange={handlePasswordChange}
          error={!!password && !passwordValid}
          helperText={!passwordValid && password ? "Mínimo de 6 caracteres" : ""}
          onKeyDown={handleKeyDown}
        />

        <CustomButton
          variant="contained"
          color="primary"
          onClick={handleButtonClick}
          disabled={loading || !formValid}
        >
          {loading ? "Entrando..." : "Entrar"}
        </CustomButton>

        <Typography variant="body2" align="center">
          Não tem uma conta?{" "}
          <Link to="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
            Cadastre-se
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

export default Login;
