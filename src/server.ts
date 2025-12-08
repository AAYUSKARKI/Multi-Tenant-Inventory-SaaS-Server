import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import { tenantRouter } from "./api/tenant/tenantRouter";
import { userRouter } from "./api/user/userRouter";
import { openAPIRouter } from "./api-docs/openAPIRouter";
import errorHandler from "./common/middleware/errorHandler";
import { itemRouter } from "./api/item/itemRouter";
import { warehouseRouter } from "./api/warehouse/warehouseRouter";
import { stockRouter } from "./api/stock/stockRouter";

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
app.use("/api", userRouter);
app.use("/api",itemRouter);
app.use("/api",warehouseRouter);
app.use("/api",stockRouter);


//swagger docs
app.use(openAPIRouter);

// Error Handling Middleware
app.use(errorHandler());

export { server };