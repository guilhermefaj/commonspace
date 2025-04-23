import React from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const investmentData = [
  { month: 'Jan', social: 4000, environmental: 3000 },
  { month: 'Fev', social: 3500, environmental: 2800 },
  { month: 'Mar', social: 4200, environmental: 3300 },
  { month: 'Abr', social: 3800, environmental: 2900 },
  { month: 'Mai', social: 4300, environmental: 3500 },
];

const feedbackData = [
  { name: 'Positivo', value: 60 },
  { name: 'Neutro', value: 25 },
  { name: 'Negativo', value: 15 },
];

const COLORS = ['#22c55e', '#3b82f6', '#ef4444'];

export default function MiningDashboard() {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Investment Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Investimentos Mensais</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={investmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="social" name="Social" fill="#3b82f6" />
              <Bar dataKey="environmental" name="Ambiental" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Feedback Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Distribuição de Feedback</h2>
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
        </div>

        {/* Recent Community Feedback */}
        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
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
        </div>
      </div>
    </div>
  );
} 