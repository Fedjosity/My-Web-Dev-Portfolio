"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { Contact } from "../../../types/admin-types";

type Props = {
  contacts: Contact[];
  onChanged: () => void;
};

export default function ContactsList({ contacts, onChanged }: Props) {
  const handleDeleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    try {
      const { error } = await supabase.from("contacts").delete().eq("id", id);
      if (error) throw error;
      toast.success("Contact deleted successfully!");
      onChanged();
    } catch (err) {
      console.error("Error deleting contact:", err);
      toast.error("Failed to delete contact");
    }
  };

  if (contacts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            No messages yet. People will be able to contact you through the
            contact form.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <Card key={contact.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-lg font-semibold">{contact.name}</h3>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-primary hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>
                <p className="text-muted-foreground mb-3">{contact.message}</p>
                <div className="text-sm text-muted-foreground">
                  {new Date(contact.created_at).toLocaleString()}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteContact(contact.id)}
                className="text-destructive hover:text-destructive ml-4"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
