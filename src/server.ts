import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import { tenantRouter } from "./api/tenant/tenantRouter";
import { openAPIRouter } from "./api-docs/openAPIRouter";
import errorHandler from "./common/middleware/errorHandler";

const app: Express = express();
const server = http.createServer(app);

// Middlewares
app.use(helmet());
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", tenantRouter);

//swagger docs
app.use(openAPIRouter);

// Error Handling Middleware
app.use(errorHandler());

export { server };