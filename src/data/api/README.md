# Mock API Database

This directory contains JSON files that simulate a backend API for the CommonSpace application. This approach allows frontend development to continue without requiring an actual backend server during the MVP phase.

## Data Structure

The mock database consists of the following JSON files:

- **users.json**: User accounts with different roles (citizen, company, public_agency)
- **community_reports.json**: Reports of issues submitted by community members
- **posts.json**: Forum posts from various users
- **post_replies.json**: Replies to posts in the forum
- **feedback.json**: User feedback on posts (likes, dislikes, flags)
- **messages.json**: Direct messages between users
- **follows.json**: Records of citizens following company profiles
- **social_cases.json**: Social investment projects by mining companies

## Usage

A utility file (`src/utils/api.js`) provides methods to access this data in an async manner that simulates API calls. The utility includes:

- Simulated network delay using `setTimeout`
- Occasional error simulation for testing error handling
- Methods that filter and transform the data as needed

### Example Usage

```javascript
import api from '../utils/api';

// In a component:
useEffect(() => {
  const fetchData = async () => {
    try {
      // Get all community reports
      const reports = await api.communityReports.getAll();
      
      // Get a specific user
      const user = await api.users.getById(1);
      
      // Get all posts of type "report"
      const reportPosts = await api.posts.getByType("report");
      
      // Get conversation between two users
      const messages = await api.messages.getConversation(1, 4);
      
      // Do something with the data...
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };
  
  fetchData();
}, []);
```

## Data Relationships

- Users (id) → Community Reports (user_id)
- Users (id) → Posts (user_id)
- Users (id) → Post Replies (user_id)
- Posts (id) → Post Replies (post_id)
- Posts (id) → Feedback (post_id)
- Users (id) → Messages (sender_id/receiver_id)
- Users (id with role="company") → Social Cases (company_id)
- Users (id with role="citizen") → Follows (follower_id)
- Users (id with role="company") → Follows (company_id)

## Adding New Data

To add new items to the mock database, simply edit the corresponding JSON file. Make sure to:

1. Use unique IDs for new entries
2. Maintain the same data structure
3. Use valid references to existing IDs when creating relationships

For testing purposes, you can also modify the `src/utils/api.js` file to add custom behaviors or transformations to the data. 