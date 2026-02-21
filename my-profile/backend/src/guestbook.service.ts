import { Injectable } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

@Injectable()
export class GuestbookService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in environment.');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async findAll() { 
    const { data } = await this.supabase.from('guestbook').select('*').order('created_at', { ascending: false });
    return data;
  }
  async create(dto: any) { return await this.supabase.from('guestbook').insert([dto]); }
  async update(id: string, dto: any) { return await this.supabase.from('guestbook').update(dto).eq('id', id); }
  async delete(id: string) { return await this.supabase.from('guestbook').delete().eq('id', id); }
}
