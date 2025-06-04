# Entidad: Alert

Alertas enviadas a la usuaria o a su entorno.

- title, message, type, sendAt, isSent
- ManyToMany ↔ User
- ManyToOne → Condition (opcional)
