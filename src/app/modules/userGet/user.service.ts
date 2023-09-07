import { Prisma, User } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { IUserInterface } from "../order/order.interface";
import { userSearchableFields } from "../user/auth.constant";
import { IUserFilterRequest } from "../user/auth.interface";

const getAllFromDB = async (
    filters: IUserFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<User[]>> => {

    const { page, limit, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters

    const andConditions = []
    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map((field) => ({
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

    const whereConditions: Prisma.UserWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {}
    const result = await prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder
            } : {
                name: 'asc'
            }
    });

    const total = await prisma.user.count();

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}

const getDataById = async (id: string): Promise<User | null> => {
    const result = await prisma.user.findUnique({
        where: {
            id
        }
    })

    return result;
}

const getDataByProfile = async (user: IUserInterface): Promise<User | null> => {
    const id = user.userId
    const result = await prisma.user.findUnique({
        where: {
            id
        }
    })

    return result;
}

const updateIntoDb = async (id: string, payload: Partial<User>): Promise<User> => {
    const result = await prisma.user.update({
        where: {
            id
        },
        data: payload
    })
    return result;
}

const deleteFromDB = async (id: string): Promise<User> => {
    const result = await prisma.user.delete({
        where: {
            id
        }
    })
    return result;
}

export const UserService = {
    getAllFromDB,
    getDataById,
    updateIntoDb,
    deleteFromDB,
    getDataByProfile
}
