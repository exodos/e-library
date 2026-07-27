// Browser: use relative URLs so the current host works (localhost or production domain).
// Server (SSR in Docker): prefer INTERNAL_BASE_URL — `localhost` often fails in Alpine/Node
// containers (IPv6 ::1). 127.0.0.1 talks to the same Next process reliably.
export const baseUrl =
  typeof window === "undefined"
    ? process.env.INTERNAL_BASE_URL ||
      process.env.NEXTAUTH_URL ||
      "http://127.0.0.1:3000"
    : "";
