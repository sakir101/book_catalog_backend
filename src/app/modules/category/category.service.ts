import { Category, Prisma } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { categorySearchableFields } from "./category.constant";
import { ICategoryFilterRequest } from "./category.interface";


const insertIntoDB = async (categoryData: Category): Promise<Category> => {
    const result = await prisma.category.create({
        data: categoryData,
    })
    return result
}

const getAllFromDB = async (
    filters: ICategoryFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<Category[]>> => {

    const { page, limit, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters

    const andConditions = []
    if (searchTerm) {
        andConditions.push({
            OR: categorySearchableFields.map((field) => ({
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

    const whereConditions: Prisma.CategoryWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {}
    const result = await prisma.category.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder
            } : {
                title: 'asc'
            },
        include: {
            books: true
        }
    });

    const total = await prisma.category.count();

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}

const getDataById = async (id: string): Promise<Category | null> => {
    const result = await prisma.category.findUnique({
        where: {
            id
        },
        include: {
            books: true
        }
    })

    return result;
}

const updateIntoDb = async (id: string, payload: Partial<Category>): Promise<Category> => {
    const result = await prisma.category.update({
        where: {
            id
        },
        data: payload,
        include: {
            books: true
        }
    })
    return result;
}

const deleteFromDB = async (id: string): Promise<Category> => {
    const result = await prisma.category.delete({
        where: {
            id
        },
        include: {
            books: true
        }
    })
    return result;
}

export const CategoryService = {
    insertIntoDB,
    getAllFromDB,
    getDataById,
    updateIntoDb,
    deleteFromDB
}