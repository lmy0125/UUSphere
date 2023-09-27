import { Post, User, Like, Comment } from '@prisma/client';

export interface PostDetails extends Post {
	author: User;
	likes: Like[];
	comments: Comment[];
}
