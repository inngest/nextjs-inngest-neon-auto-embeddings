import Link from "next/link";
import { db } from "@/db";
import { contacts } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export default async function HomePage() {
  const [totalContacts] = await db.select({ value: count() }).from(contacts);
  const [leads] = await db
    .select({ value: count() })
    .from(contacts)
    .where(eq(contacts.status, "Lead"));
  const [qualified] = await db
    .select({ value: count() })
    .from(contacts)
    .where(eq(contacts.status, "Qualified"));
  const [sales] = await db
    .select({ value: count() })
    .from(contacts)
    .where(eq(contacts.status, "Sales"));

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Welcome to your CRM
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Manage your contacts and track their progress through your sales
            pipeline.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/contacts/upload"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Add Contacts
            </Link>
            <Link
              href="/contacts/kanban"
              className="text-sm font-semibold leading-6 text-white"
            >
              View Pipeline <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Contacts
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {totalContacts?.value ?? 0}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Leads
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {leads?.value ?? 0}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Qualified
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {qualified?.value ?? 0}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Sales
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {sales?.value ?? 0}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
