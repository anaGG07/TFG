<?php

namespace App\Service;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

// ! 29/05/2025 - Servicio para manejar el envío de emails de la aplicación
class EmailService
{
    public function __construct(
        private MailerInterface $mailer,
        private LoggerInterface $logger,
        private ParameterBagInterface $params
    ) {}

    public function sendPasswordResetEmail(string $userEmail, string $userName, string $resetToken): bool
    {
        try {
            $email = (new TemplatedEmail())
                ->from('noreply@eyraclub.es')
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
                ->from('noreply@eyraclub.es')
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
                ->from('noreply@eyraclub.es')
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

    // ! 29/05/2025 - URLs del frontend ahora configurables mediante variables de entorno
    private function generateResetUrl(string $token): string
    {
        $baseUrl = $_ENV['FRONTEND_BASE_URL'] ?? 'http://localhost:5173';
        $resetPath = $_ENV['FRONTEND_RESET_PASSWORD_PATH'] ?? '/reset-password';
        return $baseUrl . $resetPath . '?token=' . $token;
    }

    private function generateDashboardUrl(): string
    {
        $baseUrl = $_ENV['FRONTEND_BASE_URL'] ?? 'http://localhost:5173';
        $dashboardPath = $_ENV['FRONTEND_DASHBOARD_PATH'] ?? '/dashboard';
        return $baseUrl . $dashboardPath;
    }

    private function generateCalendarUrl(): string
    {
        $baseUrl = $_ENV['FRONTEND_BASE_URL'] ?? 'http://localhost:5173';
        return $baseUrl . '/calendar';
    }
}
