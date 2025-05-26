<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250526185942 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
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
            CREATE TABLE condition (id SERIAL NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, is_chronic BOOLEAN NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, state BOOLEAN NOT NULL, PRIMARY KEY(id))
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
            CREATE TABLE cycle_day (id SERIAL NOT NULL, cycle_phase_id INT NOT NULL, cycle_id INT NOT NULL, phase VARCHAR(50) NOT NULL, date DATE NOT NULL, day_number SMALLINT NOT NULL, symptoms JSON DEFAULT NULL, notes JSON DEFAULT NULL, mood JSON DEFAULT NULL, flow_intensity SMALLINT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_2DCDAD667F6A902C ON cycle_day (cycle_phase_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE guest_access (id SERIAL NOT NULL, owner_id INT DEFAULT NULL, guest_id INT NOT NULL, guest_type VARCHAR(255) NOT NULL, access_to JSON NOT NULL, expires_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, state BOOLEAN NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_1CA601BE7E3C61F9 ON guest_access (owner_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_1CA601BE9A4AA658 ON guest_access (guest_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE hormone_level (id SERIAL NOT NULL, user_id INT NOT NULL, cycle_day_id INT DEFAULT NULL, hormone_type VARCHAR(255) NOT NULL, level DOUBLE PRECISION NOT NULL, state BOOLEAN NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_BD30C6A8A76ED395 ON hormone_level (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_BD30C6A8D4670E26 ON hormone_level (cycle_day_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE menopause_log (id SERIAL NOT NULL, user_id INT NOT NULL, hot_flashes BOOLEAN DEFAULT NULL, mood_swings BOOLEAN DEFAULT NULL, vaginal_dryness BOOLEAN DEFAULT NULL, insomnia BOOLEAN DEFAULT NULL, hormone_therapy BOOLEAN DEFAULT NULL, notes TEXT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_B9D2B074A76ED395 ON menopause_log (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE menstrual_cycle (id SERIAL NOT NULL, user_id INT NOT NULL, phase VARCHAR(255) DEFAULT NULL, cycle_id VARCHAR(36) DEFAULT NULL, start_date DATE NOT NULL, end_date DATE NOT NULL, estimated_next_start DATE NOT NULL, average_cycle_length INT NOT NULL, average_duration INT NOT NULL, flow_amount VARCHAR(50) DEFAULT NULL, flow_color VARCHAR(50) DEFAULT NULL, flow_odor VARCHAR(50) DEFAULT NULL, pain_level INT DEFAULT NULL, notes VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_1B04B8F0A76ED395 ON menstrual_cycle (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE notification (id SERIAL NOT NULL, user_id INT NOT NULL, related_condition_id INT DEFAULT NULL, guest_access_id INT DEFAULT NULL, title VARCHAR(255) NOT NULL, message TEXT NOT NULL, type VARCHAR(50) NOT NULL, priority VARCHAR(20) NOT NULL, context VARCHAR(50) DEFAULT NULL, read BOOLEAN NOT NULL, read_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, scheduled_for TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, target_user_type VARCHAR(30) DEFAULT NULL, related_entity_type VARCHAR(100) DEFAULT NULL, related_entity_id INT DEFAULT NULL, action_url VARCHAR(255) DEFAULT NULL, action_text VARCHAR(50) DEFAULT NULL, metadata JSON DEFAULT NULL, dismissed BOOLEAN NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_BF5476CAA76ED395 ON notification (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_BF5476CA62693FF1 ON notification (related_condition_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_BF5476CA8F2F21AA ON notification (guest_access_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE onboarding (id SERIAL NOT NULL, user_id INT NOT NULL, profile_type VARCHAR(255) NOT NULL, gender_identity VARCHAR(255) NOT NULL, pronouns VARCHAR(100) DEFAULT NULL, is_personal BOOLEAN NOT NULL, stage_of_life VARCHAR(50) NOT NULL, last_period_date DATE DEFAULT NULL, average_cycle_length INT DEFAULT NULL, average_period_length INT DEFAULT NULL, hormone_type VARCHAR(255) DEFAULT NULL, hormone_start_date DATE DEFAULT NULL, hormone_frequency_days INT DEFAULT NULL, receive_alerts BOOLEAN NOT NULL, receive_recommendations BOOLEAN NOT NULL, receive_cycle_phase_tips BOOLEAN NOT NULL, receive_workout_suggestions BOOLEAN NOT NULL, receive_nutrition_advice BOOLEAN NOT NULL, share_cycle_with_partner BOOLEAN NOT NULL, want_ai_companion BOOLEAN NOT NULL, health_concerns JSON NOT NULL, access_code VARCHAR(20) DEFAULT NULL, allow_parental_monitoring BOOLEAN NOT NULL, common_symptoms JSON NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, completed BOOLEAN NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_23A7BB0EA76ED395 ON onboarding (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE pregnancy_log (id SERIAL NOT NULL, user_id INT NOT NULL, start_date DATE NOT NULL, due_date DATE NOT NULL, week INT DEFAULT NULL, symptoms TEXT DEFAULT NULL, fetal_movements TEXT DEFAULT NULL, ultrasound_date DATE DEFAULT NULL, notes VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_A5929CDCA76ED395 ON pregnancy_log (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE symptom_log (id SERIAL NOT NULL, user_id INT NOT NULL, date DATE NOT NULL, symptom VARCHAR(255) NOT NULL, intensity INT NOT NULL, notes TEXT DEFAULT NULL, state BOOLEAN NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, entity VARCHAR(50) NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_64508847A76ED395 ON symptom_log (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE "user" (id SERIAL NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, profile_type VARCHAR(255) NOT NULL, birth_date DATE NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, state BOOLEAN NOT NULL, onboarding_completed BOOLEAN DEFAULT false NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL ON "user" (email)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user_condition (id SERIAL NOT NULL, user_id INT NOT NULL, condition_id INT NOT NULL, start_date DATE NOT NULL, end_date DATE DEFAULT NULL, notes VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, state BOOLEAN NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_BD3605A7A76ED395 ON user_condition (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_BD3605A7887793B6 ON user_condition (condition_id)
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
            ALTER TABLE cycle_day ADD CONSTRAINT FK_2DCDAD667F6A902C FOREIGN KEY (cycle_phase_id) REFERENCES menstrual_cycle (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE guest_access ADD CONSTRAINT FK_1CA601BE7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE guest_access ADD CONSTRAINT FK_1CA601BE9A4AA658 FOREIGN KEY (guest_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE hormone_level ADD CONSTRAINT FK_BD30C6A8A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE hormone_level ADD CONSTRAINT FK_BD30C6A8D4670E26 FOREIGN KEY (cycle_day_id) REFERENCES cycle_day (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE menopause_log ADD CONSTRAINT FK_B9D2B074A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE menstrual_cycle ADD CONSTRAINT FK_1B04B8F0A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notification ADD CONSTRAINT FK_BF5476CAA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notification ADD CONSTRAINT FK_BF5476CA62693FF1 FOREIGN KEY (related_condition_id) REFERENCES condition (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notification ADD CONSTRAINT FK_BF5476CA8F2F21AA FOREIGN KEY (guest_access_id) REFERENCES guest_access (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE onboarding ADD CONSTRAINT FK_23A7BB0EA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE pregnancy_log ADD CONSTRAINT FK_A5929CDCA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE symptom_log ADD CONSTRAINT FK_64508847A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_condition ADD CONSTRAINT FK_BD3605A7A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_condition ADD CONSTRAINT FK_BD3605A7887793B6 FOREIGN KEY (condition_id) REFERENCES condition (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE SCHEMA public
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
            ALTER TABLE cycle_day DROP CONSTRAINT FK_2DCDAD667F6A902C
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE guest_access DROP CONSTRAINT FK_1CA601BE7E3C61F9
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE guest_access DROP CONSTRAINT FK_1CA601BE9A4AA658
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE hormone_level DROP CONSTRAINT FK_BD30C6A8A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE hormone_level DROP CONSTRAINT FK_BD30C6A8D4670E26
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE menopause_log DROP CONSTRAINT FK_B9D2B074A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE menstrual_cycle DROP CONSTRAINT FK_1B04B8F0A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notification DROP CONSTRAINT FK_BF5476CAA76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notification DROP CONSTRAINT FK_BF5476CA62693FF1
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notification DROP CONSTRAINT FK_BF5476CA8F2F21AA
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE onboarding DROP CONSTRAINT FK_23A7BB0EA76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE pregnancy_log DROP CONSTRAINT FK_A5929CDCA76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE symptom_log DROP CONSTRAINT FK_64508847A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_condition DROP CONSTRAINT FK_BD3605A7A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_condition DROP CONSTRAINT FK_BD3605A7887793B6
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE aiquery
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE aiquery_condition
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE condition
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
            DROP TABLE guest_access
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE hormone_level
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE menopause_log
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE menstrual_cycle
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE notification
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE onboarding
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE pregnancy_log
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE symptom_log
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE "user"
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user_condition
        SQL);
    }
}
