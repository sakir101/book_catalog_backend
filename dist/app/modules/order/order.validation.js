"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = void 0;
const zod_1 = require("zod");
const order_constant_1 = require("./order.constant");
const create = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string({
            required_error: "User id is required"
        }),
        orderedBooks: zod_1.z.array(zod_1.z.unknown()),
        status: zod_1.z.enum([...order_constant_1.status]).optional()
    })
});
exports.OrderValidation = {
    create
};
