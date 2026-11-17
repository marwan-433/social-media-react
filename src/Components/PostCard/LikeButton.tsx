import { useState } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { likePost } from "../../services/post.services";

interface LikeButtonProps {
  initialLikes: number;
  postId: string;
  initialIsLiked?: boolean;
  onLikesChange?: (likesCount: number) => void;
}

function LikeButton({
  initialLikes,
  postId,
  initialIsLiked = false,
  onLikesChange,
}: LikeButtonProps) {
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isUpdating, setIsUpdating] = useState(false);

  async function toggleLike() {
    setIsUpdating(true);

    try {
      await likePost(postId);
      const nextIsLiked = !isLiked;
      const nextLikesCount = likesCount + (nextIsLiked ? 1 : -1);
      setIsLiked(nextIsLiked);
      setLikesCount(nextLikesCount);
      onLikesChange?.(nextLikesCount);
    } catch {
      toast.error("Unable to update like. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <button
      type="button"
      aria-label={`${isLiked ? "Unlike" : "Like"} post (${likesCount} likes)`}
      aria-pressed={isLiked}
      disabled={isUpdating}
      onClick={toggleLike}
      className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-wait disabled:opacity-60 ${
        isLiked
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Heart
        size={18}
        aria-hidden="true"
        className={isLiked ? "fill-current" : ""}
      />
      {likesCount}
    </button>
  );
}

export default LikeButton;
