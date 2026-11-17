import React from 'react'
import axios from 'axios'
import PostCard from '../../Components/PostCard/PostCard'
import Sidebar from '../../Components/Sidebar/Sidebar'
import SuggestedFriends from '../../Components/SuggestedFreinds/SuggestedFriends'
import { getUserfeed } from '../../services/Feed.services'
import { useEffect, useState } from 'react'
import { id } from 'zod/locales'
import type { PostCardI } from '../../types/postCard.types'
import PostSkeleton from '../../Components/PostCard/PostSkeleton'
import CreatePost from '../../Components/PostCard/CreatePost'
import { useQuery } from '@tanstack/react-query'

function Feed() {
 
  const {data , isLoading , isFetching , isError , error}= useQuery({

    queryKey:["getFeed"],
    queryFn:()=> getUserfeed(),
    select:(data)=> data.data.posts as PostCardI[],
    enabled:true,
    // retry:3,
    // retryOnMount:false,
    // retryDelay:2000
    // refetchInterval:1000,
    // refetchOnMount:false,
    // refetchOnWindowFocus:false,
    refetchIntervalInBackground:false,
    staleTime:4000,
    // gcTime:0

  })
  // const posts : PostCardI[] = data.data.posts
  // const [posts, setposts] = useState<PostCardI[] | []>([]);
  // const [isLoading, setisLoading] = useState(true)
  // async function getPosts() {
  //     try {
  //       const { data } = await getUserfeed()
  //       setposts(data.data.posts)
  //     } catch (error) {
  //       if (axios.isAxiosError(error)) {
  //         console.log(error.response?.data.message);
  //       }
  //     } finally {
  //       setisLoading(false)
  //     }

  //   }
    
  // useEffect(() => {
    
  //   getPosts()
  // }, [])
  return (
    <div className='mx-14'>
      <div className="grid grid-cols-12 gap-4">

        <div className="col-span-2">
          <Sidebar />
        </div>
        <div className="col-span-7"
        >
          <div className="">
         <h2>isloading {isLoading+""}</h2>
         <h2>isFetching {isFetching+""}</h2>

          </div>
          <CreatePost  />
          { isError?<><p>{error.message}</p></>: isLoading ? <PostSkeleton /> : data?.map((post) => {
            return <React.Fragment key={post._id}>
              <PostCard post={post}  />
            </React.Fragment>
          })}

        </div>
        <div className="col-span-3">
          <SuggestedFriends />
        </div>
      </div>
    </div>
  )
}

export default Feed
