import users from '../data/api/users.json';
import posts from '../data/api/posts.json';
import postReplies from '../data/api/post_replies.json';
import follows from '../data/api/follows.json';
import feedback from '../data/api/feedback.json';
import messages from '../data/api/messages.json';
import socialCases from '../data/api/social_cases.json';
import communityReports from '../data/api/community_reports.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to simulate errors occasionally (for testing)
const simulateError = (probability = 0.005) => Math.random() < probability;

const api = {
  // User related endpoints
  users: {
    getAll: async () => {
      await delay(300);
      if (simulateError()) throw new Error('Failed to fetch users');
      return users;
    },
    
    getById: async (id) => {
      await delay(200);
      const user = users.find(u => u.id === id);
      if (!user) throw new Error(`User with id ${id} not found`);
      return user;
    },
    
    getByRole: async (role) => {
      await delay(300);
      return users.filter(u => u.role === role);
    }
  },
  
  // Posts related endpoints
  posts: {
    getAll: async () => {
      await delay(400);
      if (simulateError()) throw new Error('Failed to fetch posts');
      return posts;
    },
    
    getById: async (id) => {
      await delay(200);
      const post = posts.find(p => p.id === id);
      if (!post) throw new Error(`Post with id ${id} not found`);
      return post;
    },
    
    getByUserId: async (userId) => {
      await delay(300);
      return posts.filter(p => p.user_id === userId);
    },
    
    getByType: async (type) => {
      await delay(300);
      return posts.filter(p => p.type === type);
    },
    
    getReplies: async (postId) => {
      await delay(250);
      return postReplies.filter(r => r.post_id === postId);
    }
  },
  
  // Follows related endpoints
  follows: {
    getAll: async () => {
      await delay(300);
      return follows;
    },
    
    getFollowersByCompany: async (companyId) => {
      await delay(250);
      const followRelations = follows.filter(f => f.company_id === companyId);
      const followerIds = followRelations.map(f => f.follower_id);
      return users.filter(u => followerIds.includes(u.id));
    },
    
    getCompaniesByFollower: async (followerId) => {
      await delay(250);
      const followRelations = follows.filter(f => f.follower_id === followerId);
      const companyIds = followRelations.map(f => f.company_id);
      return users.filter(u => companyIds.includes(u.id) && u.role === 'company');
    }
  },
  
  // Feedback related endpoints
  feedback: {
    getAll: async () => {
      await delay(300);
      return feedback;
    },
    
    getByPostId: async (postId) => {
      await delay(200);
      return feedback.filter(f => f.post_id === postId);
    },
    
    getByUserId: async (userId) => {
      await delay(200);
      return feedback.filter(f => f.user_id === userId);
    }
  },
  
  // Messages related endpoints
  messages: {
    getAll: async () => {
      await delay(400);
      return messages;
    },
    
    getConversation: async (user1Id, user2Id) => {
      await delay(300);
      return messages.filter(m => 
        (m.sender_id === user1Id && m.receiver_id === user2Id) || 
        (m.sender_id === user2Id && m.receiver_id === user1Id)
      ).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    },
    
    getInbox: async (userId) => {
      await delay(350);
      // Get all unique users this person has messaged with
      const messagePartners = new Set();
      
      messages.forEach(m => {
        if (m.sender_id === userId) {
          messagePartners.add(m.receiver_id);
        } else if (m.receiver_id === userId) {
          messagePartners.add(m.sender_id);
        }
      });
      
      // For each conversation partner, get the most recent message
      const conversations = Array.from(messagePartners).map(partnerId => {
        const conversation = messages.filter(m => 
          (m.sender_id === userId && m.receiver_id === partnerId) || 
          (m.sender_id === partnerId && m.receiver_id === userId)
        ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        const partner = users.find(u => u.id === partnerId);
        
        return {
          partnerId,
          partnerName: partner ? partner.username : 'Unknown User',
          lastMessage: conversation[0],
          unreadCount: conversation.filter(m => m.sender_id === partnerId).length
        };
      });
      
      return conversations;
    }
  },
  
  // Social cases related endpoints
  socialCases: {
    getAll: async () => {
      await delay(500);
      return socialCases;
    },
    
    getByCompanyId: async (companyId) => {
      await delay(300);
      return socialCases.filter(sc => sc.company_id === companyId);
    },
    
    getTotalInvestment: async (companyId) => {
      await delay(200);
      const companyCases = socialCases.filter(sc => sc.company_id === companyId);
      return companyCases.reduce((total, sc) => total + sc.investment_amount, 0);
    }
  },
  
  // Community reports related endpoints
  communityReports: {
    getAll: async () => {
      await delay(400);
      return communityReports;
    },
    
    getById: async (id) => {
      await delay(200);
      const report = communityReports.find(r => r.id === id);
      if (!report) throw new Error(`Report with id ${id} not found`);
      return report;
    },
    
    getByUserId: async (userId) => {
      await delay(300);
      return communityReports.filter(r => r.user_id === userId);
    },
    
    getByCategory: async (category) => {
      await delay(250);
      return communityReports.filter(r => r.category === category);
    },
    
    getByZipcode: async (zipcode) => {
      await delay(300);
      return communityReports.filter(r => r.zipcode === zipcode);
    }
  }
};

export default api; 