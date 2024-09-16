import { Router } from "express";
import { compile, verify } from "../controllers/Contracts";

const router = Router();

router.post("/compile", compile);
router.post("/verify", verify);

export default router;
