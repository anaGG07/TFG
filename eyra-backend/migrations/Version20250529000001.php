<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

// ! 29/05/2025 - Migración para crear tabla de tokens de reset de contraseña
final class Version20250529000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create password_reset_tokens table';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE password_reset_tokens (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            token VARCHAR(255) NOT NULL UNIQUE,
            expires_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            used BOOLEAN NOT NULL DEFAULT FALSE,
            CONSTRAINT FK_password_reset_tokens_user_id FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE
        )');
        
        $this->addSql('CREATE INDEX idx_token ON password_reset_tokens (token)');
        $this->addSql('CREATE INDEX idx_expires_at ON password_reset_tokens (expires_at)');
        $this->addSql('COMMENT ON COLUMN password_reset_tokens.expires_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN password_reset_tokens.created_at IS \'(DC2Type:datetime_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE password_reset_tokens');
    }
}
