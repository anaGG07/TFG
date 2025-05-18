PASOS PARA CREAR UN PROYECTO NUEVO SYMFONY
------------------------------------------

1º -> Crear carpeta de proyecto: 
	`--> symfony new companyContact --webapp
	`--> symfony new cardGame --webapp

2º -> Levantar el servidor: 
	`--> symfony serve -d (Dentro de la carpeta creada)
	`--> symfony server:start -d 

3º -> Crear la base de datos:
	`--> Configurar el archivo .env  --> DATABASE_URL="mysql://root:@127.0.0.1:3306/plantilla"
	`--> Iniciar Xampp
	`--> php bin/console doctrine:database:create

4º -> Crear primer controlador: 
	`--> php bin/console make:controller MainController (redireccionador)

5º -> Generar la entidad User:
	`--> php bin/console make:user

6º -> Generar el sistema de seguridad login/logout: 
	`--> php bin/console make:auth

7º -> Generar el sistema de registro:
    `--> php bin/console make:registration-form

8º -> Generar el archivo de migraciones:
    `--> php bin/console make:migration

9º -> Aplicar las migraciones:
    `--> php bin/console doctrine:migrations:migrate

10º -> Crear las entidades necesarias:
	`--> php bin/console make:entity NombreEntidad

11º -> Establecer relaciones entre entidades:
	`--> php bin/console make:entity NombreEntidad

12º -> Generar CRUD:
	`--> php bin/console make:crud


ANOTACIONES IMPORTANTES
-----------------------

"Invalid CSRF token"
	`--> composer require paragonie/sodium_compat
 	`--> php bin/console secrets:generate-keys
	`--> composer install
	`--> completar en `.env` la variable `APP_SECRET=`, con el valor generado en 
		 el archivo `plantillaB\config\secrets\dev\dev.decrypt.private.php` en la variable: `SYMFONY_DECRYPTION_SECRET`.
	`--> php bin/console cache:clear    


Parar el servidor:
	`--> symfony server:stop --all

Crear Relaciones:
	`--> php bin/console make:entity
	`--> nombre de la entidad a editar
	`--> nombre de la propiedad "relacion"
	`--> relation
	`--> nombre de la entidad con la que se relaciona
	`--> seguir instrucciones de la terminal


Crear un User Admin:
	`--> php bin/console doctrine:query:sql "INSERT INTO user (username, roles, password) VALUES ('admin', '["ROLE_ADMIN"]', 'admin')"

Forzar que la base de datos esté idéntico al código:
	`--> php bin/console doctrine:schema:update --force

    #[IsGranted("ROLE_USER")]
		`--> En el contrador para evitar que entren usuarios no logueados

		$this->isGranted("ROLE_ADMIN")