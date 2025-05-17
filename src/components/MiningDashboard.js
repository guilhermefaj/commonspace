import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const investmentData = [
  { month: 'Jan', social: 4000, environmental: 3000, savings: 5200 },
  { month: 'Fev', social: 3500, environmental: 2800, savings: 4800 },
  { month: 'Mar', social: 4200, environmental: 3300, savings: 5500 },
  { month: 'Abr', social: 3800, environmental: 2900, savings: 5100 },
  { month: 'Mai', social: 4300, environmental: 3500, savings: 5800 },
];

const feedbackData = [
  { name: 'Positivo', value: 60 },
  { name: 'Neutro', value: 25 },
  { name: 'Negativo', value: 15 },
];

const costSavingsData = [
  { name: 'Redução de Multas', value: 450000, fill: '#8884d8' },
  { name: 'Prevenção de Acidentes', value: 850000, fill: '#83a6ed' },
  { name: 'Otimização de Recursos', value: 320000, fill: '#8dd1e1' },
  { name: 'Melhor Reputação', value: 280000, fill: '#82ca9d' },
];

const COLORS = ['#22c55e', '#3b82f6', '#ef4444'];

// Função para formatar valores monetários
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Função para simular ROI (Return on Investment)
const calculateROI = (totalInvestment, totalSavings) => {
  return ((totalSavings - totalInvestment) / totalInvestment * 100).toFixed(2);
};

export default function MiningDashboard() {
  const [timeFrame, setTimeFrame] = useState('monthly');

  // Calcular totais
  const totalInvestment = investmentData.reduce(
    (acc, curr) => acc + curr.social + curr.environmental, 
    0
  );
  
  const totalSavings = investmentData.reduce(
    (acc, curr) => acc + curr.savings, 
    0
  );
  
  const roi = calculateROI(totalInvestment, totalSavings);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link 
            to="/company/social-cases"
            className="bg-blue-600 text-white rounded-lg p-4 shadow-md hover:bg-blue-700 transition-colors"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-500 rounded-full mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Gerenciar Projetos Sociais</span>
            </div>
          </Link>
          
          <Link 
            to="/company/followers"
            className="bg-green-600 text-white rounded-lg p-4 shadow-md hover:bg-green-700 transition-colors"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-500 rounded-full mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span>Ver Seguidores</span>
            </div>
          </Link>
          
          <Link 
            to="/messages"
            className="bg-purple-600 text-white rounded-lg p-4 shadow-md hover:bg-purple-700 transition-colors"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-500 rounded-full mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span>Mensagens</span>
            </div>
          </Link>
          
          <Link 
            to="/forum"
            className="bg-yellow-600 text-white rounded-lg p-4 shadow-md hover:bg-yellow-700 transition-colors"
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-500 rounded-full mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <span>Fórum da Comunidade</span>
            </div>
          </Link>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-500 text-sm font-medium">Investimento Social Total</h3>
          <p className="text-3xl font-bold text-gray-900 mb-2">R$ 19.800.000</p>
          <span className="text-green-600 text-sm">↑ 12% em relação ao mês anterior</span>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-500 text-sm font-medium">Projetos Ativos</h3>
          <p className="text-3xl font-bold text-gray-900 mb-2">24</p>
          <span className="text-blue-600 text-sm">8 projetos concluídos este mês</span>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-500 text-sm font-medium">Índice de Satisfação</h3>
          <p className="text-3xl font-bold text-gray-900 mb-2">85%</p>
          <span className="text-green-600 text-sm">↑ 5% em relação ao mês anterior</span>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-500 text-sm font-medium">Economia Estimada</h3>
          <p className="text-3xl font-bold text-green-600 mb-2">R$ 1.900.000</p>
          <span className="text-blue-600 text-sm">ROI: {roi}% em investimentos sociais</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Investment vs Savings Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-3">Investimentos e Economias Mensais</h2>
          <div className="flex items-center mb-4">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm mr-4">Social</span>
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm mr-4">Ambiental</span>
            <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-sm">Economia</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            <strong className="text-blue-600">Análise:</strong> Existe uma correlação positiva entre investimentos socioambientais e economia gerada. Em média, para cada R$ 1 investido, há um retorno de R$ 1,37 em economias.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={investmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
              <Bar dataKey="social" name="Social" fill="#3b82f6" />
              <Bar dataKey="environmental" name="Ambiental" fill="#22c55e" />
              <Line type="monotone" dataKey="savings" name="Economia" stroke="#9333ea" strokeWidth={2} dot={{ r: 4 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Savings Breakdown */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-3">Economia por Categoria</h2>
          <p className="text-sm text-gray-600 mb-4">
            <strong className="text-blue-600">Análise:</strong> A prevenção de acidentes representa a maior fonte de economia (45%), seguida pela redução de multas (24%). Estes dados justificam o investimento em segurança e conformidade.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costSavingsData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {costSavingsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Feedback Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-3">Distribuição de Feedback</h2>
          <p className="text-sm text-gray-600 mb-4">
            <strong className="text-blue-600">Análise:</strong> O feedback positivo (60%) supera significativamente o negativo (15%), indicando boa aceitação dos projetos sociais. Há uma tendência de crescimento na satisfação geral em comparação ao trimestre anterior.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={feedbackData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {feedbackData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-4">
            <div className="text-xs text-gray-500">
              Fonte dos dados: Pesquisa de satisfação com comunidades locais (Maio/2024)
            </div>
          </div>
        </div>

        {/* Recent Community Feedback */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Feedback Recente da Comunidade</h2>
            <Link 
              to="/forum" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { type: 'positive', text: 'Projeto de capacitação profissional tem gerado ótimos resultados' },
              { type: 'neutral', text: 'Sugestão de ampliação do programa de educação ambiental' },
              { type: 'negative', text: 'Preocupação com o aumento do tráfego de caminhões' },
            ].map((feedback, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  feedback.type === 'positive'
                    ? 'bg-green-50 border-l-4 border-green-500'
                    : feedback.type === 'negative'
                    ? 'bg-red-50 border-l-4 border-red-500'
                    : 'bg-blue-50 border-l-4 border-blue-500'
                }`}
              >
                <p className="text-gray-700">{feedback.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Análise de Sentimento</h3>
            <p className="text-sm text-gray-600">
              Houve uma redução de 12% nas menções negativas sobre poluição e tráfego em comparação com o trimestre anterior, indicando que as medidas de mitigação estão surtindo efeito.
            </p>
          </div>
        </div>
      </div>
      
      {/* Economia e ROI detalhado */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
        <h2 className="text-xl font-bold mb-4">Economia Gerada pelos Investimentos Socioambientais</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-600 mb-4">
              Os investimentos em programas sociais e ambientais geram economias significativas para a empresa, 
              além de melhorar a reputação corporativa. Abaixo estão detalhadas as principais fontes de economia:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Redução de multas ambientais:</strong> Economia estimada de R$ 450.000 anuais devido à melhor conformidade ambiental.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Prevenção de acidentes:</strong> Economia de R$ 850.000 em custos potenciais relacionados a acidentes de trabalho e ambientais.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Otimização de recursos:</strong> Economia de R$ 320.000 através de melhorias em processos e redução de desperdícios.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Valor de reputação:</strong> Economia de R$ 280.000 em custos evitados de marketing e relações públicas.</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-4">ROI dos Investimentos Socioambientais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Investimento Total</h4>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(totalInvestment)}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Economia Total</h4>
                <p className="text-xl font-bold text-green-600">{formatCurrency(totalSavings)}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Retorno Líquido</h4>
                <p className="text-xl font-bold text-purple-600">{formatCurrency(totalSavings - totalInvestment)}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">ROI</h4>
                <p className="text-xl font-bold text-yellow-600">{roi}%</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>Fonte: Análise interna baseada em dados financeiros e operacionais - Q1 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 