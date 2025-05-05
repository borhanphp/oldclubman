import axios from "axios";

export default axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    credentials: 'include',
    headers: {
        Accept: "application/json",
        "Authorization": `Bearer ${getToken("old_token")}`,
        "Content-Type": 'multipart/form-data',
    },
    withCredentials: true
});
