import { Request, Response } from "express"
import httpStatus from "http-status"
import catchAsync from "../../../shared/catchAsync"
import pick from "../../../shared/pick"
import sendResponse from "../../../shared/sendResponse"
import { userFilterableFields } from "../user/auth.constant"
import { UserService } from "./user.service"

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {

    const filters = pick(req.query, userFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])

    const result = await UserService.getAllFromDB(filters, options)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User data are fetched",
        meta: result.meta,
        data: result.data
    })
})

const getDataById = catchAsync(async (req: Request, res: Response) => {


    const result = await UserService.getDataById(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User data fetched by id",
        data: result
    })
})

const getDataByProfile = catchAsync(async (req: Request, res: Response) => {

    const user = (req as any).user
    const result = await UserService.getDataByProfile(user)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User data fetched by id",
        data: result
    })
})

const updateIntoDb = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await UserService.updateIntoDb(id, payload)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Update data successfully",
        data: result
    })
})

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await UserService.deleteFromDB(id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Delete data successfully",
        data: result
    })
})

export const UserController = {
    getAllFromDB,
    getDataById,
    updateIntoDb,
    deleteFromDB,
    getDataByProfile
}
