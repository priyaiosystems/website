# Grafana Dashboard for GOAL3 Batch Processing

## Dashboard JSON

This Grafana dashboard provides comprehensive monitoring for batch processing operations.

### Import Instructions

1. Copy the JSON below
2. In Grafana, go to Create → Import
3. Paste JSON and click "Load"
4. Select your Prometheus data source
5. Click "Import"

### Dashboard Panels

**Performance:**
- Batch throughput (files/second)
- Processing time (p50, p95, p99)
- Bytes processed per second

**Success/Failure:**
- Success rate (%)
- Files succeeded vs failed
- Error rate

**Resources:**
- Active workers
- Queue depth
- Circuit breaker state

**Processing:**
- Groups processed
- Files skipped (idempotency)
- Storage errors

---

## Prometheus Queries

### Throughput (files/second)
```promql
rate(goal3_batch_files_processed_total[5m])
```

### Success Rate (%)
```promql
100 * (
  rate(goal3_batch_files_succeeded_total[5m]) /
  rate(goal3_batch_files_processed_total[5m])
)
```

### Processing Time (p95)
```promql
histogram_quantile(0.95, 
  rate(goal3_batch_file_processing_seconds_bucket[5m])
)
```

### Circuit Breaker State
```promql
goal3_batch_circuit_breaker_state
# 0 = closed (healthy)
# 1 = half-open (testing)
# 2 = open (failing)
```

### Active Workers
```promql
goal3_batch_active_workers
```

### Queue Depth
```promql
goal3_batch_queued_files
```

---

## Alerts

### High Error Rate
```yaml
alert: BatchHighErrorRate
expr: |
  (
    rate(goal3_batch_files_failed_total[5m]) /
    rate(goal3_batch_files_processed_total[5m])
  ) > 0.1
for: 5m
labels:
  severity: warning
annotations:
  summary: "Batch error rate above 10%"
```

### Circuit Breaker Open
```yaml
alert: BatchCircuitBreakerOpen
expr: goal3_batch_circuit_breaker_state == 2
for: 1m
labels:
  severity: critical
annotations:
  summary: "Batch circuit breaker is open"
```

### No Files Processed
```yaml
alert: BatchNoProgress
expr: |
  rate(goal3_batch_files_processed_total[10m]) == 0
  and goal3_batch_queued_files > 0
for: 10m
labels:
  severity: warning
annotations:
  summary: "Batch processing stalled"
```

---

## Available Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `goal3_batch_files_processed_total` | Counter | Total files processed |
| `goal3_batch_files_succeeded_total` | Counter | Files successfully processed |
| `goal3_batch_files_failed_total` | Counter | Files that failed |
| `goal3_batch_files_skipped_total` | Counter | Files skipped (already processed) |
| `goal3_batch_groups_processed_total` | Counter | Total AL3 groups processed |
| `goal3_batch_bytes_processed_total` | Counter | Total bytes processed |
| `goal3_batch_file_processing_seconds` | Histogram | Time per file |
| `goal3_batch_active_workers` | Gauge | Active worker goroutines |
| `goal3_batch_queued_files` | Gauge | Files in queue |
| `goal3_batch_circuit_breaker_state` | Gauge | Circuit breaker state (0/1/2) |
| `goal3_batch_storage_errors_total` | Counter | Storage operation errors |
| `goal3_batch_duration_seconds` | Histogram | Total batch duration |
| `goal3_batch_size_files` | Histogram | Files per batch |

---

## Usage Example

### Start batch with metrics
```bash
goal3-batch \
  --source "s3://bucket/input/" \
  --output "s3://bucket/output/" \
  --metrics-addr ":9090"
```

### Query metrics
```bash
# Prometheus metrics
curl http://localhost:9090/metrics

# Health check
curl http://localhost:9090/health

# Readiness check (K8s)
curl http://localhost:9090/ready
```

### Kubernetes Service Monitor
```yaml
apiVersion: v1
kind: Service
metadata:
  name: goal3-batch-metrics
  labels:
    app: goal3-batch
spec:
  ports:
  - name: metrics
    port: 9090
    targetPort: 9090
  selector:
    app: goal3-batch
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: goal3-batch
spec:
  selector:
    matchLabels:
      app: goal3-batch
  endpoints:
  - port: metrics
    interval: 30s
```
