import React from "react";
import { NeomorphicInput, NeomorphicButton } from "../ui/NeomorphicComponents";

interface SecurityFormProps {
  form: any;
  error: string | null;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (e: React.FormEvent) => void;
}

const SecurityForm: React.FC<SecurityFormProps> = ({ form, error, loading, handleChange, handlePasswordChange }) => (
  <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 py-2 w-full">
    <NeomorphicInput
      id="currentPassword"
      name="currentPassword"
      type="password"
      value={form.currentPassword || ""}
      onChange={handleChange}
      placeholder="Contraseña actual"
      autoComplete="current-password"
    />
    <NeomorphicInput
      id="newPassword"
      name="newPassword"
      type="password"
      value={form.newPassword || ""}
      onChange={handleChange}
      placeholder="Nueva contraseña"
      autoComplete="new-password"
    />
    <NeomorphicInput
      id="confirmPassword"
      name="confirmPassword"
      type="password"
      value={form.confirmPassword || ""}
      onChange={handleChange}
      placeholder="Confirmar nueva contraseña"
      autoComplete="new-password"
    />
    {error && (
      <div className="text-red-600 text-center font-medium">{error}</div>
    )}
    <div className="flex gap-4 mt-2 w-full">
      <NeomorphicButton
        type="submit"
        variant="primary"
        className="flex-1 border-2 border-transparent"
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar contraseña"}
      </NeomorphicButton>
    </div>
  </form>
);

export default SecurityForm; 