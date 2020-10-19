export const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? "http://13.125.238.74"
    : "http://localhost:3003";
export const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "http://3.35.216.232"
    : "http://localhost:3001";
