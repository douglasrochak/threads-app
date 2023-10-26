'use server';

import { revalidatePath } from 'next/cache';

import Thread from '../models/thread.model';
import User from '../models/user.model';

import { connectToDB } from '../mongoose';

interface CreateThreadParams {
  text: string;
  author: string;
  communityId: string;
  path: string;
}

interface AddCommentToThreadParams {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}

export async function createThread({
  author,
  communityId,
  path,
  text,
}: CreateThreadParams) {
  try {
    connectToDB();

    const createThread = await Thread.create({
      text,
      author,
      community: null,
    });

    // Update user model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createThread._id },
    });

    revalidatePath(path);
  } catch (error) {
    throw new Error(`Error creating thread: ${(error as Error).message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of posts to skip
  const skipAmount = (pageNumber - 1) * pageSize;

  // Fetch the posts that have no parents (top-level threads...)
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: 'author', model: User })
    .populate({
      path: 'children',
      model: User,
      select: '_id name parentId image',
    });

  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

export async function fetchThreadById(threadId: string) {
  connectToDB();
  try {
    // TODO: Populate Community
    const thread = await Thread.findById(threadId)
      .populate({
        path: 'author',
        model: User,
        select: '_id name image',
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id id name parentId image',
          },
          {
            path: 'children',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: '_id id name parentId image',
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error) {
    throw new Error(`Error fetching thread: ${(error as Error).message}`);
  }
}

export async function addCommentToThread({
  threadId,
  commentText,
  userId,
  path,
}: AddCommentToThreadParams) {
  connectToDB();

  try {
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) throw new Error('Thread not found');

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const saveCommentThread = await commentThread.save();

    originalThread.children.push(saveCommentThread._id);

    originalThread.save();

    revalidatePath(path);
  } catch (error) {
    throw new Error(
      `Error adding comment to thread: ${(error as Error).message}`
    );
  }
}
