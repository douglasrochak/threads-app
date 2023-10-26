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
  CommentValidantionSchema,
  commentValidantionSchema,
} from '@/lib/validations/thread';
import { Input } from '../ui/input';
import Image from 'next/image';
import { addCommentToThread } from '@/lib/actions/thread.actions';

type Props = {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
};

export const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<CommentValidantionSchema>({
    resolver: zodResolver(commentValidantionSchema),
  });

  async function onSubmit(values: CommentValidantionSchema) {
    await addCommentToThread({
      userId: currentUserId,
      threadId,
      commentText: values.thread,
      path: pathname,
    });

    form.reset();
  }

  return (
    <Form {...form}>
      <form className='comment-form' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex items-center gap-3 w-full'>
              <FormLabel className='overflow-hidden rounded-full w-12 h-12'>
                <Image
                  src={currentUserImg}
                  alt='Profile Image'
                  width={48}
                  height={48}
                  className='object-cover'
                />
              </FormLabel>
              <FormControl className='border-none bg-transparent'>
                <Input
                  type='text'
                  placeholder='Comment...'
                  className='no-focus text-light-1 outline-none'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type='submit' className='comment-form_btn'>
          Reply
        </Button>
      </form>
    </Form>
  );
};
