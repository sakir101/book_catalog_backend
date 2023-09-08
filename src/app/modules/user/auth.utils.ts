export const isPasswordMatched = async (password: any, isExistPassword: any) => {
    if (password === isExistPassword) {
        return true
    } else {

        return false
    }
}