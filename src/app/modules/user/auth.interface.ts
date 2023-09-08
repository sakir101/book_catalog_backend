export type IUserFilterRequest = {
    searchTerm?: string | undefined;
    reviewAndRatings?: string | undefined;
    orders?: string | undefined;
    email?: string | undefined;
}

export type ILoginUser = {
    email: string;
    password: string
}

export type ILoginUserResponse = {
    accessToken: string,
    refreshToken?: string
}

export type IRefreshTokenResponse = {
    accessToken: string
}