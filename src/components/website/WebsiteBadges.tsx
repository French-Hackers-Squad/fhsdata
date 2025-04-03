import { Badge } from "@/components/ui/badge";
import { WebsiteStatus, WebsitePriority } from "@/types/website";

export const StatusBadge = ({ status }: { status: WebsiteStatus }) => {
  const getStatusColor = (status: WebsiteStatus) => {
    switch (status) {
      case "A attaquer":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "En cours":
        return "bg-blue-500 hover:bg-blue-600";
      case "Attaqué":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Badge className={getStatusColor(status)}>
      {status}
    </Badge>
  );
};

export const PriorityBadge = ({ priority }: { priority: WebsitePriority }) => {
  const getPriorityColor = (priority: WebsitePriority) => {
    switch (priority) {
      case "Haute":
        return "bg-red-500 hover:bg-red-600";
      case "Moyenne":
        return "bg-orange-500 hover:bg-orange-600";
      case "Basse":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Badge className={getPriorityColor(priority)}>
      {priority}
    </Badge>
  );
}; 
