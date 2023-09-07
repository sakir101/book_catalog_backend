import { Order, Prisma } from "@prisma/client";
import { BAD_REQUEST } from "http-status";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { orderSearchableFields } from "./order.constant";
import { IOrderFilterRequest, IUserInterface } from "./order.interface";

const insertIntoDB = async (orderData: Prisma.OrderCreateInput): Promise<Order> => {
    const result = await prisma.order.create({
        data: orderData
    });
    return result;
};

const getAllFromDB = async (
    filters: IOrderFilterRequest,
    options: IPaginationOptions,
    user: IUserInterface
): Promise<IGenericResponse<Order[]>> => {

    const { page, limit, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters

    const andConditions = []


    if (searchTerm) {
        andConditions.push({
            OR: orderSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditions: Prisma.OrderWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {}
    const result = await prisma.order.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder
            } : {
                createdAt: 'desc'
            },
        include: {
            user: true
        }
    });

    const total = await prisma.order.count();



    if (user.role === 'customer') {
        const result1 = result.filter((singleOrder) => (
            singleOrder.userId === user.userId
        ))


        return {
            meta: {
                total,
                page,
                limit
            },
            data: result1
        }
    }

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }


}

const getDataById = async (id: string, user: IUserInterface): Promise<Order | null> => {
    console.log(user)
    const result = await prisma.order.findUnique({
        where: {
            id
        },
        include: {
            user: true
        }
    })

    if (user.role === 'customer') {
        if (user.userId === result?.userId) {
            return result
        }
        else {
            throw new ApiError(BAD_REQUEST, "You are not authorized")
        }
    }
    return result;
}



export const OrderService = {
    insertIntoDB,
    getAllFromDB,
    getDataById
}