<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/* ! 31/05/2025 - Migración para añadir campos category y severity a la tabla condition */
final class Version20250531000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add category and severity fields to condition table';
    }

    public function up(Schema $schema): void
    {
        // ! 31/05/2025 - Añadir campos category y severity a la tabla condition
        $this->addSql('ALTER TABLE condition ADD COLUMN category VARCHAR(100)');
        $this->addSql('ALTER TABLE condition ADD COLUMN severity VARCHAR(50)');
        
        // ! 31/05/2025 - Crear índices para mejorar rendimiento en búsquedas
        $this->addSql('CREATE INDEX idx_condition_category ON condition (category)');
        $this->addSql('CREATE INDEX idx_condition_severity ON condition (severity)');
        $this->addSql('CREATE INDEX idx_condition_state ON condition (state)');
        
        // ! 31/05/2025 - Datos iniciales de ejemplo para condiciones comunes
        $this->addSql("UPDATE condition SET category = 'gynecological' WHERE name ILIKE '%endometriosis%'");
        $this->addSql("UPDATE condition SET category = 'hormonal' WHERE name ILIKE '%pcos%' OR name ILIKE '%syndrome%'");
        $this->addSql("UPDATE condition SET category = 'reproductive' WHERE name ILIKE '%fertility%' OR name ILIKE '%infertil%'");
        $this->addSql("UPDATE condition SET category = 'mental_health' WHERE name ILIKE '%anxiety%' OR name ILIKE '%depression%'");
        $this->addSql("UPDATE condition SET category = 'chronic_pain' WHERE name ILIKE '%fibromyalgia%' OR name ILIKE '%pain%'");
    }

    public function down(Schema $schema): void
    {
        // ! 31/05/2025 - Revertir cambios eliminando los campos añadidos
        $this->addSql('DROP INDEX IF EXISTS idx_condition_category');
        $this->addSql('DROP INDEX IF EXISTS idx_condition_severity');
        $this->addSql('DROP INDEX IF EXISTS idx_condition_state');
        $this->addSql('ALTER TABLE condition DROP COLUMN category');
        $this->addSql('ALTER TABLE condition DROP COLUMN severity');
    }
}
