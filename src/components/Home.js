import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Conectando Mineração e Sociedade
            </motion.h1>
            <motion.p 
              className="text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Uma plataforma inovadora que conecta comunidades, mineradoras e órgãos públicos,
              promovendo transparência e desenvolvimento social sustentável.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                to="/dashboard"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50"
              >
                Começar Agora
              </Link>
              <a
                href="#sobre"
                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600"
              >
                Saiba Mais
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="sobre" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
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
              transition={{ duration: 0.8 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Nossa Visão</h2>
              <p className="text-gray-600">
                Ser a principal plataforma de gestão e comunicação no setor de mineração,
                estabelecendo novos padrões de transparência e responsabilidade social.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
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
      </section>

      {/* Partners */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
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
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Pronto para Começar?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a nós na construção de um setor de mineração mais transparente e sustentável.
          </p>
          <Link
            to="/dashboard"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 inline-block"
          >
            Acessar Plataforma
          </Link>
        </div>
      </section>
    </div>
  );
} 