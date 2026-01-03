---
sidebar_position: 1
title: AWS Marketplace Deployment
description: Deploy GOAL3 container from AWS Marketplace
---

# AWS Marketplace Deployment

:::info Coming Soon
The GOAL3 listing on AWS Marketplace is currently in preparation. This page will be updated with the direct marketplace link once available.

**Early Access**: Contact [sales@priyaiosystems.com](mailto:sales@priyaiosystems.com) for beta access.
:::

---

## Why AWS Marketplace?

- **Trusted Platform**: Leverage your existing AWS relationship
- **Consolidated Billing**: One bill from AWS, no separate vendor invoicing
- **Pay-As-You-Go**: Usage-based pricing with no upfront license fees
- **Fast Procurement**: Deploy in minutes, not months

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│          Your AWS Account (VPC)         │
│                                         │
│  ┌─────────────┐      ┌──────────────┐ │
│  │   GOAL3     │      │   Your S3    │ │
│  │  Container  │◄────►│   Buckets    │ │
│  │   (ECS/EKS) │      │              │ │
│  └─────────────┘      └──────────────┘ │
│         │                               │
│         │  100% Private Processing      │
│         ▼  Zero Data Exfiltration       │
│  ┌─────────────┐                        │
│  │  CloudWatch │                        │
│  │   Metrics   │                        │
│  └─────────────┘                        │
└─────────────────────────────────────────┘
```

---

## Prerequisites

### AWS Requirements

- AWS account with appropriate IAM permissions
- VPC with private subnets (recommended)
- S3 buckets for input/output (for batch processing)
- ECS cluster or EKS cluster (for container deployment)

### IAM Permissions

GOAL3 container requires:
- `s3:GetObject` - Read AL3 files
- `s3:PutObject` - Write parsed output
- `cloudwatch:PutMetricData` - Usage metrics
- `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents` - Logging

---

## Deployment Options

### Option 1: Amazon ECS (Recommended)

Best for teams already using ECS or new to Kubernetes.

**Steps:**
1. Subscribe to GOAL3 on AWS Marketplace
2. Create ECS task definition using GOAL3 container image
3. Configure environment variables (S3 buckets, parsing options)
4. Deploy as ECS service with auto-scaling
5. Configure Application Load Balancer (ALB) for HTTP API

**Estimated Time**: 15-30 minutes

### Option 2: Amazon EKS

Best for teams with existing Kubernetes infrastructure.

**Steps:**
1. Subscribe to GOAL3 on AWS Marketplace
2. Deploy Helm chart or Kubernetes manifests
3. Configure Ingress for HTTP API
4. Set up Horizontal Pod Autoscaler (HPA)

**Estimated Time**: 20-40 minutes (assuming EKS cluster exists)

---

## Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | HTTP API port (default: 8080) | `8080` |
| `LOG_LEVEL` | No | Logging verbosity | `info` |
| `MAX_FILE_SIZE_MB` | No | Max upload size (default: 10) | `10` |
| `OUTPUT_FORMAT_DEFAULT` | No | Default format if not specified | `json` |

### Resource Recommendations

| Workload | vCPU | Memory | Instances |
|----------|------|--------|-----------|
| Development/Testing | 1 | 2 GB | 1 |
| Production (Realtime API) | 2-4 | 4-8 GB | 2+ (with auto-scaling) |
| Batch Processing | 4-8 | 8-16 GB | Scale based on job queue |

---

## Security Best Practices

### Network Isolation

✅ **DO:**
- Deploy in private subnets
- Use VPC endpoints for S3 access
- Restrict security groups to minimum required access
- Enable VPC Flow Logs

### Data Protection

✅ **DO:**
- Enable S3 encryption at rest (SSE-S3 or SSE-KMS)
- Use TLS 1.2+ for all API calls
- Rotate IAM credentials regularly
- Enable CloudTrail for audit logging

### Zero Data Exfiltration Verification

To verify no data leaves your VPC:
1. Check VPC Flow Logs - should only see internal traffic
2. Monitor NAT Gateway usage - should be minimal
3. Review CloudWatch metrics - all processing happens in your VPC

---

## Monitoring & Observability

### CloudWatch Metrics

GOAL3 emits:
- `ParsedFiles` - Count of files processed
- `ParseDuration` - Time to parse each file
- `ParsingErrors` - Count of failures
- `OutputSize` - Size of generated output

### CloudWatch Logs

Structured JSON logs include:
- Request IDs for tracing
- Validation warnings/errors
- Performance metrics

### Sample Dashboard

```json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          [ "GOAL3", "ParsedFiles", { "stat": "Sum" } ],
          [ ".", "ParsingErrors", { "stat": "Sum" } ]
        ],
        "period": 300,
        "stat": "Sum",
        "region": "us-east-1",
        "title": "Parsing Activity"
      }
    }
  ]
}
```

---

## Scaling

### Auto-Scaling (ECS)

```json
{
  "targetTrackingScalingPolicyConfiguration": {
    "targetValue": 70.0,
    "predefinedMetricSpecification": {
      "predefinedMetricType": "ECSServiceAverageCPUUtilization"
    }
  }
}
```

### HPA (Kubernetes)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: goal3-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: goal3
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## Pricing

All billing goes through AWS Marketplace:
- **Metered by**: vCPU-hours consumed
- **Billing Cycle**: Monthly, via AWS invoice
- **No Minimum**: Pay only for what you use

[Learn more about pricing →](../pricing)

---

## Support

- **Documentation**: This site
- **Technical Issues**: Available with production deployments
- **Sales Questions**: [sales@priyaiosystems.com](mailto:sales@priyaiosystems.com)

---

## Next Steps

1. ✓ **Try the WASM Viewer** to verify parsing accuracy: [/viewer](/viewer)
2. 📧 **Contact sales** for early marketplace access
3. 🚀 **Deploy** and start parsing in minutes

---

**Questions?** [Contact us](mailto:sales@priyaiosystems.com) • [View Pricing](../pricing)
