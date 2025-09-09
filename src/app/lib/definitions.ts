export type Post = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  date: string;
  user: string;
};

export type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};
