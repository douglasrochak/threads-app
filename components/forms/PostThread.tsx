'use client';
import { usePathname, useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

import {
  ThreadValidantionSchema,
  threadValidantionSchema,
} from '@/lib/validations/thread';

// import { updateUser } from '@/lib/actions/user.actions';
import { createThread } from '@/lib/actions/thread.actions';

type Props = {
  userId: string;
};

export const PostThread = ({ userId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<ThreadValidantionSchema>({
    resolver: zodResolver(threadValidantionSchema),
    defaultValues: {
      thread: '',
      accountId: userId,
    },
  });

  async function onSubmit(values: ThreadValidantionSchema) {
    await createThread({
      text: values.thread,
      author: values.accountId,
      communityId: '',
      path: pathname,
    });

    router.push('/');
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='mt-10 flex flex-col justify-start gap-10'
      >
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3 w-full'>
              <FormLabel className='text-base-semibold text-light-2 ml-1'>
                Content
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='bg-primary-500'>
          Post Thread
        </Button>
      </form>
    </Form>
  );
};
