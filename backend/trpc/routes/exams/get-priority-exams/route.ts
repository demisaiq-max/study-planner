import { publicProcedure } from '../../../create-context';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

export const getPriorityExams = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('user_id', input.userId)
      .eq('priority', true)
      .order('date', { ascending: true })
      .limit(3);

    if (error) {
      throw new Error(`Failed to fetch priority exams: ${error.message}`);
    }

    return data || [];
  });

export default getPriorityExams;