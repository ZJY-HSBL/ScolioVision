# Inference API Contract / 推理接口契约

The frontend is model-agnostic. Set `analysisMode` to `remote` and configure `apiEndpoint` in `Scoliosis/src/js/config.js` when a backend model service is available.

前端不绑定具体模型。当真实模型服务可用时，在 `config.js` 中切换为 `remote` 并设置后端地址。

## Request

```http
POST /inference
Content-Type: application/json
```

```json
{
  "image": "data:image/jpeg;base64,...",
  "fileName": "example.jpg"
}
```

## Minimal response

```json
{
  "type": "胸椎右侧弯",
  "cobbAngle": 22.6
}
```

## Recommended response

```json
{
  "type": "胸椎右侧弯",
  "cobbAngle": 22.6,
  "band": "model-defined band",
  "description": "Structured model interpretation.",
  "source": "vertebral-landmark-model-v1",
  "fingerprint": "optional-request-or-model-id"
}
```

## Security / 安全要求

- Never embed provider API keys in frontend JavaScript.
- Keep credentials, model paths, and protected healthcare-system access on the server.
- Apply HTTPS, authentication, rate limiting, payload limits, and logging controls.
- Do not log raw patient images unless the approved research protocol explicitly allows it.
- Validate request and response schemas.
- Configure CORS explicitly rather than allowing arbitrary origins in production.

## Suggested backend separation / 推荐后端分层

```text
HTTP API
  └── request validation
      └── image decoding / quality control
          └── model inference
              └── Cobb geometry
                  └── normalized response
```
