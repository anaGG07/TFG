import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { TextField } from '../../../components/forms/TextField';
import { Select } from '../../../components/forms/Select';
import Button from '../../../components/Button';
import { Alert } from '../../../components/ui/Alert';
import { ProfileType } from '../../../types/domain';
import { getRandomAvatarConfig } from "../../../components/avatarBuilder/randomAvatar";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    name: '',
    lastName: '',
    birthDate: '',
    profileType: ProfileType.WOMEN,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const profileOptions = [
    { value: ProfileType.WOMEN, label: 'Mujer' },
    { value: ProfileType.TRANS, label: 'Persona en transición' },
    { value: ProfileType.UNDERAGE, label: 'Menor de edad' },
  ];

  // Validación de complejidad de contraseña
  const isPasswordComplex = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  // Eliminar validación de formato y unicidad de username
  // Solo validar longitud máxima
  const isUsernameValid = (username: string) => {
    return username.length <= 255;
  };

  // Comprobación de unicidad de username
  const checkUsernameUnique = async (username: string) => {
    try {
      const res = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
      const data = await res.json();
      return data.isUnique;
    } catch {
      return false;
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!isPasswordComplex(formData.password)) {
      newErrors.password = 'Debe tener mayúscula, minúscula, número y símbolo';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    } else if (!isUsernameValid(formData.username)) {
      newErrors.username = 'No puede superar 255 caracteres';
    }
    if (!formData.name) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (!/^[A-Za-zÀ-ÿ\s]{2,50}$/.test(formData.name)) {
      newErrors.name = 'Solo letras y espacios (2-50 caracteres)';
    }
    if (!formData.lastName) {
      newErrors.lastName = 'El apellido es obligatorio';
    } else if (!/^[A-Za-zÀ-ÿ\s]{2,50}$/.test(formData.lastName)) {
      newErrors.lastName = 'Solo letras y espacios (2-50 caracteres)';
    }
    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es obligatoria';
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      if (birthDate > today) {
        newErrors.birthDate = 'La fecha de nacimiento no puede ser futura';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar el error específico cuando el usuario cambia el valor
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNextStep = async () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
    if (step === 2) {
      await validateStep2();
    }
  };

  const handlePreviousStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      handleNextStep();
      return;
    }
    if (!(await validateStep2())) {
      return;
    }
    setIsLoading(true);
    setApiError('');
    try {
      const { confirmPassword, ...registerData } = formData;
      const randomAvatar = getRandomAvatarConfig();
      const dataWithAvatar = {
        ...registerData,
        avatar: randomAvatar,
      };
      await register(dataWithAvatar);
      await login({ email: formData.email, password: formData.password });
      navigate('/dashboard');
    } catch (err: any) {
      // Mostrar error específico del backend si existe
      if (err.response && err.response.errors) {
        setErrors(err.response.errors);
      } else {
        setApiError(err.message || 'Error al registrar la cuenta. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-serif text-primary-DEFAULT">Crear una cuenta</h1>
        <p className="text-gray-600 mt-2">Comienza a conocer tu ciclo menstrual</p>
      </div>

      {apiError && (
        <Alert 
          variant="error" 
          className="mb-4"
          onClose={() => setApiError('')}
        >
          {apiError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              placeholder="nombre@ejemplo.com"
              fullWidth
              required
              error={errors.email}
              disabled={isLoading}
            />

            <TextField
              id="password"
              name="password"
              type="password"
              label="Contraseña"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              fullWidth
              required
              error={errors.password}
              disabled={isLoading}
            />

            <TextField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirma tu contraseña"
              fullWidth
              required
              error={errors.confirmPassword}
              disabled={isLoading}
            />
          </>
        )}

        {step === 2 && (
          <>
            <TextField
              id="username"
              name="username"
              label="Nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              placeholder="Elige un nombre de usuario"
              fullWidth
              required
              error={errors.username}
              disabled={isLoading}
            />

            <div className="grid grid-cols-2 gap-4">
              <TextField
                id="name"
                name="name"
                label="Nombre"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                fullWidth
                required
                error={errors.name}
                disabled={isLoading}
              />

              <TextField
                id="lastName"
                name="lastName"
                label="Apellido"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Tu apellido"
                fullWidth
                required
                error={errors.lastName}
                disabled={isLoading}
              />
            </div>

            <TextField
              id="birthDate"
              name="birthDate"
              type="date"
              label="Fecha de nacimiento"
              value={formData.birthDate}
              onChange={handleChange}
              fullWidth
              required
              error={errors.birthDate}
              disabled={isLoading}
            />

            <Select
              id="profileType"
              name="profileType"
              label="Tipo de perfil"
              options={profileOptions}
              value={formData.profileType}
              onChange={handleChange}
              fullWidth
              required
              disabled={isLoading}
            />
          </>
        )}

        <div className="flex justify-between mt-6">
          {step === 2 && (
            <Button
              type="button"
              variant="secondary"
              onClick={handlePreviousStep}
              disabled={isLoading}
            >
              Atrás
            </Button>
          )}

          <Button
            type={step === 2 ? "submit" : "button"}
            variant="primary"
            onClick={step === 1 ? handleNextStep : undefined}
            isLoading={isLoading}
            className={step === 1 ? "w-full" : "ml-auto"}
          >
            {step === 1 ? 'Siguiente' : 'Crear cuenta'}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-primary-DEFAULT hover:text-primary-600 font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-gray-500 text-sm">
          Al registrarte, aceptas nuestros{' '}
          <Link to="/terms" className="text-primary-DEFAULT hover:text-primary-600">
            Términos de servicio
          </Link>{' '}
          y{' '}
          <Link to="/privacy" className="text-primary-DEFAULT hover:text-primary-600">
            Política de privacidad
          </Link>
        </p>
      </div>
    </div>
  );
};
