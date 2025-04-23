import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const resourceData = [
  { month: 'Jan', received: 5000000, allocated: 4200000 },
  { month: 'Fev', received: 4800000, allocated: 4500000 },
  { month: 'Mar', received: 5200000, allocated: 4800000 },
  { month: 'Abr', received: 4900000, allocated: 4600000 },
  { month: 'Mai', received: 5300000, allocated: 4900000 },
];

const demandData = [
  { month: 'Jan', demands: 45, resolved: 38 },
  { month: 'Fev', demands: 52, resolved: 45 },
  { month: 'Mar', demands: 48, resolved: 42 },
  { month: 'Abr', demands: 55, resolved: 50 },
  { month: 'Mai', demands: 49, resolved: 45 },
];

export default function PublicAgencyDashboard() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Região
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas as Regiões</option>
              <option value="norte">Norte</option>
              <option value="nordeste">Nordeste</option>
              <option value="centro">Centro-Oeste</option>
              <option value="sudeste">Sudeste</option>
              <option value="sul">Sul</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Mineração
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos os Tipos</option>
              <option value="ferro">Minério de Ferro</option>
              <option value="ouro">Ouro</option>
              <option value="cobre">Cobre</option>
              <option value="bauxita">Bauxita</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total de Recursos Recebidos</h3>
          <p className="text-3xl font-bold text-gray-900 mb-2">R$ 25.200.000</p>
          <span className="text-green-600 text-sm">96% alocados em projetos</span>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-500 text-sm font-medium">Demandas Sociais</h3>
          <p className="text-3xl font-bold text-gray-900 mb-2">249</p>
          <span className="text-blue-600 text-sm">89% taxa de resolução</span>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-500 text-sm font-medium">Empresas Monitoradas</h3>
          <p className="text-3xl font-bold text-gray-900 mb-2">42</p>
          <span className="text-green-600 text-sm">100% em conformidade</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resource Management Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Gestão de Recursos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
              <Bar dataKey="received" name="Recursos Recebidos" fill="#3b82f6" />
              <Bar dataKey="allocated" name="Recursos Alocados" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Social Demands Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Demandas Sociais</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={demandData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="demands" name="Demandas Totais" stroke="#3b82f6" />
              <Line type="monotone" dataKey="resolved" name="Demandas Resolvidas" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
          <h2 className="text-xl font-bold mb-6">Atividades Recentes</h2>
          <div className="space-y-4">
            {[
              { type: 'inspection', text: 'Inspeção realizada na Mineradora XYZ - Conformidade verificada', date: '2024-03-24' },
              { type: 'resource', text: 'Novo projeto social aprovado - Alocação de R$ 500.000', date: '2024-03-23' },
              { type: 'demand', text: 'Resolução de demanda comunitária - Infraestrutura local', date: '2024-03-22' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  {activity.type === 'inspection' ? '🔍' : activity.type === 'resource' ? '💰' : '📋'}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 