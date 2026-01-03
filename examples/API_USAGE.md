# GOAL3 API Usage Guide

The GOAL3 API provides HTTP endpoints for parsing and validating ACORD AL3 Property & Casualty data.

## Quick Start

### Start the API Server

```bash
# Default (port 8080)
./goal3-api

# Custom port
export PORT=3000
./goal3-api
```

### Basic Parse Request

```bash
curl -X POST http://localhost:8080/v1/parse \
  -H "Content-Type: application/octet-stream" \
  --data-binary "@path/to/file.AL3"
```

## API Endpoints

### `POST /v1/parse`

Parse an AL3 file and return structured JSON.

**Request**:
- Content-Type: `application/octet-stream`
- Body: Raw AL3 binary data

**Response** (200 OK):
```json
{
  "groups": [
    {
      "group_name": "2TRG",
      "group_version": "1",
      "data": {
        "transaction_code": "02",
        "transaction_code_fmtd": "Policy Change",
        "effective_date": "2024-01-15",
        ...
      }
    }
  ],
  "validation_summary": {
    "error_count": 0,
    "warning_count": 0,
    "errors": [],
    "warnings": []
  }
}
```

**Error Response** (400/500):
```json
{
  "error": "parse error: invalid header format"
}
```

### `POST /v1/validate`

Validate an AL3 file without parsing all data.

**Request**: Same as `/v1/parse`

**Response** (200 OK):
```json
{
  "valid": true,
  "validation_summary": {
    "error_count": 0,
    "warning_count": 0,
    "errors": [],
    "warnings": []
  }
}
```

### `GET /schema`

Get the JSON Schema for AL3 P&C data.

**Response** (200 OK):
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ACORD AL3 Property & Casualty Schema",
  "version": "1.0.0",
  ...
}
```

### `GET /health`

Health check endpoint.

**Response** (200 OK):
```json
{
  "status": "healthy"
}
```

### `GET /ready`

Readiness check for Kubernetes.

**Response** (200 OK):
```json
{
  "ready": true
}
```

### `GET /metrics`

Prometheus metrics endpoint.

**Response** (200 OK):
```
# HELP goal3_requests_total Total number of API requests
# TYPE goal3_requests_total counter
goal3_requests_total{endpoint="/v1/parse",status="200"} 1234
...
```

### `GET /swagger`

Interactive API documentation (Swagger UI).

## Examples

### Parse Single File

```bash
curl -X POST http://localhost:8080/v1/parse \
  -H "Content-Type: application/octet-stream" \
  --data-binary "@AUTOP_20241225.AL3" \
  -o output.json
```

### Validate File

```bash
curl -X POST http://localhost:8080/v1/validate \
  -H "Content-Type: application/octet-stream" \
  --data-binary "@file.AL3"
```

### Process Multiple Files

```bash
#!/bin/bash
for file in *.AL3; do
  echo "Processing $file..."
  curl -X POST http://localhost:8080/v1/parse \
    -H "Content-Type: application/octet-stream" \
    --data-binary "@$file" \
    -o "${file%.AL3}.json"
done
```

### Python Client Example

```python
import requests

def parse_al3_file(filepath, api_url="http://localhost:8080"):
    with open(filepath, 'rb') as f:
        response = requests.post(
            f"{api_url}/v1/parse",
            headers={'Content-Type': 'application/octet-stream'},
            data=f
        )
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Parse failed: {response.text}")

# Usage
result = parse_al3_file("AUTOP_20241225.AL3")
print(f"Parsed {len(result['groups'])} groups")
```

### Node.js Client Example

```javascript
const fs = require('fs');
const fetch = require('node-fetch');

async function parseAL3File(filepath, apiUrl = 'http://localhost:8080') {
  const data = fs.readFileSync(filepath);
  
  const response = await fetch(`${apiUrl}/v1/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: data
  });
  
  if (response.ok) {
    return await response.json();
  } else {
    const error = await response.text();
    throw new Error(`Parse failed: ${error}`);
  }
}

// Usage
parseAL3File('AUTOP_20241225.AL3')
  .then(result => console.log(`Parsed ${result.groups.length} groups`))
  .catch(console.error);
```

## Deployment

### Docker

```dockerfile
FROM goal3-api:latest
EXPOSE 8080
CMD ["./goal3-api"]
```

```bash
docker run -p 8080:8080 goal3-api:latest
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: goal3-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: goal3-api
  template:
    metadata:
      labels:
        app: goal3-api
    spec:
      containers:
      - name: api
        image: goal3-api:latest
        ports:
        - containerPort: 8080
        env:
        - name: PORT
          value: "8080"
        resources:
          requests:
            cpu: "500m"
            memory: "512Mi"
          limits:
            cpu: "2000m"
            memory: "2Gi"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Kubernetes Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: goal3-api
spec:
  selector:
    app: goal3-api
  ports:
  - port: 80
    targetPort: 8080
  type: LoadBalancer
```

### Kubernetes Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: goal3-api
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - api.example.com
    secretName: goal3-tls
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: goal3-api
            port:
              number: 80
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | HTTP port | `8080` |
| `HOST` | Bind address | `0.0.0.0` |
| `ENABLE_METERING` | Enable AWS Marketplace metering | `false` |
| `AWS_PRODUCT_CODE` | AWS Marketplace product code | - |
| `AWS_REGION` | AWS region for metering | `us-east-1` |
| `CUSTOMER_ID` | Customer identifier for metering | `default-customer` |
| `TLS_ENABLED` | Enable TLS | `false` |
| `TLS_CERT` | Path to TLS certificate | - |
| `TLS_KEY` | Path to TLS private key | - |

### TLS Configuration

```bash
# Generate self-signed certificate (development only)
openssl req -x509 -newkey rsa:4096 \
  -keyout key.pem -out cert.pem \
  -days 365 -nodes

# Start with TLS
export TLS_ENABLED=true
export TLS_CERT=cert.pem
export TLS_KEY=key.pem
./goal3-api
```

### Schema Overrides

Customize AL3 group definitions and field types using `config/overrides.yaml`.

**Create Override File**:

```yaml
# config/overrides.yaml
schema:
  groups:
    # Override group 6TTI - Trailer Value to Signed Numeric
    - code: "6TTI"
      elements:
        - seq_num: "6"
          data_type: "SN"  # Change to Signed Numeric
          length: 8
        - seq_num: "10"
          data_type: "DC"  # Change to Dollars and Cents
          length: 11

  field_overrides:
    # Custom formatting for specific fields
    "6TTI.TrailerValue":
      custom_format: "currency"
    "5BIS.CustomField":
      data_type: "N"
      length: 10
```

**Apply Overrides**:

```bash
# Rebuild with overrides
make generate-overrides
make build

# Restart API
./goal3-api
```

**Common Override Use Cases**:

1. **Fix incorrect field types**:
   ```yaml
   - code: "5ABC"
     elements:
       - seq_num: "3"
         data_type: "SN"  # Was "N", should be signed
   ```

2. **Adjust field lengths**:
   ```yaml
   - code: "6XYZ"
     elements:
       - seq_num: "5"
         length: 12  # Extend from 10 to 12
   ```

3. **Custom formatting**:
   ```yaml
   field_overrides:
     "GroupCode.FieldName":
       custom_format: "currency"  # or "percentage", "date"
   ```

**Validation**:

```bash
# Test override applied
curl http://localhost:8080/schema | jq '.definitions."6TTI"'
```

## Monitoring

### Prometheus Integration

Add to `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'goal3-api'
    static_configs:
      - targets: ['goal3-api:8080']
    metrics_path: '/metrics'
```

### Key Metrics

- `goal3_requests_total` - Total API requests
- `goal3_request_duration_seconds` - Request latency
- `goal3_parse_errors_total` - Parse failures
- `goal3_active_requests` - In-flight requests

### Health Monitoring

```bash
# Simple health check
curl http://localhost:8080/health

# Kubernetes-style readiness
curl http://localhost:8080/ready

# Monitor continuously
watch -n 5 'curl -s http://localhost:8080/health | jq'
```

## Performance

### Recommended Resources

- **CPU**: 1-2 vCPU per instance
- **Memory**: 512MB-2GB per instance
- **Concurrency**: 100-500 requests/sec per instance

### Load Testing

```bash
# Install hey (HTTP load generator)
go install github.com/rakyll/hey@latest

# Test parse endpoint
hey -n 1000 -c 10 -m POST \
  -H "Content-Type: application/octet-stream" \
  -D test.AL3 \
  http://localhost:8080/v1/parse
```

### Scaling Guidelines

| File Size | Requests/sec | Instances | vCPU/Instance |
|-----------|--------------|-----------|---------------|
| < 100KB | 100 | 2 | 1 |
| 100KB-1MB | 50 | 3 | 1-2 |
| > 1MB | 20 | 5 | 2 |

## Error Handling

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid AL3 data)
- `413` - Payload Too Large (file > MaxSize)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error
- `503` - Service Unavailable

### Common Errors

**Invalid Header**:
```json
{
  "error": "parse error: invalid segment header at offset 0"
}
```

**Validation Errors**:
```json
{
  "groups": [...],
  "validation_summary": {
    "error_count": 2,
    "errors": [
      {
        "name": "Invalid Date",
        "message": "Date field contains non-numeric value"
      }
    ]
  }
}
```

## Security

### Best Practices

1. **Use HTTPS** in production (enable TLS or use load balancer)
2. **Rate limiting** via API Gateway/Ingress
3. **Authentication** via API Gateway/OAuth
4. **Network policies** to restrict pod-to-pod traffic
5. **Resource limits** to prevent DoS

### AWS Marketplace Deployment

For AWS Marketplace deployments with metering:

```yaml
env:
- name: ENABLE_METERING
  value: "true"
- name: AWS_PRODUCT_CODE
  value: "your-product-code"
- name: CUSTOMER_ID
  valueFrom:
    fieldRef:
      fieldPath: metadata.namespace
```

## Troubleshooting

### Server Won't Start

```bash
# Check if port is in use
lsof -i :8080

# Check logs
./goal3-api 2>&1 | tee api.log
```

###Parse Errors

```bash
# Validate file structure first
curl -X POST http://localhost:8080/v1/validate \
  -H "Content-Type: application/octet-stream" \
  --data-binary "@problem.AL3"
```

### High Memory Usage

- Increase memory limits
- Reduce concurrent connections
- Check for large file sizes

## Support

For issues, feature requests, or questions:
- Check `/swagger` endpoint for interactive API docs
- Review Prometheus `/metrics` for performance insights
- Enable debug logging in development
