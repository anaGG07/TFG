<?php

namespace App\Service;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Psr\Log\LoggerInterface;

// ! 07/06/2025 - Servicio simplificado para manejar el envío de emails
class EmailService
{
    public function __construct(
        private MailerInterface $mailer,
        private LoggerInterface $logger
    ) {}

    public function sendPasswordResetEmail(string $userEmail, string $userName, string $resetToken): bool
    {
        try {
            $email = (new TemplatedEmail())
                ->from('info@eyraclub.es')
                ->to($userEmail)
                ->subject('EYRA - Restablecer contraseña')
                ->htmlTemplate('emails/password_reset.html.twig')
                ->context([
                    'userName' => $userName,
                    'resetToken' => $resetToken,
                    'resetUrl' => $this->generateResetUrl($resetToken),
                    'expirationTime' => '1 hora'
                ]);

            $this->mailer->send($email);
            
            $this->logger->info('Email de reset de contraseña enviado', [
                'recipient' => $userEmail,
                'token' => substr($resetToken, 0, 8) . '...'
            ]);
            
            return true;
        } catch (\Exception $e) {
            $this->logger->error('Error al enviar email de reset de contraseña', [
                'recipient' => $userEmail,
                'error' => $e->getMessage()
            ]);
            
            return false;
        }
    }

    public function sendWelcomeEmail(string $userEmail, string $userName): bool
    {
        try {
            $email = (new TemplatedEmail())
                ->from('info@eyraclub.es')
                ->to($userEmail)
                ->subject('¡Bienvenida a EYRA!')
                ->htmlTemplate('emails/welcome.html.twig')
                ->context([
                    'userName' => $userName,
                    'dashboardUrl' => $this->generateDashboardUrl()
                ]);

            $this->mailer->send($email);
            
            $this->logger->info('Email de bienvenida enviado', [
                'recipient' => $userEmail
            ]);
            
            return true;
        } catch (\Exception $e) {
            $this->logger->error('Error al enviar email de bienvenida', [
                'recipient' => $userEmail,
                'error' => $e->getMessage()
            ]);
            
            return false;
        }
    }

    public function sendCycleReminderEmail(string $userEmail, string $userName, array $cycleInfo): bool
    {
        try {
            $email = (new TemplatedEmail())
                ->from('info@eyraclub.es')
                ->to($userEmail)
                ->subject('EYRA - Recordatorio de tu ciclo')
                ->htmlTemplate('emails/cycle_reminder.html.twig')
                ->context([
                    'userName' => $userName,
                    'cycleInfo' => $cycleInfo,
                    'calendarUrl' => $this->generateCalendarUrl()
                ]);

            $this->mailer->send($email);
            
            $this->logger->info('Email de recordatorio de ciclo enviado', [
                'recipient' => $userEmail
            ]);
            
            return true;
        } catch (\Exception $e) {
            $this->logger->error('Error al enviar email de recordatorio de ciclo', [
                'recipient' => $userEmail,
                'error' => $e->getMessage()
            ]);
            
            return false;
        }
    }

    public function sendInvitationSentEmail(
        string $inviterEmail, 
        string $inviterName, 
        string $invitedEmail, 
        string $invitationCode,
        string $guestType,
        array $accessPermissions,
        \DateTime $expirationDate
    ): bool {
        try {
            $email = (new TemplatedEmail())
                ->from('info@eyraclub.es')
                ->to($inviterEmail)
                ->subject('EYRA - Invitación enviada exitosamente')
                ->htmlTemplate('emails/invitation_sent.html.twig')
                ->context([
                    'inviterName' => $inviterName,
                    'invitedEmail' => $invitedEmail,
                    'invitationCode' => $invitationCode,
                    'guestTypeLabel' => $this->getGuestTypeLabel($guestType),
                    'accessPermissions' => $this->formatAccessPermissions($accessPermissions),
                    'expirationDate' => $expirationDate->format('d/m/Y H:i'),
                    'dashboardUrl' => $this->generateDashboardUrl()
                ]);

            $this->mailer->send($email);
            
            $this->logger->info('Email de confirmación de invitación enviado', [
                'inviter' => $inviterEmail,
                'invited' => $invitedEmail,
                'code' => substr($invitationCode, 0, 4) . '...'
            ]);
            
            return true;
        } catch (\Exception $e) {
            $this->logger->error('Error al enviar email de confirmación de invitación', [
                'inviter' => $inviterEmail,
                'invited' => $invitedEmail,
                'error' => $e->getMessage()
            ]);
            
            return false;
        }
    }

    public function sendInvitationReceivedEmail(
        string $invitedEmail,
        string $inviterName,
        string $invitationCode,
        string $guestType,
        array $accessPermissions,
        \DateTime $expirationDate
    ): bool {
        try {
            $email = (new TemplatedEmail())
                ->from('info@eyraclub.es')
                ->to($invitedEmail)
                ->subject('EYRA - Te han invitado a acceder')
                ->htmlTemplate('emails/invitation_received.html.twig')
                ->context([
                    'inviterName' => $inviterName,
                    'invitationCode' => $invitationCode,
                    'guestTypeLabel' => $this->getGuestTypeLabel($guestType),
                    'accessPermissions' => $this->formatAccessPermissions($accessPermissions),
                    'expirationDate' => $expirationDate->format('d/m/Y H:i'),
                    'invitationUrl' => $this->generateInvitationUrl($invitationCode)
                ]);

            $this->mailer->send($email);
            
            $this->logger->info('Email de invitación enviado', [
                'recipient' => $invitedEmail,
                'inviter' => $inviterName,
                'code' => substr($invitationCode, 0, 4) . '...'
            ]);
            
            return true;
        } catch (\Exception $e) {
            $this->logger->error('Error al enviar email de invitación', [
                'recipient' => $invitedEmail,
                'inviter' => $inviterName,
                'error' => $e->getMessage()
            ]);
            
            return false;
        }
    }

    // Métodos auxiliares
    private function generateResetUrl(string $token): string
    {
        $baseUrl = $_ENV['FRONTEND_BASE_URL'] ?? 'https://eyraclub.es';
        $resetPath = $_ENV['FRONTEND_RESET_PASSWORD_PATH'] ?? '/reset-password';
        return $baseUrl . $resetPath . '?token=' . $token;
    }

    private function generateDashboardUrl(): string
    {
        $baseUrl = $_ENV['FRONTEND_BASE_URL'] ?? 'https://eyraclub.es';
        $dashboardPath = $_ENV['FRONTEND_DASHBOARD_PATH'] ?? '/dashboard';
        return $baseUrl . $dashboardPath;
    }

    private function generateCalendarUrl(): string
    {
        $baseUrl = $_ENV['FRONTEND_BASE_URL'] ?? 'https://eyraclub.es';
        return $baseUrl . '/calendar';
    }

    private function getGuestTypeLabel(string $guestType): string
    {
        return match($guestType) {
            'partner' => 'Pareja',
            'healthcare_provider' => 'Profesional de la Salud',
            'parental' => 'Familiar',
            'friend' => 'Amigo/a',
            default => 'Invitado'
        };
    }

    private function formatAccessPermissions(array $permissions): array
    {
        $formatted = [];
        foreach ($permissions as $permission) {
            $formatted[] = match($permission) {
                'view_cycle' => 'Ver información de ciclos menstruales',
                'view_symptoms' => 'Ver síntomas registrados',
                'view_moods' => 'Ver estados de ánimo',
                'view_calendar' => 'Acceder al calendario',
                'view_analytics' => 'Ver análisis y estadísticas',
                'view_predictions' => 'Ver predicciones del ciclo',
                default => $permission
            };
        }
        return $formatted;
    }

    private function generateInvitationUrl(string $code): string
    {
        $baseUrl = $_ENV['FRONTEND_BASE_URL'] ?? 'https://eyraclub.es';
        $invitationPath = $_ENV['FRONTEND_INVITATION_PATH'] ?? '/invitation';
        return $baseUrl . $invitationPath . '?code=' . $code;
    }
}
