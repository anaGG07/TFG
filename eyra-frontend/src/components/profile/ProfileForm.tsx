import React from "react";
import { NeomorphicInput, NeomorphicButton } from "../ui/NeomorphicComponents";

interface ProfileFormProps {
  form: {
    name: string;
    lastName: string;
    username: string;
    birthDate: string;
    // ! 08/06/2025 - Añadido campo de privacidad
    allowSearchable?: boolean;
  };
  error: string | null;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: (e: React.FormEvent) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ form, error, loading, handleChange, handleSave }) => {
  // Solo validar longitud máxima de username
  const isUsernameValid = (username: string) => {
    return username.length <= 255;
  };

  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

  const validateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (!/^[A-Za-zÀ-ÿ\s]{2,50}$/.test(form.name)) {
      newErrors.name = 'Solo letras y espacios (2-50 caracteres)';
    }
    if (!form.lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio';
    } else if (!/^[A-Za-zÀ-ÿ\s]{2,50}$/.test(form.lastName)) {
      newErrors.lastName = 'Solo letras y espacios (2-50 caracteres)';
    }
    if (!form.username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    } else if (!isUsernameValid(form.username)) {
      newErrors.username = 'No puede superar 255 caracteres';
    }
    if (!form.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es obligatoria';
    } else {
      const birthDate = new Date(form.birthDate);
      if (isNaN(birthDate.getTime())) {
        newErrors.birthDate = 'Formato de fecha inválido';
      } else if (birthDate > new Date()) {
        newErrors.birthDate = 'La fecha de nacimiento no puede ser futura';
      }
    }
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (await validateForm(e)) {
      try {
        await handleSave(e);
        setFieldErrors({});
      } catch (err: any) {
        // Si el backend devuelve errores de validación
        if (err.response && err.response.errors) {
          setFieldErrors(err.response.errors);
        }
      }
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
        {fieldErrors.name && <span className="text-red-600 text-xs">{fieldErrors.name}</span>}
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
        {fieldErrors.lastName && <span className="text-red-600 text-xs">{fieldErrors.lastName}</span>}
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
          maxLength={255}
          title="Máximo 255 caracteres"
        />
        {fieldErrors.username && <span className="text-red-600 text-xs">{fieldErrors.username}</span>}
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
        {fieldErrors.birthDate && <span className="text-red-600 text-xs">{fieldErrors.birthDate}</span>}
      </div>
      
      {/* ! 08/06/2025 - Sección de configuración de privacidad */}
      <div className="col-span-2 w-full max-w-md mx-auto">
        <div className="bg-white/30 rounded-xl p-4 border border-white/20">
          <h3 className="font-semibold text-[#7a2323] mb-3 text-center">Configuración de Privacidad</h3>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label htmlFor="allowSearchable" className="text-sm text-[#7a2323] font-medium">
                Permitir que otros usuarios me encuentren
              </label>
              <p className="text-xs text-[#7a2323]/60 mt-1">
                Los usuarios podrán buscarte por tu nombre de usuario para enviarte invitaciones
              </p>
            </div>
            <div className="ml-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="allowSearchable"
                  name="allowSearchable"
                  checked={form.allowSearchable ?? true}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C62328]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C62328]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-span-2 flex justify-center">
        {error && <div className="text-red-600 text-sm mb-4 text-center max-w-md">{error}</div>}
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