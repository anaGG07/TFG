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
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

  // Validación de complejidad de contraseña
  const isPasswordComplex = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  const validateForm = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es obligatoria';
    } else if (form.currentPassword.length < 8) {
      newErrors.currentPassword = 'La contraseña actual debe tener al menos 8 caracteres';
    }
    if (!form.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es obligatoria';
    } else if (form.newPassword.length < 8) {
      newErrors.newPassword = 'La nueva contraseña debe tener al menos 8 caracteres';
    } else if (!isPasswordComplex(form.newPassword)) {
      newErrors.newPassword = 'Debe tener mayúscula, minúscula, número y símbolo';
    } else if (form.newPassword === form.currentPassword) {
      newErrors.newPassword = 'La nueva contraseña debe ser diferente a la actual';
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'La confirmación es obligatoria';
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'La nueva contraseña y la confirmación no coinciden';
    }
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (validateForm(e)) {
      try {
        handlePasswordChange(e);
        setFieldErrors({});
      } catch (err: any) {
        if (err.response && err.response.errors) {
          setFieldErrors(err.response.errors);
        }
      }
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
        {fieldErrors.currentPassword && <span className="text-red-600 text-xs">{fieldErrors.currentPassword}</span>}
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
        {fieldErrors.newPassword && <span className="text-red-600 text-xs">{fieldErrors.newPassword}</span>}
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
        {fieldErrors.confirmPassword && <span className="text-red-600 text-xs">{fieldErrors.confirmPassword}</span>}
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