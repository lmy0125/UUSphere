import { Post, User, Like } from '@prisma/client';
import { CommentDetails } from './comment';

export interface PostDetails extends Post {
	author: User;
	likes: Like[];
	comments: CommentDetails[];
}
