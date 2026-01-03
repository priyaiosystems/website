---
sidebar_position: 2
title: Realtime HTTP API
description: Synchronous AL3 parsing via RESTful HTTP API
---

# Realtime HTTP API

Parse ACORD AL3 files on-demand via a simple HTTP POST request.

## Endpoint

```
POST /parse
```

## Request

### Headers

```http
Content-Type: multipart/form-data
```

### Form Data

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | file | Yes | AL3 file to parse |
| `format` | string | No | Output format: `json` (default), `csv`, or `parquet` |

### Example Request

```bash
curl -X POST https://your-goal3-endpoint/parse \
  -F "file=@policy_12345.al3" \
  -F "format=json"
```

## Response

### Success (200 OK)

**JSON format:**
```json
{
  "status": "success",
  "data": { /* hierarchical AL3 structure */ },
  "metadata": {
    "filename": "policy_12345.al3",
    "parsed_at": "2026-01-02T19:15:00Z",
    "parser_version": "1.0.0"
  },
  "validation_summary": {
    "warnings": [],
    "errors": []
  }
}
```

**CSV format:**
Returns `application/zip` with multiple normalized CSV files.

**Parquet format:**
Returns `application/x-parquet` binary file.

### Partial Success (200 OK)

Even if some AL3 groups fail to parse, you'll receive structured output:

```json
{
  "status": "partial_success",
  "data": { /* successfully parsed groups */ },
  "validation_summary": {
    "warnings": [
      {
        "line": 245,
        "group": "ZZUNK",
        "message": "Unknown group code - included as raw data"
      }
    ]
  }
}
```

### Errors (4xx, 5xx)

```json
{
  "error": "Invalid AL3 header",
  "details": "Expected 'AL3' magic bytes at offset 0"
}
```

## Output Format Details

### JSON
- Full hierarchy preserved
- Ideal for APIs and modern apps
- Average size: 2-3x original AL3

### CSV
- Normalized tables (one per AL3 group type)
- Packaged as `.zip`
- Ideal for data warehouses and Excel

### Parquet
- Columnar, compressed format
- Smaller than JSON (often 50% of AL3 size)
- Ideal for Snowflake, BigQuery, Athena

## Performance

| File Size | Typical Response Time |
|-----------|----------------------|
| < 100 KB | < 200 ms |
| 100 KB - 1 MB | 200-500 ms |
| 1-5 MB | 500 ms - 2s |

## Rate Limits

No hard rate limits - pay only for vCPU consumed. Scale horizontally as needed.

## Best Practices

✅ **DO:**
- Use for real-time user-facing applications
- Set appropriate timeouts (recommend 30s)
- Handle partial_success responses gracefully

❌ **DON'T:**
- Use for batch processing (use [Batch API](./batch-processing) instead)
- Upload files > 10MB (use Batch for large files)

## Next Steps

- [Batch Processing](./batch-processing) - For high-volume workloads
- [Output Formats](./output-formats) - Deep dive into schema
