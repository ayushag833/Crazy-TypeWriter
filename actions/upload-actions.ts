"use server";
import getDbConnection from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import OpenAI from "openai";
import { AssemblyAI } from 'assemblyai'
import { GoogleGenerativeAI } from "@google/generative-ai"

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_API_KEY!
})

export async function transcribeUploadedFile(
  resp: {
    serverData: { userId: string; file: any };
  }[]
) {
  if (!resp) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  const {
    serverData: {
      userId,
      file: { url: fileUrl, name: fileName },
    },
  } = resp[0];

  if (!fileUrl || !fileName) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  const config = {
    audio_url: fileUrl
  }

  try {
    const transcriptions = await client.transcripts.transcribe(config)
    return {
      success: true,
      message: "File uploaded successfully!",
      data: { transcriptions:transcriptions.text, userId },
    };
  } catch (error) {
    console.error("Error processing file", error);

    if (error instanceof OpenAI.APIError && error.status === 413) {
      return {
        success: false,
        message: "File size exceeds the max limit of 20MB",
        data: null,
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Error processing file",
      data: null,
    };
  }
}

async function saveBlogPost(userId: string, title: string, content: string) {
  try {
    const sql = await getDbConnection();
    const [insertedPost] = await sql`
    INSERT INTO posts (user_id, title, content)
    VALUES (${userId}, ${title}, ${content})
    RETURNING id
    `;
    return insertedPost.id;
  } catch (error) {
    console.error("Error saving blog post", error);
    throw error;
  }
}

async function getUserBlogPosts(userId: string) {
  try {
    const sql = await getDbConnection();
    const posts = await sql`
    SELECT content FROM posts 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC 
    LIMIT 3
  `;
    return posts.map((post) => post.content).join("\n\n");
  } catch (error) {
    console.error("Error getting user blog posts", error);
    throw error;
  }
}

async function generateBlogPost({
  transcriptions,
  userPosts,
}: {
  transcriptions: string;
  userPosts: string;
}) {
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Please convert the following transcription :- ${transcriptions} into a well-structured blog post using Markdown formatting. Follow this structure:

1. Start with a SEO friendly catchy title on the first line.
2. Add two newlines after the title.
3. Write an engaging introduction paragraph.
4. Create multiple sections for the main content, using appropriate headings (##, ###).
5. Include relevant subheadings within sections if needed.
6. Use bullet points or numbered lists where appropriate.
7. Add a conclusion paragraph at the end.
8. Ensure the content is informative, well-organized, and easy to read.
9. Emulate my writing style, tone, and any recurring patterns you notice from my previous posts.

You can also look out for similiar posts :- ${userPosts}`;
  
  const result = await model.generateContent(prompt);
  return result.response.text()
}

export async function generateBlogPostAction({
  transcriptions,
  userId,
}: {
  transcriptions: any;
  userId: string;
}) {
  const userPosts = await getUserBlogPosts(userId);

  let postId = null;

  if (transcriptions) {
    const blogPost = await generateBlogPost({
      transcriptions,
      userPosts,
    });

    if (!blogPost) {
      return {
        success: false,
        message: "Blog post generation failed, please try again...",
      };
    }

    const [title, ...contentParts] = blogPost?.split("\n\n") || [];

    //database connection

    if (blogPost) {
      postId = await saveBlogPost(userId, title, blogPost);
    }
  }

  //navigate
  revalidatePath(`/posts/${postId}`);
  redirect(`/posts/${postId}`);
}
