import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
export async function getUserfeed(){
    const {data} = await axios.get(`${baseUrl}/posts?limit=30&page=  `,
          
         {
            headers:{
                "Content-Type": "application/json",
                "Authorization":`Bearer ${localStorage.getItem("userToken")}`
            }
        }
    )
    return data;
}