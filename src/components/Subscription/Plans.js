import React from 'react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Básico',
    price: 'R$ 999/mês',
    features: [
      'Dashboard básico de indicadores',
      'Visualização de feedback da comunidade',
      'Relatórios mensais',
      'Suporte por email'
    ],
    recommended: false
  },
  {
    name: 'Profissional',
    price: 'R$ 2.499/mês',
    features: [
      'Todas as features do plano Básico',
      'Análises avançadas de dados',
      'Pesquisas de satisfação personalizadas',
      'API de integração',
      'Suporte prioritário'
    ],
    recommended: true
  },
  {
    name: 'Enterprise',
    price: 'Sob consulta',
    features: [
      'Todas as features do plano Profissional',
      'Consultoria dedicada',
      'Relatórios personalizados ilimitados',
      'Análises preditivas',
      'Integração com sistemas existentes',
      'Suporte 24/7'
    ],
    recommended: false
  }
];

export default function Plans() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Planos para Mineradoras</h1>
        <p className="text-xl text-gray-600">
          Escolha o plano ideal para sua operação
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-lg overflow-hidden ${
              plan.recommended ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            {plan.recommended && (
              <div className="bg-blue-500 text-white text-center py-2">
                Mais Popular
              </div>
            )}
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
              <p className="text-4xl font-bold mb-6">{plan.price}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/contato')}
                className={`w-full py-3 px-6 rounded-md text-white font-medium ${
                  plan.recommended
                    ? 'bg-gradient-to-r from-blue-600 to-blue-800'
                    : 'bg-blue-600'
                }`}
              >
                {plan.name === 'Enterprise' ? 'Fale Conosco' : 'Começar Agora'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Perguntas Frequentes</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Posso trocar de plano depois?</h3>
            <p className="text-gray-600">
              Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
              As mudanças serão refletidas na próxima fatura.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Como funciona o período de teste?</h3>
            <p className="text-gray-600">
              Oferecemos 14 dias de teste gratuito em todos os planos, sem compromisso.
              Você pode cancelar a qualquer momento durante este período.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Preciso fornecer cartão de crédito?</h3>
            <p className="text-gray-600">
              Não é necessário fornecer cartão de crédito durante o período de teste.
              Apenas quando decidir continuar com um dos planos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 