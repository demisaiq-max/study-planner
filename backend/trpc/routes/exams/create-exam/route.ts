import { publicProcedure } from '../../../create-context';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

export const createExam = publicProcedure
  .input(z.object({
    userId: z.string(),
    title: z.string(),
    date: z.string(),
    subject: z.string(),
    priority: z.boolean().optional().default(false),
  }))
  .mutation(async ({ input }) => {
    const { data, error } = await supabase
      .from('exams')
      .insert({
        user_id: input.userId,
        title: input.title,
        date: input.date,
        subject: input.subject,
        priority: input.priority,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create exam: ${error.message}`);
    }

    return data;
  });

export default createExam;