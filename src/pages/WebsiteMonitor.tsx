import React, { useState, useEffect } from "react";
import RetroLayout from "@/components/RetroLayout";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Terminal, AlertTriangle, Check, X, LogIn, Plus, Shield, Target, Timer, CheckCircle2, Search, Filter, ArrowUpDown, Trash2, Edit2, Eye, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WebsiteStatus = "A attaquer" | "En cours" | "Attaqué";
type WebsitePriority = "Basse" | "Moyenne" | "Haute";

interface Website {
  id: string;
  url: string;
  status: WebsiteStatus;
  date_added: string;
  added_by?: string;
  notes?: string;
  priority?: WebsitePriority;
  ecrie: boolean;
}

const urlSchema = z.string().url().startsWith("http");

const WebsiteMonitor = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [filteredWebsites, setFilteredWebsites] = useState<Website[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [sortField, setSortField] = useState<keyof Website>("date_added");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
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
  const [protocol, setProtocol] = useState<"https://" | "http://">("https://");
  const [urlWithoutProtocol, setUrlWithoutProtocol] = useState("");

  const stats = {
    total: websites.length,
    aAttaquer: websites.filter(w => w.status === "A attaquer").length,
    enCours: websites.filter(w => w.status === "En cours").length,
    attaques: websites.filter(w => w.status === "Attaqué").length,
    hautePriorite: websites.filter(w => w.priority === "Haute").length
  };

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
      }
    );

    fetchSession();
    fetchWebsites();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let result = websites;
    
    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(website => 
        website.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        website.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtre par statut
    if (statusFilter) {
      result = result.filter(website => website.status === statusFilter);
    }
    
    // Filtre par priorité
    if (priorityFilter) {
      result = result.filter(website => website.priority === priorityFilter);
    }
    
    // Tri
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredWebsites(result);
  }, [websites, searchTerm, statusFilter, priorityFilter, sortField, sortDirection]);

  const convertToWebsite = (data: any): Website => ({
    id: data.id,
    url: data.url,
    status: data.status as WebsiteStatus,
    date_added: data.date_added,
    added_by: data.added_by,
    notes: data.notes,
    priority: data.priority as WebsitePriority,
    ecrie: data.ecrie || false
  });

  const fetchWebsites = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .order('date_added', { ascending: false });
      
      if (error) throw error;
      
      setWebsites((data || []).map(convertToWebsite));
    } catch (error) {
        console.error("Erreur lors de la récupération des sites:", error);
        toast({
          title: "Erreur",
        description: "Impossible de charger les sites",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const fullUrl = `${protocol}${urlWithoutProtocol}`;
      urlSchema.parse(fullUrl);
      
      const websiteData = {
        url: fullUrl,
        status: newWebsite.status,
        priority: newWebsite.priority,
        notes: newWebsite.notes || "",
        added_by: session.user.id,
        date_added: new Date().toISOString()
      };

      console.log("Données à insérer:", websiteData);
      
      const { data, error } = await supabase
        .from('websites')
        .insert([websiteData])
        .select();
      
      if (error) {
        console.error("Erreur Supabase:", error);
        throw error;
      }
      
      if (data && data[0]) {
        const newSite = convertToWebsite(data[0]);
        setWebsites(prev => [newSite, ...prev]);
        
        setShowAddModal(false);
        setNewWebsite({
          url: "",
          status: "A attaquer",
          priority: "Moyenne",
          notes: ""
        });
        setUrlWithoutProtocol("");
        setProtocol("https://");
        
        toast({
          title: "Succès",
          description: "Site ajouté avec succès"
        });
      }
    } catch (error) {
      console.error("Erreur détaillée:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'ajouter le site",
        variant: "destructive"
      });
    }
  };

  const handleUpdateWebsite = async (website: Website) => {
    try {
      const { error } = await supabase
        .from('websites')
        .update({
          url: website.url,
          status: website.status,
          priority: website.priority,
          notes: website.notes
        })
        .eq('id', website.id);
      
      if (error) throw error;
      
      setWebsites(prev => prev.map(w => w.id === website.id ? website : w));
      setShowEditModal(false);
      
        toast({
        title: "Succès",
        description: "Site mis à jour avec succès"
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du site:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le site",
        variant: "destructive"
      });
    }
  };

  const handleDeleteWebsite = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce site ?")) return;
    
    try {
      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setWebsites(prev => prev.filter(w => w.id !== id));
      
        toast({
        title: "Succès",
        description: "Site supprimé avec succès"
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du site:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le site",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: WebsiteStatus) => {
    switch (status) {
      case "A attaquer":
        return (
          <div className="flex items-center gap-2 text-red-500">
            <Target className="h-4 w-4" />
            <span>À Attaquer</span>
          </div>
        );
      case "En cours":
        return (
          <div className="flex items-center gap-2 text-yellow-500">
            <Timer className="h-4 w-4" />
            <span>En Cours</span>
          </div>
        );
      case "Attaqué":
        return (
          <div className="flex items-center gap-2 text-green-500">
            <Shield className="h-4 w-4" />
            <span>Attaqué</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: WebsitePriority) => {
    switch (priority) {
      case "Haute":
        return <Badge variant="destructive">Haute</Badge>;
      case "Moyenne":
        return <Badge variant="secondary">Moyenne</Badge>;
      case "Basse":
        return <Badge variant="default">Basse</Badge>;
      default:
        return null;
    }
  };

  if (!session) {
    return (
      <RetroLayout>
        <div className="min-h-screen flex items-center justify-center bg-black/90 p-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Connexion Requise</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center mb-4">Veuillez vous connecter pour accéder au panel d'administration</p>
              <Button 
                className="w-full" 
                onClick={() => navigate("/login")}
              >
                <LogIn className="mr-2" />
                Se connecter
              </Button>
            </CardContent>
          </Card>
        </div>
      </RetroLayout>
    );
  }

  return (
    <RetroLayout>
      <div className="min-h-screen bg-black/90 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* En-tête simplifié sans fond */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-france-blue/20 rounded-lg">
                  <Terminal className="h-6 w-6 text-france-blue" />
                </div>
                <h1 className="text-3xl font-bold text-france-white">
                  Surveillance des Sites
                </h1>
              </div>
              <p className="text-france-white/70 text-lg">
                Gestion et suivi des sites web à surveiller
              </p>
            </div>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-black/50 border border-france-blue/30 rounded-lg hover:bg-black/70 hover:border-france-blue/50 transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-france-blue/0 via-france-blue/10 to-france-blue/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="relative">
                  <Plus className="h-5 w-5 text-france-blue transition-transform duration-300 group-hover:rotate-90" />
                  <div className="absolute inset-0 bg-france-blue/10 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300"></div>
                </div>
                <span className="relative text-france-white/90 group-hover:text-france-white transition-colors duration-300">Nouveau Site</span>
              </div>
            </Button>
          </div>

          {/* Statistiques avec animations et effets de survol */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-black/50 border border-france-blue/30 hover:border-france-blue/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-france-blue/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-france-white/90">Total Sites</CardTitle>
                <Globe className="h-4 w-4 text-france-blue animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-france-white">{stats.total}</div>
                <p className="text-xs text-france-white/70 mt-1">Sites surveillés</p>
              </CardContent>
            </Card>
            <Card className="bg-black/50 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-france-white/90">À Attaquer</CardTitle>
                <Target className="h-4 w-4 text-red-500 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{stats.aAttaquer}</div>
                <p className="text-xs text-france-white/70 mt-1">En attente</p>
              </CardContent>
            </Card>
            <Card className="bg-black/50 border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-france-white/90">En Cours</CardTitle>
                <Timer className="h-4 w-4 text-yellow-500 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-500">{stats.enCours}</div>
                <p className="text-xs text-france-white/70 mt-1">En cours d'attaque</p>
              </CardContent>
            </Card>
            <Card className="bg-black/50 border border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-france-white/90">Attaqués</CardTitle>
                <Shield className="h-4 w-4 text-green-500 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{stats.attaques}</div>
                <p className="text-xs text-france-white/70 mt-1">Attaques réussies</p>
              </CardContent>
            </Card>
                </div>

          {/* Filtres et Recherche améliorés avec animations */}
          <div className="bg-black/50 p-4 rounded-lg border border-france-blue/30 backdrop-blur-sm shadow-lg hover:shadow-france-blue/20 transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-france-blue transition-transform duration-300 group-hover:scale-110" />
                  <Input
                    placeholder="Rechercher un site..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-black/30 border-france-blue/30 focus:border-france-blue transition-all duration-300"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-black/30 border border-france-blue/30 rounded px-4 py-2 text-france-white/90 focus:border-france-blue focus:outline-none transition-all duration-300 hover:bg-black/40"
                >
                  <option value="">Tous les statuts</option>
                  <option value="A attaquer">À Attaquer</option>
                  <option value="En cours">En Cours</option>
                  <option value="Attaqué">Attaqué</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-black/30 border border-france-blue/30 rounded px-4 py-2 text-france-white/90 focus:border-france-blue focus:outline-none transition-all duration-300 hover:bg-black/40"
                >
                  <option value="">Toutes les priorités</option>
                  <option value="Haute">Haute</option>
                  <option value="Moyenne">Moyenne</option>
                  <option value="Basse">Basse</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tableau amélioré avec animations */}
          <div className="bg-black/50 rounded-lg border border-france-blue/30 overflow-hidden backdrop-blur-sm shadow-lg hover:shadow-france-blue/20 transition-all duration-300">
            <Table>
              <TableHeader>
                <TableRow className="bg-black/30">
                  <TableHead 
                    className="cursor-pointer hover:bg-black/50 transition-colors duration-300"
                    onClick={() => {
                      setSortField("url");
                      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                    }}
                  >
                    <div className="flex items-center text-france-white/90 group">
                      URL
                      <ArrowUpDown className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </TableHead>
                  <TableHead className="text-france-white/90">Statut</TableHead>
                  <TableHead className="text-france-white/90">Priorité</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-black/50 transition-colors duration-300"
                    onClick={() => {
                      setSortField("date_added");
                      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                    }}
                  >
                    <div className="flex items-center text-france-white/90 group">
                      Date d'ajout
                      <ArrowUpDown className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </div>
                  </TableHead>
                        <TableHead className="text-france-white/90">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-france-blue"></div>
                        <p className="text-france-white/70">Chargement des sites...</p>
                      </div>
                          </TableCell>
                  </TableRow>
                ) : filteredWebsites.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Eye className="h-8 w-8 text-france-white/50 animate-pulse" />
                        <p className="text-france-white/70">Aucun site trouvé</p>
                            </div>
                          </TableCell>
                  </TableRow>
                ) : (
                  filteredWebsites.map((website) => (
                    <TableRow 
                      key={website.id}
                      className="hover:bg-black/30 transition-colors duration-300"
                    >
                      <TableCell className="font-medium text-france-white/90">
                        <a 
                          href={website.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-france-blue transition-colors duration-300 flex items-center gap-2"
                        >
                          <Globe className="h-4 w-4" />
                          {website.url}
                        </a>
                      </TableCell>
                      <TableCell>{getStatusBadge(website.status)}</TableCell>
                      <TableCell>{getPriorityBadge(website.priority)}</TableCell>
                      <TableCell className="text-france-white/70">
                        {new Date(website.date_added).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedWebsite(website);
                              setShowEditModal(true);
                            }}
                            className="hover:bg-france-blue/20 transition-colors duration-300"
                          >
                            <Edit2 className="h-4 w-4 text-france-blue" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteWebsite(website.id)}
                            className="hover:bg-red-500/20 transition-colors duration-300"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                  ))
                )}
                    </TableBody>
                  </Table>
          </div>
        </div>

        {/* Modal d'ajout amélioré */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="bg-black/90 border border-france-blue/30 backdrop-blur-sm shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-france-white bg-clip-text text-transparent bg-gradient-to-r from-france-blue to-france-white">
                Ajouter un site
              </DialogTitle>
              <DialogDescription className="text-france-white/70 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajoutez un nouveau site à surveiller
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddWebsite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-france-white/90">URL</label>
                <div className="flex gap-2">
                  <select
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value as "https://" | "http://")}
                    className="bg-black/30 border border-france-blue/30 rounded px-4 py-2 text-france-white/90 focus:border-france-blue focus:outline-none transition-all duration-300"
                  >
                    <option value="https://">https://</option>
                    <option value="http://">http://</option>
                  </select>
                  <Input
                    type="text"
                    value={urlWithoutProtocol}
                    onChange={(e) => setUrlWithoutProtocol(e.target.value)}
                    placeholder="example.com"
                    className="flex-1 bg-black/30 border-france-blue/30 focus:border-france-blue transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-france-white/90">Statut</label>
                <select
                  value={newWebsite.status}
                  onChange={(e) => setNewWebsite(prev => ({ ...prev, status: e.target.value as Website["status"] }))}
                  className="w-full bg-black/30 border border-france-blue/30 rounded px-4 py-2 text-france-white/90 focus:border-france-blue focus:outline-none transition-all duration-300"
                >
                  <option value="A attaquer">À Attaquer</option>
                  <option value="En cours">En Cours</option>
                  <option value="Attaqué">Attaqué</option>
                </select>
            </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-france-white/90">Priorité</label>
                <select
                  value={newWebsite.priority}
                  onChange={(e) => setNewWebsite(prev => ({ ...prev, priority: e.target.value as Website["priority"] }))}
                  className="w-full bg-black/30 border border-france-blue/30 rounded px-4 py-2 text-france-white/90 focus:border-france-blue focus:outline-none transition-all duration-300"
                >
                  <option value="Basse">Basse</option>
                  <option value="Moyenne">Moyenne</option>
                  <option value="Haute">Haute</option>
                </select>
          </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-france-white/90">Notes</label>
                <Input
                  type="text"
                  value={newWebsite.notes}
                  onChange={(e) => setNewWebsite(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notes sur le site..."
                  className="bg-black/30 border-france-blue/30 focus:border-france-blue transition-all duration-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="border-france-blue/30 text-france-white/90 hover:bg-france-blue/20 transition-all duration-300"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit"
                  className="bg-france-blue hover:bg-france-blue/90 text-white shadow-lg hover:shadow-france-blue/30 transition-all duration-300"
                >
                  Ajouter
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal d'édition amélioré */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="bg-black/90 border border-france-blue/30 backdrop-blur-sm shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-france-white bg-clip-text text-transparent bg-gradient-to-r from-france-blue to-france-white">
                Modifier le site
              </DialogTitle>
              <DialogDescription className="text-france-white/70 flex items-center gap-2">
                <Edit2 className="h-4 w-4" />
                Modifiez les informations du site
              </DialogDescription>
            </DialogHeader>
            {selectedWebsite && (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateWebsite(selectedWebsite);
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-france-white/90">URL</label>
                  <div className="flex gap-2">
                    <select
                      value={selectedWebsite.url.startsWith("https://") ? "https://" : "http://"}
                      onChange={(e) => {
                        const newProtocol = e.target.value as "https://" | "http://";
                        const urlWithoutProtocol = selectedWebsite.url.replace(/^https?:\/\//, "");
                        setSelectedWebsite(prev => prev ? { ...prev, url: `${newProtocol}${urlWithoutProtocol}` } : null);
                      }}
                      className="bg-black/30 border border-france-blue/30 rounded px-4 py-2 text-france-white/90 focus:border-france-blue focus:outline-none transition-all duration-300"
                    >
                      <option value="https://">https://</option>
                      <option value="http://">http://</option>
                    </select>
                    <Input
                      type="text"
                      value={selectedWebsite.url.replace(/^https?:\/\//, "")}
                      onChange={(e) => {
                        const protocol = selectedWebsite.url.startsWith("https://") ? "https://" : "http://";
                        setSelectedWebsite(prev => prev ? { ...prev, url: `${protocol}${e.target.value}` } : null);
                      }}
                      className="flex-1 bg-black/30 border-france-blue/30 focus:border-france-blue transition-all duration-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-france-white/90">Statut</label>
                  <select
                    value={selectedWebsite.status}
                    onChange={(e) => setSelectedWebsite(prev => prev ? { ...prev, status: e.target.value as Website["status"] } : null)}
                    className="w-full bg-black/30 border border-france-blue/30 rounded px-4 py-2 text-france-white/90 focus:border-france-blue focus:outline-none transition-all duration-300"
                  >
                    <option value="A attaquer">À Attaquer</option>
                    <option value="En cours">En Cours</option>
                    <option value="Attaqué">Attaqué</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-france-white/90">Priorité</label>
                  <select
                    value={selectedWebsite.priority}
                    onChange={(e) => setSelectedWebsite(prev => prev ? { ...prev, priority: e.target.value as Website["priority"] } : null)}
                    className="w-full bg-black/30 border border-france-blue/30 rounded px-4 py-2 text-france-white/90 focus:border-france-blue focus:outline-none transition-all duration-300"
                  >
                    <option value="Basse">Basse</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Haute">Haute</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-france-white/90">Notes</label>
                  <Input
                    type="text"
                    value={selectedWebsite.notes}
                    onChange={(e) => setSelectedWebsite(prev => prev ? { ...prev, notes: e.target.value } : null)}
                    className="bg-black/30 border-france-blue/30 focus:border-france-blue transition-all duration-300"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                    className="border-france-blue/30 text-france-white/90 hover:bg-france-blue/20 transition-all duration-300"
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-france-blue hover:bg-france-blue/90 text-white shadow-lg hover:shadow-france-blue/30 transition-all duration-300"
                  >
                    Enregistrer
                  </Button>
                </div>
              </form>
        )}
          </DialogContent>
        </Dialog>
      </div>
    </RetroLayout>
  );
};

export default WebsiteMonitor;
