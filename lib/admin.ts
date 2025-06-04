export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "20100712oga",
}

export function isAdmin(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}
