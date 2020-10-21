export const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://jtwitter.me"
    : "http://localhost:3003";
export const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.jtwitter.me"
    : "http://localhost:3001";
