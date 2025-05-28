<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migración para añadir el campo avatar a la tabla user.
 * 
 * El campo avatar es de tipo JSONB y contiene la personalización del avatar del usuario.
 */
final class Version20250528000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Añade campo avatar (JSONB) a la tabla user para personalización del avatar';
    }

    public function up(Schema $schema): void
    {
        // ! 28/05/2025 - Añadido campo avatar como JSONB
        $this->addSql('ALTER TABLE "user" ADD avatar JSONB DEFAULT NULL');

        // Establece un valor predeterminado para todos los usuarios existentes
        $defaultAvatar = json_encode([
            "skinColor" => "",
            "eyes" => "",
            "eyebrows" => "",
            "mouth" => "",
            "hairStyle" => "",
            "hairColor" => "",
            "facialHair" => "",
            "clothes" => "",
            "fabricColor" => "",
            "glasses" => "",
            "glassOpacity" => "",
            "accessories" => "",
            "tattoos" => "",
            "backgroundColor" => ""
        ]);

        $this->addSql('UPDATE "user" SET avatar = \'' . $defaultAvatar . '\'::jsonb');

        // Una forma más simple de verificar la estructura JSON
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT check_avatar_structure CHECK (
            avatar IS NULL OR (
                avatar::text LIKE \'%"skinColor"%\' AND
                avatar::text LIKE \'%"eyes"%\' AND
                avatar::text LIKE \'%"eyebrows"%\' AND
                avatar::text LIKE \'%"mouth"%\' AND
                avatar::text LIKE \'%"hairStyle"%\' AND
                avatar::text LIKE \'%"hairColor"%\' AND
                avatar::text LIKE \'%"facialHair"%\' AND
                avatar::text LIKE \'%"clothes"%\' AND
                avatar::text LIKE \'%"fabricColor"%\' AND
                avatar::text LIKE \'%"glasses"%\' AND
                avatar::text LIKE \'%"glassOpacity"%\' AND
                avatar::text LIKE \'%"accessories"%\' AND
                avatar::text LIKE \'%"tattoos"%\' AND
                avatar::text LIKE \'%"backgroundColor"%\'
            )
        )');
    }

    public function down(Schema $schema): void
    {
        // ! 28/05/2025 - Eliminada restricción y campo avatar
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT IF EXISTS check_avatar_structure');
        $this->addSql('ALTER TABLE "user" DROP avatar');
    }
}
