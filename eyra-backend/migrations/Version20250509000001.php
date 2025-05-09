<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250509000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Creates the onboarding table for user onboarding flow';
    }

    public function up(Schema $schema): void
    {
        // Crear la tabla onboarding
        $this->addSql('CREATE TABLE onboarding (
            id SERIAL NOT NULL,
            user_id INT NOT NULL,
            profile_type VARCHAR(255) NOT NULL,
            gender_identity VARCHAR(255) NOT NULL,
            pronouns VARCHAR(100) DEFAULT NULL,
            is_personal BOOLEAN NOT NULL,
            stage_of_life VARCHAR(50) NOT NULL,
            last_period_date DATE DEFAULT NULL,
            average_cycle_length INT DEFAULT NULL,
            average_period_length INT DEFAULT NULL,
            hormone_type VARCHAR(255) DEFAULT NULL,
            hormone_start_date DATE DEFAULT NULL,
            hormone_frequency_days INT DEFAULT NULL,
            receive_alerts BOOLEAN NOT NULL,
            receive_recommendations BOOLEAN NOT NULL,
            receive_cycle_phase_tips BOOLEAN NOT NULL,
            receive_workout_suggestions BOOLEAN NOT NULL,
            receive_nutrition_advice BOOLEAN NOT NULL,
            share_cycle_with_partner BOOLEAN NOT NULL,
            want_a_i_companion BOOLEAN NOT NULL,
            health_concerns JSONB NOT NULL,
            access_code VARCHAR(20) DEFAULT NULL,
            allow_parental_monitoring BOOLEAN NOT NULL,
            common_symptoms JSONB NOT NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL,
            completed BOOLEAN NOT NULL,
            PRIMARY KEY(id)
        )');

        // Índice único para asegurar relación uno a uno
        $this->addSql('CREATE UNIQUE INDEX IDX_onboarding_user_id ON onboarding (user_id)');

        // Clave foránea con eliminación en cascada
        $this->addSql('ALTER TABLE onboarding 
            ADD CONSTRAINT FK_onboarding_user_id 
            FOREIGN KEY (user_id) 
            REFERENCES "user" (id) 
            ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // Eliminar tabla onboarding en rollback
        $this->addSql('DROP TABLE onboarding');
    }
}
