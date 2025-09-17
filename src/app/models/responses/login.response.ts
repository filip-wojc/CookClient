export interface LoginResponse {
    userId: number
    accessToken: string
    refreshToken: string
    tokenExpiration: Date
    refreshTokenExpiration: Date
}