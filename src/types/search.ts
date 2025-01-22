export interface SearchResult {
  id: string;
  first_name: string;
  last_name: string;
  company: string;
  content: string;
  similarity: number;
}

export interface SearchResponse {
  results: SearchResult[];
}
