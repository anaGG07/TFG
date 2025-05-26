<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * 23/05/2025 - Migración para eliminar campos obsoletos tras implementar el nuevo modelo basado en fases
 */
final class Version20250523000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Elimina campos obsoletos tras la implementación del modelo basado en fases';
    }

    public function up(Schema $schema): void
    {
        // Intentar eliminar la FK solo si existe (previene errores en entornos inconsistentes)
        $this->addSql("
            DO \$\$ BEGIN
                IF EXISTS (
                    SELECT 1
                    FROM information_schema.table_constraints
                    WHERE constraint_name = 'fk_cycle_day_cycle_id'
                      AND table_name = 'cycle_day'
                ) THEN
                    ALTER TABLE cycle_day DROP CONSTRAINT fk_cycle_day_cycle_id;
                END IF;
            END \$\$;
        ");

        // Eliminar índice si existe
        $this->addSql('DROP INDEX IF EXISTS idx_cycle_day_cycle_id');

        // Eliminar campo obsoleto
        $this->addSql('ALTER TABLE cycle_day DROP COLUMN IF EXISTS cycle_id');
        $this->addSql('ALTER TABLE cycle_day DROP COLUMN IF EXISTS phase');

        // Hacer obligatoria la nueva relación con ciclo (ya creada en migración anterior)
        $this->addSql('ALTER TABLE cycle_day ALTER COLUMN cycle_phase_id SET NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // Revertir nullable en cycle_phase_id
        $this->addSql('ALTER TABLE cycle_day ALTER COLUMN cycle_phase_id DROP NOT NULL');

        // Volver a crear campo cycle_id y phase
        $this->addSql('ALTER TABLE cycle_day ADD cycle_id INT');
        $this->addSql('ALTER TABLE cycle_day ADD phase VARCHAR(20)');
        $this->addSql('COMMENT ON COLUMN cycle_day.phase IS \'(DC2Type:cycle_phase)\'');

        // Restaurar la relación con cycle_id
        $this->addSql('ALTER TABLE cycle_day ADD CONSTRAINT fk_cycle_day_cycle_id FOREIGN KEY (cycle_id) REFERENCES menstrual_cycle (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_cycle_day_cycle_id ON cycle_day (cycle_id)');
    }
}
