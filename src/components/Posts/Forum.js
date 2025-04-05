import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [newPost, setNewPost] = useState({ title: '', body: '', type: 'opinion', zipcode: '' });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchData = async (apiCall, fallback = []) => {
      try {
        return await apiCall();
      } catch (err) {
        console.warn(`API call failed: ${err.message}. Using fallback data.`);
        return fallback;
      }
    };
    
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all data with retries and fallbacks
        const postsData = await fetchData(api.posts.getAll);
        if (postsData.length === 0) {
          setError('No posts found. Please try again later.');
          setIsLoading(false);
          return;
        }
        
        const usersData = await fetchData(api.users.getAll);
        const feedbackData = await fetchData(api.feedback.getAll);
        
        // Process the posts with available data
        const postsWithDetails = await Promise.all(postsData.map(async (post) => {
          // Get username (use fallback if user not found)
          const user = usersData.find(u => u.id === post.user_id);
          const username = user ? user.username : 'Unknown User';
          
          // Get replies count with fallback
          let repliesCount = 0;
          try {
            const replies = await api.posts.getReplies(post.id);
            repliesCount = replies.length;
          } catch (err) {
            console.warn(`Failed to fetch replies for post ${post.id}: ${err.message}`);
          }
          
          // Get likes and dislikes (with fallbacks)
          const postFeedback = feedbackData.filter(f => f.post_id === post.id);
          const likes = postFeedback.filter(f => f.type === 'like').length;
          const dislikes = postFeedback.filter(f => f.type === 'dislike').length;
          
          return {
            ...post,
            username,
            replies_count: repliesCount,
            likes,
            dislikes
          };
        }));
        
        // Sort by most recent
        const sortedPosts = postsWithDetails.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        
        setPosts(sortedPosts);
        setError(null);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.type === filter);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would be an API call to create a post
    const newPostWithDetails = {
      ...newPost,
      id: posts.length + 1,
      user_id: 1, // Assuming current user
      username: 'Usuário Atual',
      status: 'pending',
      created_at: new Date().toISOString(),
      replies_count: 0,
      likes: 0,
      dislikes: 0
    };
    
    setPosts([newPostWithDetails, ...posts]);
    setNewPost({ title: '', body: '', type: 'opinion', zipcode: '' });
    setIsCreating(false);
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'opinion': return 'Opinião';
      case 'suggestion': return 'Sugestão';
      case 'report': return 'Relatório';
      default: return type;
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'Pendente';
      case 'reviewed': return 'Revisado';
      case 'responded': return 'Respondido';
      default: return status;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'opinion': return 'bg-blue-100 text-blue-800';
      case 'suggestion': return 'bg-green-100 text-green-800';
      case 'report': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'responded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-red-700 underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Fórum da Comunidade</h1>
        <button 
          onClick={() => setIsCreating(!isCreating)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {isCreating ? 'Cancelar' : 'Nova Publicação'}
        </button>
      </div>

      {isCreating && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Criar Nova Publicação</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 mb-2">Título</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newPost.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="body" className="block text-gray-700 mb-2">Conteúdo</label>
              <textarea
                id="body"
                name="body"
                value={newPost.body}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="type" className="block text-gray-700 mb-2">Tipo</label>
              <select
                id="type"
                name="type"
                value={newPost.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="opinion">Opinião</option>
                <option value="suggestion">Sugestão</option>
                <option value="report">Relatório</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="zipcode" className="block text-gray-700 mb-2">CEP (Opcional)</label>
              <input
                type="text"
                id="zipcode"
                name="zipcode"
                value={newPost.zipcode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="00000-000"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Publicar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="filter" className="mr-2 font-medium">Filtrar por:</label>
        <select
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos</option>
          <option value="opinion">Opiniões</option>
          <option value="suggestion">Sugestões</option>
          <option value="report">Relatórios</option>
        </select>
      </div>

      <div className="space-y-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
                  <span className={`px-2 py-1 text-xs rounded ${getTypeColor(post.type)}`}>
                    {getTypeLabel(post.type)}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{post.body.length > 150 
                  ? `${post.body.substring(0, 150)}...` 
                  : post.body}
                </p>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="mr-4">Por: {post.username}</span>
                    <span className="mr-4">
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    {post.zipcode && (
                      <span>CEP: {post.zipcode}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs rounded mr-2 ${getStatusColor(post.status)}`}>
                      {getStatusLabel(post.status)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-3 flex justify-between">
                <div className="flex items-center space-x-4">
                  <Link 
                    to={`/forum/post/${post.id}`}
                    className="flex items-center text-gray-600 hover:text-blue-600"
                  >
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Ver detalhes
                  </Link>
                  <div className="flex items-center">
                    <button className="flex items-center text-gray-600 hover:text-green-600 mr-2">
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      {post.likes}
                    </button>
                    <button className="flex items-center text-gray-600 hover:text-red-600">
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                      </svg>
                      {post.dislikes}
                    </button>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                    </svg>
                    {post.replies_count} {post.replies_count === 1 ? 'resposta' : 'respostas'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Nenhuma publicação encontrada. Seja o primeiro a publicar!' 
                : `Nenhuma publicação do tipo "${getTypeLabel(filter)}" encontrada.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 