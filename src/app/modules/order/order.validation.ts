import { z } from "zod";
import { status } from "./order.constant";

const create = z.object({
    body: z.object({
        userId: z.string({
            required_error: "User id is required"
        }),
        orderedBooks: z.array(z.unknown()),
        status: z.enum([...status] as [string, ...string[]]).optional()
    })
})

export const OrderValidation = {
    create
}