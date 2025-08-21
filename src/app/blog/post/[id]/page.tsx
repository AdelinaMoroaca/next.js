import { posts } from "@/app/lib/placeholder-data";
import { notFound } from "next/navigation";
import Post from "@/app/ui/components/posts/Post";

export default function Page({ params }: { params: { id: string } }) {
  const post = posts.find((post: { id: string }) => post.id === params.id);
  if (!post) return notFound();
  return (
    <>
      <h1>Post</h1>

      <Post {...post} />
    </>
  );
}
