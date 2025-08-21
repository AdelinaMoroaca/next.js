import { posts } from "@/app/lib/placeholder-data";
import { notFound } from "next/navigation";
import Post from "@/app/ui/components/posts/Post";
import type { Post as PostType } from "@/app/lib/definitions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = (posts as PostType[]).find((p) => p.id === id);

  if (!post) notFound();

  return (
    <>
      <h1>Post</h1>
      <Post {...post} />
    </>
  );
}
