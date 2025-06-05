/**
 * Script para probar la disponibilidad de endpoints de API
 * 
 * Este script puede ejecutarse en la consola del navegador para diagnosticar
 * si los endpoints de la API están funcionando correctamente.
 */

// Función para probar un endpoint específico
async function testEndpoint(url, method = 'GET', body = null) {
  console.log(`🧪 Probando ${method} a ${url}...`);
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };
  
  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, options);
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log(`📋 Headers:`, Object.fromEntries([...response.headers]));
    
    // Intentar obtener respuesta como JSON
    try {
      const data = await response.json();
      console.log(`✅ Respuesta:`, data);
      return { success: response.ok, status: response.status, data };
    } catch (jsonError) {
      // Si no es JSON, obtener como texto
      const text = await response.clone().text();
      console.log(`📝 Respuesta (texto):`, text);
      return { success: response.ok, status: response.status, text };
    }
  } catch (error) {
    console.error(`❌ Error al probar ${url}:`, error);
    return { success: false, error: error.message };
  }
}

// Probar todos los endpoints importantes de la API
async function testAllEndpoints() {
  const baseUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:9000' 
    : (window.location.hostname === '54.227.159.169' 
        ? 'http://54.227.159.169:9000' 
        : 'https://old.eyraclub.es');
        
  console.log(`🔍 Comenzando pruebas de API en ${baseUrl}`);
  
  // Lista de endpoints a probar
  const endpoints = [
    { url: `${baseUrl}/api/profile`, method: 'GET', name: 'Perfil de usuario' },
    { url: `${baseUrl}/api/onboarding`, method: 'POST', name: 'Endpoint de onboarding', 
      body: { 
        profileType: "profile_women",
        genderIdentity: "test", 
        completed: true 
      }
    },
    { url: `${baseUrl}/api/refresh-token`, method: 'POST', name: 'Refresh token' },
  ];
  
  // Ejecutar pruebas de cada endpoint
  const results = {};
  
  for (const endpoint of endpoints) {
    console.log(`\n🧪 Probando: ${endpoint.name}`);
    results[endpoint.name] = await testEndpoint(
      endpoint.url, 
      endpoint.method, 
      endpoint.body
    );
  }
  
  // Mostrar resumen
  console.log('\n📊 RESULTADOS DE LAS PRUEBAS:');
  Object.entries(results).forEach(([name, result]) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${name}: ${result.status || result.error || 'OK'}`);
  });
  
  return results;
}

// Ejecutar las pruebas
console.log('API Tester cargado. Para probar los endpoints, ejecuta:');
console.log('testAllEndpoints()');

// Exportar las funciones para uso en consola del navegador
window.testEndpoint = testEndpoint;
window.testAllEndpoints = testAllEndpoints;
