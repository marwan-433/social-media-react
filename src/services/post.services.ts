import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
export async function getSinglePost(postId: string ){
    const data = await axios.get(`${baseUrl}/posts/${postId}`,
          
         {
            headers:{
                "Content-Type": "application/json",
                "Authorization":`Bearer ${localStorage.getItem("userToken")}`
            }
        }
    )
    return data;
}


export async function createPost( formdate : FormData ){
    const data = await axios.post(`${baseUrl}/posts`,
          formdate,
         {
            headers:{
                
                "Authorization":`Bearer ${localStorage.getItem("userToken")}`
            }
        }
    )
    return data;
}

export async function updatePost(postId: string, formdate : FormData ){
    const data = await axios.put(`${baseUrl}/posts/${postId}`,
          formdate,
         {
            headers:{
                
                "Authorization":`Bearer ${localStorage.getItem("userToken")}`
            }
        }
    )
    return data;
}

export async function deletePost(postId: string ){
    const data = await axios.delete(`${baseUrl}/posts/${postId}`,
          
         {
            headers:{
                
                "Authorization":`Bearer ${localStorage.getItem("userToken")}`
            }
        }
    )
    return data;
}

export async function likePost(postId: string) {
    const data = await axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/like`,
        null,
        {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("userToken")}`
            }
        }
    )
    return data;
}