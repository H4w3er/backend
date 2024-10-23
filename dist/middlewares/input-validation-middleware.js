"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const inputValidationMiddleware = (req, res, next) => {
    const result = (0, express_validator_1.validationResult)(req);
    const errors = result.array();
    if (!result.isEmpty()) {
        //@ts-ignore
        res.status(400).json({ errorsMessages: errors.map(c => { return { message: c.msg, field: c === null || c === void 0 ? void 0 : c.path }; }) });
    }
    else {
        next();
    }
};
exports.inputValidationMiddleware = inputValidationMiddleware;
