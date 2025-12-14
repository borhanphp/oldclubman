import { getLocal } from "@/utility";
import axios from "axios";
const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    credentials: 'include',
    headers: {
        Accept: "application/json",
        "Authorization": `Bearer ${getLocal('old_token')}`,
        "Content-Type": 'multipart/form-data',
    },
    withCredentials: true
});

export default api;
