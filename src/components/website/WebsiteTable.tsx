import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Globe, AlertTriangle, Clock, CheckCircle, Flame, Shield, Target, Flag } from "lucide-react";
import { StatusBadge, PriorityBadge } from "./WebsiteBadges";
import { Website } from "@/types/website";
import { formatDate } from "@/utils/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface WebsiteTableProps {
  websites: Website[];
  onEdit: (website: Website) => void;
  onDelete: (website: Website) => void;
}

const WebsiteTable = ({ websites, onEdit, onDelete }: WebsiteTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "A attaquer":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "En cours":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "Attaqué":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      default:
        return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "A attaquer":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case "En cours":
        return <Clock className="h-4 w-4 text-blue-400" />;
      case "Attaqué":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return null;
    }
  };

  const getPriorityIcon = (priority: string) => {
    const color = priority === "Haute" ? "text-red-400" : priority === "Moyenne" ? "text-yellow-400" : "text-green-400";
    return <Flag className={`h-4 w-4 ${color}`} />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Haute":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "Moyenne":
        return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "Basse":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      default:
        return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-black/5 backdrop-blur-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">URL</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Priorité</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Date d'ajout</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Ajouté par</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-zinc-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {websites.map((website) => (
            <tr
              key={website.id}
              className="border-b border-zinc-800 last:border-0 hover:bg-black/10"
            >
              <td className="px-4 py-3">
                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-100 hover:text-zinc-300"
                >
                  {website.url}
                </a>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(website.status)}
                  <span className="text-sm text-zinc-100">{website.status}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {getPriorityIcon(website.priority)}
                  <span className="text-sm text-zinc-100">{website.priority}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-zinc-100">
                  {formatDate(website.date_added)}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6 border border-zinc-800">
                    <AvatarImage
                      src={website.profiles?.avatar_url || undefined}
                      alt={website.profiles?.username || website.user_name}
                    />
                    <AvatarFallback className="bg-black/20 text-zinc-400 text-xs">
                      {(website.profiles?.username || website.user_name || "?")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-zinc-100">
                    {website.profiles?.username || website.user_name}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(website)}
                    className="rounded-lg bg-black/10 p-2 text-zinc-400 hover:text-zinc-100"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(website)}
                    className="rounded-lg bg-black/10 p-2 text-zinc-400 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WebsiteTable; 
