import commentsData from "@/services/mockData/comments.json";

class CommentsService {
  constructor() {
    this.comments = [...commentsData];
    this.delay = 300;
    this.nextId = Math.max(...this.comments.map(c => c.Id), 0) + 1;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }

  async getByPostId(postId) {
    await this.delay();
    
    const postComments = this.comments
      .filter(comment => comment.postId === parseInt(postId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return [...postComments];
  }

  async getById(id) {
    await this.delay();
    
    const comment = this.comments.find(c => c.Id === parseInt(id));
    if (!comment) {
      throw new Error('Comment not found');
    }
    
    return { ...comment };
  }

  async create(commentData) {
    await this.delay();
    
    if (!commentData.postId || !commentData.authorId || !commentData.content?.trim()) {
      throw new Error('Post ID, author ID, and content are required');
    }

    if (commentData.content.trim().length > 280) {
      throw new Error('Comment cannot exceed 280 characters');
    }

    const newComment = {
      Id: this.nextId++,
      postId: parseInt(commentData.postId),
      authorId: parseInt(commentData.authorId),
      content: commentData.content.trim(),
      createdAt: new Date().toISOString(),
      editedAt: null,
      likeCount: 0
    };

    this.comments.unshift(newComment);
    return { ...newComment };
  }

  async update(id, updateData) {
    await this.delay();
    
    const index = this.comments.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Comment not found');
    }

    if (updateData.content && updateData.content.length > 280) {
      throw new Error('Comment cannot exceed 280 characters');
    }

    const updatedComment = {
      ...this.comments[index],
      ...updateData,
      Id: parseInt(id),
      editedAt: new Date().toISOString()
    };

    this.comments[index] = updatedComment;
    return { ...updatedComment };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.comments.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Comment not found');
    }

    this.comments.splice(index, 1);
    return true;
  }

  async getCommentCount(postId) {
    await this.delay();
    return this.comments.filter(c => c.postId === parseInt(postId)).length;
  }
}

export const commentsService = new CommentsService();