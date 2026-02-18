import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class GuestbookService {
  private supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  async findAll() { 
    const { data } = await this.supabase.from('guestbook').select('*').order('created_at', { ascending: false });
    return data;
  }
  async create(dto: any) { return await this.supabase.from('guestbook').insert([dto]); }
  async update(id: string, dto: any) { return await this.supabase.from('guestbook').update(dto).eq('id', id); }
  async delete(id: string) { return await this.supabase.from('guestbook').delete().eq('id', id); }
}
