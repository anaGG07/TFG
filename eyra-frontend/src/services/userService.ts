import { User } from '../types/domain';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const userService = {
  async updateProfile(userId: number, data: Partial<User>): Promise<User> {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar el perfil');
    }

    return response.json();
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_URL}/password-change`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al cambiar la contraseña');
    }
  },

  async updateOnboarding(data: Partial<User['onboarding']>): Promise<User> {
    const response = await fetch(`${API_URL}/onboarding`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar las preferencias');
    }

    return response.json();
  },
}; 