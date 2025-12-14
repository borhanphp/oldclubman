import Comment from "./Comment";

const CommentThread = () => {
  // Your demo data structure is great for a recursive component!
  const comments = [
    {
      id: 1,
      client_comment: {
        id: 101,
        fname: "Mohmed Shahin",
        last_name: "",
        image: "/profile-avatar.png",
      },
      content: "আমাদেরই সেম অবস্তা বসে আছি বেবিকে নিয়ে। 😭",
      created_at: "1d",
      reactions: 43,
      children: [
        {
          id: 2,
          client_comment: {
            id: 102,
            fname: "Dhruba's World",
            last_name: "",
            image: "/profile-avatar.png",
          },
          content:
            "Mohmed Shahin আপনাকে কি বলে ধন্যবাদ জানানো যায় জানি না এতো রাতে আপনি বেবিকে নিয়ে? 😭👍👍👍👏",
          created_at: "1d",
          reactions: 38,
          children: [
            {
              id: 4,
              client_comment: {
                id: 103,
                fname: "Rahul Kumar",
                last_name: "",
                image: "/profile-avatar.png",
              },
              content: "হ্যাঁ ঠিক বলেছেন! বাচ্চাদের সাথে রাত জাগা খুব কঠিন 😴",
              created_at: "1d",
              reactions: 5,
              children: [], // Ensure all children have this key
            },
          ],
        },
        {
          id: 3,
          client_comment: {
            id: 101, // Same as main comment
            fname: "Mohmed Shahin",
            last_name: "",
            image: "/profile-avatar.png",
          },
          content: "Dhruba's World জি কিছু করার নেই মেয়ে বলে কথা 🌸",
          created_at: "1d",
          reactions: 1,
          children: [], // Ensure this is present
        },
      ],
    },
  ];

  return (
    <div className="relative max-w-2xl mx-auto p-4 bg-white">
      {/* We map over the top-level comments and render them */}
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentThread;