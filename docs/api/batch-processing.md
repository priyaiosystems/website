---
sidebar_position: 3
title: Batch Processing
description: High-volume AL3 processing from S3, EFS, and other storage
---

# Batch Processing

Process thousands of AL3 files in parallel with the GOAL3 batch processing engine.

## Key Features

- **Storage Integration**: S3, EFS, NFS, and more
- **Parallel Processing**: Process 100s of files concurrently
- **Cost Efficient**: Spin up containers only when needed
- **Automatic Retries**: Built-in error handling

## Endpoint

```
POST /batch
```

## Request

```json
{
  "source": {
    "type": "s3",
    "bucket": "my-al3-files",
    "prefix": "incoming/",
    "pattern": "*.al3"
  },
  "destination": {
    "type": "s3",
    "bucket": "parsed-data",
    "prefix": "parquet/",
    "format": "parquet"
  },
  "options": {
    "parallelism": 10,
    "on_error": "continue"
  }
}
```

## Supported Storage Providers

### Amazon S3
```json
{
  "type": "s3",
  "bucket": "bucket-name",
  "prefix": "path/to/files/",
  "region": "us-east-1"
}
```

### Amazon EFS
```json
{
  "type": "efs",
  "file_system_id": "fs-12345678",
  "path": "/al3-files/"
}
```

### NFS/Shared Storage
```json
{
  "type": "nfs",
  "mount_point": "/mnt/share",
  "path": "/al3-files/"
}
```

## Response

### Async Job Created (202 Accepted)

```json
{
  "job_id": "batch-20260102-abc123",
  "status": "queued",
  "total_files": 1247,
  "created_at": "2026-01-02T19:20:00Z"
}
```

## Job Status

### Check Progress

```
GET /batch/{job_id}
```

### Response

```json
{
  "job_id": "batch-20260102-abc123",
  "status": "processing",
  "progress": {
    "total_files": 1247,
    "completed": 823,
    "failed": 2,
    "remaining": 422
  },
  "estimated_completion": "2026-01-02T19:35:00Z"
}
```

### Job Status Values

| Status | Description |
|--------|-------------|
| `queued` | Job accepted, not yet started |
| `processing` | Actively processing files |
| `completed` | All files processed successfully |
| `partial_success` | Some files failed, others succeeded |
| `failed` | Job failed to complete |

## Output Structure

### Parquet Output

```
s3://parsed-data/parquet/
├── _manifest.json
├── transactions/
│   ├── part-0001.parquet
│   └── part-0002.parquet
├── coverages/
│   ├── part-0001.parquet
│   └── part-0002.parquet
└── vehicles/
    └── part-0001.parquet
```

### CSV Output

```
s3://parsed-data/csv/batch-20260102-abc123.zip
└── Contains:
    ├── transactions.csv
    ├── coverages.csv
    ├── vehicles.csv
    └── ... (one CSV per AL3 group)
```

## Pricing & Performance

- **Cost**: Based on vCPU-hours consumed
- **Throughput**: ~100-200 files/minute with 10 parallel workers
- **Auto-scaling**: Adjust `parallelism` based on workload

### Example Costs

Processing 10,000 AL3 files (avg 500KB each):
- Time: ~60-90 minutes with parallelism=10
- vCPU-hours: ~15-20 hours
- Cost: Pay for actual vCPU consumed

## Best Practices

### ✅ DO

- Use S3 lifecycle policies to archive processed files
- Set `parallelism` based on available resources
- Monitor job progress via CloudWatch metrics
- Use `on_error: "continue"` for large batches

### ❌ DON'T

- Process the same files repeatedly (check `_manifest.json`)
- Set parallelism too high (can overwhelm resources)
- Mix unrelated files in the same batch

## Error Handling

```json
{
  "job_id": "batch-20260102-abc123",
  "status": "partial_success",
  "errors": [
    {
      "file": "s3://bucket/incoming/corrupted.al3",
      "error": "Invalid AL3 header",
      "line": 1
    }
  ]
}
```

## Next Steps

- [Output Formats](./output-formats) - Understand the schema
- [AWS Deployment](../deployment/aws-marketplace) - Setup guide
