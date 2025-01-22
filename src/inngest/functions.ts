import { inngest } from "./client";
import { OpenAI } from "openai";
import { neon } from "@neondatabase/serverless";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sql = neon(process.env.DATABASE_URL!);

export const generateEmbedding = inngest.createFunction(
  { id: "generate-document-embedding" },
  { event: "db/contacts.inserted" },
  async ({ event, step }) => {
    const { id, first_name, last_name, company, notes } = event.data.new;

    // Generate embedding using OpenAI
    const embedding = await step.run("Generate embedding", async () => {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: `${first_name.data} ${last_name.data} ${company.data} ${notes.data}`,
        dimensions: 1536,
      });
      return response.data[0].embedding;
    });

    // Store embedding in Neon
    await step.run("Store embedding", async () => {
      await sql`
        UPDATE contacts 
        SET 
          embedding = ${JSON.stringify(embedding)}::vector,
          updated_at = NOW()
        WHERE id = ${id.data}
      `;
    });

    return { id: id.data, status: "embedding_generated" };
  }
);

export const generateAllEmbeddings = inngest.createFunction(
  { id: "generate-all-embeddings", concurrency: 10 },
  { event: "db/contacts.generate-all-embeddings" },
  async ({ step }) => {
    // Fetch all contacts without embeddings
    const contacts = await step.run("Fetch contacts", async () => {
      return await sql`
        SELECT id, first_name, last_name, company, notes
        FROM contacts
        WHERE embedding IS NULL
      `;
    });

    // Process each contact
    const results = await Promise.all(
      contacts.map(async (contact) => {
        try {
          // Generate embedding using OpenAI
          const embedding = await step.run(
            `Generate embedding for contact ${contact.id}`,
            async () => {
              const response = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: `${contact.first_name} ${contact.last_name} ${contact.company} ${contact.notes}`,
                dimensions: 1536,
              });
              return response.data[0].embedding;
            }
          );

          // Store embedding in Neon
          await step.run(
            `Store embedding for contact ${contact.id}`,
            async () => {
              await sql`
                UPDATE contacts 
                SET 
                  embedding = ${JSON.stringify(embedding)}::vector,
                  updated_at = NOW()
                WHERE id = ${contact.id}
              `;
            }
          );

          return { id: contact.id, status: "success" };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(`Failed to process contact ${contact.id}:`, error);
          return { id: contact.id, status: "error", error: error.message };
        }
      })
    );

    return {
      processed: results.length,
      successful: results.filter((r) => r.status === "success").length,
      failed: results.filter((r) => r.status === "error").length,
      results,
    };
  }
);
