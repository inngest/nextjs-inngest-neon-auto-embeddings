import { NextResponse } from "next/server";
import { db } from "@/db";
import { contacts } from "@/db/schema";
import { type NewContact } from "@/db/types";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();
    const rows = text.split("\n");

    // Parse headers (first row)
    const headers = rows[0].split(",").map((header) => header.trim());

    // Validate required headers
    const requiredHeaders = ["firstName", "lastName", "email"];
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));

    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { error: `Missing required headers: ${missingHeaders.join(", ")}` },
        { status: 400 }
      );
    }

    // Process each row (skip header row)
    const contacts_data = rows
      .slice(1)
      .filter((row) => row.trim()) // Skip empty rows
      .map((row) => {
        const values = row.split(",").map((value) => value.trim());
        const contact: Partial<NewContact> = {
          status: "Lead", // Default status for imported contacts
        };

        headers.forEach((header, index) => {
          if (values[index]) {
            contact[header as keyof NewContact] = values[index];
          }
        });

        return contact as NewContact; // We validated required fields above
      });

    // Insert all contacts
    const newContacts = await db
      .insert(contacts)
      .values(contacts_data)
      .returning();

    return NextResponse.json(newContacts, { status: 201 });
  } catch (error) {
    console.error("Error creating contacts:", error);
    return NextResponse.json(
      { error: "Failed to create contacts" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allContacts = await db.select().from(contacts);
    return NextResponse.json(allContacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}
