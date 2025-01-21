export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  status: "Lead" | "Qualified" | "Sales";
  createdAt: string;
  updatedAt: string;
}
