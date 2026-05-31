import axios from "axios"

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
})

export function signup(email: string, password: string, firstName: string, lastName: string) {
  return http.post("/auth/signup", { email, password, firstName, lastName })
}

export function login(email: string, password: string) {
  return http.post("/auth/login", { email, password })
}

export function forgotPassword(email: string) {
  return http.post("/auth/forgot-password", { email })
}

export function resetPassword(token: string, password: string) {
  return http.post("/auth/reset-password", { token, password })
}
