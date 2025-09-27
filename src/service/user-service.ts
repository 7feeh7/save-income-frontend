import { parseJwt } from "../utils/jwt";
import { api } from "./api";

type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type TUser = {
  id: string;
  name: string;
  email: string;
};


export async function register(payload: RegisterPayload) {
  const { data } = await api.post("/users", payload);
  return data;
}

export async function getMe(): Promise<TUser> {
  const token = localStorage.getItem("token");
  const payload = parseJwt<{ id?: string }>(token);

  if (!token || !payload?.id) {
    throw new Error("Token inválido ou ausente.");
  }

  const { data } = await api.get(`/users/${payload.id}`);
  return data as TUser;
}