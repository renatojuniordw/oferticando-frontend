import api from '@/lib/api'

export const login = async (identifier: string, password: string) => {
    const { data } = await api.post('/users/login', { identifier, password })
    return data
}

export const register = async (username: string, email: string, password: string) => {
    const { data } = await api.post('/users/register', { username, email, password })
    return data
}

export const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
}