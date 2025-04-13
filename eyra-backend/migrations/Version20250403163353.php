<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250403163353 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            DROP SEQUENCE alert_id_seq CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            DROP SEQUENCE messenger_messages_id_seq CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE aiquery (id SERIAL NOT NULL, user_id INT NOT NULL, query TEXT NOT NULL, response TEXT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, metadata JSON DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_7DC9844BA76ED395 ON aiquery (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE aiquery_condition (aiquery_id INT NOT NULL, condition_id INT NOT NULL, PRIMARY KEY(aiquery_id, condition_id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_45FF69BDA7D98037 ON aiquery_condition (aiquery_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_45FF69BD887793B6 ON aiquery_condition (condition_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE content (id SERIAL NOT NULL, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, content TEXT NOT NULL, type VARCHAR(255) NOT NULL, target_phase VARCHAR(255) DEFAULT NULL, tags JSON DEFAULT NULL, image_url VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE content_condition (content_id INT NOT NULL, condition_id INT NOT NULL, PRIMARY KEY(content_id, condition_id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_8D31C04084A0A3ED ON content_condition (content_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_8D31C040887793B6 ON content_condition (condition_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE cycle_day (id SERIAL NOT NULL, cycle_id INT NOT NULL, date DATE NOT NULL, day_number SMALLINT NOT NULL, phase VARCHAR(255) NOT NULL, symptoms JSON DEFAULT NULL, notes JSON DEFAULT NULL, mood JSON DEFAULT NULL, flow_intensity SMALLINT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_2DCDAD665EC1162 ON cycle_day (cycle_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE notification (id SERIAL NOT NULL, user_id INT NOT NULL, related_condition_id INT DEFAULT NULL, title VARCHAR(255) NOT NULL, message TEXT NOT NULL, type VARCHAR(50) NOT NULL, priority VARCHAR(20) NOT NULL, context VARCHAR(50) DEFAULT NULL, read BOOLEAN NOT NULL, read_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, scheduled_for TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, target_user_type VARCHAR(30) DEFAULT NULL, related_entity_type VARCHAR(100) DEFAULT NULL, related_entity_id INT DEFAULT NULL, action_url VARCHAR(255) DEFAULT NULL, action_text VARCHAR(50) DEFAULT NULL, metadata JSON DEFAULT NULL, dismissed BOOLEAN NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_BF5476CAA76ED395 ON notification (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_BF5476CA62693FF1 ON notification (related_condition_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE refresh_token (id SERIAL NOT NULL, user_id INT NOT NULL, token VARCHAR(255) NOT NULL, expires_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, ip_address VARCHAR(45) DEFAULT NULL, user_agent VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_C74F21955F37A13B ON refresh_token (token)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_C74F2195A76ED395 ON refresh_token (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE aiquery ADD CONSTRAINT FK_7DC9844BA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE aiquery_condition ADD CONSTRAINT FK_45FF69BDA7D98037 FOREIGN KEY (aiquery_id) REFERENCES aiquery (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE aiquery_condition ADD CONSTRAINT FK_45FF69BD887793B6 FOREIGN KEY (condition_id) REFERENCES condition (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE content_condition ADD CONSTRAINT FK_8D31C04084A0A3ED FOREIGN KEY (content_id) REFERENCES content (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE content_condition ADD CONSTRAINT FK_8D31C040887793B6 FOREIGN KEY (condition_id) REFERENCES condition (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE cycle_day ADD CONSTRAINT FK_2DCDAD665EC1162 FOREIGN KEY (cycle_id) REFERENCES menstrual_cycle (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notification ADD CONSTRAINT FK_BF5476CAA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notification ADD CONSTRAINT FK_BF5476CA62693FF1 FOREIGN KEY (related_condition_id) REFERENCES condition (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE refresh_token ADD CONSTRAINT FK_C74F2195A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE alert_user DROP CONSTRAINT fk_22304cd93035f72
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE alert_user DROP CONSTRAINT fk_22304cda76ed395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE alert DROP CONSTRAINT fk_17fd46c156a273cc
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE alert_user
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE alert
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE messenger_messages
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE hormone_level ADD cycle_day_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE hormone_level ADD hormone_type VARCHAR(255) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE hormone_level DROP phase_name
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE hormone_level DROP hormone_name
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE hormone_level ADD CONSTRAINT FK_BD30C6A8D4670E26 FOREIGN KEY (cycle_day_id) REFERENCES cycle_day (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_BD30C6A8D4670E26 ON hormone_level (cycle_day_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE SCHEMA public
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE hormone_level DROP CONSTRAINT FK_BD30C6A8D4670E26
        SQL);
        $this->addSql(<<<'SQL'
            CREATE SEQUENCE alert_id_seq INCREMENT BY 1 MINVALUE 1 START 1
        SQL);
        $this->addSql(<<<'SQL'
            CREATE SEQUENCE messenger_messages_id_seq INCREMENT BY 1 MINVALUE 1 START 1
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE alert_user (alert_id INT NOT NULL, user_id INT NOT NULL, PRIMARY KEY(alert_id, user_id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX idx_22304cda76ed395 ON alert_user (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX idx_22304cd93035f72 ON alert_user (alert_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE alert (id SERIAL NOT NULL, origin_id INT DEFAULT NULL, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, send_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, alert_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, is_read BOOLEAN NOT NULL, state BOOLEAN NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX idx_17fd46c156a273cc ON alert (origin_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE messenger_messages (id BIGSERIAL NOT NULL, body TEXT NOT NULL, headers TEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, available_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, delivered_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX idx_75ea56e016ba31db ON messenger_messages (delivered_at)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX idx_75ea56e0e3bd61ce ON messenger_messages (available_at)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX idx_75ea56e0fb7336f0 ON messenger_messages (queue_name)
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN messenger_messages.created_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN messenger_messages.available_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN messenger_messages.delivered_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE alert_user ADD CONSTRAINT fk_22304cd93035f72 FOREIGN KEY (alert_id) REFERENCES alert (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE alert_user ADD CONSTRAINT fk_22304cda76ed395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE alert ADD CONSTRAINT fk_17fd46c156a273cc FOREIGN KEY (origin_id) REFERENCES condition (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE aiquery DROP CONSTRAINT FK_7DC9844BA76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE aiquery_condition DROP CONSTRAINT FK_45FF69BDA7D98037
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE aiquery_condition DROP CONSTRAINT FK_45FF69BD887793B6
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE content_condition DROP CONSTRAINT FK_8D31C04084A0A3ED
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE content_condition DROP CONSTRAINT FK_8D31C040887793B6
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE cycle_day DROP CONSTRAINT FK_2DCDAD665EC1162
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notification DROP CONSTRAINT FK_BF5476CAA76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notification DROP CONSTRAINT FK_BF5476CA62693FF1
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE refresh_token DROP CONSTRAINT FK_C74F2195A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE aiquery
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE aiquery_condition
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE content
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE content_condition
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE cycle_day
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE notification
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE refresh_token
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_BD30C6A8D4670E26
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE hormone_level ADD hormone_name VARCHAR(255) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE hormone_level DROP cycle_day_id
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE hormone_level RENAME COLUMN hormone_type TO phase_name
        SQL);
    }
}
