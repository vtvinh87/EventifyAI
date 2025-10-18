
import { supabase } from './supabase';
import type { User } from '../types';

const fromSupabaseProfile = (profile: any): User | null => {
    if (!profile) return null;
    return {
        id: profile.id,
        name: profile.full_name,
        avatarUrl: profile.avatar_url,
        role: profile.role,
        interests: profile.interests,
    };
};

export const getProfile = async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .limit(1) // An toàn giới hạn chỉ 1 dòng trong trường hợp có dữ liệu trùng lặp
        .maybeSingle(); // Sử dụng maybeSingle() để xử lý 0 hoặc 1 dòng mà không báo lỗi
    
    if (error) {
        console.error('Error fetching profile:', error.message);
        return null;
    }
    
    return fromSupabaseProfile(data);
};


export const updateUserInterests = async (userId: string, interests: string[]): Promise<{ success: boolean }> => {
  console.log("Saving user interests to Supabase:", interests);
  const { error } = await supabase
    .from('profiles')
    .update({ interests })
    .eq('id', userId);

  if (error) {
    console.error("Error updating interests:", error.message);
    return { success: false };
  }

  return { success: true };
};