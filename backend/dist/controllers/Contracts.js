"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = compile;
exports.verify = verify;
const utils_1 = require("../utils");
async function compile(req, res) {
    let { name, contract } = req.body;
    console.log("loading", contract);
    try {
        const compiledContract = await (0, utils_1.compileContract)(name, contract);
        res.status(200).json({ data: compiledContract });
    }
    catch (e) {
        res.status(500).json(e);
    }
}
async function verify(req, res) {
    let { contractAddress, contractSourceCode, contractName, constructorArguments, } = req.body;
    try {
        const verified = await (0, utils_1.verifyContract)(contractAddress, contractSourceCode, contractName, constructorArguments);
        res.status(200).json({ data: verified });
    }
    catch (e) {
        res.status(500).json(e);
    }
}
