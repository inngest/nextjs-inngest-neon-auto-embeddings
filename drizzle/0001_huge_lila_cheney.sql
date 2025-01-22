CREATE EXTENSION vector;


ALTER TABLE "contacts" ADD COLUMN "embedding" vector(1536);--> statement-breakpoint
CREATE INDEX "embeddingIndex" ON "contacts" USING hnsw ("embedding" vector_cosine_ops);