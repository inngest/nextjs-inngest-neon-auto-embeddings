import { inngest } from "@/inngest/client";
import { generateEmbedding, generateAllEmbeddings } from "@/inngest/functions";
import { serve } from "inngest/next";

export const runtime = "edge";

// Create an API that serves our Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generateEmbedding, generateAllEmbeddings],
  streaming: "allow",
});
