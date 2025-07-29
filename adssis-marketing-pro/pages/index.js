import React, { useState } from 'react';
import { Brain, Target, Users, DollarSign, ArrowRight, MessageSquare, Zap, RefreshCw, CheckCircle, Copy, Settings } from 'lucide-react';

export default function AdsSisWorkingPlatform() {
  const [screen, setScreen] = useState('onboarding'); // onboarding, dashboard
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [data, setData] = useState({
    businessName: '', businessType: '', location: '', businessDescription: '',
    productsServices: '', mainProblem: '', targetCustomers: '', businessGoals: '', budget: '', platforms: ''
  });
  const [matrix, setMatrix] = useState(null);
  const [content, setContent] = useState([]);

  const businessTypes = [
    'Restaurante/Bar/Cafetería', 'Tienda/E-commerce', 'Servicios profesionales', 
    'Gimnasio/Centro deportivo', 'Clínica/Consultorio médico', 'Academia/Educación',
    'Inmobiliaria', 'Tecnología/Software', 'Belleza/Estética', 'Otro'
  ];

  const budgets = ['$500-1,500/mes', '$1,500-3,000/mes', '$3,000-7,000/mes', '$7,000+/mes'];

  // IA REAL CON OPENAI
  const processWithAI = async () => {
    setGenerating(true);
    
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessData: data }),
      });

      if (!response.ok) {
        throw new Error('Error en la API');
      }

      const result = await response.json();
      
      if (result.success) {
        setMatrix(result.matrix);
        setContent(result.content);
        setScreen('dashboard');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error conectando con IA. Verifica tu configuración.');
    } finally {
      setGenerating(false);
    }
  };

  const generateMore = async () => {
    setGenerating(true);
    
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessData: data }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Agregar nuevo contenido al existente
        const newContent = result.content.map(item => ({
          ...item,
          id: content.length + item.id
        }));
        setContent([...content, ...newContent]);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generando más contenido');
    } finally {
      setGenerating(false);
    }
  };

  const approveContent = (id) => {
    setContent(prev => prev.map(item => 
      item.id === id ? {...item, status: 'approved'} : item
    ));
  };

  // ONBOARDING
  if (screen === 'onboarding') {
    if (step === 1) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
            <div className="text-center mb-8">
              <Brain className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white p-4" />
              <h1 className="text-3xl font-bold text-gray-800">adsSis Marketing Pro</h1>
              <p className="text-gray-600 mt-2">🚀 ¡Ahora con IA REAL de OpenAI!</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Nombre del negocio *</label>
                <input
                  type="text"
                  placeholder="Ej: Restaurante El Buen Sabor"
                  className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={data.businessName}
                  onChange={(e) => setData({...data, businessName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Tipo de negocio *</label>
                <select
                  className="w-full p-4 text-lg border border-gray-300 rounded-lg"
                  value={data.businessType}
                  onChange={(e) => setData({...data, businessType: e.target.value})}
                >
                  <option value="">Selecciona tipo</option>
                  {businessTypes.map((type, idx) => (
                    <option key={idx} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Ubicación</label>
                <input
                  type="text"
                  placeholder="Ej: Bogotá, Colombia"
                  className="w-full p-4 text-lg border border-gray-300 rounded-lg"
                  value={data.location}
                  onChange={(e) => setData({...data, location: e.target.value})}
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!data.businessName || !data.businessType}
                className="w-full py-4 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              >
                Continuar <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
            <div className="text-center mb-8">
              <Target className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-gray-800">Productos y Servicios</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Lista TODOS tus productos/servicios *</label>
                <textarea
                  placeholder="Ej: 
Almuerzo ejecutivo ($15) - Completo con sopa y postre
Desayunos típicos ($8-12) - Tamales, arepas, calentado
Catering eventos (desde $25/persona)
Delivery gratis zona norte

Escribe todo lo que ofreces..."
                  className="w-full p-4 text-lg border border-gray-300 rounded-lg"
                  rows="8"
                  value={data.productsServices}
                  onChange={(e) => setData({...data, productsServices: e.target.value})}
                />
                <p className="text-sm text-gray-500 mt-2">🤖 IA REAL analizará cada producto</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg">
                  Atrás
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!data.productsServices || data.productsServices.length < 50}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-gray-800">Clientes y Problema</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">¿Qué problema resuelves? *</label>
                <textarea
                  placeholder="Ej: Las personas extrañan comida casera auténtica pero no tienen tiempo para cocinar..."
                  className="w-full p-4 text-lg border border-gray-300 rounded-lg"
                  rows="4"
                  value={data.mainProblem}
                  onChange={(e) => setData({...data, mainProblem: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">¿Quiénes son tus clientes? *</label>
                <textarea
                  placeholder="Ej: Familias colombianas, profesionales ocupados 30-45 años, parejas jóvenes..."
                  className="w-full p-4 text-lg border border-gray-300 rounded-lg"
                  rows="6"
                  value={data.targetCustomers}
                  onChange={(e) => setData({...data, targetCustomers: e.target.value})}
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg">
                  Atrás
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!data.mainProblem || !data.targetCustomers}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (step === 4) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
            <div className="text-center mb-8">
              <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-gray-800">Objetivos y Presupuesto</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">¿Qué quieres lograr? *</label>
                <textarea
                  placeholder="Ej: Más clientes jóvenes, llenar el restaurante en las noches..."
                  className="w-full p-4 text-lg border border-gray-300 rounded-lg"
                  rows="4"
                  value={data.businessGoals}
                  onChange={(e) => setData({...data, businessGoals: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Presupuesto mensual *</label>
                <select
                  className="w-full p-4 text-lg border border-gray-300 rounded-lg"
                  value={data.budget}
                  onChange={(e) => setData({...data, budget: e.target.value})}
                >
                  <option value="">Selecciona presupuesto</option>
                  {budgets.map((budget, idx) => (
                    <option key={idx} value={budget}>{budget}</option>
                  ))}
                </select>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-green-800 mb-3 text-lg">🤖 ¡IA REAL de OpenAI lista!</h3>
                <div className="grid grid-cols-2 gap-3 text-sm text-green-700">
                  <div>✅ Análisis real de productos</div>
                  <div>✅ Contenido único por IA</div>
                  <div>✅ Posts optimizados</div>
                  <div>✅ Conectado a Supabase</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg">
                  Atrás
                </button>
                <button
                  onClick={processWithAI}
                  disabled={!data.businessGoals || !data.budget}
                  className="flex-1 py-4 text-lg bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  ¡Procesar con IA REAL!
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // PANTALLA DE CARGA
  if (generating && !matrix) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
          <Brain className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white p-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🤖 OpenAI Procesando...</h2>
          <div className="space-y-3 text-left">
            <div className="flex items-center text-blue-600">
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Analizando productos con IA
            </div>
            <div className="flex items-center text-blue-600">
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Generando contenido único
            </div>
            <div className="flex items-center text-blue-600">
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Guardando en Supabase
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD
  if (screen === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Brain className="w-6 h-6 mr-2 text-blue-600" />
                  {matrix?.company.name} - IA REAL ✨
                </h1>
                <p className="text-gray-600">{matrix?.company.type} en {matrix?.company.location}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={generateMore}
                  disabled={generating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {generating ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                  Generar Más con OpenAI
                </button>
                <button
                  onClick={() => setScreen('onboarding')}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Reconfigurar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{matrix?.products.length || 0}</div>
              <div className="text-gray-600">Productos IA</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{matrix?.clients.length || 0}</div>
              <div className="text-gray-600">Segmentos</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{content.length}</div>
              <div className="text-gray-600">Contenidos</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{content.filter(c => c.status === 'approved').length}</div>
              <div className="text-gray-600">Aprobados</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                Contenido por OpenAI 🤖
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {content.map((item) => (
                <div key={item.id} className={`border rounded-lg p-4 transition-all ${
                  item.status === 'approved' ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:shadow-md'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.platform}</span>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">{item.type}</span>
                      </div>
                    </div>
                    {item.status === 'approved' ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <button
                        onClick={() => approveContent(item.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        ✓ Aprobar
                      </button>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded mb-3">
                    <p className="text-sm whitespace-pre-line">{item.content}</p>
                  </div>
                  
                  <div className="text-xs text-gray-600 mb-3">
                    <strong>🤖 OpenAI:</strong> {item.reasoning}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Alcance: {item.reach?.toLocaleString()}</span>
                    <button className="hover:text-blue-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
