import { Category } from "@prisma/client"
import { Request, Response } from "express"
import httpStatus from "http-status"
import catchAsync from "../../../shared/catchAsync"
import pick from "../../../shared/pick"
import sendResponse from "../../../shared/sendResponse"
import { categoryFilterableFields } from "./category.constant"
import { CategoryService } from "./category.service"

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.insertIntoDB(req.body)
    sendResponse<Category>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category is created successfully",
        data: result
    })
})

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {

    const filters = pick(req.query, categoryFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])

    const result = await CategoryService.getAllFromDB(filters, options)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category data are fetched",
        meta: result.meta,
        data: result.data
    })
})

const getDataById = catchAsync(async (req: Request, res: Response) => {


    const result = await CategoryService.getDataById(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category data fetched by id",
        data: result
    })
})

const updateIntoDb = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await CategoryService.updateIntoDb(id, payload)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Update data successfully",
        data: result
    })
})

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await CategoryService.deleteFromDB(id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Delete data successfully",
        data: result
    })
})

export const CategoryController = {
    insertIntoDB,
    getAllFromDB,
    getDataById,
    updateIntoDb,
    deleteFromDB
}