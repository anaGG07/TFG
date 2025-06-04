# Entidad: User

## Descripción
Representa al usuario principal del sistema. Desde esta entidad se relacionan todos los datos personales, de salud y accesos.

## Campos clave

- `email`: identificador único
- `password`: contraseña en hash
- `profileType`: tipo de perfil (enum)
- `state`: si está activa o no
- `createdAt` / `updatedAt`: fechas automáticas

## Relaciones

- OneToMany → MenstrualCycle
- OneToOne → MenopauseLog
- ManyToMany ←→ Alert
- etc.

## Notas técnicas

- Usa Symfony Security
- Implementa `UserInterface` y `PasswordAuthenticatedUserInterface`
- Incluye eventos Doctrine: `PrePersist`, `PreUpdate`
