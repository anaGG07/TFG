<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250508000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Adds onboardingCompleted field to user table';
    }

    public function up(Schema $schema): void
    {
        // Añadir el campo onboardingCompleted a la tabla user
        $this->addSql('ALTER TABLE user ADD onboarding_completed TINYINT(1) NOT NULL DEFAULT 0');
        
        // Actualizar cualquier usuario existente como no completado
        $this->addSql('UPDATE user SET onboarding_completed = 0');
    }

    public function down(Schema $schema): void
    {
        // Eliminar el campo en caso de rollback
        $this->addSql('ALTER TABLE user DROP COLUMN onboarding_completed');
    }
}
