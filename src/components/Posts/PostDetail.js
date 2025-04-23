import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setIsLoading(true);
        
        // Fetch the post
        const postData = await api.posts.getById(parseInt(postId));
        if (!postData) {
          setError('Post not found');
          setIsLoading(false);
          return;
        }
        
        // Fetch user info
        const usersData = await api.users.getAll();
        const user = usersData.find(u => u.id === postData.user_id);
        
        // Fetch feedback
        const feedbackData = await api.feedback.getAll();
        const postFeedback = feedbackData.filter(f => f.post_id === postData.id);
        const likes = postFeedback.filter(f => f.type === 'like').length;
        const dislikes = postFeedback.filter(f => f.type === 'dislike').length;
        
        // Get replies
        const repliesData = await api.posts.getReplies(postData.id);
        
        // Enhance replies with user info
        const enhancedReplies = await Promise.all(repliesData.map(async (reply) => {
          const replyUser = usersData.find(u => u.id === reply.user_id);
          return {
            ...reply,
            username: replyUser ? replyUser.username : 'Unknown User',
            role: replyUser ? replyUser.type : 'citizen'
          };
        }));
        
        // Sort replies by date
        const sortedReplies = enhancedReplies.sort((a, b) => 
          new Date(a.created_at) - new Date(b.created_at)
        );
        
        // Set state
        setPost({
          ...postData,
          username: user ? user.username : 'Unknown User',
          likes,
          dislikes
        });
        setReplies(sortedReplies);
        setError(null);
      } catch (err) {
        console.error('Error fetching post details:', err);
        setError('Failed to load post details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPostDetails();
  }, [postId]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;
    
    try {
      // In a real app, this would call an API endpoint
      // For now, we'll simulate it by creating an object locally
      const newReplyObj = {
        id: Date.now(), // Generate a unique ID
        post_id: parseInt(postId),
        user_id: 1, // Assuming current user ID is 1
        content: newReply,
        created_at: new Date().toISOString()
      };
      
      // Add the reply to our state with user details
      setReplies([...replies, {
        ...newReplyObj,
        username: 'Você', // Current user name
        role: 'citizen' // Assuming current user role
      }]);
      
      setNewReply('');
    } catch (err) {
      console.error('Error posting reply:', err);
      alert('Failed to post your reply. Please try again.');
    }
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

  const getRoleLabel = (role) => {
    switch(role) {
      case 'citizen': return 'Cidadão';
      case 'company': return 'Empresa';
      case 'public_agency': return 'Órgão Público';
      default: return role;
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

  const getRoleColor = (role) => {
    switch(role) {
      case 'citizen': return 'bg-green-100 text-green-800';
      case 'company': return 'bg-blue-100 text-blue-800';
      case 'public_agency': return 'bg-purple-100 text-purple-800';
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

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Publicação não encontrada. O post solicitado pode ter sido removido ou não existe.'}</p>
          <button 
            onClick={() => navigate('/forum')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Voltar para o Fórum
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate('/forum')}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para o Fórum
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{post.title}</h1>
            <div className="flex items-center">
              <span className={`px-2 py-1 text-xs rounded mr-2 ${getTypeColor(post.type)}`}>
                {getTypeLabel(post.type)}
              </span>
              <span className={`px-2 py-1 text-xs rounded ${getStatusColor(post.status)}`}>
                {getStatusLabel(post.status)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span className="mr-4">Por: {post.username}</span>
            <span className="mr-4">
              {new Date(post.created_at).toLocaleDateString('pt-BR')}
            </span>
            {post.zipcode && (
              <span>CEP: {post.zipcode}</span>
            )}
          </div>
          
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-line">{post.body}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-600 hover:text-green-600">
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
            <button className="flex items-center text-gray-600 hover:text-yellow-600">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
              </svg>
              Reportar
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Respostas ({replies.length})</h2>
        <div className="space-y-6">
          {replies.map(reply => (
            <div key={reply.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <span className="font-medium text-gray-800 mr-2">{reply.username}</span>
                  <span className={`px-2 py-1 text-xs rounded ${getRoleColor(reply.role)}`}>
                    {getRoleLabel(reply.role)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(reply.created_at).toLocaleDateString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{reply.content}</p>
            </div>
          ))}

          {replies.length === 0 && (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <p className="text-gray-600">Ainda não há respostas para esta publicação. Seja o primeiro a responder!</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Deixe sua resposta</h2>
        <form onSubmit={handleReplySubmit}>
          <div className="mb-4">
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escreva sua resposta aqui..."
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Responder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 