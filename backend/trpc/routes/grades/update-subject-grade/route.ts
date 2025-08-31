import { publicProcedure } from '../../../create-context';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

export const updateSubjectGrade = publicProcedure
  .input(z.object({
    userId: z.string(),
    subject: z.string(),
    grade: z.string(),
  }))
  .mutation(async ({ input }) => {
    const { data, error } = await supabase
      .from('subject_grades')
      .upsert({
        user_id: input.userId,
        subject: input.subject,
        grade: input.grade,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update subject grade: ${error.message}`);
    }

    return data;
  });

export default updateSubjectGrade;