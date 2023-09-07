import { Order } from "@prisma/client"
import { Request, Response } from "express"
import httpStatus from "http-status"
import catchAsync from "../../../shared/catchAsync"
import pick from "../../../shared/pick"
import sendResponse from "../../../shared/sendResponse"
import { orderFilterableFields } from "./order.constant"
import { OrderService } from "./order.service"

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.insertIntoDB(req.body)
    sendResponse<Order>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order is created successfully",
        data: result
    })
})

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user

    const filters = pick(req.query, orderFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])

    const result = await OrderService.getAllFromDB(filters, options, user)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order data are fetched",
        meta: result.meta,
        data: result.data
    })
})

const getDataById = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user

    const result = await OrderService.getDataById(req.params.id, user)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order data fetched by id",
        data: result
    })
})

export const OrderController = {
    insertIntoDB,
    getAllFromDB,
    getDataById
}