import React from "react";
import { NeomorphicInput, NeomorphicButton } from "../ui/NeomorphicComponents";

interface SecurityFormProps {
  form: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  error: string | null;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (e: React.FormEvent) => void;
}

const SecurityForm: React.FC<SecurityFormProps> = ({ form, error, loading, handleChange, handlePasswordChange }) => {
  const validateForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que todos los campos estén completos
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return false;
    }

    // Validar longitud mínima de contraseña
    if (form.newPassword.length < 8) {
      return false;
    }

    // Validar que la nueva contraseña y la confirmación coincidan
    if (form.newPassword !== form.confirmPassword) {
      return false;
    }

    // Validar que la nueva contraseña sea diferente a la actual
    if (form.newPassword === form.currentPassword) {
      return false;
    }

    // Validar complejidad de la contraseña
    const hasUpperCase = /[A-Z]/.test(form.newPassword);
    const hasLowerCase = /[a-z]/.test(form.newPassword);
    const hasNumbers = /\d/.test(form.newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (validateForm(e)) {
      handlePasswordChange(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2 w-full items-center">
      <div className="w-full max-w-xs flex flex-col gap-2">
        <label htmlFor="currentPassword" className="font-semibold text-[#7a2323] mb-1">Contraseña actual</label>
        <NeomorphicInput
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={form.currentPassword || ""}
          onChange={handleChange}
          placeholder="Contraseña actual"
          autoComplete="current-password"
          required
          minLength={8}
        />
      </div>
      <div className="w-full max-w-xs flex flex-col gap-2">
        <label htmlFor="newPassword" className="font-semibold text-[#7a2323] mb-1">Nueva contraseña</label>
        <NeomorphicInput
          id="newPassword"
          name="newPassword"
          type="password"
          value={form.newPassword || ""}
          onChange={handleChange}
          placeholder="Nueva contraseña"
          autoComplete="new-password"
          required
          minLength={8}
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
          title="La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial"
        />
      </div>
      <div className="w-full max-w-xs flex flex-col gap-2">
        <label htmlFor="confirmPassword" className="font-semibold text-[#7a2323] mb-1">Confirmar nueva contraseña</label>
        <NeomorphicInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword || ""}
          onChange={handleChange}
          placeholder="Confirmar nueva contraseña"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>
      {error && (
        <div className="text-red-600 text-center font-medium">{error}</div>
      )}
      <div className="flex gap-4 mt-2 w-full justify-center">
        <NeomorphicButton
          type="submit"
          variant="primary"
          className="px-8 py-3 text-lg min-w-[180px] border-2 border-transparent"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar contraseña"}
        </NeomorphicButton>
      </div>
    </form>
  );
};

export default SecurityForm; 