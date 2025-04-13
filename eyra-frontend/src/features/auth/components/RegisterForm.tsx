import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { TextField } from '../../../components/forms/TextField';
import { Select } from '../../../components/forms/Select';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { ProfileType } from '../../../types/domain';

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
    genderIdentity: '',
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
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    }
    
    if (!formData.name) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'El apellido es obligatorio';
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

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
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
    
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      // Excluir la confirmación de contraseña del envío
      const { confirmPassword, ...registerData } = formData;
      
      await register(registerData);
      
      // Iniciar sesión automáticamente después del registro
      await login({ email: formData.email, password: formData.password });
      
      navigate('/dashboard');
    } catch (err: any) {
      setApiError(err.message || 'Error al registrar la cuenta. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Crear una cuenta</h1>
        <p className="text-gray-600 mt-2">Únete a EYRA y comienza tu viaje</p>
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
              id="genderIdentity"
              name="genderIdentity"
              label="Identidad de género"
              value={formData.genderIdentity}
              onChange={handleChange}
              placeholder="Opcional"
              fullWidth
              disabled={isLoading}
            />

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
            fullWidth={step === 1}
            className={step === 2 ? "ml-auto" : ""}
          >
            {step === 1 ? 'Siguiente' : 'Crear cuenta'}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-purple-600 hover:text-purple-500">
            Inicia sesión
          </Link>
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-gray-500 text-sm">
          Al registrarte, aceptas nuestros{' '}
          <Link to="/terms" className="text-purple-600 hover:text-purple-500">
            Términos de servicio
          </Link>{' '}
          y{' '}
          <Link to="/privacy" className="text-purple-600 hover:text-purple-500">
            Política de privacidad
          </Link>
        </p>
      </div>
    </div>
  );
};
