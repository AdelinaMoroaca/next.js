// src/app/blog/post/[id]/page.tsx
import { notFound } from "next/navigation";
import Post from "@/app/ui/components/posts/Post";
import { getPosts } from "@/app/lib/data";

// Explicit props type for this route
interface PostPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const posts = await getPosts();
  return posts.map((post) => ({ id: post.id }));
}

export default async function Page({ params }: PostPageProps) {
  const posts = await getPosts();
  const post = posts.find((p) => p.id === params.id);

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
