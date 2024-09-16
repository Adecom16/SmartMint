import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import contract from "./routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const swaggerDocument = YAML.load("./swagger.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/v1/api/contract", contract);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend OF smartMint Protocol");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
