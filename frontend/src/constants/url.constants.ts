let baseUrl: string;

if (process.env.NODE_ENV === "development") {
  baseUrl = "https://localhost:7042/api";
} else {
  baseUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:88/api";
}

export { baseUrl };
