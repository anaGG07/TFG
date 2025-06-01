<?php

namespace App\Command;

use App\Repository\PasswordResetTokenRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

// ! 29/05/2025 - Comando para limpiar tokens de reset de contraseña expirados
#[AsCommand(
    name: 'app:clean-expired-reset-tokens',
    description: 'Elimina tokens de reset de contraseña expirados de la base de datos',
)]
class CleanExpiredResetTokensCommand extends Command
{
    public function __construct(
        private PasswordResetTokenRepository $passwordResetTokenRepository
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->info('Iniciando limpieza de tokens expirados...');

        try {
            $deletedCount = $this->passwordResetTokenRepository->deleteExpiredTokens();
            
            if ($deletedCount > 0) {
                $io->success(sprintf('Se eliminaron %d tokens expirados.', $deletedCount));
            } else {
                $io->info('No se encontraron tokens expirados para eliminar.');
            }
            
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $io->error('Error al limpiar tokens expirados: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
