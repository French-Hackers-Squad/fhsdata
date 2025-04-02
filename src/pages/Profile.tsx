import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, User, Mail, Upload, X } from 'lucide-react';
import RetroLayout from '@/components/RetroLayout';

const profileSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  email: z.string().email('Email invalide'),
  avatar_url: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      email: '',
      avatar_url: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Utilisateur non trouvé');

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        form.reset({
          username: profile.username || '',
          email: user.email || '',
          avatar_url: profile.avatar_url || '',
        });

        if (profile.avatar_url) {
          setAvatarPreview(profile.avatar_url);
        }
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger le profil',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [form, toast]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Erreur',
          description: 'Le fichier doit être une image',
          variant: 'destructive',
        });
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Erreur',
          description: 'L\'image ne doit pas dépasser 5MB',
          variant: 'destructive',
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non trouvé');

      // Créer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload l'image
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erreur upload:', uploadError);
        throw new Error('Erreur lors de l\'upload de l\'image');
      }

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      // Mettre à jour le profil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Erreur mise à jour profil:', updateError);
        throw new Error('Erreur lors de la mise à jour du profil');
      }

      // Mettre à jour le formulaire et la prévisualisation
      form.setValue('avatar_url', publicUrl);
      setAvatarPreview(publicUrl);

      toast({
        title: 'Succès',
        description: 'Photo de profil mise à jour avec succès',
      });
    } catch (error) {
      console.error('Erreur complète:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de mettre à jour la photo de profil',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non trouvé');

      // Supprimer l'image du storage
      if (avatarPreview) {
        const oldPath = avatarPreview.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('profiles')
            .remove([`avatars/${oldPath}`]);
        }
      }

      // Mettre à jour le profil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Mettre à jour le formulaire et la prévisualisation
      form.setValue('avatar_url', '');
      setAvatarPreview(null);

      toast({
        title: 'Succès',
        description: 'Photo de profil supprimée avec succès',
      });
    } catch (error) {
      console.error('Erreur complète:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de supprimer la photo de profil',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non trouvé');

      const { error } = await supabase
        .from('profiles')
        .update({
          username: data.username,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Profil mis à jour avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le profil',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black/90">
        <div className="loader-matrix"></div>
      </div>
    );
  }

  return (
    <RetroLayout>
      <div className="min-h-screen bg-black/90 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="france-card">
            <div className="text-center mb-8">
              <div className="relative h-24 w-24 mx-auto mb-4">
                <div className="h-full w-full rounded-full overflow-hidden border-2 border-france-blue glow-text">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-full h-full p-6 text-france-blue" />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 flex gap-2">
                  <label className="cursor-pointer p-1 bg-france-blue rounded-full hover:bg-france-blue/80 transition-colors">
                    <Upload className="h-4 w-4 text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                    />
                  </label>
                  {avatarPreview && (
                    <button
                      onClick={removeAvatar}
                      disabled={uploading}
                      className="p-1 bg-france-red rounded-full hover:bg-france-red/80 transition-colors"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  )}
                </div>
              </div>
              <h1 className="text-4xl font-bold france-text mb-2">Profil</h1>
              <p className="text-france-white/90 text-lg">Gérez vos informations personnelles</p>
            </div>

            <div className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="france-card p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <User className="text-france-blue" size={20} />
                        <h3 className="font-bold text-france-white">Informations</h3>
                      </div>
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-france-white">Nom d'utilisateur</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-black/50 border-france-blue/30 text-france-white placeholder:text-france-white/50" />
                            </FormControl>
                            <FormMessage className="text-france-red" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="france-card p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Mail className="text-france-white" size={20} />
                        <h3 className="font-bold text-france-white">Contact</h3>
                      </div>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-france-white">Email</FormLabel>
                            <FormControl>
                              <Input {...field} disabled className="bg-black/50 border-france-blue/30 text-france-white/70" />
                            </FormControl>
                            <FormMessage className="text-france-red" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={saving} 
                      className="france-button text-france-white/90 hover:text-black"
                    >
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Enregistrer les modifications
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </RetroLayout>
  );
};

export default Profile; 