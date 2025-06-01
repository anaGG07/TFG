<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250601165545 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            DROP INDEX idx_condition_state
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX idx_condition_severity
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX idx_condition_category
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE guest_access DROP CONSTRAINT fk_guest_access_invitation_code
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN guest_access.guest_preferences IS NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE guest_access ADD CONSTRAINT FK_1CA601BE5C27D062 FOREIGN KEY (invitation_code_id) REFERENCES invitation_code (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER INDEX idx_guest_access_invitation_code RENAME TO IDX_1CA601BE5C27D062
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE invitation_code DROP CONSTRAINT fk_invitation_code_redeemed_by
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX idx_invitation_code_status
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE invitation_code ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE invitation_code ALTER status DROP DEFAULT
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN invitation_code.guest_type IS NULL
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN invitation_code.access_permissions IS NULL
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN invitation_code.created_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN invitation_code.status IS NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE invitation_code ADD CONSTRAINT FK_BA14FCCC2FBC08BA FOREIGN KEY (redeemed_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER INDEX invitation_code_code_key RENAME TO UNIQ_BA14FCCC77153098
        SQL);
        $this->addSql(<<<'SQL'
            ALTER INDEX idx_invitation_code_creator RENAME TO IDX_BA14FCCC61220EA6
        SQL);
        $this->addSql(<<<'SQL'
            ALTER INDEX idx_invitation_code_redeemed_by RENAME TO IDX_BA14FCCC2FBC08BA
        SQL);
        $this->addSql(<<<'SQL'
            ALTER INDEX password_reset_tokens_token_key RENAME TO UNIQ_3967A2165F37A13B
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE SCHEMA public
        SQL);
        $this->addSql(<<<'SQL'
            ALTER INDEX uniq_3967a2165f37a13b RENAME TO password_reset_tokens_token_key
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX idx_condition_state ON condition (state)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX idx_condition_severity ON condition (severity)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX idx_condition_category ON condition (category)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE guest_access DROP CONSTRAINT FK_1CA601BE5C27D062
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN guest_access.guest_preferences IS 'Preferencias del invitado para filtrar información del anfitrión en calendario compartido'
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE guest_access ADD CONSTRAINT fk_guest_access_invitation_code FOREIGN KEY (invitation_code_id) REFERENCES invitation_code (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER INDEX idx_1ca601be5c27d062 RENAME TO idx_guest_access_invitation_code
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE invitation_code DROP CONSTRAINT FK_BA14FCCC2FBC08BA
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE invitation_code ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE invitation_code ALTER status SET DEFAULT 'active'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN invitation_code.guest_type IS 'Tipo de invitado: partner, friend, parental, healthcare_provider'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN invitation_code.access_permissions IS 'JSON array con permisos específicos otorgados con este código'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN invitation_code.created_at IS NULL
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN invitation_code.status IS 'Estado del código: active, used, expired, revoked'
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE invitation_code ADD CONSTRAINT fk_invitation_code_redeemed_by FOREIGN KEY (redeemed_by_id) REFERENCES "user" (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX idx_invitation_code_status ON invitation_code (status)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER INDEX idx_ba14fccc2fbc08ba RENAME TO idx_invitation_code_redeemed_by
        SQL);
        $this->addSql(<<<'SQL'
            ALTER INDEX idx_ba14fccc61220ea6 RENAME TO idx_invitation_code_creator
        SQL);
        $this->addSql(<<<'SQL'
            ALTER INDEX uniq_ba14fccc77153098 RENAME TO invitation_code_code_key
        SQL);
    }
}
