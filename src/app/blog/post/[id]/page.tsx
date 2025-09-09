// src/app/blog/post/[id]/page.tsx
import { notFound } from "next/navigation";
import Post from "@/app/ui/components/posts/Post";
import { getPosts } from "@/app/lib/data";

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const posts = await getPosts();
  return posts.map((post) => ({ id: post.id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ await because it's a Promise now
  const posts = await getPosts();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  return (
    <>
      <h1>Post</h1>
      <Post {...post} />
    </>
  );
}
