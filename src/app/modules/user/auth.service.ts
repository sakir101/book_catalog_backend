import { User } from "@prisma/client"
import prisma from "../../../shared/prisma"

const insertIntoDB = async (userData: User): Promise<User> => {
    const result = await prisma.user.create({
        data: userData,
    })
    return result
}

export const AuthService = {
    insertIntoDB
}