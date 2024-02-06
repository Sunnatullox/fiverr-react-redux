export const HOST = import.meta.env.VITE_APP_SERVER_URL
export const API_URL= `${HOST}/api`

export const AUTH_ROUTE = `${API_URL}/auth`

export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`
export const REGISTER_ROUTE = `${AUTH_ROUTE}/signup`
export const SET_USER_INFO = `${AUTH_ROUTE}/set-user-info`
