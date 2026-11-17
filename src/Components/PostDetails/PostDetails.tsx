import React, { useContext, useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Globe2,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { Link, useParams } from "react-router";
import toast from "react-hot-toast";

import type { PostCardI, TopComment, } from "../../types/postCard.types";
import { getPostComments } from "../../services/comments.services";
import { getSinglePost } from "../../services/post.services";
import PostComment from "../PostCard/PostComment";
import LikeButton from "../PostCard/LikeButton";
import { UserContext } from "../Context/UserContext";



function PostDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState<PostCardI | null>(null);
  const [allComments, setAllComments] = useState<TopComment[] | []>([]);
  const [visibleComments, setVisibleComments] = useState(1);
  const userContext = useContext(UserContext);
  const userId = userContext?.userDetails?._id;
  const restOfComments = allComments.filter((comment)=>comment._id !== details?.topComment?._id)

  async function getPostDetails(postId: string) {
    try {
      const { data } = await getSinglePost(postId);
      if (!data?.data?.post) {
        setDetails(null);
        toast.error("Post not found.");
        return;
      }
      setDetails(data.data.post);
    } catch (error) {
      console.log(error);
      toast.error("Unable to load this post.");
    }
  }

  async function getComments(postId: string) {
    try {
      const { data } = await getPostComments(postId);
      if (!Array.isArray(data?.data?.comments)) {
        throw new Error("Comments response did not contain a comments list.");
      }
      setAllComments(data.data.comments);
      setDetails((currentDetails) =>
        currentDetails
          ? { ...currentDetails, commentsCount: data.data.comments.length }
          : currentDetails,
      );
    } catch (error) {
      console.log(error);
      toast.error("Unable to load comments.");
    }
  }

  useEffect(() => {
    if (!id) {
      toast.error("Post not found.");
      return;
    }

    getPostDetails(id);
    getComments(id);
  }, [id]);

  // const [liked, setLiked] = useState(false);
  // const [likes, setLikes] = useState(post.likesCount);
  // const [commentText, setCommentText] = useState("");
  // const [shareMessage, setShareMessage] = useState("");

  // function toggleLike() {
  //   setLiked((currentLiked) => {
  //     setLikes((currentLikes) => currentLikes + (currentLiked ? -1 : 1));
  //     return !currentLiked;
  //   });
  // }

  async function sharePost() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied");
    } catch {
      toast.error("Could not share this post.");
    }
  }

  function showMoreComments() {

    setVisibleComments(visibleComments + 2);
  }

  return (
    <>
      {details && (
        <>
          <div className="mx-auto mt-6 w-full  px-4 sm:px-5">
            <Link
              className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
              to="/feed"
            >
              <ArrowLeft aria-hidden="true" size={17} />
              Back to feed
            </Link>
          </div>
          <article className="mx-auto mb-6 mt-2 w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <header className="flex items-start justify-between gap-3 px-4 pt-4 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <img
                  className="size-11 shrink-0 rounded-full object-cover ring-2 ring-white"
                  src={details.user.photo}
                  alt={details.user.name}
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-1.5">
                    <span className="truncate text-sm font-semibold text-gray-900">
                      {details.user.name}
                    </span>
                    <span className="truncate text-xs text-gray-500">
                      {details.user.username}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                    <span>
                      {new Date(details.createdAt).toLocaleString("en-us", {
                        timeStyle: "short",
                        dateStyle: "full",
                      })}
                    </span>
                    <span aria-hidden="true">·</span>
                    <Globe2 aria-label="Public" size={13} />
                    <span>{details.privacy}</span>
                  </div>
                </div>
              </div>
              <button
                aria-label="More post options"
                className="-mr-2 flex size-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                type="button"
              >
                <MoreHorizontal size={21} />
              </button>
            </header>

            <div className="px-4 pb-3 pt-3 text-sm leading-6 text-gray-800 sm:px-5">
              <p>{details.body}</p>
            </div>

            {details.image && (
              <img
                className="block max-h-[520px] w-full bg-gray-100 object-cover"
                src={details.image}
                alt={details.body}
              />
            )}

            <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-gray-500 sm:px-5">
              <div className="flex items-center gap-2">
                <span className="flex size-[18px] items-center justify-center rounded-full bg-rose-500 text-white">
                  <Heart aria-hidden="true" fill="currentColor" size={11} />
                </span>
                <span>{details.likesCount} likes</span>
              </div>
              <div className="flex gap-3">
                <span>{details.commentsCount} comments</span>
                <span>{details.sharesCount} shares</span>
              </div>
            </div>

            <div className="mx-4 flex border-y border-gray-200 sm:mx-5">
              <div className="flex min-h-11 flex-1 items-center justify-center">
                <LikeButton
                  key={`${details._id}-${userId ?? ""}`}
                  initialLikes={Number(details.likesCount ?? 0)}
                  postId={details._id}
                  initialIsLiked={Boolean(
                    userId && (details.likes ?? []).includes(userId),
                  )}
                  onLikesChange={(likesCount) =>
                    setDetails((currentDetails) =>
                      currentDetails
                        ? { ...currentDetails, likesCount }
                        : currentDetails,
                    )
                  }
                />
              </div>
              <button
                className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                onClick={() =>
                  document.getElementById("post-details-comment")?.focus()
                }
                type="button"
              >
                <MessageCircle size={18} />
                Comment
              </button>
              <button
                className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                onClick={sharePost}
                type="button"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>

            <section aria-label="Comments" className="px-4 pb-4 pt-3 sm:px-5">
              <button
                className="mb-3 flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900"
                type="button"
                onClick={showMoreComments}
              >
                Show more comments
                <ChevronDown size={16} />
              </button>

              {allComments.length > 0 ? (
                allComments.slice(0, visibleComments).map((comment) => {
                  return (
                    <React.Fragment key={comment._id}>
                      <div className="space-y-3 my-4">
                        <div className="flex items-start gap-2.5">
                          <img
                            alt={comment.commentCreator.name}
                            className="mt-0.5 size-8 shrink-0 rounded-full object-cover"
                            src={comment.commentCreator.photo}
                          />
                          <div className="min-w-0 rounded-2xl bg-gray-100 px-3 py-2">
                            <div className="flex flex-wrap items-baseline gap-x-1.5">
                              <span className="text-xs font-semibold text-gray-900">
                                {comment.commentCreator.name}
                              </span>
                              <span className="text-[11px] text-gray-500">
                                {comment.commentCreator.username}
                              </span>
                            </div>
                            <p className="mt-0.5 break-words text-sm leading-5 text-gray-800">
                              {comment.content}
                            </p>
                            {comment.image && <>
                            <img src={comment.image} className="w-20 h-20" alt="" />
                            </>}
                            <span className="mt-1 block text-[11px] text-gray-500">
                              {new Date(comment.createdAt).toLocaleString(
                                "en-us",
                                {
                                  timeStyle: "short",
                                  dateStyle: "full",
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })
              ) : (
                <>

                  {details.topComment && (
                    <>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2.5">
                          <img
                            alt={details.topComment.commentCreator.name}
                            className="mt-0.5 size-8 shrink-0 rounded-full object-cover"
                            src={details.topComment.commentCreator.photo}
                          />
                          <div className="min-w-0 rounded-2xl bg-gray-100 px-3 py-2">
                            <div className="flex flex-wrap items-baseline gap-x-1.5">
                              <span className="text-xs font-semibold text-gray-900">
                                {details.topComment.commentCreator.name}
                              </span>
                              <span className="text-[11px] text-gray-500">
                                {details.topComment.commentCreator.username}
                              </span>
                            </div>
                            <p className="mt-0.5 break-words text-sm leading-5 text-gray-800">
                              {details.topComment.content}
                            </p>
                             {details.topComment.image && <>
                            <img src={details.topComment.image} className="w-20 h-20" alt="" />
                            </>}
                            <span className="mt-1 block text-[11px] text-gray-500">
                              {new Date(
                                details.topComment.createdAt,
                              ).toLocaleString("en-us", {
                                timeStyle: "short",
                                dateStyle: "full",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                   {restOfComments && restOfComments.slice(0, visibleComments).map((comment)=>{
                              return (
                              <React.Fragment key={comment._id}>
                                <div className="space-y-3 my-4">
                                  <div className="flex items-start gap-2.5">
                                    <img
                                      alt={comment.commentCreator.name}
                                      className="mt-0.5 size-8 shrink-0 rounded-full object-cover"
                                      src={comment.commentCreator.photo}
                                    />
                                    <div className="min-w-0 rounded-2xl bg-gray-100 px-3 py-2">
                                      <div className="flex flex-wrap items-baseline gap-x-1.5">
                                        <span className="text-xs font-semibold text-gray-900">
                                          {comment.commentCreator.name}
                                        </span>
                                        <span className="text-[11px] text-gray-500">
                                          {comment.commentCreator.username}
                                        </span>
                                      </div>
                                      <p className="mt-0.5 break-words text-sm leading-5 text-gray-800">
                                        {comment.content}
                                      </p>
                                       {comment.image && <>
                                              <img src={comment.image} className="w-20 h-20" alt="" />
                                              </>}
                                      <span className="mt-1 block text-[11px] text-gray-500">
                                        {new Date(comment.createdAt).toLocaleString("en-us", {
                                          timeStyle: "short",
                                          dateStyle: "full",
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </React.Fragment>
                            );
                            })}
                </>
              )}
               <PostComment postId={details._id} getComments={getComments}/>
            </section>
          </article>
        </>
      )}
    </>
  );
}

export default PostDetails;


