import React from 'react';
import { useNavigate } from 'react-router-dom';

const userTypes = [
  {
    type: 'community',
    title: 'Comunidade',
    description: 'Acesso gratuito para membros da comunidade',
    features: [
      'Reporte de problemas em tempo real',
      'Visualização de investimentos sociais',
      'Canal de comunicação direta'
    ],
    icon: '👥',
    path: '/comunidades'
  },
  {
    type: 'mining',
    title: 'Mineradora',
    description: 'Acesso premium com análises avançadas',
    features: [
      'Dashboard analítico completo',
      'Insights baseados em dados',
      'Gestão de investimentos sociais',
      'Relatórios personalizados'
    ],
    icon: '⛏️',
    path: '/mineradoras',
    premium: true
  },
  {
    type: 'government',
    title: 'Órgão Público',
    description: 'Acesso institucional com recursos especializados',
    features: [
      'Monitoramento regional',
      'Análise por tipo de mineração',
      'Gestão de recursos e demandas',
      'Relatórios setoriais'
    ],
    icon: '🏛️',
    path: '/orgaos-publicos'
  }
];

export default function UserType() {
  const navigate = useNavigate();

  const handleUserTypeSelect = (path, isPremium) => {
    if (isPremium) {
      // Aqui você pode adicionar lógica para verificar assinatura ou redirecionar para página de planos
      navigate('/planos');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Escolha seu perfil de acesso</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {userTypes.map((type) => (
          <div
            key={type.type}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="text-center mb-6">
              <span className="text-4xl mb-4 block">{type.icon}</span>
              <h2 className="text-2xl font-bold mb-2">{type.title}</h2>
              <p className="text-gray-600 mb-4">{type.description}</p>
            </div>

            <ul className="space-y-2 mb-6">
              {type.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUserTypeSelect(type.path, type.premium)}
              className={`w-full py-3 px-6 rounded-md text-white font-medium ${
                type.premium 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-800'
                  : 'bg-blue-600'
              }`}
            >
              {type.premium ? 'Ver Planos' : 'Acessar'}
            </button>
          </div>
        ))}
      </div>

      {/* Consultoria Section */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Consultoria Especializada</h2>
          <p className="text-lg mb-6">
            Oferecemos serviços de consultoria proativa baseados em dados sociais coletados,
            com relatórios completos e análises personalizadas para sua operação.
          </p>
          <button
            onClick={() => navigate('/consultoria')}
            className="bg-white text-blue-600 py-3 px-8 rounded-md font-medium hover:bg-blue-50"
          >
            Saiba Mais
          </button>
        </div>
      </div>
    </div>
  );
} 