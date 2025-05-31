import { User } from "../types/domain";
import { API_ROUTES } from "../config/apiRoutes";
import { apiFetch } from "../utils/httpClient";

export const userService = {
  async updateProfile(data: Partial<User>): Promise<User> {
    const body = {
      ...data,
      avatar:
        data.avatar && typeof data.avatar === "object"
          ? JSON.stringify(data.avatar)
          : data.avatar,
    };
    return apiFetch(API_ROUTES.USER.UPDATE_PROFILE, {
      method: "PUT",
      body,
    });
  },

  async updateAvatar(avatar: any): Promise<User> {
    const body = {
      avatar:
        avatar && typeof avatar === "object" ? JSON.stringify(avatar) : avatar,
    };
    return apiFetch(API_ROUTES.USER.UPDATE_PROFILE, {
      method: "PUT",
      body,
    });
  },

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    return apiFetch(API_ROUTES.AUTH.PASSWORD_CHANGE, {
      method: "POST",
      body: { currentPassword, newPassword },
    });
  },

  async updateOnboarding(data: Partial<User["onboarding"]>): Promise<User> {
    return apiFetch(API_ROUTES.AUTH.ONBOARDING, {
      method: "POST",
      body: data,
    });
  },

  async updateOnboardingPartial(data: Partial<User["onboarding"]>): Promise<User> {
    return apiFetch(API_ROUTES.AUTH.ONBOARDING, {
      method: "PUT",
      body: data,
    });
  },
};
