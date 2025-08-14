"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddProjectForm from "./AddProjectForm";
import ProjectsList from "./ProjectsList";
import ContactsList from "./ContactsList";
import type { Contact, Project } from "../../../types/admin-types";

type Props = {
  projects: Project[];
  contacts: Contact[];
  onRefresh: () => void;
};

export default function TabsContainer({
  projects,
  contacts,
  onRefresh,
}: Props) {
  return (
    <Tabs defaultValue="projects" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="contacts">Contacts</TabsTrigger>
      </TabsList>

      <TabsContent value="projects" className="space-y-6">
        <AddProjectForm onAdded={onRefresh} />
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Custom Projects</h2>
          <ProjectsList projects={projects} onChanged={onRefresh} />
        </div>
      </TabsContent>

      <TabsContent value="contacts" className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Contact Messages</h2>
          <ContactsList contacts={contacts} onChanged={onRefresh} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
