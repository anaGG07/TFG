<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250520174427 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Adds entity column to symptom_log with default value';
    }

    public function up(Schema $schema): void
    {
        // ! 20/05/2025 - Modificada para añadir columna entity sin romper datos existentes
        
        // Primero añadimos la columna permitiendo NULL
        $this->addSql(<<<'SQL'
            ALTER TABLE symptom_log ADD entity VARCHAR(50) NULL
        SQL);
        
        // Actualizamos todos los registros existentes con el valor predeterminado
        $this->addSql(<<<'SQL'
            UPDATE symptom_log SET entity = 'menstrual_cycle'
        SQL);
        
        // Ahora cambiamos la columna a NOT NULL
        $this->addSql(<<<'SQL'
            ALTER TABLE symptom_log ALTER COLUMN entity SET NOT NULL
        SQL);
        
    }

    public function down(Schema $schema): void
    {
        // ! 20/05/2025 - Añadida reversión para poder deshacer esta migración
        
        // Añadimos la reversión para poder deshacer esta migración si es necesario
        $this->addSql(<<<'SQL'
            ALTER TABLE symptom_log DROP COLUMN entity
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE symptom_log ALTER state SET DEFAULT true
        SQL);
    }
}
