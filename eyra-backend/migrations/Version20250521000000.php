<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Remove genderIdentity field from user table
 */
final class Version20250521000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Elimina el campo gender_identity de la tabla user';
    }

    public function up(Schema $schema): void
    {
        // ! 21/05/2025 - Eliminación del campo gender_identity de la tabla user
        $this->addSql('ALTER TABLE "user" DROP COLUMN gender_identity');
    }

    public function down(Schema $schema): void
    {
        // ! 21/05/2025 - Añadir el campo gender_identity en caso de rollback
        $this->addSql('ALTER TABLE "user" ADD gender_identity VARCHAR(255) DEFAULT NULL');
    }
}
