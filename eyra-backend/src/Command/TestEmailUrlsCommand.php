<?php

namespace App\Command;

use App\Service\EmailService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

// ! 29/05/2025 - Comando para verificar la configuración de URLs de email
#[AsCommand(
    name: 'app:test-email-urls',
    description: 'Muestra las URLs que se generarán en los emails para verificar la configuración',
)]
class TestEmailUrlsCommand extends Command
{
    public function __construct(
        private EmailService $emailService
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('🔗 EYRA - Verificación de URLs de Email');

        // Leer configuración desde .env
        $frontendBaseUrl = $_ENV['FRONTEND_BASE_URL'] ?? 'http://localhost:5173';
        $resetPasswordPath = $_ENV['FRONTEND_RESET_PASSWORD_PATH'] ?? '/reset-password';
        $dashboardPath = $_ENV['FRONTEND_DASHBOARD_PATH'] ?? '/dashboard';

        $io->section('📊 Configuración Actual');
        $io->table(
            ['Variable', 'Valor'],
            [
                ['FRONTEND_BASE_URL', $frontendBaseUrl],
                ['FRONTEND_RESET_PASSWORD_PATH', $resetPasswordPath],
                ['FRONTEND_DASHBOARD_PATH', $dashboardPath],
            ]
        );

        $io->section('🌐 URLs Generadas');
        
        $sampleToken = 'abcd1234567890ef'; // Token de ejemplo
        
        $resetUrl = $frontendBaseUrl . $resetPasswordPath . '?token=' . $sampleToken;
        $dashboardUrl = $frontendBaseUrl . $dashboardPath;
        $calendarUrl = $frontendBaseUrl . '/calendar';

        $io->table(
            ['Tipo de Email', 'URL Generada'],
            [
                ['Reset de Contraseña', $resetUrl],
                ['Bienvenida (Dashboard)', $dashboardUrl],
                ['Recordatorio (Calendario)', $calendarUrl],
            ]
        );

        $io->section('⚙️ Cómo Configurar');
        $io->text([
            'Para cambiar las URLs, edita el archivo .env:',
            '',
            '# Cambia la URL base (puerto común para Vite: 5173, React CRA: 3000)',
            'FRONTEND_BASE_URL=http://localhost:TU_PUERTO',
            '',
            '# Cambia las rutas si son diferentes en tu frontend',
            'FRONTEND_RESET_PASSWORD_PATH=/tu-ruta-reset',
            'FRONTEND_DASHBOARD_PATH=/tu-ruta-dashboard',
        ]);

        $io->section('🚀 Configuraciones Comunes');
        $io->table(
            ['Framework/Herramienta', 'Puerto Típico', 'URL Base'],
            [
                ['Vite (React/Vue)', '5173', 'http://localhost:5173'],
                ['Create React App', '3000', 'http://localhost:3000'],
                ['Next.js', '3000', 'http://localhost:3000'],
                ['Angular CLI', '4200', 'http://localhost:4200'],
                ['Vue CLI', '8080', 'http://localhost:8080'],
                ['Producción', '80/443', 'https://tu-dominio.com'],
            ]
        );

        if ($frontendBaseUrl === 'http://localhost:5173' && $resetPasswordPath === '/reset-password') {
            $io->success('✅ Configuración por defecto (Vite en puerto 5173)');
        } else {
            $io->info('ℹ️  Configuración personalizada detectada');
        }

        $io->note([
            'Después de cambiar las URLs en .env:',
            '1. Reinicia tu servidor backend',
            '2. Prueba el endpoint /password-reset',
            '3. Verifica que la URL en el email sea correcta'
        ]);

        return Command::SUCCESS;
    }
}
