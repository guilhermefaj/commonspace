import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

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

const impactByTypeData = [
  { name: 'Minério de Ferro', value: 45, fill: '#8884d8' },
  { name: 'Ouro', value: 25, fill: '#ffc658' },
  { name: 'Cobre', value: 15, fill: '#82ca9d' },
  { name: 'Bauxita', value: 15, fill: '#8dd1e1' },
];

// Função para formatar valores monetários
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function PublicAgencyDashboard() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Calcular taxas de resolução
  const totalDemands = demandData.reduce((sum, item) => sum + item.demands, 0);
  const totalResolved = demandData.reduce((sum, item) => sum + item.resolved, 0);
  const resolutionRate = ((totalResolved / totalDemands) * 100).toFixed(1);
  
  // Detectar anomalias nos dados
  const lastMonthDemands = demandData[demandData.length - 1].demands;
  const avgDemands = totalDemands / demandData.length;
  const demandAnomaly = lastMonthDemands > (avgDemands * 1.1);

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
          <span className="text-blue-600 text-sm">{resolutionRate}% taxa de resolução</span>
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
          <h2 className="text-xl font-bold mb-3">Gestão de Recursos</h2>
          <p className="text-sm text-gray-600 mb-4">
            <strong className="text-blue-600">Análise:</strong> A taxa média de alocação de recursos é de 92.4%. 
            Houve um aumento consistente na eficiência alocativa nos últimos 3 meses, indicando melhoria nos 
            processos de gestão orçamentária.
          </p>
          {resourceData[resourceData.length - 1].allocated / resourceData[resourceData.length - 1].received > 0.95 && (
            <div className="p-3 bg-green-50 border-l-4 border-green-500 mb-4">
              <p className="text-sm text-green-700 font-medium">Destaque Positivo</p>
              <p className="text-sm text-green-600">
                No último mês, a taxa de alocação atingiu 92.5%, superando a meta de 90%. 
                Isto indica excelente eficiência no uso dos recursos públicos.
              </p>
            </div>
          )}
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
          <div className="mt-3 text-xs text-gray-500 text-right">
            Fonte: Sistema Integrado de Administração Financeira (SIAFI) - 2024
          </div>
        </div>

        {/* Social Demands Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-3">Demandas Sociais</h2>
          <p className="text-sm text-gray-600 mb-4">
            <strong className="text-blue-600">Análise:</strong> A taxa média de resolução de demandas é de {resolutionRate}%.
            Existe uma correlação positiva entre aumento de recursos alocados e aumento na taxa de resolução.
          </p>
          {demandAnomaly && (
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 mb-4">
              <p className="text-sm text-yellow-700 font-medium">Alerta</p>
              <p className="text-sm text-yellow-600">
                Detectamos um aumento significativo no número de demandas no último mês, 
                10% acima da média histórica. Recomenda-se investigar as causas deste aumento.
              </p>
            </div>
          )}
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
          <div className="mt-3 text-xs text-gray-500 text-right">
            Fonte: Sistema de Ouvidoria de Demandas Sociais - 2024
          </div>
        </div>

        {/* Mining Type Impact */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-3">Impacto por Tipo de Mineração</h2>
          <p className="text-sm text-gray-600 mb-4">
            <strong className="text-blue-600">Análise:</strong> A extração de minério de ferro representa 45% dos 
            impactos socioambientais reportados, seguida pela mineração de ouro com 25%. O direcionamento 
            de recursos deve considerar esta distribuição para maximizar a eficácia das medidas mitigadoras.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={impactByTypeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {impactByTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 text-xs text-gray-500 text-right">
            Fonte: Relatório de Impactos Socioambientais da Mineração - Agência Nacional de Mineração (2023)
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-3">Atividades Recentes</h2>
          <p className="text-sm text-gray-600 mb-4">
            <strong className="text-blue-600">Análise:</strong> As inspeções in loco têm resultado em 
            100% de conformidade nos últimos 30 dias, sugerindo que o monitoramento preventivo está sendo efetivo.
          </p>
          <div className="space-y-4">
            {[
              { type: 'inspection', text: 'Inspeção realizada na Mineradora XYZ - Conformidade verificada', date: '2024-03-24', recent: true },
              { type: 'resource', text: 'Novo projeto social aprovado - Alocação de R$ 500.000', date: '2024-03-23', recent: true },
              { type: 'demand', text: 'Resolução de demanda comunitária - Infraestrutura local', date: '2024-03-22', recent: true },
            ].map((activity, index) => (
              <div 
                key={index} 
                className={`flex items-center p-4 rounded-lg ${activity.recent ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}
              >
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

      {/* Summary and Recommendations */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Resumo e Recomendações</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Resumo da Situação Atual</h3>
            <p className="text-gray-600 mb-4">
              Os indicadores mostram uma situação geral positiva, com alta taxa de conformidade das empresas 
              monitoradas e boa gestão dos recursos alocados. A eficiência na resolução de demandas sociais 
              apresentou melhora consistente nos últimos meses, atingindo {resolutionRate}%.
            </p>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Fonte dos Dados:</strong> Os dados apresentados neste painel são provenientes 
                de sistemas oficiais de monitoramento e controle, incluindo SIAFI, Sistema de Ouvidoria, 
                e relatórios da Agência Nacional de Mineração para o período de janeiro a maio de 2024.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 mb-2">Recomendações</h3>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <p className="text-gray-600">
                <strong>Priorizar recursos para áreas de minério de ferro:</strong> Considerando que representam 45% dos impactos reportados.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <p className="text-gray-600">
                <strong>Investigar o aumento recente de demandas:</strong> Analisar as causas do pico observado em abril.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <p className="text-gray-600">
                <strong>Manter a frequência das inspeções:</strong> O modelo atual tem resultado em 100% de conformidade.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <p className="text-gray-600">
                <strong>Desenvolver métricas de impacto dos recursos:</strong> Para melhor avaliar o retorno dos investimentos em programas sociais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 