# Arquitectura SaaS Multi-Cliente para Hoteles

## 1) Requisitos

- Cada hotel debe tener su bot (con personalidad, conocimiento e integraciones propias).
- Cada hotel debe tener su dashboard operativo y analítico.
- Todo debe centralizarse para operación, despliegue, seguridad y costos.

## 2) Enfoque de multi-tenancy

### Modelo recomendado

**Shared database + shared schema + tenant isolation por `tenant_id` + RLS**.

Ventajas:
- Menor costo operativo.
- Escalabilidad simple en etapas tempranas.
- Onboarding de nuevos hoteles en minutos.

Evolución:
- Hoteles enterprise pueden migrar a **database-per-tenant** sin cambiar APIs (patrón híbrido).

## 3) Componentes

### 3.1 Control Plane (central)

- `tenant-service`: altas/bajas de hoteles y settings globales.
- `billing-service`: suscripciones, límites por plan, facturación.
- `feature-flag-service`: habilitación de capacidades por plan/hotel.
- `admin-console`: vista operativa global (NOC/SRE/Soporte).

### 3.2 Data Plane (servicio al hotel)

- `chat-orchestrator`: enrutamiento del chat, policies, guardrails.
- `bot-config-service`: prompts, tono, idioma, horarios, reglas por hotel.
- `knowledge-service`: ingestión de contenido hotelero y embeddings por tenant.
- `dashboard-service`: métricas y operación para equipos del hotel.
- `handoff-service`: transferencia a agente humano (recepción/call center).

### 3.3 Shared Platform

- API Gateway + WAF.
- Identity (OIDC/SAML), RBAC y scopes por tenant.
- PostgreSQL (OLTP), Redis (cache), Kafka/NATS (eventos), S3 (objetos).
- OpenTelemetry + Prometheus + Grafana + Loki.

## 4) Aislamiento y seguridad

- Todas las entidades de negocio llevan `tenant_id`.
- Políticas RLS en PostgreSQL para impedir lectura/escritura cruzada.
- JWT con claims: `tenant_id`, `role`, `permissions`.
- Encriptación en tránsito (TLS) y en reposo (KMS-managed).
- Auditoría de acciones administrativas y trazabilidad por request.

## 5) Bot por hotel

Cada bot se compone de:

- Prompt base de plataforma.
- Prompt/branding por hotel.
- Conocimiento (documentos, FAQ, políticas, tarifas).
- Herramientas habilitadas por hotel (reservas, upgrades, room service, tickets).

Resolución en runtime:

1. El widget envía `tenant_slug`.
2. Gateway resuelve `tenant_id`.
3. Orchestrator carga configuración + knowledge index del hotel.
4. Se ejecuta flujo conversacional con guardrails y logging.

## 6) Dashboard por hotel

Módulos mínimos:

- Conversaciones en vivo + estados.
- KPIs: volumen, FRT, resolución, CSAT.
- Gestión de contenido (FAQ/documentos).
- Configuración de bot (tono, idioma, reglas de escalamiento).
- Usuarios/roles del hotel.

Acceso:

- Subdominios por hotel (`hotel-a.tuplataforma.com`) o ruta (`/t/hotel-a`).
- SSO opcional para cadenas hoteleras.

## 7) Centralización operativa

- Provisionamiento automático de tenant (idempotente).
- CI/CD único por entorno (dev/staging/prod).
- Observabilidad multi-tenant con filtros por `tenant_id`.
- Catálogo de planes y límites (mensajes, agentes, integraciones).
- Backups, retención y políticas de cumplimiento centralizadas.

## 8) Modelo de despliegue recomendado

- Servicios stateless en Kubernetes.
- Autoscaling por CPU/RPS/queue lag.
- Jobs async para ingestión y reindexación de conocimiento.
- CDN para widget JS y assets del dashboard.

## 9) Roadmap por fases

### Fase 1 (MVP)
- Onboarding de hotel.
- Bot web embebible.
- Dashboard básico por hotel.
- Aislamiento por `tenant_id` + RLS.

### Fase 2
- Integraciones PMS/CRM.
- Handoff omnicanal (WhatsApp, email).
- Métricas avanzadas + alertas.

### Fase 3
- Personalización enterprise.
- Modelo híbrido de tenancy.
- SLA/SLO avanzados y DR multi-región.

