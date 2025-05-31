<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250531000002 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Añadir campo guest_preferences a tabla guest_access para sistema de calendario compartido';
    }

    public function up(Schema $schema): void
    {
        // ! 31/05/2025 - Migración para añadir campo guest_preferences a GuestAccess
        $this->addSql('ALTER TABLE guest_access ADD COLUMN guest_preferences JSON NULL');
        $this->addSql('COMMENT ON COLUMN guest_access.guest_preferences IS \'Preferencias del invitado para filtrar información del anfitrión en calendario compartido\'');
    }

    public function down(Schema $schema): void
    {
        // ! 31/05/2025 - Rollback: eliminar campo guest_preferences
        $this->addSql('ALTER TABLE guest_access DROP COLUMN guest_preferences');
    }
}
