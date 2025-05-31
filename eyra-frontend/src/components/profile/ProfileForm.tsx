import React from "react";
import { NeomorphicInput, NeomorphicButton } from "../ui/NeomorphicComponents";

interface ProfileFormProps {
  form: {
    name: string;
    lastName: string;
    username: string;
    birthDate: string;
  };
  error: string | null;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: (e: React.FormEvent) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ form, error, loading, handleChange, handleSave }) => {
  const validateForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que los campos no estén vacíos
    if (!form.name.trim() || !form.lastName.trim() || !form.username.trim() || !form.birthDate) {
      return false;
    }

    // Validar formato de fecha
    const birthDate = new Date(form.birthDate);
    if (isNaN(birthDate.getTime())) {
      return false;
    }

    // Validar que la fecha no sea futura
    if (birthDate > new Date()) {
      return false;
    }

    // Validar longitud del nombre de usuario
    if (form.username.length < 3 || form.username.length > 30) {
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (validateForm(e)) {
      handleSave(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-start justify-center">
      <div className="w-full max-w-xs flex flex-col gap-2 mx-auto">
        <label htmlFor="name" className="font-semibold text-[#7a2323] mb-1">Nombre</label>
        <NeomorphicInput
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre"
          required
          minLength={2}
          maxLength={50}
          pattern="[A-Za-zÀ-ÿ\s]+"
          title="Solo letras y espacios"
        />
      </div>
      <div className="w-full max-w-xs flex flex-col gap-2 mx-auto">
        <label htmlFor="lastName" className="font-semibold text-[#7a2323] mb-1">Apellido</label>
        <NeomorphicInput
          id="lastName"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Apellido"
          required
          minLength={2}
          maxLength={50}
          pattern="[A-Za-zÀ-ÿ\s]+"
          title="Solo letras y espacios"
        />
      </div>
      <div className="w-full max-w-xs flex flex-col gap-2 mx-auto">
        <label htmlFor="username" className="font-semibold text-[#7a2323] mb-1">Nombre de usuario</label>
        <NeomorphicInput
          id="username"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Nombre de usuario"
          required
          minLength={3}
          maxLength={30}
          pattern="[A-Za-z0-9_-]+"
          title="Solo letras, números, guiones y guiones bajos"
        />
      </div>
      <div className="w-full max-w-xs flex flex-col gap-2 mx-auto">
        <label htmlFor="birthDate" className="font-semibold text-[#7a2323] mb-1">Fecha de nacimiento</label>
        <NeomorphicInput
          id="birthDate"
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
          placeholder="Fecha de nacimiento"
          type="date"
          required
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
      {error && (
        <div className="col-span-2 text-red-600 text-center font-medium">{error}</div>
      )}
      <div className="col-span-2 flex justify-center">
        <NeomorphicButton
          type="submit"
          variant="primary"
          className="px-8 py-3 text-lg min-w-[180px] border-2 border-transparent"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </NeomorphicButton>
      </div>
    </form>
  );
};

export default ProfileForm; 