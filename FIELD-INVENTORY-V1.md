# MAD3OOMA Field Inventory V1
Internal field inventory for scrapyard sourcing.

Routes require JWT + `isAdmin=true`.

- GET `/field-inventory/dashboard`
- GET/POST `/field-inventory/scrapyards`
- GET `/field-inventory/vehicles`
- POST `/field-inventory/vehicles/quick`
- POST `/field-inventory/vehicles`
- PATCH `/field-inventory/vehicles/:id`
- POST `/field-inventory/vehicles/:id/confirm`
- POST `/field-inventory/vehicles/:id/status`
- POST `/field-inventory/vehicles/:id/publish`

If the deployment uses a global `api` prefix, prepend `/api`.
Production PostgreSQL/Supabase schema: `database/20260911_field_inventory.sql`.
