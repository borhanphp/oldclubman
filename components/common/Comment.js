import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

const Comment = ({ comment, handleReplyToReply, handleModalCommentLike, isReply = false }) => {
  const hasReplies = comment.children && comment.children.length > 0;
  const secondReplyRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);

  // These are placeholders for your existing logic
  const renderContentWithMentions = (content) => content;
  const showingReactionsIcon = (reaction) => null;
  const formatCompactTime = (time) => time;

  useEffect(() => {
    // We only need to do this calculation for the main comment,
    // and only if there are at least two replies.
    if (!isReply && comment.children && comment.children.length >= 2) {
      const secondReplyElement = secondReplyRef.current;
      if (secondReplyElement) {
        // We get the position of the second reply relative to the main comment
        // to calculate the line height.
        const parentTop = secondReplyElement.parentNode.getBoundingClientRect().top;
        const secondReplyTop = secondReplyElement.getBoundingClientRect().top;
        
        // Calculate the height needed for the line to reach the horizontal bar.
        // The 18px offset aligns it with the horizontal line of the reply.
        setLineHeight(secondReplyTop - parentTop + 18);
      }
    }
  }, [comment, isReply]); // Recalculate if comments change

  return (
    <div className={`relative ${isReply ? 'ml-12' : ''}`}>
      {/*
        This is the main vertical line for the entire reply thread.
        Its height is now dynamically calculated.
      */}
      {!isReply && comment.children && comment.children.length >= 2 && (
        <div 
          className="absolute top-[36px] left-[18px] w-px bg-gray-300" 
          style={{ height: `${lineHeight}px` }}
        ></div>
      )}

      {/* The comment container with avatar and content */}
      <div className="flex items-start mb-4 relative">
        {/* Avatar */}
        <div className="relative mr-3 w-9 h-9 rounded-full overflow-hidden flex-shrink-0 z-10">
          <Image
            src={comment?.client?.image || "/common-avator.jpg"}
            className="w-full h-full object-cover"
            alt={`${comment?.client?.fname}`}
            width={36}
            height={36}
          />
        </div>

        {/* Comment content and actions */}
        <div className="flex-1">
          {/*
            This is the horizontal line for a single reply.
          */}
          {isReply && (
            <div className="absolute top-[18px] left-[-14px] w-[14px] h-px bg-gray-300"></div>
          )}
          
          <div className="bg-gray-100 p-3 rounded-2xl relative border border-gray-200">
            {/* Header with name and time */}
            <div className="font-medium text-sm">
              <Link href={`/${comment?.client_id}`} className="cursor-pointer hover:underline">
                {comment?.client?.fname}
              </Link>
              <span className="text-xs text-gray-500 ml-2">
                {formatCompactTime(comment.created_at)}
              </span>
            </div>
            {/* Content */}
            <div className="text-gray-700 text-sm mt-1">
              {renderContentWithMentions(comment.content)}
            </div>
            
            {/* Reaction pill */}
            {/* ... (Your existing reaction code here) */}
          </div>
          
          {/* Actions row */}
          <div className="flex items-center gap-3 ml-2 text-[12px] text-gray-600 mt-1">
            {/* ... (Your existing actions code here) */}
          </div>
        </div>
      </div>
      
      {/* Recursively render replies */}
      {hasReplies && (
        <div className="relative">
          {comment.children.map((child, i) => (
            <Comment
              key={child.id || i}
              comment={child}
              handleReplyToReply={handleReplyToReply}
              handleModalCommentLike={handleModalCommentLike}
              isReply={true}
              // We pass the ref only to the second child comment
              ref={i === 1 ? secondReplyRef : null}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;