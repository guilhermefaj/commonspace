import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function Followers() {
  const [followers, setFollowers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    newThisMonth: 0,
    activeEngagement: 0
  });

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setIsLoading(true);
        // Assuming we're looking at followers for company with ID 5 (eco_miner)
        const companyId = 5;
        
        // Fetch followers using the API
        const followersData = await api.follows.getFollowersByCompany(companyId);
        
        // Process follower data to get additional details like 'following since'
        const processedFollowers = await Promise.all(followersData.map(async (follower) => {
          // Find the follow relationship to get created_at date
          const followRelationship = await api.follows.getAll().then(follows => 
            follows.find(f => f.follower_id === follower.id && f.company_id === companyId)
          );
          
          // Calculate 'following since' text
          const followDate = new Date(followRelationship.created_at);
          const now = new Date();
          const diffTime = Math.abs(now - followDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          let followingSince = '';
          if (diffDays < 7) {
            followingSince = `${diffDays} dias`;
          } else if (diffDays < 30) {
            followingSince = `${Math.floor(diffDays / 7)} semanas`;
          } else if (diffDays < 365) {
            followingSince = `${Math.floor(diffDays / 30)} meses`;
          } else {
            followingSince = `${Math.floor(diffDays / 365)} anos`;
          }
          
          return {
            id: followRelationship.id,
            follower_id: follower.id,
            company_id: companyId,
            username: follower.username,
            email: follower.email,
            location: 'Minas Gerais, Brasil', // This would come from actual user data in a real app
            created_at: followRelationship.created_at,
            following_since: followingSince
          };
        }));
        
        setFollowers(processedFollowers);
        
        // Update stats
        setStats({
          total: processedFollowers.length,
          newThisMonth: processedFollowers.filter(f => {
            const followDate = new Date(f.created_at);
            const now = new Date();
            return followDate.getMonth() === now.getMonth() && 
                  followDate.getFullYear() === now.getFullYear();
          }).length,
          activeEngagement: 72 // This would be calculated based on real data in a production app
        });
        
      } catch (error) {
        console.error('Error fetching followers:', error);
        // Show error state in a real app
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFollowers();
  }, []);

  const filteredFollowers = followers.filter(follower => 
    follower.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    follower.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMessageFollower = (followerId) => {
    // In a real app, this would open a message dialog or redirect to messages
    console.log(`Sending message to follower ID: ${followerId}`);
    alert('Em uma aplicação real, isso redirecionaria para a mensagem direta com este seguidor.');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Seguidores da Empresa</h1>
      <p className="text-gray-600 mb-8">
        Pessoas da comunidade que acompanham as atualizações, projetos e eventos da sua empresa.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-800">Total de Seguidores</h3>
            <span className="text-blue-600 text-2xl font-bold">{stats.total}</span>
          </div>
          <p className="text-gray-600">Número total de pessoas que seguem sua empresa</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-800">Novos Seguidores</h3>
            <span className="text-green-600 text-2xl font-bold">+{stats.newThisMonth}</span>
          </div>
          <p className="text-gray-600">Novos seguidores adquiridos este mês</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-800">Engajamento</h3>
            <span className="text-purple-600 text-2xl font-bold">{stats.activeEngagement}%</span>
          </div>
          <p className="text-gray-600">Percentual de seguidores ativos e engajados</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">Lista de Seguidores</h2>
            <div className="w-full md:w-1/3">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Buscar por nome ou localização..."
              />
            </div>
          </div>
        </div>
        
        {filteredFollowers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              {searchTerm 
                ? 'Nenhum seguidor encontrado para esta busca.' 
                : 'Nenhum seguidor disponível.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seguindo desde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFollowers.map(follower => (
                  <tr key={follower.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{follower.username}</div>
                          <div className="text-sm text-gray-500">{follower.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{follower.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{follower.following_since}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleMessageFollower(follower.follower_id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Mensagem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Dicas para Aumentar Seguidores</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Publique atualizações regulares sobre projetos sociais da empresa</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Responda prontamente às dúvidas e feedbacks da comunidade</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Organize eventos comunitários e convide as pessoas a seguirem para atualizações</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Compartilhe histórias de sucesso e impacto positivo na comunidade</span>
          </li>
        </ul>
      </div>
    </div>
  );
} 