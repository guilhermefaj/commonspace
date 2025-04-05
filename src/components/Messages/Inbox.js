import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

export default function Inbox() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUserId = 1; // Assuming current user ID is 1 for mock data

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        
        // Get all messages
        const messagesData = await api.messages.getAll();
        
        // Get all users
        const usersData = await api.users.getAll();
        
        // Group messages by conversation (unique pairs of users)
        const conversationMap = new Map();
        
        messagesData.forEach(message => {
          // For each message, identify the other participant (not the current user)
          const otherUserId = message.from_user_id === currentUserId 
            ? message.to_user_id 
            : message.from_user_id;
          
          // Create a unique key for each conversation
          const conversationKey = [currentUserId, otherUserId].sort().join('-');
          
          if (!conversationMap.has(conversationKey)) {
            // Create a new conversation entry
            const otherUser = usersData.find(u => u.id === otherUserId);
            
            conversationMap.set(conversationKey, {
              id: conversationKey,
              participant: {
                id: otherUserId,
                username: otherUser ? otherUser.username : 'Unknown User',
                role: otherUser ? otherUser.type : 'citizen'
              },
              messages: [],
              unreadCount: 0
            });
          }
          
          // Add message to the conversation
          const conversation = conversationMap.get(conversationKey);
          conversation.messages.push(message);
          
          // Count unread messages (ones sent to current user that aren't read)
          if (message.to_user_id === currentUserId && !message.is_read) {
            conversation.unreadCount += 1;
          }
        });
        
        // Process conversations to include the last message
        const processedConversations = Array.from(conversationMap.values()).map(conversation => {
          // Sort messages by date
          const sortedMessages = conversation.messages.sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
          
          // Get the last message
          const lastMessage = sortedMessages[0];
          
          return {
            ...conversation,
            lastMessage: {
              content: lastMessage ? lastMessage.content : '',
              created_at: lastMessage ? lastMessage.created_at : new Date().toISOString(),
              sender_id: lastMessage ? lastMessage.from_user_id : null,
              is_read: lastMessage ? lastMessage.is_read : true
            }
          };
        });
        
        // Sort conversations by last message date (most recent first)
        const sortedConversations = processedConversations.sort((a, b) =>
          new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at)
        );
        
        setConversations(sortedConversations);
        setError(null);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load messages. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversations();
  }, [currentUserId]);

  const handleSelectConversation = async (conversation) => {
    try {
      // Get all messages related to this conversation
      const allMessages = await api.messages.getAll();
      
      // Filter messages that are part of this conversation
      const conversationMessages = allMessages.filter(message => 
        (message.from_user_id === currentUserId && message.to_user_id === conversation.participant.id) ||
        (message.from_user_id === conversation.participant.id && message.to_user_id === currentUserId)
      );
      
      // Sort messages by date (oldest first)
      const sortedMessages = conversationMessages.sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
      );
      
      setMessages(sortedMessages);
      setSelectedConversation(conversation);
      
      // Mark messages as read
      if (conversation.unreadCount > 0) {
        // Update the UI immediately
        const updatedConversations = conversations.map(c => 
          c.id === conversation.id 
            ? { ...c, unreadCount: 0, lastMessage: { ...c.lastMessage, is_read: true } } 
            : c
        );
        setConversations(updatedConversations);
        
        // In a real app, you would call an API to mark messages as read
      }
    } catch (err) {
      console.error('Error loading conversation messages:', err);
      // Handle error appropriately
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    
    try {
      // Create a new message object
      const newMessageObj = {
        id: Date.now(), // Generate a unique ID
        from_user_id: currentUserId,
        to_user_id: selectedConversation.participant.id,
        content: newMessage,
        created_at: new Date().toISOString(),
        is_read: false
      };
      
      // Add to messages list
      setMessages([...messages, newMessageObj]);
      
      // Update conversation last message
      const updatedConversations = conversations.map(c => 
        c.id === selectedConversation.id 
          ? { 
              ...c, 
              lastMessage: {
                content: newMessage,
                created_at: newMessageObj.created_at,
                sender_id: currentUserId,
                is_read: true
              } 
            } 
          : c
      );
      setConversations(updatedConversations);
      setNewMessage('');
      
      // In a real app, you would call an API to save the message
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Mensagens</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-lg shadow-md overflow-hidden h-[600px] flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Conversas</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Nenhuma conversa encontrada.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {conversations.map(conversation => (
                  <li key={conversation.id}>
                    <button
                      className={`w-full p-4 text-left flex items-start ${
                        selectedConversation?.id === conversation.id 
                          ? 'bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleSelectConversation(conversation)}
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-800 mr-2">
                              {conversation.participant.username}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded ${getRoleColor(conversation.participant.role)}`}>
                              {getRoleLabel(conversation.participant.role)}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(conversation.lastMessage.created_at).toLocaleDateString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className={`text-sm ${conversation.lastMessage.is_read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                          {conversation.lastMessage.content.length > 60
                            ? `${conversation.lastMessage.content.substring(0, 60)}...`
                            : conversation.lastMessage.content}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <Link to="/messages/new" className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-md hover:bg-blue-700">
              Nova Mensagem
            </Link>
          </div>
        </div>
        
        <div className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden h-[600px] flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-800 mr-2">
                    {selectedConversation.participant.username}
                  </h2>
                  <span className={`px-2 py-1 text-xs rounded ${getRoleColor(selectedConversation.participant.role)}`}>
                    {getRoleLabel(selectedConversation.participant.role)}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`max-w-[75%] p-3 rounded-lg ${
                      message.from_user_id === currentUserId 
                        ? 'bg-blue-100 ml-auto'
                        : 'bg-gray-100'
                    }`}
                  >
                    <p className="text-gray-800">{message.content}</p>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
                
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Inicie uma conversa com {selectedConversation.participant.username}.</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite sua mensagem..."
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                  >
                    Enviar
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-8">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhuma conversa selecionada</h3>
                <p className="mt-2 text-gray-500">Selecione uma conversa para visualizar as mensagens.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 