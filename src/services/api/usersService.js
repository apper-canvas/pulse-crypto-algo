import usersData from "@/services/mockData/users.json";

class UsersService {
  constructor() {
    this.users = [...usersData];
    this.delay = 300;
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    return this.users.map(user => ({ ...user }));
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    const user = this.users.find(u => u.Id === id);
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  }

  async getCurrentUser() {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    // Return first user as current user for demo
    const user = this.users.find(u => u.Id === 1);
    if (!user) {
      throw new Error("Current user not found");
    }
    return { ...user };
  }

  async create(userData) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    const newUser = {
      Id: Math.max(...this.users.map(u => u.Id)) + 1,
      ...userData,
      followerCount: 0,
      followingCount: 0,
      postCount: 0,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id, userData) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    const index = this.users.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    this.users[index] = { ...this.users[index], ...userData };
    return { ...this.users[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    const index = this.users.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    this.users.splice(index, 1);
    return true;
  }
async search(query = '') {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    // If no query provided, return all users
    if (!query || query.trim() === '') {
      return this.users.map(user => ({ ...user }));
    }
    
    const searchTerm = query.toLowerCase().trim();
    
    // Filter users by username or display name (case-insensitive partial match)
    const filteredUsers = this.users.filter(user => 
      user.username.toLowerCase().includes(searchTerm) ||
      user.displayName.toLowerCase().includes(searchTerm)
    );
    
    return filteredUsers.map(user => ({ ...user }));
  }

  async follow(followerId, followingId) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    // Update follower counts
    const follower = this.users.find(u => u.Id === followerId);
    const following = this.users.find(u => u.Id === followingId);
    
    if (follower) follower.followingCount = (follower.followingCount || 0) + 1;
    if (following) following.followerCount = (following.followerCount || 0) + 1;
    
    return true;
  }

  async unfollow(followerId, followingId) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    // Update follower counts
    const follower = this.users.find(u => u.Id === followerId);
    const following = this.users.find(u => u.Id === followingId);
    
    if (follower && follower.followingCount > 0) follower.followingCount--;
    if (following && following.followerCount > 0) following.followerCount--;
    
    return true;
  }
}

export const usersService = new UsersService();