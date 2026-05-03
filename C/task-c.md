# Task C — Xero Accounting API (Written answers)

**Reference:** [Xero Accounting API overview](https://developer.xero.com/documentation/api/accounting/overview)

---

## C1. How would you prove that our Xero API connection is working *before* checking invoices?

### 1. Complete OAuth 2.0 authentication and retrieve a valid access token

Prove basic auth works before calling any accounting endpoints.  
Official link: https://developer.xero.com/documentation/guides/oauth2/auth-flow

---

### 2. Call the lightweight /Organisation endpoint as a health check

It’s the standard Xero recommended test — no invoice data required, confirms token, headers and tenant ID are correct.  
Official link: https://developer.xero.com/documentation/api/accounting/organisation

---

### 3. Validate required request headers and tenant ID configuration

Confirm `Authorization Bearer` and `Xero-tenant-id` headers are correctly implemented.  
Official link: https://developer.xero.com/documentation/best-practices/managing-connections/connections

---

### 4. Validate connectivity with simple master data endpoints (Contacts / Accounts)

If Organisation passes, test low-risk master data endpoints to fully confirm API access.

- Contacts: https://developer.xero.com/documentation/api/accounting/contacts
- Accounts: https://developer.xero.com/documentation/api/accounting/accounts

---

### 5. Check HTTP response codes for connection validation or failure diagnosis

Confirm 200 OK for success; interpret 401/403/429 etc if any error occurs.  
Official link: https://developer.xero.com/documentation/api/xero-hq/response-codes

---

## C2. If `/connections` works but `GET /Invoices` fails, what would you check?

### 1. Check your OAuth 2.0 API Scopes

`/connections` needs minimal scope; `Invoices` requires **accounting.full / accounting.transactions**

- Missing `accounting` related scope = connections works, invoices 403/401 blank error

Official link: https://developer.xero.com/documentation/guides/oauth2/scopes

---

### 2. Verify the `Xero-tenant-id` Header

`/connections` returns your tenant IDs, but if you use the **wrong Tenant ID** in invoice requests → fails immediately.

Official link: https://developer.xero.com/documentation/best-practices/managing-connections/connections

---

### 3. Check User / App Permission Level in Xero Organisation

Even with valid token:

- Xero user may have **no view permission for Invoices**
- App may be restricted in Xero organisation settings

Official link: https://developer.xero.com/documentation/guides/oauth2/access-permissions

## C3. What endpoint would you call to check invoices?

The official Xero Accounting API endpoint to **retrieve/check invoices** is:

**GET /api.xro/2.0/Invoices** `https://api.xero.com/api.xro/2.0/Invoices`**

## Official Documentation Link

[https://developer.xero.com/documentation/api/accounting/invoices](https://developer.xero.com/documentation/api/accounting/invoices)

---

## C4. How would you check one specific invoice?

Use the same **Invoices** resource with an **identifier** in the path. Xero supports fetching a single invoice by **GUID** or by **invoice number**, for example:

- `**GET https://api.xero.com/api.xro/2.0/Invoices/{InvoiceID}`**  
where `{InvoiceID}` is the Xero **InvoiceID** (UUID), **or**
- `**GET https://api.xero.com/api.xro/2.0/Invoices/{InvoiceNumber}`**  
e.g. a value like `INV-01514`, as documented for the record filter.

## Official Xero Documentation Link

[https://developer.xero.com/documentation/api/accounting/invoices](https://developer.xero.com/documentation/api/accounting/invoices)

---

## C5. If the invoice API returns **429**, how should the backend handle it?

A **429 Too Many Requests** error means the backend has exceeded Xero’s API rate limits.The backend must implement **exponential backoff with retry logic** (the standard, Xero-recommended solution).

Steps the backend should follow:

1. **Catch the 429 HTTP status code**
2. **Read the** `Retry-After` **header** from the API response (tells you how many seconds to wait)
3. **Wait/pause** for the specified time before retrying
4. **Retry the request** automatically
5. **Implement exponential backoff** for repeated 429s (wait longer after each failed retry)
6. **Add circuit breaker** after max retries to avoid flooding the API

### Official Xero Documentation Links

- Xero API Rate Limits & 429 Handling: [https://developer.xero.com/documentation/auth-and-limits/xero-api-limits](https://developer.xero.com/documentation/auth-and-limits/xero-api-limits)
- Official Retry Best Practices: [https://developer.xero.com/documentation/api/http-headers](https://developer.xero.com/documentation/api/http-headers)

