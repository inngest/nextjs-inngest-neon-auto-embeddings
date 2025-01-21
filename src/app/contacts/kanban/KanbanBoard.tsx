"use client";

import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Column } from "./Column";
import { Contact } from "./types";
import { ContactCard } from "./ContactCard";

const STATUSES = ["Lead", "Qualified", "Sales"] as const;

interface Props {
  initialContacts: Contact[];
}

export function KanbanBoard({ initialContacts }: Props) {
  const [contacts, setContacts] = useState(initialContacts);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const contact = contacts.find((c) => c.id === event.active.id);
    if (contact) {
      setActiveContact(contact);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveContact(null);

    if (!over) return;

    const activeContact = contacts.find((c) => c.id === active.id);
    const newStatus = over.id as (typeof STATUSES)[number];

    if (
      activeContact &&
      activeContact.status !== newStatus &&
      STATUSES.includes(newStatus)
    ) {
      try {
        const response = await fetch(`/api/contacts/${activeContact.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) throw new Error("Failed to update contact status");

        setContacts(
          contacts.map((contact) =>
            contact.id === activeContact.id
              ? { ...contact, status: newStatus }
              : contact
          )
        );
      } catch (error) {
        console.error("Error updating contact status:", error);
        alert("Failed to update contact status. Please try again.");
      }
    }
  };

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {STATUSES.map((status) => (
          <Column
            key={status}
            id={status}
            title={status}
            contacts={contacts.filter((contact) => contact.status === status)}
          />
        ))}
        <DragOverlay>
          {activeContact ? <ContactCard contact={activeContact} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
