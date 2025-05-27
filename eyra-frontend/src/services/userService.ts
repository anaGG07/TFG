import { User } from '../types/domain';
import { API_ROUTES } from '../config/apiRoutes';
import { apiFetch } from '../utils/httpClient';

export const userService = {
  async updateProfile(data: Partial<User>): Promise<User> {
    return apiFetch(API_ROUTES.USER.UPDATE_PROFILE, {
      method: 'PUT',
      body: data,
    });
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return apiFetch(API_ROUTES.AUTH.PASSWORD_CHANGE, {
      method: 'POST',
      body: { currentPassword, newPassword },
    });
  },

  async updateOnboarding(data: Partial<User['onboarding']>): Promise<User> {
    return apiFetch(API_ROUTES.AUTH.ONBOARDING, {
      method: 'PUT',
      body: data,
    });
  },
}; 