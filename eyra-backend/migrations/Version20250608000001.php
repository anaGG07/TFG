<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * ! 08/06/2025 - Migración para añadir campo de configuración de privacidad de búsqueda
 * Añade el campo allow_searchable a la tabla user para controlar si un usuario 
 * permite ser encontrado en búsquedas por otros usuarios
 */
final class Version20250608000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add allow_searchable field to user table for search privacy control';
    }

    public function up(Schema $schema): void
    {
        // Añadir el campo allow_searchable con valor por defecto true
        $this->addSql('ALTER TABLE "user" ADD allow_searchable BOOLEAN DEFAULT true NOT NULL');
        
        // Crear índice para optimizar consultas de búsqueda
        $this->addSql('CREATE INDEX IDX_USER_SEARCHABLE ON "user" (allow_searchable)');
        
        // Añadir comentario para documentar el propósito del campo
        $this->addSql('COMMENT ON COLUMN "user".allow_searchable IS \'Controla si el usuario permite ser encontrado en búsquedas por otros usuarios\'');
    }

    public function down(Schema $schema): void
    {
        // Eliminar el índice
        $this->addSql('DROP INDEX IDX_USER_SEARCHABLE');
        
        // Eliminar el campo
        $this->addSql('ALTER TABLE "user" DROP allow_searchable');
    }
}
