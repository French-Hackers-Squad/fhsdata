import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, User, Mail, Upload, X, UserPlus } from 'lucide-react';
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
  const [hasProfile, setHasProfile] = useState(false);
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

        if (error) {
          if (error.code === 'PGRST116') {
            setHasProfile(false);
            form.reset({
              email: user.email || '',
              username: '',
              avatar_url: '',
            });
          } else {
            throw error;
          }
        } else {
          setHasProfile(true);
          form.reset({
            username: profile.username || '',
            email: user.email || '',
            avatar_url: profile.avatar_url || '',
          });

          if (profile.avatar_url) {
            setAvatarPreview(profile.avatar_url);
          }
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

      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Erreur',
          description: 'Le fichier doit être une image',
          variant: 'destructive',
        });
        return;
      }

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

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erreur upload:', uploadError);
        throw new Error('Erreur lors de l\'upload de l\'image');
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

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

      if (avatarPreview) {
        const oldPath = avatarPreview.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('profiles')
            .remove([`avatars/${oldPath}`]);
        }
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

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

  const createProfile = async (data: ProfileFormValues) => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non trouvé');

      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: data.username,
          avatar_url: avatarPreview,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setHasProfile(true);
      toast({
        title: 'Succès',
        description: 'Profil créé avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le profil',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!hasProfile) {
      await createProfile(data);
      return;
    }

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
              <h1 className="text-3xl font-bold france-text mb-2">
                {hasProfile ? 'Mon Profil' : 'Créer mon Profil'}
              </h1>
              <p className="text-france-white/90">
                {hasProfile 
                  ? 'Gérez vos informations personnelles'
                  : 'Créez votre profil pour accéder à toutes les fonctionnalités'
                }
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="relative h-24 w-24">
                    <div className="h-full w-full rounded-full overflow-hidden border-2 border-france-blue glow-text">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-black/50 flex items-center justify-center">
                          <User className="h-12 w-12 text-france-blue/70" />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 flex gap-2">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          id="avatar-upload"
                          disabled={uploading}
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="flex items-center justify-center h-8 w-8 bg-france-blue hover:bg-france-blue/90 text-white rounded-full cursor-pointer transition-colors duration-200"
                        >
                          {uploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                        </label>
                      </div>
                      {avatarPreview && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={removeAvatar}
                          disabled={uploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-france-white/90">Nom d'utilisateur</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-black/30 border-france-blue/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-france-white/90">Email</FormLabel>
                        <FormControl>
                          <Input {...field} disabled className="bg-black/30 border-france-blue/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-france-blue hover:bg-france-blue/90"
                  disabled={saving}
                >
                  {saving ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enregistrement...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {hasProfile ? (
                        <>
                          <User className="h-4 w-4" />
                          Mettre à jour le profil
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          Créer mon profil
                        </>
                      )}
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </RetroLayout>
  );
};

export default Profile; 
