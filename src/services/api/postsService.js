import postsData from "@/services/mockData/posts.json";
import { usersService } from "@/services/api/usersService";

class PostsService {
  constructor() {
    this.posts = [...postsData];
    this.delay = 400;
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    // Enrich posts with author data
    const enrichedPosts = await Promise.all(
      this.posts.map(async (post) => {
        try {
          const author = await usersService.getById(post.authorId);
          return { ...post, author };
        } catch {
          return { ...post, author: null };
        }
      })
    );
    
    // Sort by creation date, newest first
    return enrichedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    const post = this.posts.find(p => p.Id === id);
    if (!post) {
      throw new Error("Post not found");
    }
    
    // Enrich with author data
    try {
      const author = await usersService.getById(post.authorId);
      return { ...post, author };
    } catch {
      return { ...post, author: null };
    }
  }

  async getByUserId(userId) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    const userPosts = this.posts.filter(p => p.authorId === userId);
    
    // Enrich posts with author data
    const enrichedPosts = await Promise.all(
      userPosts.map(async (post) => {
        try {
          const author = await usersService.getById(post.authorId);
          return { ...post, author };
        } catch {
          return { ...post, author: null };
        }
      })
    );
    
    // Sort by creation date, newest first
    return enrichedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async create(postData) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    const newPost = {
      Id: Math.max(...this.posts.map(p => p.Id)) + 1,
      ...postData,
      likeCount: 0,
commentCount: 0,
      createdAt: new Date().toISOString(),
      editedAt: null
    };
    
    this.posts.unshift(newPost);
    
    // Enrich with author data for return
    try {
      const author = await usersService.getById(newPost.authorId);
      return { ...newPost, author };
    } catch {
      return { ...newPost, author: null };
    }
  }

  async update(id, postData) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    const index = this.posts.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Post not found");
    }
    
    this.posts[index] = { 
      ...this.posts[index], 
      ...postData,
      editedAt: new Date().toISOString()
    };
    
    // Enrich with author data for return
    try {
      const author = await usersService.getById(this.posts[index].authorId);
      return { ...this.posts[index], author };
    } catch {
      return { ...this.posts[index], author: null };
    }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    const index = this.posts.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Post not found");
    }
    this.posts.splice(index, 1);
    return true;
}

  async addComment(postId) {
    await this.delay();
    
    const post = this.posts.find(p => p.Id === parseInt(postId));
    if (!post) {
      throw new Error('Post not found');
    }
    
    post.commentCount = (post.commentCount || 0) + 1;
    return post.commentCount;
  }

  async getCommentCount(postId) {
    await this.delay();
    
    const post = this.posts.find(p => p.Id === parseInt(postId));
    return post ? (post.commentCount || 0) : 0;
  }

  async like(postId, userId) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    const post = this.posts.find(p => p.Id === postId);
    if (post) {
      post.likeCount = (post.likeCount || 0) + 1;
    }
    return true;
  }

  async unlike(postId, userId) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    const post = this.posts.find(p => p.Id === postId);
    if (post && post.likeCount > 0) {
      post.likeCount--;
    }
    return true;
  }
}

export const postsService = new PostsService();