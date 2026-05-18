# API Documentation

All API routes are under `/api/`. Requests and responses use JSON.

## Authentication

Most endpoints are public. Protected endpoints require a Supabase session token
sent as `Authorization: Bearer <token>`.

---

## Endpoints

### `POST /api/generate`

Generate an AI-designed image from a text prompt.

**Body**

| Field    | Type   | Required | Description                    |
| -------- | ------ | -------- | ------------------------------ |
| `prompt` | string | yes      | Text prompt (1–1000 chars)     |

**Success Response** `200`

```json
{
  "design": {
    "id": "uuid",
    "prompt": "...",
    "enhanced_prompt": "...",
    "image_url": "data:image/png;base64,...",
    "status": "completed",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

**Error Responses**

| Status | Body                                   |
| ------ | -------------------------------------- |
| 400    | `{ "error": "Prompt is required" }`    |
| 500    | `{ "error": "Internal server error" }` |

---

### `POST /api/recommendations`

Get AI-powered product recommendations based on cart contents.

**Body**

| Field          | Type     | Required | Description                    |
| -------------- | -------- | -------- | ------------------------------ |
| `productNames` | string[] | yes      | Names of products in the cart  |

**Success Response** `200`

```json
{
  "recommendations": [
    { "id": "uuid", "name": "T-Shirt", "price": 29.99, "image_url": "..." }
  ]
}
```

Returns an empty array on failure instead of an error status.

---

### `GET /api/printful/products`

Fetch the Printful catalog. Proxies the Printful API.

**Success Response** `200`

Returns the raw Printful catalog response.

---

### `POST /api/printful/create-order`

Create a product on Printful and submit an order for fulfillment.

**Body**

| Field             | Type   | Required | Description                         |
| ----------------- | ------ | -------- | ----------------------------------- |
| `variantId`       | number | yes      | Printful variant ID                 |
| `designImageUrl`  | string | yes      | URL of the design image             |
| `title`           | string | yes      | Product title (max 200 chars)       |
| `price`           | number | yes      | Retail price                        |
| `shipping`        | object | yes      | Shipping address (see below)        |

**`shipping` object**

| Field          | Type   | Required | Description                |
| -------------- | ------ | -------- | -------------------------- |
| `name`         | string | yes      | Recipient full name        |
| `address1`     | string | yes      | Street address             |
| `city`         | string | yes      | City                       |
| `country_code` | string | yes      | ISO 3166-1 alpha-2 code    |
| `zip`          | string | yes      | Postal/ZIP code            |
| `email`        | string | yes      | Contact email              |

**Success Response** `200`

```json
{
  "order": { ... },
  "product": { ... }
}
```

**Error Responses**

| Status | Body                                            |
| ------ | ----------------------------------------------- |
| 400    | `{ "error": "<validation message>" }`           |
| 502    | `{ "error": "Failed to create product on Printful" }` |

---

### `GET /api/test-supabase`

Health check that verifies the Supabase connection.

**Success Response** `200`

```json
{
  "success": true,
  "message": "Supabase connection is working!",
  "time": "2025-01-01T00:00:00Z"
}
```

**Error Responses**

| Status | Body                                                        |
| ------ | ----------------------------------------------------------- |
| 500    | `{ "success": false, "error": "Missing env variables..." }` |
| 502    | `{ "success": false, "error": "Supabase query failed..." }`|

---

## Error Format

All API errors follow a consistent format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

Common error codes:

| Code               | HTTP Status | Description                  |
| ------------------ | ----------- | ---------------------------- |
| `VALIDATION_ERROR` | 400         | Input failed Zod validation  |
| `UNAUTHORIZED`     | 401         | No valid session token       |
| `FORBIDDEN`        | 403         | Insufficient role/permission |
| `NOT_FOUND`        | 404         | Resource does not exist      |
| `CONFLICT`         | 409         | Duplicate or stock conflict  |
| `INTERNAL_ERROR`   | 500         | Unexpected server error      |

---

## Security Headers

All responses include the following headers:

| Header                    | Value                              |
| ------------------------- | ---------------------------------- |
| `X-Frame-Options`         | `DENY`                             |
| `X-Content-Type-Options`  | `nosniff`                          |
| `Referrer-Policy`         | `strict-origin-when-cross-origin`  |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `Permissions-Policy`      | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | Strict CSP (see `next.config.ts`)  |
