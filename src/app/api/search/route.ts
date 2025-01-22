import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { neon } from "@neondatabase/serverless";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    // Generate embedding for search query
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
      dimensions: 1536,
    });
    const embedding = embeddingResponse.data[0].embedding;

    // Perform vector similarity search using cosine similarity
    const results = await sql`
      SELECT 
        id,
        first_name,
        last_name,
        company,
        notes as content,
        1 - (embedding <=> ${JSON.stringify(embedding)}::vector) as similarity
      FROM contacts
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> ${JSON.stringify(embedding)}::vector
      LIMIT 5
    `;

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
