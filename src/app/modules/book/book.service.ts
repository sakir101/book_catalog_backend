import { Book, Prisma } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { bookSearchableFields } from "./book.constant";
import { IBookFilterRequest } from "./book.interface";

const insertIntoDB = async (bookData: Book): Promise<Book> => {
    const result = await prisma.book.create({
        data: bookData,
        include: {
            category: true
        }
    })
    return result
}

const getAllFromDB = async (
    filters: IBookFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<Book[]>> => {

    const { page, limit, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters
    const andConditions = []

    if (Object.keys(filterData)[0] === 'minPrice') {
        console.log(Object.values(filterData)[0])
        const minP: number = parseFloat(String(Object.values(filterData)[0]));

        const result = await prisma.book.findMany({
            where: {
                price: {
                    gte: minP
                }
            }
        })
        const total = await prisma.book.count();
        return {
            meta: {
                total,
                page,
                limit
            },
            data: result
        }
    }
    if (Object.keys(filterData)[0] === 'maxPrice') {
        console.log(Object.values(filterData)[0])
        const maxP: number = parseFloat(String(Object.values(filterData)[0]));

        const result = await prisma.book.findMany({
            where: {
                price: {
                    lte: maxP
                }
            }
        })
        const total = await prisma.book.count();
        return {
            meta: {
                total,
                page,
                limit
            },
            data: result
        }
    }

    if (searchTerm) {
        andConditions.push({
            OR: bookSearchableFields.map((field) => ({
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

    const whereConditions: Prisma.BookWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {}
    const result = await prisma.book.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder
            } : {
                title: 'asc'
            }
    });

    const total = await prisma.book.count();

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}

const getDataById = async (id: string): Promise<Book | Book[] | null> => {
    const result = await prisma.book.findUnique({
        where: {
            id
        }
    })

    if (!result) {
        const result1 = await prisma.book.findMany({
            where: {
                categoryId: id
            }
        })

        return result1
    }

    return result;
}

const updateIntoDb = async (id: string, payload: Partial<Book>): Promise<Book> => {
    const result = await prisma.book.update({
        where: {
            id
        },
        data: payload
    })
    return result;
}

const deleteFromDB = async (id: string): Promise<Book> => {
    const result = await prisma.book.delete({
        where: {
            id
        }
    })
    return result;
}

export const BookService = {
    insertIntoDB,
    getAllFromDB,
    getDataById,
    updateIntoDb,
    deleteFromDB
}