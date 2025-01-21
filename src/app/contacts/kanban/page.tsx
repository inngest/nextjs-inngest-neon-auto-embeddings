import { KanbanBoard } from "./KanbanBoard";

export default async function KanbanPage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/contacts`,
    {
      cache: "no-store",
    }
  );
  const contacts = await response.json();

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Contact Pipeline
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Manage your contacts through different stages.</p>
        </div>
        <div className="mt-5">
          <KanbanBoard initialContacts={contacts} />
        </div>
      </div>
    </div>
  );
}
