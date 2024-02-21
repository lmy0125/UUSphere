import { User, Comment } from '@prisma/client';

export interface CommentDetails extends Comment {
	author: User;
}
