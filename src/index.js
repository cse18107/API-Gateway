const express = require('express');
const rateLimit = require('express-rate-limit');
const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 15 minutes
  max: 3,
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(limiter);

app.use(
  '/flightsService',
  createProxyMiddleware({
    target: ServerConfig.FLIGHT_SERVICE,
    changeOrigin: true,
    pathRewrite: {'^/flightsService' : '/'}
  }),
);

app.use(
  '/flightBookingService',
  createProxyMiddleware({
    target: ServerConfig.FLIGHT_BOOKING_SERVICE,
    changeOrigin: true,
    pathRewrite: {'^/flightBookingService' : '/'}
  }),
);

app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Successfully started the server on PORT: ${ServerConfig.PORT}`);
});

