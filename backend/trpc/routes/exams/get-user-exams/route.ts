import { publicProcedure } from '../../../create-context';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

export const getUserExams = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('user_id', input.userId)
      .order('date', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch exams: ${error.message}`);
    }

    return data || [];
  });

export default getUserExams;