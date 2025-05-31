import React from "react";
import { NeomorphicInput, NeomorphicButton } from "../ui/NeomorphicComponents";

interface ProfileFormProps {
  form: any;
  error: string | null;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: (e: React.FormEvent) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ form, error, loading, handleChange, handleSave }) => (
  <form onSubmit={handleSave} className="flex flex-col gap-4 w-full">
    <NeomorphicInput
      id="name"
      name="name"
      value={form.name}
      onChange={handleChange}
      placeholder="Nombre"
      required
    />
    <NeomorphicInput
      id="lastName"
      name="lastName"
      value={form.lastName}
      onChange={handleChange}
      placeholder="Apellido"
      required
    />
    <NeomorphicInput
      id="username"
      name="username"
      value={form.username}
      onChange={handleChange}
      placeholder="Nombre de usuario"
      required
    />
    <NeomorphicInput
      id="birthDate"
      name="birthDate"
      value={form.birthDate}
      onChange={handleChange}
      placeholder="Fecha de nacimiento"
      type="date"
      required
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
        {loading ? "Guardando..." : "Guardar cambios"}
      </NeomorphicButton>
    </div>
  </form>
);

export default ProfileForm; 