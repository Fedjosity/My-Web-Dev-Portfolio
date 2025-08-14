"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Mail, Plus, Calendar } from "lucide-react";

type Props = {
  totalMessages: number;
  totalProjects: number;
  messagesThisWeek: number;
};

export default function StatsSummary({
  totalMessages,
  totalProjects,
  messagesThisWeek,
}: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalMessages}</p>
              <p className="text-muted-foreground text-sm">Total Messages</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Plus className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalProjects}</p>
              <p className="text-muted-foreground text-sm">Custom Projects</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{messagesThisWeek}</p>
              <p className="text-muted-foreground text-sm">This Week</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
