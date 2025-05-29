<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

// ! 28/05/2025 - Migración creada para añadir la tabla invitation_code y modificar guest_access

final class Version20250528000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Creates invitation_code table for temporary invitation system and adds relationship to guest_access';
    }

    public function up(Schema $schema): void
    {
        // ! 28/05/2025 - Crear tabla invitation_code
        $this->addSql('CREATE TABLE invitation_code (
            id SERIAL PRIMARY KEY,
            code VARCHAR(10) NOT NULL UNIQUE,
            creator_id INTEGER NOT NULL,
            guest_type VARCHAR(50) NOT NULL,
            access_permissions JSON NOT NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            expires_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            status VARCHAR(20) DEFAULT \'active\' NOT NULL,
            redeemed_by_id INTEGER DEFAULT NULL,
            redeemed_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL
        )');

        // ! 28/05/2025 - Añadir índices para mejorar el rendimiento
        $this->addSql('CREATE INDEX IDX_invitation_code_creator ON invitation_code (creator_id)');
        $this->addSql('CREATE INDEX IDX_invitation_code_status ON invitation_code (status)');
        $this->addSql('CREATE INDEX IDX_invitation_code_redeemed_by ON invitation_code (redeemed_by_id)');

        // ! 28/05/2025 - Añadir claves foráneas
        $this->addSql('ALTER TABLE invitation_code ADD CONSTRAINT FK_invitation_code_creator 
            FOREIGN KEY (creator_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE invitation_code ADD CONSTRAINT FK_invitation_code_redeemed_by 
            FOREIGN KEY (redeemed_by_id) REFERENCES "user" (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');

        // ! 28/05/2025 - Añadir columna invitation_code_id a guest_access
        $this->addSql('ALTER TABLE guest_access ADD invitation_code_id INTEGER DEFAULT NULL');
        $this->addSql('CREATE INDEX IDX_guest_access_invitation_code ON guest_access (invitation_code_id)');
        $this->addSql('ALTER TABLE guest_access ADD CONSTRAINT FK_guest_access_invitation_code 
            FOREIGN KEY (invitation_code_id) REFERENCES invitation_code (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');

        // ! 28/05/2025 - Comentario explicativo sobre la columna access_permissions
        $this->addSql('COMMENT ON COLUMN invitation_code.access_permissions IS \'JSON array con permisos específicos otorgados con este código\'');
        $this->addSql('COMMENT ON COLUMN invitation_code.status IS \'Estado del código: active, used, expired, revoked\'');
        $this->addSql('COMMENT ON COLUMN invitation_code.guest_type IS \'Tipo de invitado: partner, friend, parental, healthcare_provider\'');
    }

    public function down(Schema $schema): void
    {
        // ! 28/05/2025 - Eliminar la relación de guest_access con invitation_code
        $this->addSql('ALTER TABLE guest_access DROP CONSTRAINT IF EXISTS FK_guest_access_invitation_code');
        $this->addSql('DROP INDEX IF EXISTS IDX_guest_access_invitation_code');
        $this->addSql('ALTER TABLE guest_access DROP COLUMN invitation_code_id');

        // ! 28/05/2025 - Eliminar la tabla invitation_code
        $this->addSql('DROP TABLE invitation_code');
    }
}
