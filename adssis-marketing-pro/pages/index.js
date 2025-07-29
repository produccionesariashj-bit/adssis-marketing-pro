import React, { useState } from 'react';
import { Brain, Target, Users, DollarSign, ArrowRight, MessageSquare, Zap, RefreshCw, CheckCircle, Copy, Settings, Building2, Package, Heart } from 'lucide-react';

export default function AdsSisWorkingPlatform() {
  const [screen, setScreen] = useState('onboarding');
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [data, setData] = useState({
    // Paso 1: Información básica
    businessName: '', businessType: '', location: '', businessSize: '',
    // Paso 2: Oferta
    productsServices: '', uniqueValue: '', priceRange: '',
    // Paso 3: Clientes
    targetDemographic: '', clientAvatar: '', clientPainPoints: '', clientMotivations: '',
    // Paso 4: Objetivos
    businessGoals: [], specificChallenges: '', successMetrics: '',
    // Paso 5: Recursos
    monthlyBudget: '', currentPlatforms: [], preferredPlatforms: '', contentPreferences: [],
    // Paso 6: Personalidad
    brandPersonality: [], communicationStyle: '', avoidTopics: '', inspirationalBrands: ''
  });
  const [matrix, setMatrix] = useState(null);
  const [content, setContent] = useState([]);

  const businessTypes = [
    'Restaurante/Bar/Cafetería', 'Tienda física/Retail', 'E-commerce/Tienda online',
    'Servicios profesionales (consultoría, legal, contable)', 'Salud y bienestar (clínica, spa, gym)',
    'Educación (academia, instituto, cursos)', 'Tecnología (software, apps, IT)',
    'Inmobiliaria', 'Construcción/Arquitectura', 'Belleza y estética',
    'Deportes y fitness', 'Turismo y viajes', 'Entretenimiento',
    'Servicios financieros', 'Manufactura/Producción', 'Logística/Transporte',
    'Agricultura/Alimentos', 'Energía/Sostenibilidad', 'Otro'
  ];

  const budgets = [
    'Menos de $500/mes', '$500 - $1,500/mes', '$1,500 - $3,000/mes', 
    '$3,000 - $7,000/mes', '$7,000 - $15,000/mes', 'Más de $15,000/mes'
  ];

  // IA REAL CON MATRIZ ENTERPRISE
  const processWithAI = async () => {
    setGenerating(true);
    
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessData: data }),
      });

      if (!response.ok) throw new Error('Error en la API');

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
      alert('Error conectando con IA Enterprise. Verifica tu configuración.');
    } finally {
      setGenerating(false);
    }
  };

  const generateMore = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessData: data }),
      });

      const result = await response.json();
      
      if (result.success) {
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

  const handleCheckboxChange = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  // PASO 1: INFORMACIÓN BÁSICA
  if (screen === 'onboarding' && step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <Building2 className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white p-4" />
            <h1 className="text-3xl font-bold text-gray-800">adsSis Enterprise</h1>
            <p className="text-gray-600 mt-2">🚀 Matriz Universal + IA Avanzada</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '16.6%'}}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Paso 1 de 6: Información Básica</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">¿Cómo se llama tu empresa? *</label>
              <input
                type="text"
                placeholder="Ej: Restaurante El Buen Sabor, Consultora López & Asociados"
                className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={data.businessName}
                onChange={(e) => setData({...data, businessName: e.target.value})}
              />
              <p className="text-sm text-gray-500 mt-1">El nombre que usan tus clientes para referirse a ti</p>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">¿A qué se dedica tu empresa? *</label>
              <select
                className="w-full p-4 text-lg border border-gray-300 rounded-lg"
                value={data.businessType}
                onChange={(e) => setData({...data, businessType: e.target.value})}
              >
                <option value="">Selecciona tu industria</option>
                {businessTypes.map((type, idx) => (
                  <option key={idx} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">¿Dónde está ubicada tu empresa?</label>
              <input
                type="text"
                placeholder="Ej: Bogotá, Colombia / Ciudad de México / Madrid, España"
                className="w-full p-4 text-lg border border-gray-300 rounded-lg"
                value={data.location}
                onChange={(e) => setData({...data, location: e.target.value})}
              />
              <p className="text-sm text-gray-500 mt-1">Ciudad y país donde operas principalmente</p>
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

  // PASO 2: TU OFERTA
  if (screen === 'onboarding' && step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <Package className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-800">Tu Oferta</h2>
            <p className="text-gray-600">¿Qué ofreces a tus clientes?</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '33.3%'}}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Paso 2 de 6</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">Describe TODOS los productos o servicios que ofreces *</label>
              <textarea
                placeholder={`Ejemplo para restaurante:
• Almuerzo ejecutivo ($15) - Incluye sopa, plato fuerte, postre y bebida
• Desayunos tradicionales ($8-12) - Tamales, arepas, calentado paisa
• Catering para eventos (desde $25/persona) - Servicio completo
• Delivery sin costo adicional en zona norte

Ejemplo para consultoría:
• Consultoría estratégica empresarial - Planes de crecimiento personalizados
• Implementación de sistemas de gestión - ERP, CRM, workflows
• Capacitación gerencial - Liderazgo, productividad, equipos`}
                className="w-full p-4 text-lg border border-gray-300 rounded-lg"
                rows="10"
                value={data.productsServices}
                onChange={(e) => setData({...data, productsServices: e.target.value})}
              />
              <p className="text-sm text-gray-500 mt-2">💡 Sé específico. La IA creará contenido único para cada cosa que menciones.</p>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">¿Qué te hace diferente de tu competencia? *</label>
              <textarea
                placeholder={`Ejemplos:
• "Somos los únicos que usamos ingredientes 100% orgánicos locales"
• "Tenemos 15 años de experiencia en el sector financiero"
• "Nuestro método reduce el tiempo de implementación en 70%"
• "Garantía de satisfacción 100% - si no funciona, te devolvemos el dinero"`}
                className="w-full p-4 text-lg border border-gray-300 rounded-lg"
                rows="5"
                value={data.uniqueValue}
                onChange={(e) => setData({...data, uniqueValue: e.target.value})}
              />
              <p className="text-sm text-gray-500 mt-2">¿Por qué alguien debería elegirte a ti en lugar de ir con la competencia?</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg">
                Atrás
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!data.productsServices || !data.uniqueValue}
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

  // PASO 3: TUS CLIENTES
  if (screen === 'onboarding' && step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <Users className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-800">Tus Clientes</h2>
            <p className="text-gray-600">¿A quién le vendes?</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '50%'}}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Paso 3 de 6</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">¿Quiénes son tus clientes desde el punto de vista demográfico? *</label>
              <textarea
                placeholder={`Ejemplos demográficos:
• Profesionales entre 25-45 años con ingresos medios-altos
• Familias con niños pequeños de clase media
• Jóvenes universitarios con presupuesto limitado
• Empresarios y dueños de PYMES
• Mujeres entre 30-50 años que cuidan su imagen`}
                className="w-full p-4 text-lg border border-gray-300 rounded-lg"
                rows="6"
                value={data.targetDemographic}
                onChange={(e) => setData({...data, targetDemographic: e.target.value})}
              />
              <p className="text-sm text-gray-500 mt-2">Piensa en edad, género, ingresos, ubicación, profesión, estado familiar</p>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">¿Cómo son tus clientes en su día a día? ¿Qué problemas tienen? *</label>
              <textarea
                placeholder={`Ejemplos de avatares:
• "Ejecutivos que trabajan 10+ horas y no tienen tiempo para cocinar en casa"
• "Madres emprendedoras que manejan negocio y familia al mismo tiempo"
• "Dueños de pequeñas empresas que no saben cómo crecer digitalmente"
• "Personas que han probado mil dietas y nada les funciona"`}
                className="w-full p-4 text-lg border border-gray-300 rounded-lg"
                rows="6"
                value={data.clientAvatar}
                onChange={(e) => setData({...data, clientAvatar: e.target.value})}
              />
              <p className="text-sm text-gray-500 mt-2">Describe su personalidad, rutina diaria, frustraciones, miedos, deseos</p>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">¿Qué problemas específicos resuelves para tus clientes? *</label>
              <textarea
                placeholder={`Ejemplos de problemas que resuelves:
• "Les ahorro 2+ horas diarias porque no tienen que cocinar ni hacer mercado"
• "Les quito el estrés de manejar sus finanzas porque lo hacemos nosotros"
• "Les doy la confianza que necesitan para verse bien en reuniones importantes"
• "Les elimino la frustración de no saber por dónde empezar su negocio digital"`}
                className="w-full p-4 text-lg border border-gray-300 rounded-lg"
                rows="6"
                value={data.clientPainPoints}
                onChange={(e) => setData({...data, clientPainPoints: e.target.value})}
              />
              <p className="text-sm text-gray-500 mt-2">¿Qué dolor, frustración o necesidad específica solucionas?</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg">
                Atrás
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!data.targetDemographic || !data.clientAvatar || !data.clientPainPoints}
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

  // PASO 4: TUS OBJETIVOS
  if (screen === 'onboarding' && step === 4) {
    const goalOptions = [
      "Generar más ventas/clientes", "Aumentar reconocimiento de marca", "Diferenciarnos de la competencia",
      "Educar a nuestro mercado", "Fidelizar clientes actuales", "Expandir a nuevos mercados",
      "Lanzar productos/servicios nuevos", "Posicionarnos como expertos", "Crear una comunidad", "Mejorar nuestra reputación"
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <Target className="w-12 h-12 text-orange-600 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-800">Tus Objetivos</h2>
            <p className="text-gray-600">¿Qué quieres lograr con marketing?</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '66.6%'}}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Paso 4 de 6</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">¿Cuáles son tus objetivos principales de marketing? *</label>
              <div className="grid grid-cols-1 gap-2">
                {goalOptions.map((goal, idx) => (
                  <label key={idx} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-3"
                      checked={data.businessGoals.includes(goal)}
                      onChange={() => handleCheckboxChange('businessGoals', goal)}
                    />
                    <span>{goal}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">Selecciona todas las que apliquen</p>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">¿Cuáles son tus mayores desafíos actuales? *</label>
              <textarea
                placeholder={`Ejemplos de desafíos:
• "La gente no entiende por qué somos diferentes a la competencia"
• "Nuestros clientes no saben todos los servicios que ofrecemos"
• "Nos ven como una opción cara pero no ven el valor"
• "Solo nos conocen por un producto pero tenemos muchos más"
• "Los clientes nos compran una vez pero no vuelven"`}
                className="w-full p-4 text-lg border border-gray-300 rounded-lg"
                rows="6"
                value={data.specificChallenges}
                onChange={(e) => setData({...data, specificChallenges: e.target.value})}
              />
              <p className="text-sm text-gray-500 mt-2">¿Qué te impide crecer más rápido?</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg">
                Atrás
              </button>
              <button
                onClick={() => setStep(5)}
                disabled={data.businessGoals.length === 0 || !data.specificChallenges}
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

  // PASO 5: RECURSOS Y PLATAFORMAS
  if (screen === 'onboarding' && step === 5) {
    const platforms = ["Instagram", "Facebook", "TikTok", "LinkedIn", "YouTube", "Twitter/X", "WhatsApp Business", "Google My Business"];
    const contentTypes = ["Fotos de productos/servicios", "Videos explicativos/tutoriales", "Historias detrás de escenas", "Testimonios de clientes", "Tips y consejos", "Contenido educativo"];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-800">Recursos y Plataformas</h2>
            <p className="text-gray-600">¿Con qué trabajamos?</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '83.3%'}}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Paso 5 de 6</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">¿Cuál es tu presupuesto mensual aproximado para marketing? *</label>
              <select
                className="w-full p-4 text-lg border border-gray-300 rounded-lg"
                value={data.monthlyBudget}
                onChange={(e) => setData({...data, monthlyBudget: e.target.value})}
              >
                <option value="">Selecciona tu presupuesto</option>
                {budgets.map((budget, idx) => (
                  <option key={idx} value={budget}>{budget}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">¿En qué plataformas tienes presencia actualmente?</label>
              <div className="grid grid-cols-2 gap-2">
                {platforms.map((platform, idx) => (
                  <label key={idx} className="flex items-center p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={data.currentPlatforms.includes(platform)}
                      onChange={() => handleCheckboxChange('currentPlatforms', platform)}
                    />
                    <span className="text-sm">{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">¿Qué tipo de contenido te gusta más crear?</label>
              <div className="grid grid-cols-1 gap-2">
                {contentTypes.map((type, idx) => (
                  <label key={idx} className="flex items-center p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={data.contentPreferences.includes(type)}
                      onChange={() => handleCheckboxChange('contentPreferences', type)}
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(4)} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg">
                Atrás
              </button>
              <button
                onClick={() => setStep(6)}
                disabled={!data.monthlyBudget}
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

  // PASO 6: PERSONALIDAD DE MARCA
  if (screen === 'onboarding' && step === 6) {
    const personalities = ["Amigable y cercana", "Profesional y seria", "Divertida y relajada", "Innovadora y moderna", "Tradicional y confiable", "Exclusiva y sofisticada", "Auténtica y honesta", "Inspiradora y motivacional", "Educativa y experta"];
    const communicationStyles = ["Formal y profesional (usted, señor/señora)", "Casual y amigable (tú, más relajado)", "Inspiracional y motivacional", "Educativo y experto", "Directo y sin rodeos", "Storytelling y emocional", "Divertido con humor", "Mezcla según el contexto"];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <Heart className="w-12 h-12 text-pink-600 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-800">Personalidad de tu Marca</h2>
            <p className="text-gray-600">¿Cómo quieres que te perciban?</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '100%'}}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Paso 6 de 6</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">Si tu marca fuera una persona, ¿cómo sería? *</label>
              <div className="grid grid-cols-1 gap-2">
                {personalities.map((personality, idx) => (
                  <label key={idx} className="flex items-center p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={data.brandPersonality.includes(personality)}
                      onChange={() => handleCheckboxChange('brandPersonality', personality)}
                    />
                    <span className="text-sm">{personality}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">Selecciona 2-3 que mejor describan cómo quieres ser percibido</p>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">¿Cómo prefieres comunicarte con tus clientes? *</label>
              <select
                className="w-full p-4 text-lg border border-gray-300 rounded-lg"
                value={data.communicationStyle}
                onChange={(e) => setData({...data, communicationStyle: e.target.value})}
              >
                <option value="">Selecciona tu estilo</option>
                {communicationStyles.map((style, idx) => (
                  <option key={idx} value={style}>{style}</option>
                ))}
              </select>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-green-800 mb-3 text-lg">🚀 ¡Listo para la Matriz Enterprise!</h3>
              <div className="grid grid-cols-2 gap-3 text-sm text-green-700">
                <div>✅ 120+ Pain Points universales</div>
                <div>✅ 80+ Frameworks psicológicos</div>
                <div>✅ Estrategias de posicionamiento</div>
                <div>✅ Content Pillars optimizados</div>
                <div>✅ Ejecución creativa avanzada</div>
                <div>✅ Matriz de plataformas</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(5)} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg">
                Atrás
              </button>
              <button
                onClick={processWithAI}
                disabled={data.brandPersonality.length === 0 || !data.communicationStyle}
                className="flex-1 py-4 text-lg bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
              >
                <Brain className="w-5 h-5 mr-2" />
                ¡Generar con Matriz Enterprise!
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA DE CARGA
  if (generating && !matrix) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
          <Brain className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white p-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🧠 Matriz Enterprise Procesando...</h2>
          <div className="space-y-3 text-left">
            <div className="flex items-center text-blue-600">
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Analizando productos con IA avanzada
            </div>
            <div className="flex items-center text-blue-600">
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Creando avatares psicográficos
            </div>
            <div className="flex items-center text-blue-600">
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Aplicando 120+ Pain Points
            </div>
            <div className="flex items-center text-blue-600">
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Usando frameworks psicológicos
            </div>
            <div className="flex items-center text-blue-600">
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Generando contenido estratégico
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
                  {matrix?.company.name} - Matriz Enterprise ✨
                </h1>
                <p className="text-gray-600">{matrix?.company.type} • {matrix?.company.location}</p>
                <p className="text-sm text-green-600">🚀 {matrix?.matrix_version || 'Enterprise v2.0'}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={generateMore}
                  disabled={generating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {generating ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                  Generar Más con Matriz
                </button>
                <button
                  onClick={() => {setScreen('onboarding'); setStep(1);}}
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
          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{matrix?.products?.length || 0}</div>
              <div className="text-gray-600">Productos IA</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{matrix?.avatars?.length || 0}</div>
              <div className="text-gray-600">Avatares</div>
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

          {/* Contenido */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                Contenido Generado por Matriz Enterprise 🧠
              </h2>
              <div className="text-sm text-gray-500">
                Usando {matrix?.matrix_elements_used?.total_pain_points || 120}+ Pain Points universales
              </div>
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
                    <strong>🧠 Matriz Enterprise:</strong> {item.reasoning}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Alcance: {item.reach?.toLocaleString()}</span>
                    <span>Engagement: {item.engagement_prediction}</span>
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
