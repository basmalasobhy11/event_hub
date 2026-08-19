const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const AUTH_URL = process.env.AUTH_URL || "http://localhost:8082";
const CATALOG_URL = process.env.CATALOG_URL || "http://localhost:8081";
const BOOKING_URL = process.env.BOOKING_URL || "http://localhost:8083";
const AI_INSIGHT_URL = process.env.AI_INSIGHT_URL || "http://localhost:8084";
const ANALYTICS_URL = process.env.ANALYTICS_URL || "http://localhost:8085";
const PORT = process.env.PORT || 8080;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

app.use(cors({
  origin: FRONTEND_ORIGIN
}));

app.use("/api/auth", createProxyMiddleware({
  target: AUTH_URL,
  changeOrigin: true,
}));

app.use("/api/catalog", createProxyMiddleware({
  target: CATALOG_URL,
  changeOrigin: true,
}));

app.use("/api/bookings", createProxyMiddleware({
  target: BOOKING_URL,
  changeOrigin: true,
}));

app.use("/api/analyze", createProxyMiddleware({
  target: AI_INSIGHT_URL,
  changeOrigin: true,
}));

app.use("/api/analytics", createProxyMiddleware({
  target: ANALYTICS_URL,
  changeOrigin: true,
}));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Gateway running on http://localhost:${PORT}`);
});
