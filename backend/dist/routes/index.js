"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Contracts_1 = require("../controllers/Contracts");
const router = (0, express_1.Router)();
router.post("/compile", Contracts_1.compile);
router.post("/verify", Contracts_1.verify);
exports.default = router;
