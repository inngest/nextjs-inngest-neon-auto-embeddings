"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Contact } from "./types";

interface Props {
  contact: Contact;
}

export function ContactCard({ contact }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: contact.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-4 rounded-md shadow-sm cursor-move hover:shadow-md transition-all ${
        isDragging ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="font-medium text-gray-900">
        {contact.firstName} {contact.lastName}
      </div>
      <div className="text-sm text-gray-500">{contact.email}</div>
      {contact.company && (
        <div className="text-sm text-gray-500">{contact.company}</div>
      )}
    </div>
  );
}
