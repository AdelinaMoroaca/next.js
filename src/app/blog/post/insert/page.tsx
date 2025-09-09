"use client";

import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@app/lib/definitions";
import { getSession } from "next-auth/react";

export default function Page() {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [content, setContent] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    content: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uuid = uuidv4();
    fetch(
      `/api/posts?id=${uuid}&title=${formData.title}&author=${user?.name}&content=${formData.content}&date=${formData.date}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: uuid }),
      }
    )
      .then(() => {
        setFormData({
          id: "",
          title: "",
          content: "",
          date: new Date().toISOString().slice(0, 10),
        });
        router.push("/blog/posts");
      })
      .catch(console.error);
  };

  const generateContent = async () => {
    if (!formData.title) return;
    setGenerating(true);
    try {
      const response = await fetch("/api/generateContent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: formData.title }),
      });

      const data = await response.json();

      if (data.content) {
        setContent(data.content);
        setFormData((prev) => ({ ...prev, content: data.content }));
      } else if (data.error) {
        console.error("OpenAI error:", data.error);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    getSession().then((session) => {
      setUser(session?.user || null);
      if (!session?.user) {
        router.push("/blog/posts");
      }
    });
  }, [router]);

  const postContent = useMemo(() => {
    return content || formData.content;
  }, [content, formData.content]);

  return (
    <div className="bg-white p-8 rounded shadow">
      <h2 className="text-2xl mb-4 text-purple-700">New Blog Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium">
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border-2 border-purple-100 p-2 rounded-md focus:border-purple-200 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="content" className="block font-medium">
            Content:
          </label>
          <textarea
            id="content"
            name="content"
            rows={4}
            value={formData.content}
            onChange={handleChange}
            className="w-full border-2 border-purple-100 p-2 rounded-md focus:border-purple-200 focus:outline-none"
          ></textarea>
          {generating && (
            <p className="text-purple-700 my-1">Generating content...</p>
          )}
          <button
            onClick={generateContent}
            type="button"
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Generate Content
          </button>
        </div>

        {postContent && (
          <div className="mt-4 p-4 bg-purple-50 rounded">
            <h3 className="font-semibold text-purple-700">
              Generated Preview:
            </h3>
            <p>{postContent}</p>
          </div>
        )}

        <div>
          <label htmlFor="date" className="block font-medium">
            Date:
          </label>
          <input
            type="text"
            id="date"
            name="date"
            value={formData.date}
            readOnly
            className="w-full border-2 border-purple-100 p-2 rounded-md focus:border-purple-200 focus:outline-none"
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
