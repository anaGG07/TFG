<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 * 
 * ! 23/05/2025 - Migración para implementar el nuevo modelo de ciclos basado en fases
 */
final class Version20250523000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Implementa el nuevo modelo de ciclos basado en fases';
    }

    public function up(Schema $schema): void
    {
        // Añadir campos a la tabla menstrual_cycle
        $this->addSql('ALTER TABLE menstrual_cycle ADD phase VARCHAR(20) DEFAULT NULL');
        $this->addSql('ALTER TABLE menstrual_cycle ADD cycle_id VARCHAR(36) DEFAULT NULL');
        $this->addSql('COMMENT ON COLUMN menstrual_cycle.phase IS \'(DC2Type:cycle_phase)\'');
        
        // Crear índice para ciclo_id para mejorar el rendimiento de búsquedas
        $this->addSql('CREATE INDEX idx_menstrual_cycle_id ON menstrual_cycle (cycle_id)');
        
        // Modificar la tabla cycle_day (preparamos la migración pero no ejecutamos aún los cambios de relación)
        // Primero creamos nueva columna para la nueva relación
        $this->addSql('ALTER TABLE cycle_day ADD cycle_phase_id INT DEFAULT NULL');
        
        // Crear índice para la nueva relación
        $this->addSql('CREATE INDEX idx_cycle_day_phase_id ON cycle_day (cycle_phase_id)');
        
        // Añadimos restricción de clave foránea a la nueva columna
        $this->addSql('ALTER TABLE cycle_day ADD CONSTRAINT fk_cycle_day_cycle_phase FOREIGN KEY (cycle_phase_id) REFERENCES menstrual_cycle (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // Eliminar índices
        $this->addSql('DROP INDEX idx_cycle_day_phase_id');
        $this->addSql('DROP INDEX idx_menstrual_cycle_id');
        
        // Eliminar clave foránea
        $this->addSql('ALTER TABLE cycle_day DROP CONSTRAINT fk_cycle_day_cycle_phase');
        
        // Eliminar columnas añadidas
        $this->addSql('ALTER TABLE cycle_day DROP COLUMN cycle_phase_id');
        $this->addSql('ALTER TABLE menstrual_cycle DROP COLUMN phase');
        $this->addSql('ALTER TABLE menstrual_cycle DROP COLUMN cycle_id');
    }
}
