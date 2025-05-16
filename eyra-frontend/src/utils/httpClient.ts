import { API_URL } from "../config/apiRoutes";

// Módulo de eventos para evitar dependencia circular
export const authEvents = {
  onUnauthorized: () => {
    console.warn("Handler onUnauthorized no configurado");
    window.location.href = "/login";
  },
  onLogout: async () => {
    console.warn("Handler onLogout no configurado");
    return Promise.resolve();
  },
};

export const configureAuthHandlers = (handlers: {
  onUnauthorized: () => void;
  onLogout: () => Promise<void>;
}) => {
  authEvents.onUnauthorized = handlers.onUnauthorized;
  authEvents.onLogout = handlers.onLogout;
};

interface RequestOptions extends RequestInit {
  body?: any;
  headers?: HeadersInit;
  skipErrorHandling?: boolean;
  skipRedirectCheck?: boolean;
}

// Log inicial
console.log("httpClient (fetch) inicializado, API_URL base:", API_URL);

/**
 * Llama al endpoint de refresh-token y devuelve si fue exitoso.
 */
async function tryRefreshToken(): Promise<boolean> {
  // Si ya estamos en la página de login, no intentamos reautenticar para evitar bucles
  if (window.location.pathname === '/login') {
    console.log("[httpClient] Ya en página de login, evitando bucle de renovación");
    return false;
  }
  
  try {
    console.log("[httpClient] Intentando renovar token...");
    
    const res = await fetch(`${API_URL}/api/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      credentials: "include",
      cache: "no-cache",
      mode: "cors"
    });

    if (!res.ok) {
      console.warn("[httpClient] Error al renovar token:", {
        status: res.status,
        statusText: res.statusText,
        url: res.url
      });
      return false;
    }

    console.info("[httpClient] Token renovado con éxito");
    return true;
  } catch (error) {
    console.error("[httpClient] Fallo al renovar token:", error);
    return false;
  }
}

/**
 * Función principal de peticiones a la API usando fetch.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  if (!path) throw new Error("Ruta de API no especificada");

  // SOLUCIÓN: Evitar llamadas API en páginas de login/registro excepto el login mismo
  if (
    window.location.pathname === '/login' &&
    !path.includes('login_check') &&
    !options.skipRedirectCheck
  ) {
    console.log(`Evitando llamada API ${path} en página de login`);
    throw new Error("Llamada API evitada en página de login");
  }

  const url = path.startsWith("http")
    ? path
    : path.startsWith("/api")
      ? `${API_URL}${path}`
      : `${API_URL}/api/${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  const fetchOptions: RequestInit = {
    method: options.method || "GET",
    headers,
    credentials: "include",
    cache: "no-cache",
    mode: "cors",
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  const isLoginRequest = path.includes("/login_check") && options.method === "POST";

  try {
    console.log(`📥 Enviando petición:`, {
      url,
      method: options.method,
      headers,
      body: options.body
    });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    fetchOptions.signal = controller.signal;

    let response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    console.log(`📢 Respuesta recibida:`, {
      url,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries([...response.headers])
    });

    // 🔐 Si expiró sesión, intentar refresh
    if (
      response.status === 401 &&
      !options.skipErrorHandling &&
      !options.skipRedirectCheck &&
      !isLoginRequest
    ) {
      // Evitar redirigir si ya estamos en la página de login
      if (window.location.pathname === '/login') {
        console.log("Ya en página de login, evitando redirección para prevenir bucle");
        throw new Error("Sesión no iniciada");
      }
      
      console.warn("🔒 Token expirado, intentando renovar...");
      const refreshed = await tryRefreshToken();

      if (refreshed) {
        console.log("🔄 Reintentando la petición tras refresh...");
        return apiFetch<T>(path, { ...options, skipRedirectCheck: true });
      }

      console.warn("⛔ Refresh fallido. Ejecutando logout y redirección.");
      await authEvents.onLogout();
      
      // Solo redirigir si no estamos ya en login
      if (window.location.pathname !== '/login') {
        authEvents.onUnauthorized();
      }
      
      throw new Error("Sesión expirada o inválida.");
    }

    // Manejo especial de login
    if (isLoginRequest) {
      console.log("⚠️ Petición de login detectada - manejo especial");

      const responseClone = response.clone();

      try {
        const data = await response.json();
        console.log("Respuesta JSON de login:", data);

        if (response.ok) return data as T;

        throw new Error(
          data.message || `Error ${response.status}: ${response.statusText}`
        );
      } catch (jsonError) {
        console.warn("Error al parsear JSON de login:", jsonError);

        try {
          const text = await responseClone.text();
          console.log("Respuesta como texto:", text);

          if (response.ok) {
            return { message: "Login exitoso" } as T;
          }

          if (text.includes("Internal Server Error")) {
            throw new Error("Error interno del servidor.");
          }

          throw new Error(text || `Error ${response.status}`);
        } catch (textError) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }
    }

    // ⚠️ Errores generales
    if (!response.ok) {
      const responseClone = response.clone();
      let errorMessage = `Error ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        try {
          const text = await responseClone.text();
          if (text) errorMessage = text;
        } catch {}
      }

      console.error(`API Error (${response.status}):`, errorMessage);
      throw new Error(errorMessage);
    }

    try {
      return (await response.json()) as T;
    } catch (jsonError) {
      console.warn("Error al parsear JSON:", jsonError);
      const responseClone = response.clone();

      try {
        const text = await responseClone.text();
        return text as unknown as T;
      } catch {
        return {} as T;
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Timeout: la petición excedió el tiempo máximo.");
    }

    console.error("🌐 Error de red:", error);
    throw new Error((error as Error)?.message || "Error de red desconocido");
  }
}

/**
 * Ejecuta múltiples peticiones con valores por defecto en caso de error.
 */
export async function apiFetchParallel<T extends any[]>(
  requests: {
    path: string;
    options?: RequestOptions;
    defaultValue: T[number];
  }[]
): Promise<T> {
  const results = await Promise.allSettled(
    requests.map((req) =>
      apiFetch(req.path, { ...req.options, skipErrorHandling: true }).catch(
        () => req.defaultValue
      )
    )
  );

  return results.map((result, i) =>
    result.status === "fulfilled" ? result.value : requests[i].defaultValue
  ) as T;
}
