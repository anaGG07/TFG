<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 * 
 * ! 23/05/2025 - Migración para eliminar campos obsoletos tras implementar el nuevo modelo basado en fases
 */
final class Version20250523000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Elimina campos obsoletos tras la implementación del modelo basado en fases';
    }

    public function up(Schema $schema): void
    {
        // Eliminar la relación original con cycle y el campo phase
        // $this->addSql('ALTER TABLE cycle_day DROP CONSTRAINT fk_cycle_day_cycle_id');
        // $this->addSql('DROP INDEX idx_cycle_day_cycle_id');
        // $this->addSql('ALTER TABLE cycle_day DROP cycle_id');
        $this->addSql('ALTER TABLE cycle_day DROP phase');
        
        // Renombrar la columna cycle_phase_id para ser la nueva relación principal
        $this->addSql('ALTER TABLE cycle_day RENAME COLUMN cycle_phase_id TO cycle_phase_id');
        
        // Eliminar restricción nullable: false de la relación cycle_phase
        $this->addSql('ALTER TABLE cycle_day ALTER COLUMN cycle_phase_id SET NOT NULL');
    
        $this->addSql('ALTER TABLE cycle_day DROP COLUMN cycle_id;');
    

    }

    public function down(Schema $schema): void
    {
        // Permitir NULL en cycle_phase_id
        $this->addSql('ALTER TABLE cycle_day ALTER COLUMN cycle_phase_id DROP NOT NULL');
        
        // Recrear el campo cycle_id y phase
        $this->addSql('ALTER TABLE cycle_day ADD cycle_id INT');
        $this->addSql('ALTER TABLE cycle_day ADD phase VARCHAR(20)');
        $this->addSql('COMMENT ON COLUMN cycle_day.phase IS \'(DC2Type:cycle_phase)\'');
        
        // Crear la restricción de clave foránea
        $this->addSql('ALTER TABLE cycle_day ADD CONSTRAINT fk_cycle_day_cycle_id FOREIGN KEY (cycle_id) REFERENCES menstrual_cycle (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_cycle_day_cycle_id ON cycle_day (cycle_id)');
    }
}
