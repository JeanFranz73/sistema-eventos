import axios from "axios";

const api = axios.create({
    baseURL: "http://users-api:3001",
})

export const getUsers = async () => {
    return await api.get("/users")
}

export const getUser = async (id: number) => {
    return await api.get(`/users/${id}`)
}

export const createUser = async (user: any) => {
    return await api.post("/users", user)
}

export const updateUser = async (id: number, user: any) => {
    return await api.put(`/users/${id}`, user)
}

export const deleteUser = async (id: number) => {
    return await api.delete(`/users/${id}`)
}

export const changePassword = async (id: number, password: string, new_password: string) => {
    return await api.post(`/users/${id}/password`, { password, new_password })
}