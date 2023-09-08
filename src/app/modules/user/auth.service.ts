import { User } from "@prisma/client"
import httpStatus from "http-status"
import { Secret } from "jsonwebtoken"
import config from "../../../config"
import ApiError from "../../../errors/ApiError"
import { jwtHelpers } from "../../../helpers/jwtHelpers"
import prisma from "../../../shared/prisma"
import { ILoginUser, ILoginUserResponse } from "./auth.interface"
import { isPasswordMatched } from "./auth.utils"

const insertIntoDB = async (userData: User): Promise<User> => {
    const result = await prisma.user.create({
        data: userData,
    })
    return result
}

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
    const { email, password } = payload;


    const isUserExist = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User does not exist")
    }



    if (
        isUserExist.password &&
        !await isPasswordMatched(password, isUserExist.password)
    ) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect')
    }


    const { id: userId, role } = isUserExist
    const accessToken = jwtHelpers.createToken(
        { userId, role },
        config.jwt.secret as Secret,
        config.jwt.expires_in as string
    )

    const refreshToken = jwtHelpers.createToken(
        { userId, role },
        config.jwt.refresh_secret as Secret,
        config.jwt.refresh_expires_in as string
    )


    return {
        accessToken,
        refreshToken
    }

}

// const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
//     let verifiedToken = null
//     try {
//         verifiedToken = jwtHelpers.verifyToken(token, config.jwt.refresh_secret as Secret);

//     } catch (err) {
//         throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token")
//     }

//     const { userId } = verifiedToken;

//     const isUserExist = await User.isUserExist(userId)

//     if (!isUserExist) {
//         throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
//     }

//     const newAccessToken = jwtHelpers.createToken(
//         {
//             id: isUserExist.id,
//             role: isUserExist.role
//         },
//         config.jwt.secret as Secret,
//         config.jwt.expires_in as string
//     )

//     return {
//         accessToken: newAccessToken
//     }
// }

export const AuthService = {
    insertIntoDB,
    loginUser
}