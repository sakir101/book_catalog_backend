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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const auth_utils_1 = require("./auth.utils");
const insertIntoDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.create({
        data: userData,
    });
    return result;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            email: email
        }
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    if (isUserExist.password &&
        !(yield (0, auth_utils_1.isPasswordMatched)(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    const { id: userId, role } = isUserExist;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken
    };
});
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
exports.AuthService = {
    insertIntoDB,
    loginUser
};
