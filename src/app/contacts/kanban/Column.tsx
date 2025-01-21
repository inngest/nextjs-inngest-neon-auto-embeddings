"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ContactCard } from "./ContactCard";
import { Contact } from "./types";

interface Props {
  id: string;
  title: string;
  contacts: Contact[];
}

export function Column({ id, title, contacts }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="w-80 bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium text-gray-900 mb-4">{title}</h3>
      <div
        ref={setNodeRef}
        className={`space-y-3 h-[800px] transition-colors ${
          isOver ? "bg-gray-200/50" : ""
        }`}
      >
        <SortableContext
          items={contacts.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
