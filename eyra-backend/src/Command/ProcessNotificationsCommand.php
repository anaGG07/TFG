<?php

namespace App\Command;

use App\Service\NotificationService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:process-notifications',
    description: 'Process pending notifications and send them',
)]
class ProcessNotificationsCommand extends Command
{
    public function __construct(
        private NotificationService $notificationService
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Processing pending notifications');

        try {
            $result = $this->notificationService->processPendingNotifications();
            
            $io->success(sprintf(
                'Successfully processed %d of %d notifications',
                $result['processed'],
                $result['total']
            ));

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $io->error('Error processing notifications: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
