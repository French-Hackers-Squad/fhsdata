import React, { useState } from "react";
import RetroLayout from "@/components/RetroLayout";
import { Terminal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import WebsiteStats from "@/components/website/WebsiteStats";
import WebsiteTable from "@/components/website/WebsiteTable";
import WebsiteFilters from "@/components/website/WebsiteFilters";
import { useWebsites } from "@/hooks/useWebsites";
import { Website, WebsiteStatus, WebsitePriority } from "@/types/website";

const WebsiteMonitor = () => {
  const {
    websites,
    filteredWebsites,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    addWebsite,
    updateWebsite,
    deleteWebsite
  } = useWebsites();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [protocol, setProtocol] = useState<"https://" | "http://">("https://");
  const [urlWithoutProtocol, setUrlWithoutProtocol] = useState("");
  const [newWebsite, setNewWebsite] = useState<{
    url: string;
    status: WebsiteStatus;
    priority: WebsitePriority;
    notes: string;
  }>({
    url: "",
    status: "A attaquer",
    priority: "Moyenne",
    notes: ""
  });

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fullUrl = `${protocol}${urlWithoutProtocol}`;
      await addWebsite({
        ...newWebsite,
        url: fullUrl
      });
      setShowAddModal(false);
      setNewWebsite({
        url: "",
        status: "A attaquer",
        priority: "Moyenne",
        notes: ""
      });
      setUrlWithoutProtocol("");
      setProtocol("https://");
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
    }
  };

  const handleUpdateWebsite = async (website: Website) => {
    try {
      await updateWebsite(website);
      setShowEditModal(false);
      setSelectedWebsite(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const handleDeleteWebsite = async (website: Website) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce site ?")) {
      try {
        await deleteWebsite(website.id);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader-matrix"></div>
      </div>
    );
  }

  return (
    <RetroLayout>
      <div className="w-full">
        <div className="relative z-10 w-full">
          <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 py-6 md:py-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-black/10 rounded-xl">
                  <Terminal className="h-6 w-6 text-zinc-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-zinc-100">
                    Moniteur de Sites Web
                  </h1>
                  <p className="text-zinc-400">
                    Surveillance et gestion des sites web
                  </p>
                </div>
              </div>

              <WebsiteStats websites={websites} />

              <WebsiteFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                priorityFilter={priorityFilter}
                onPriorityFilterChange={setPriorityFilter}
                onAddClick={() => setShowAddModal(true)}
              />

              <WebsiteTable
                websites={filteredWebsites}
                onEdit={(website) => {
                  setSelectedWebsite(website);
                  setShowEditModal(true);
                }}
                onDelete={handleDeleteWebsite}
              />
            </div>

            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogContent className="bg-black/10 backdrop-blur-md border-zinc-800">
                <DialogHeader>
                  <DialogTitle className="text-zinc-100">Ajouter un nouveau site</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddWebsite} className="space-y-4">
                  <div className="flex gap-2">
                    <select
                      value={protocol}
                      onChange={(e) => setProtocol(e.target.value as "https://" | "http://")}
                      className="px-3 py-2 rounded-lg bg-black/10 border border-zinc-800 text-zinc-300 focus:border-zinc-700"
                    >
                      <option value="https://">https://</option>
                      <option value="http://">http://</option>
                    </select>
                    <Input
                      placeholder="www.example.com"
                      value={urlWithoutProtocol}
                      onChange={(e) => setUrlWithoutProtocol(e.target.value)}
                      required
                      className="bg-black/10 border-zinc-800 text-zinc-300 placeholder-zinc-500"
                    />
                  </div>
                  <select
                    value={newWebsite.status}
                    onChange={(e) => setNewWebsite({ ...newWebsite, status: e.target.value as WebsiteStatus })}
                    className="w-full px-3 py-2 rounded-lg bg-black/10 border border-zinc-800 text-zinc-300 focus:border-zinc-700"
                  >
                    <option value="A attaquer">À attaquer</option>
                    <option value="En cours">En cours</option>
                    <option value="Attaqué">Attaqué</option>
                  </select>
                  <select
                    value={newWebsite.priority}
                    onChange={(e) => setNewWebsite({ ...newWebsite, priority: e.target.value as WebsitePriority })}
                    className="w-full px-3 py-2 rounded-lg bg-black/10 border border-zinc-800 text-zinc-300 focus:border-zinc-700"
                  >
                    <option value="Haute">Haute</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Basse">Basse</option>
                  </select>
                  <Input
                    placeholder="Notes"
                    value={newWebsite.notes}
                    onChange={(e) => setNewWebsite({ ...newWebsite, notes: e.target.value })}
                    className="bg-black/10 border-zinc-800 text-zinc-300 placeholder-zinc-500"
                  />
                  <Button type="submit" className="w-full bg-black/10 hover:bg-black/20 text-zinc-100">
                    Ajouter
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
              <DialogContent className="bg-black/10 backdrop-blur-md border-zinc-800">
                <DialogHeader>
                  <DialogTitle className="text-zinc-100">Modifier le site</DialogTitle>
                </DialogHeader>
                {selectedWebsite && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (selectedWebsite) handleUpdateWebsite(selectedWebsite);
                  }} className="space-y-4">
                    <Input
                      value={selectedWebsite.url}
                      onChange={(e) => setSelectedWebsite({ ...selectedWebsite, url: e.target.value })}
                      required
                      className="bg-black/10 border-zinc-800 text-zinc-300"
                    />
                    <select
                      value={selectedWebsite.status}
                      onChange={(e) => setSelectedWebsite({ ...selectedWebsite, status: e.target.value as WebsiteStatus })}
                      className="w-full px-3 py-2 rounded-lg bg-black/10 border border-zinc-800 text-zinc-300 focus:border-zinc-700"
                    >
                      <option value="A attaquer">À attaquer</option>
                      <option value="En cours">En cours</option>
                      <option value="Attaqué">Attaqué</option>
                    </select>
                    <select
                      value={selectedWebsite.priority}
                      onChange={(e) => setSelectedWebsite({ ...selectedWebsite, priority: e.target.value as WebsitePriority })}
                      className="w-full px-3 py-2 rounded-lg bg-black/10 border border-zinc-800 text-zinc-300 focus:border-zinc-700"
                    >
                      <option value="Haute">Haute</option>
                      <option value="Moyenne">Moyenne</option>
                      <option value="Basse">Basse</option>
                    </select>
                    <Input
                      placeholder="Notes"
                      value={selectedWebsite.notes || ""}
                      onChange={(e) => setSelectedWebsite({ ...selectedWebsite, notes: e.target.value })}
                      className="bg-black/10 border-zinc-800 text-zinc-300 placeholder-zinc-500"
                    />
                    <Button type="submit" className="w-full bg-black/10 hover:bg-black/20 text-zinc-100">
                      Mettre à jour
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </RetroLayout>
  );
};

export default WebsiteMonitor;
