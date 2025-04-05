import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  const features = [
    {
      title: 'Transparência',
      description: 'Acesso direto a informações sobre investimentos sociais e projetos em andamento.',
      icon: '🔍'
    },
    {
      title: 'Comunicação Direta',
      description: 'Canal direto entre comunidades, mineradoras e órgãos públicos.',
      icon: '💬'
    },
    {
      title: 'Monitoramento em Tempo Real',
      description: 'Acompanhamento em tempo real de demandas e resoluções.',
      icon: '📊'
    },
    {
      title: 'Gestão Eficiente',
      description: 'Ferramentas analíticas para melhor gestão de recursos e projetos.',
      icon: '⚡'
    }
  ];

  const partners = [
    { name: 'Associação Brasileira de Mineração', role: 'Parceiro Institucional' },
    { name: 'Instituto de Desenvolvimento Social', role: 'Parceiro Técnico' },
    { name: 'Universidade Federal de Minas Gerais', role: 'Parceiro Acadêmico' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Sobre o CommonSpace
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Uma plataforma inovadora que conecta comunidades, mineradoras e órgãos públicos,
          promovendo transparência e desenvolvimento social sustentável no setor de mineração.
        </p>
      </motion.div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nossa Missão</h2>
          <p className="text-gray-600">
            Facilitar a comunicação e promover a transparência entre todos os atores
            envolvidos no setor de mineração, contribuindo para o desenvolvimento
            sustentável das comunidades impactadas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nossa Visão</h2>
          <p className="text-gray-600">
            Ser a principal plataforma de gestão e comunicação no setor de mineração,
            estabelecendo novos padrões de transparência e responsabilidade social.
          </p>
        </motion.div>
      </div>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Recursos Principais</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6 text-center"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Partners */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-12">Nossos Parceiros</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6 text-center"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">{partner.name}</h3>
              <p className="text-gray-600">{partner.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 