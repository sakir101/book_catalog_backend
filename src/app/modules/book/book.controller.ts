import { Book } from "@prisma/client"
import { Request, Response } from "express"
import httpStatus from "http-status"
import catchAsync from "../../../shared/catchAsync"
import pick from "../../../shared/pick"
import sendResponse from "../../../shared/sendResponse"
import { bookFilterableFields } from "./book.constant"
import { BookService } from "./book.service"

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await BookService.insertIntoDB(req.body)
    sendResponse<Book>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Book is created successfully",
        data: result
    })
})

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {

    const filters = pick(req.query, bookFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])

    const result = await BookService.getAllFromDB(filters, options)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Book data are fetched",
        meta: result.meta,
        data: result.data
    })
})

const getDataById = catchAsync(async (req: Request, res: Response) => {


    const result = await BookService.getDataById(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Book data fetched by id",
        data: result
    })
})

const updateIntoDb = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await BookService.updateIntoDb(id, payload)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Update data successfully",
        data: result
    })
})

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await BookService.deleteFromDB(id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Delete data successfully",
        data: result
    })
})

export const BookController = {
    insertIntoDB,
    getAllFromDB,
    getDataById,
    updateIntoDb,
    deleteFromDB
}