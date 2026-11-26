export interface CommentDTO {
    id: string,
    page: number,
    content: string,
    createdAt: Date
}

export interface CreateCommentDTO {
    nodeId: string,
    nodeVersion: string,
    // userId: string, // Will be added when users/commenter are added to comments table
    page: number,
    content: string,
    createdAt: Date,
    parentId?: string
}