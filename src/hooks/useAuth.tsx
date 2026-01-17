'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

// Create supabase client once outside component
const supabase = createClient();

export interface ProfileData {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  currency: string;
  language: string;
  theme: string;
  email_notifications: boolean;
  push_notifications: boolean;
  weekly_report: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: ProfileData | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<ProfileData>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  // Refresh profile
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<ProfileData>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Prevent double initialization
    if (initialized.current) return;
    initialized.current = true;

    // Check current session
    const checkUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        // If there's an auth error (invalid refresh token), sign out
        if (error) {
          console.error('Auth error:', error.message);
          // Force sign out to clear invalid session
          try {
            await supabase.auth.signOut();
          } catch (e) {
            // Ignore sign out errors
          }
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }

        setUser(user);
        if (user) {
          await fetchProfile(user.id);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking user:', error);
        // Clear state on error
        setUser(null);
        setProfile(null);
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);

      // Handle sign out
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setIsLoading(false);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return <AuthContext.Provider value={{ user, profile, isLoading, signIn, signUp, signOut, updateProfile, refreshProfile }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
