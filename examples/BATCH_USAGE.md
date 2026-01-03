# GOAL3 Batch Processor Usage Guide

The GOAL3 batch processor enables high-throughput AL3 file processing with support for S3, EFS, and local storage.

## Quick Start

### Basic Command

```bash
goal3-batch \
  --source "s3://my-bucket/input/" \
  --output "s3://my-bucket/output/" \
  --format parquet
```

### Using Configuration File

```yaml
# batch-config.yaml
source: s3://my-bucket/input/
output: s3://my-bucket/output/
format: parquet
concurrency: 8
resume: true
```

```bash
goal3-batch --config batch-config.yaml
```

## Command-Line Options

| Flag | Description | Default |
|------|-------------|---------|
| `--source` | Source URI (s3://, /path) | Required |
| `--output` | Output URI | Required |
| `--format` | Output format (json\|csv\|parquet) | `json` |
| `--concurrency` | Parallel workers (0=auto) | `0` |
| `--resume` | Skip already processed files | `true` |
| `--dry-run` | List files without processing | `false` |
| `--log-level` | Log level (debug\|info\|warn\|error) | `info` |
| `--metrics-addr` | Metrics server address | `:9090` |
| `--config` | YAML config file path | - |
| `--version` | Show version | - |

## Storage Options

### Amazon S3

```bash
goal3-batch \
  --source "s3://input-bucket/al3-files/" \
  --output "s3://output-bucket/parsed/"
```

**Requirements**:
- AWS credentials configured (IAM role, env vars, or `~/.aws/credentials`)
- Read access to source bucket
- Write access to output bucket

### Amazon EFS

```bash
goal3-batch \
  --source "/mnt/efs/al3-files/" \
  --output "/mnt/efs/parsed/"
```

**Requirements**:
- EFS mounted to `/mnt/efs`
- Read/write permissions

### Local Filesystem

```bash
goal3-batch \
 --source "./input/" \
  --output "./output/"
```

## Output Formats

### JSON (Default)

```bash
goal3-batch --format json \
  --source "s3://bucket/input/" \
  --output "s3://bucket/output/"
```

**Output**: One JSON file per input file
- `input/file.AL3` → `output/file.json`

**Example Output**:
```json
{
  "groups": [
    {
      "group_name": "2TRG",
      "data": {...}
    }
  ]
}
```

### CSV (Normalized)

```bash
goal3-batch --format csv \
  --source "s3://bucket/input/" \
  --output "s3://bucket/output/"
```

**Output**: Multi-file normalized CSV in tar.gz archive
- `input/file.AL3` → `output/file.tar.gz`

**Archive Contents**:
```
file.tar.gz
├── transaction.csv
├── coverage.csv
├── insured.csv
└── _manifest.json
```

### Parquet (Optimized)

```bash
goal3-batch --format parquet \
  --source "s3://bucket/input/" \
  --output "s3://bucket/output/"
```

**Output**: Nested Parquet file
- `input/file.AL3` → `output/file.parquet`

**Benefits**:
- 60-80% smaller than JSON
- Columnar format for analytics
- Schema embedded

## Configuration File

### Complete Example

```yaml
# Production batch configuration
source: s3://production-data/al3-files/
output: s3://data-lake/parsed/
format: parquet
concurrency: 16
resume: true

# AWS Marketplace metering (optional)
metering_enabled: true
metering_product_code: your-product-code
metering_region: us-east-1
customer_id: customer-123
```

### Override with Flags

```bash
# Use config but override format
goal3-batch --config prod.yaml --format csv

# Use config but disable resume
goal3-batch --config prod.yaml --resume=false
```

### Schema Overrides

The batch processor respects schema overrides in `config/overrides.yaml`.

**Override Example**:

```yaml
# config/overrides.yaml
schema:
  groups:
    - code: "6TTI"
      elements:
        - seq_num: "6"
          data_type: "SN"  # Override data type
          length: 8
```

**Apply**:

```bash
# Rebuild with overrides
make generate-overrides
make build

# Overrides automatically applied
./goal3-batch --source s3://bucket/input/ --output s3://bucket/output/
```

**Benefits**: Fix incorrect field types, adjust lengths, consistent parsing across all files.

## Performance Tuning

### Concurrency Settings

**Auto-detect** (recommended):
```bash
goal3-batch --concurrency 0  # Uses CPU count
```

**Small files** (< 1MB):
```bash
goal3-batch --concurrency 16
```

**Large files** (> 10MB):
```bash
goal3-batch --concurrency 4
```

**Mixed workload**:
```bash
goal3-batch --concurrency 8
```

### Resource Guidelines

| File Size | Concurrency | Memory/Worker | Total Memory |
|-----------|-------------|---------------|--------------|
| < 100KB | 16 | 50MB | 800MB |
| 100KB-1MB | 8 | 100MB | 800MB |
| 1-10MB | 4 | 200MB | 800MB |
| > 10MB | 2 | 500MB | 1GB |

## Monitoring

### Structured Logging

All output is structured JSON logs:

```json
{"level":"INFO","msg":"starting batch processor","source":"s3://bucket/input/","concurrency":8}
{"level":"INFO","msg":"found files","count":1000}
{"level":"INFO","msg":"processed file","file":"file001.AL3","groups":125,"duration":"1.2s"}
{"level":"INFO","msg":"batch processing complete","files_processed":1000,"files_succeeded":998}
```

### Metrics Endpoint

```bash
# Start batch with metrics server
goal3-batch \
  --source "s3://bucket/input/" \
  --output "s3://bucket/output/" \
  --metrics-addr ":9090" &

# Query metrics
curl http://localhost:9090/metrics
```

**Available Metrics**:
```
goal3_batch_files_total{status="success"}
goal3_batch_files_total{status="failed"}
goal3_batch_processing_duration_seconds
goal3_batch_active_workers
```

### Prometheus Integration

```yaml
scrape_configs:
  - job_name: 'goal3-batch'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names: ['default']
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        regex: goal3-batch
        action: keep
```

## Deployment Patterns

### Kubernetes Job

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: goal3-batch-migration
spec:
  template:
    spec:
      containers:
      - name: batch
        image: goal3-batch:latest
        args:
          - --source
          - s3://archive/al3-files/
          - --output
          - s3://data-lake/parsed/
          - --format
          - parquet
          - --concurrency
          - "8"
        resources:
          requests:
            cpu: "4"
            memory: "4Gi"
          limits:
            cpu: "8"
            memory: "8Gi"
        env:
          - name: AWS_REGION
            value: us-east-1
      restartPolicy: Never
  backoffLimit: 3
```

### Kubernetes CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: goal3-batch-daily
spec:
  schedule: "0 2 * * *"  # 2 AM UTC daily
  concurrencyPolicy: Forbid  # Don't overlap runs
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 3
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: batch
            image: goal3-batch:latest
            volumeMounts:
              - name: config
                mountPath: /config
            args:
              - --config
              - /config/batch-config.yaml
          volumes:
            - name: config
              configMap:
                name: batch-config
          restartPolicy: OnFailure
```

### AWS ECS Task

```json
{
  "family": "goal3-batch",
  "taskRoleArn": "arn:aws:iam::123456789:role/goal3-batch-task-role",
  "executionRoleArn": "arn:aws:iam::123456789:role/ecsTaskExecutionRole",
  "networkMode": "awsvpc",
  "cpu": "4096",
  "memory": "8192",
  "containerDefinitions": [
    {
      "name": "batch",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/goal3-batch:latest",
      "command": [
        "--source", "s3://input-bucket/al3/",
        "--output", "s3://output-bucket/parsed/",
        "--format", "parquet",
        "--concurrency", "8"
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/goal3-batch",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "batch"
        }
      }
    }
  ]
}
```

## Advanced Usage

### Dry-Run Mode

List files without processing:

```bash
goal3-batch \
  --source "s3://bucket/input/" \
  --dry-run
```

**Output**:
```
level=INFO msg="found files" count=1000
level=INFO msg="would process" file=file001.AL3 size=45678
level=INFO msg="dry-run summary" total_files=1000 total_bytes=45678900
```

### Resume from Failure

```bash
# First run processes 500/1000 files then fails
goal3-batch --source s3://bucket/input/ --output s3://bucket/output/

# Resume processes remaining 500 files (skips completed)
goal3-batch --source s3://bucket/input/ --output s3://bucket/output/
```

**How it works**:
- Checks if output file exists
- Skips if exists and `--resume=true` (default)
- Reprocesses if `--resume=false`

### Disable Resume

```bash
# Reprocess all files (overwrites existing)
goal3-batch \
  --source "s3://bucket/input/" \
  --output "s3://bucket/output/" \
  --resume=false
```

### Debug Logging

```bash
goal3-batch \
  --source "./testdata/" \
  --output "./output/" \
  --log-level debug
```

### Custom Metrics Port

```bash
goal3-batch \
  --source "s3://bucket/input/" \
  --output "s3://bucket/output/" \
  --metrics-addr ":8080"
```

## Error Handling

### Exit Codes

- `0` - Success (all files processed)
- `1` - Error (configuration, processing, or partial failure)

### Partial Failures

```
level=INFO msg="batch processing complete" files_processed=1000 files_succeeded=998 files_failed=2
level=ERROR msg="file error" file="corrupt.AL3" stage="parse" error="invalid header"
level=ERROR msg="file error" file="missing.AL3" stage="read" error="file not found"
```

**Behavior**:
- Continues processing remaining files
- Logs all errors
- Exits with code 1 if any failures

### Graceful Shutdown

```bash
# Start batch
goal3-batch --source s3://bucket/input/ --output s3://bucket/output/ &
PID=$!

# Send SIGTERM (Kubernetes pod termination)
kill -TERM $PID

# Waits for in-flight files to complete (up to 30s)
# Then exits gracefully
```

## IAM Permissions

### S3 Read/Write

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::input-bucket/*",
        "arn:aws:s3:::input-bucket"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::output-bucket/*"
    }
  ]
}
```

### AWS Marketplace Metering

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "aws-marketplace:MeterUsage"
      ],
      "Resource": "*"
    }
  ]
}
```

## Troubleshooting

### High Memory Usage

**Symptom**: OOM kills in Kubernetes

**Solutions**:
- Reduce concurrency: `--concurrency 4`
- Increase memory limit: `memory: "8Gi"`
- Use smaller batches

### Slow Processing

**Symptom**: Low throughput

**Solutions**:
- Increase concurrency: `--concurrency 16`
- Check S3 throttling (429 errors)
- Use larger instance type
- Enable S3 Transfer Acceleration

### Files Not Found

**Symptom**: `file not found` errors

**Solutions**:
- Verify source URI: `--dry-run`
- Check IAM permissions
- Confirm S3 bucket region

### Output Files Missing

**Symptom**: Some output files not created

**Solutions**:
- Check error logs for parse failures
- Verify output permissions
- Check disk space (local) or quota (S3)

## Best Practices

1. **Use dry-run first** to verify source files
2. **Enable resume** for large batches (default)
3. **Monitor metrics** via Prometheus
4. **Set resource limits** in Kubernetes
5. **Use Parquet** for analytics workloads
6. **Use CSV** for data warehouses
7. **Start with low concurrency** and tune based on metrics
8. **Enable structured logging** for debugging
9. **Use IAM roles** instead of static credentials
10. **Test with small batch** before full migration

## Examples

### Daily Processing Pipeline

```bash
#!/bin/bash
# daily-batch.sh

DATE=$(date +%Y%m%d)
SOURCE="s3://data-staging/al3/$DATE/"
OUTPUT="s3://data-lake/parsed/$DATE/"

echo "Processing $DATE batch..."

goal3-batch \
  --source "$SOURCE" \
  --output "$OUTPUT" \
  --format parquet \
  --concurrency 8 \
  --log-level info

if [ $? -eq 0 ]; then
  echo "✅ Batch complete"
  # Trigger downstream processing
  aws lambda invoke --function-name process-parsed-data
else
  echo "❌ Batch failed"
  # Send alert
  aws sns publish --topic-arn arn:aws:sns:us-east-1:123:alerts \
    --message "GOAL3 batch failed for $DATE"
  exit 1
fi
```

### Migration Script

```bash
#!/bin/bash
# migrate-archive.sh

# Process years of archived AL3 files
for year in {2020..2024}; do
  for month in {01..12}; do
    echo "Processing $year-$month..."
    
    goal3-batch \
      --source "s3://archive/al3/$year/$month/" \
      --output "s3://data-lake/parsed/$year/$month/" \
      --format parquet \
      --concurrency 4 \
      --resume=true
    
    # Pause between months to avoid throttling
    sleep 60
  done
done
```

## Support

For issues or questions:
- Check metrics endpoint for processing stats
- Enable debug logging: `--log-level debug`
- Review structured logs for error details
- Use `--dry-run` to verify configuration
