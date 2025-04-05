import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function SocialCases() {
  const [socialCases, setSocialCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [newCase, setNewCase] = useState({
    title: '',
    description: '',
    investment_amount: '',
    location: '',
    image_url: '',
    category: 'education'
  });
  const [isCreating, setIsCreating] = useState(false);
  const [stats, setStats] = useState({
    totalInvestment: 0,
    totalCases: 0,
    activeCases: 0,
    completedCases: 0,
    plannedCases: 0,
    categories: {}
  });

  const companyId = 5; // Using eco_miner for mock data

  useEffect(() => {
    const fetchSocialCases = async () => {
      try {
        setIsLoading(true);
        
        // Fetch social cases
        const casesData = await api.socialCases.getAll();
        
        // Filter cases for this company
        const companyCases = casesData.filter(socialCase => 
          socialCase.company_id === companyId
        );
        
        // Enhance cases with additional information
        const enhancedCases = companyCases.map(socialCase => {
          // Generate a random status for demonstration
          const statuses = ['active', 'completed', 'planned'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          // Generate random beneficiaries count for demonstration
          const randomBeneficiaries = Math.floor(Math.random() * 1000) + 50;
          
          // Assign categories
          const categories = ['education', 'health', 'infrastructure', 'environment'];
          const randomCategory = socialCase.category || categories[Math.floor(Math.random() * categories.length)];
          
          return {
            ...socialCase,
            status: randomStatus,
            beneficiaries: randomBeneficiaries,
            category: randomCategory
          };
        });
        
        // Calculate statistics
        const stats = enhancedCases.reduce((acc, socialCase) => {
          // Total investment
          acc.totalInvestment += parseFloat(socialCase.investment_amount || 0);
          
          // Count by status
          if (socialCase.status === 'active') acc.activeCases++;
          else if (socialCase.status === 'completed') acc.completedCases++;
          else if (socialCase.status === 'planned') acc.plannedCases++;
          
          // Count by category
          if (!acc.categories[socialCase.category]) {
            acc.categories[socialCase.category] = 0;
          }
          acc.categories[socialCase.category]++;
          
          return acc;
        }, {
          totalInvestment: 0,
          totalCases: enhancedCases.length,
          activeCases: 0,
          completedCases: 0,
          plannedCases: 0,
          categories: {}
        });
        
        setSocialCases(enhancedCases);
        setFilteredCases(enhancedCases);
        setStats(stats);
        setError(null);
      } catch (err) {
        console.error('Error fetching social cases:', err);
        setError('Failed to load social cases. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSocialCases();
  }, [companyId]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredCases(socialCases);
    } else {
      setFilteredCases(socialCases.filter(c => c.status === filter));
    }
  }, [filter, socialCases]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCase(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would be an API call to create a new social case
    const newSocialCase = {
      id: Date.now(),
      company_id: companyId,
      title: newCase.title,
      description: newCase.description,
      investment_amount: parseFloat(newCase.investment_amount),
      location: newCase.location,
      date: new Date().toISOString(),
      status: 'planned',
      image_url: newCase.image_url || 'https://via.placeholder.com/300',
      beneficiaries: 0,
      category: newCase.category
    };
    
    // Update state
    const updatedCases = [newSocialCase, ...socialCases];
    setSocialCases(updatedCases);
    
    // Update filtered cases if needed
    if (filter === 'all' || filter === 'planned') {
      setFilteredCases(prev => [newSocialCase, ...prev]);
    }
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalCases: prev.totalCases + 1,
      plannedCases: prev.plannedCases + 1,
      totalInvestment: prev.totalInvestment + parseFloat(newCase.investment_amount || 0),
      categories: {
        ...prev.categories,
        [newCase.category]: (prev.categories[newCase.category] || 0) + 1
      }
    }));
    
    // Reset form
    setNewCase({
      title: '',
      description: '',
      investment_amount: '',
      location: '',
      image_url: '',
      category: 'education'
    });
    setIsCreating(false);
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCategoryLabel = (category) => {
    switch(category) {
      case 'education': return 'Educação';
      case 'health': return 'Saúde';
      case 'infrastructure': return 'Infraestrutura';
      case 'environment': return 'Meio Ambiente';
      default: return category;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'education': return 'bg-blue-100 text-blue-800';
      case 'health': return 'bg-green-100 text-green-800';
      case 'infrastructure': return 'bg-yellow-100 text-yellow-800';
      case 'environment': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'active': return 'Em Andamento';
      case 'completed': return 'Concluído';
      case 'planned': return 'Planejado';
      default: return status;
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
        <h1 className="text-3xl font-bold text-gray-800">Investimentos Sociais</h1>
        <button 
          onClick={() => setIsCreating(!isCreating)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {isCreating ? 'Cancelar' : 'Novo Investimento'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm uppercase">Investimento Total</h3>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalInvestment)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm uppercase">Projetos Ativos</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.activeCases}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm uppercase">Projetos Planejados</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.plannedCases}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm uppercase">Projetos Concluídos</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.completedCases}</p>
        </div>
      </div>

      {isCreating && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Criar Novo Investimento Social</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="title" className="block text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newCase.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="investment_amount" className="block text-gray-700 mb-2">Valor do Investimento (R$)</label>
                <input
                  type="number"
                  id="investment_amount"
                  name="investment_amount"
                  value={newCase.investment_amount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 mb-2">Descrição</label>
              <textarea
                id="description"
                name="description"
                value={newCase.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="location" className="block text-gray-700 mb-2">Localização</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={newCase.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-gray-700 mb-2">Categoria</label>
                <select
                  id="category"
                  name="category"
                  value={newCase.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="education">Educação</option>
                  <option value="health">Saúde</option>
                  <option value="infrastructure">Infraestrutura</option>
                  <option value="environment">Meio Ambiente</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="image_url" className="block text-gray-700 mb-2">URL da Imagem (Opcional)</label>
              <input
                type="text"
                id="image_url"
                name="image_url"
                value={newCase.image_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Criar Investimento
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="filter" className="mr-2 font-medium">Filtrar por status:</label>
        <select
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos</option>
          <option value="active">Em Andamento</option>
          <option value="planned">Planejados</option>
          <option value="completed">Concluídos</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.length > 0 ? (
          filteredCases.map(socialCase => (
            <div key={socialCase.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={socialCase.image_url || "https://via.placeholder.com/600x300?text=Investimento+Social"} 
                  alt={socialCase.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">{socialCase.title}</h2>
                  <span className={`px-2 py-1 text-xs rounded ${getStatusColor(socialCase.status)}`}>
                    {getStatusLabel(socialCase.status)}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {socialCase.description.length > 100 
                    ? `${socialCase.description.substring(0, 100)}...` 
                    : socialCase.description}
                </p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-2 py-1 text-xs rounded ${getCategoryColor(socialCase.category)}`}>
                    {getCategoryLabel(socialCase.category)}
                  </span>
                  <span className="text-sm text-gray-500">{formatCurrency(socialCase.investment_amount)}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Localização: {socialCase.location}</span>
                  <span>Beneficiários: {socialCase.beneficiaries}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Nenhum investimento social encontrado.' 
                : `Nenhum investimento com status "${getStatusLabel(filter)}" encontrado.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 