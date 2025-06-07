import { useState } from "react";
import { API_ROUTES } from "../config/apiRoutes";

interface UsePasswordResetReturn {
  requestReset: (email: string) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  resetStates: () => void;
}

export const usePasswordReset = (): UsePasswordResetReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const requestReset = async (email: string): Promise<void> => {
    if (!email) {
      setError("El email es requerido");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor ingresa un email válido");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(API_ROUTES.AUTH.PASSWORD_RESET, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al procesar la solicitud");
      }

      // Si llegamos aquí, el email tiene formato válido y la petición fue exitosa
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Error al enviar la solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  const resetStates = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setError(null);
  };

  return {
    requestReset,
    isLoading,
    isSuccess,
    error,
    resetStates,
  };
};
