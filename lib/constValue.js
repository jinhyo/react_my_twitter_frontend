export const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? "ec2-13-125-238-74.ap-northeast-2.compute.amazonaws.com"
    : "http://localhost:3003";
export const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "ec2-3-35-216-232.ap-northeast-2.compute.amazonaws.com"
    : "http://localhost:3001";
