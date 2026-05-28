import { supabase } from "@shared/infrastructure/supabase/client";
import { User } from "@features/auth/domain/entities/User";
import { IAuthRepository } from "@features/auth/domain/repositories/IAuthRepository";

const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL!;

export class SupabaseAuthRepository implements IAuthRepository {

  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw error;
    return this.fetchProfile(data.user.id, data.user.email!);
  }

  async loginWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw error;
  }

  async register(
    email: string,
    password: string,
    username: string,
    role: 'adoptante' | 'refugio' = 'adoptante',
    fullName?: string,
  ): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, role, full_name: fullName ?? '' },
        emailRedirectTo: `${WEB_URL}/confirm-email`,
      },
    });
    if (error) throw error;
    if (!data.user) throw new Error('No se pudo crear el usuario');

    await supabase.from('profiles').upsert(
      { id: data.user.id, username, role, full_name: fullName ?? '' },
      { onConflict: 'id' }
    );

    if (role === 'refugio') {
      await supabase.from('refugios').upsert(
        {
          id: data.user.id,
          name: fullName ?? username,
          lat: -0.1807,
          lng: -78.4678,
        },
        { onConflict: 'id' }
      );
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      username,
      role,
      fullName,
    };
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return this.fetchProfile(user.id, user.email!);
  }

  private async fetchProfile(id: string, email: string): Promise<User> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, full_name, avatar_url, role, phone, address')
      .eq('id', id)
      .single();

    return {
      id,
      email,
      username: profile?.username ?? '',
      fullName: profile?.full_name ?? undefined,
      avatarUrl: profile?.avatar_url ?? undefined,
      role: profile?.role ?? 'adoptante',
      phone: profile?.phone ?? undefined,
      address: profile?.address ?? undefined,
    };
  }
}