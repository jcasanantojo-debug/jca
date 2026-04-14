# Plataforma SaaS Multi-Cliente para Hoteles

Este repositorio define una **arquitectura centralizada** donde:

- cada hotel tiene su propio bot;
- cada hotel tiene su propio dashboard;
- la operación y observabilidad se gestionan desde un núcleo SaaS común.

## Objetivo

Permitir que múltiples hoteles operen de forma aislada (multi-tenant) sobre una sola plataforma, compartiendo infraestructura central y manteniendo separación estricta de datos, configuración y experiencia por hotel.

## Componentes principales

1. **Control Plane (centralizado)**
   - Gestión de tenants (hoteles), planes, facturación, features, auditoría.
   - Provisionamiento de bots y dashboards por hotel.

2. **Data Plane (por tenant lógico)**
   - Chatbot hotelero con contexto propio (FAQ, políticas, upselling, integraciones PMS/CRM).
   - Dashboard dedicado por hotel (métricas, conversaciones, handoff, campañas).

3. **Shared Services**
   - IAM/SSO, API Gateway, cola de eventos, vector store, observabilidad y alertas.

## Decisiones de arquitectura

- Modelo de tenancy: **base compartida con aislamiento por `tenant_id` + RLS**.
- Configuración por hotel en tiempo de ejecución (branding, idioma, tono, reglas, catálogo).
- Bot por hotel como instancia lógica (no infraestructura separada por defecto).
- Escalado horizontal por servicios stateless.

## Estructura

- `docs/saas-arquitectura.md`: diseño detallado de la solución.
- `db/schema.sql`: esquema base multi-tenant (PostgreSQL + RLS).
- `infra/docker-compose.yml`: stack local de referencia.

## MVP sugerido

1. Alta de hotel desde Control Plane.
2. Provisionamiento automático del bot y dashboard.
3. Widget de chat embebible con `tenant_slug`.
4. Dashboard por hotel con analítica básica y gestión de conversaciones.

