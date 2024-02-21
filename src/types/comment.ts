import { User, Comment, Like } from '@prisma/client';

export interface CommentDetails extends Comment {
	author: User;
	likes: Like[];
}
