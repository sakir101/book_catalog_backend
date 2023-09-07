"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const book_constant_1 = require("./book.constant");
const insertIntoDB = (bookData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.create({
        data: bookData,
        include: {
            category: true
        }
    });
    return result;
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (Object.keys(filterData)[0] === 'minPrice') {
        console.log(Object.values(filterData)[0]);
        const minP = parseFloat(String(Object.values(filterData)[0]));
        const result = yield prisma_1.default.book.findMany({
            where: {
                price: {
                    gte: minP
                }
            }
        });
        const total = yield prisma_1.default.book.count();
        return {
            meta: {
                total,
                page,
                limit
            },
            data: result
        };
    }
    if (Object.keys(filterData)[0] === 'maxPrice') {
        console.log(Object.values(filterData)[0]);
        const maxP = parseFloat(String(Object.values(filterData)[0]));
        const result = yield prisma_1.default.book.findMany({
            where: {
                price: {
                    lte: maxP
                }
            }
        });
        const total = yield prisma_1.default.book.count();
        return {
            meta: {
                total,
                page,
                limit
            },
            data: result
        };
    }
    if (searchTerm) {
        andConditions.push({
            OR: book_constant_1.bookSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.book.findMany({
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
    const total = yield prisma_1.default.book.count();
    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
});
const getDataById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.findUnique({
        where: {
            id
        }
    });
    if (!result) {
        const result1 = yield prisma_1.default.book.findMany({
            where: {
                categoryId: id
            }
        });
        return result1;
    }
    return result;
});
const updateIntoDb = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.update({
        where: {
            id
        },
        data: payload
    });
    return result;
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.delete({
        where: {
            id
        }
    });
    return result;
});
exports.BookService = {
    insertIntoDB,
    getAllFromDB,
    getDataById,
    updateIntoDb,
    deleteFromDB
};
