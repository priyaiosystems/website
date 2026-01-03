---
sidebar_position: 1
title: API Overview
description: Introduction to GOAL3's Realtime HTTP API and Batch Processing capabilities
---

# API Overview

GOAL3 provides two powerful ways to parse ACORD AL3 files into modern data formats:

## 🚀 Dual Processing Modes

### Realtime HTTP API
Perfect for on-demand, synchronous parsing:
- **Use case**: Web applications, interactive tools, single-file processing
- **Response time**: Sub-second for typical AL3 files
- **Scalability**: Horizontal auto-scaling
- **Output**: JSON, CSV, or Parquet

[Learn more about the Realtime API →](./realtime-api)

### Batch Processing
Optimized for high-volume, asynchronous workloads:
- **Use case**: ETL pipelines, data lake ingestion, bulk migrations
- **Sources**: S3, EFS, and other storage providers
- **Scalability**: Parallel processing of thousands of files
- **Output**: JSON, CSV, or Parquet

[Learn more about Batch Processing →](./batch-processing)

## 📤 Flexible Output Formats

Choose the format that best fits your downstream systems:

| Format | Best For | Details |
|--------|----------|---------|
| **JSON** | API integrations, modern applications | Hierarchical structure preserves AL3 relationships |
|  **CSV** | Legacy systems, Excel analysis | Normalized multi-table design with referential integrity |
| **Parquet** | Analytics, AI/ML, data warehouses | Columnar format optimized for Snowflake, BigQuery, Databricks |

[Output Formats Guide →](./output-formats)

## 🔒 Security First

- **Zero Data Exfiltration**: All parsing happens in your VPC
- **No Data Retention**: GOAL3 containers don't persist your data
- **Audit Logs**: Full CloudWatch logging for compliance
- **Encryption**: TLS in transit, encryption at rest

## 🏃 Quick Start

### Prerequisites

- AWS account with GOAL3 container deployed
- API endpoint URL from your deployment
- (Optional) API key for authentication

### Example: Parse a Single File

```bash
curl -X POST https://your-goal3-endpoint/parse \
  -H "Content-Type: multipart/form-data" \
  -F "file=@policy_12345.al3" \
  -F "format=json" \
  -o output.json
```

### Example: Batch Process from S3

```bash
curl -X POST https://your-goal3-endpoint/batch \
  -H "Content-Type: application/json" \
  -d '{
    "source": {
      "type": "s3",
      "bucket": "my-al3-files",
      "prefix": "incoming/"
    },
    "destination": {
      "type": "s3",
      "bucket": "parsed-data",
      "prefix": "parquet/"
    },
    "format": "parquet"
  }'
```

## 📊 Output Schema

All formats include:
- **Parsed Data**: Structured AL3 content
- **Metadata**: File info, parsing timestamp, version
- **Validation Summary**: Warnings and errors encountered

[View detailed schema documentation →](./output-formats)

## 🛠️ Error Handling

GOAL3 provides detailed error reporting:

```json
{
  "status": "partial_success",
  "parsed_groups": 42,
  "validation_summary": {
    "warnings": [
      {
        "line": 45,
        "message": "Unknown group code 'ZZTEST' - treated as raw data"
      }
    ],
    "errors": []
  }
}
```

Even malformed files produce useful output with clear diagnostics.

## 📖 Next Steps

- [Realtime API Reference](./realtime-api) - Endpoint details and examples
- [Batch Processing Guide](./batch-processing) - Configuration and best practices
- [Output Formats](./output-formats) - Schema details for each format
- [AWS Marketplace Deployment](../deployment/aws-marketplace) - Setup guide

## 💬 Support

- **Documentation Issues**: [docs@priyaiosystems.com](mailto:docs@priyaiosystems.com)
- **Technical Support**: Available with production deployments
- **Feature Requests**: Contact your account representative

---

**Ready to start parsing?** [Deploy from AWS Marketplace](#aws-marketplace-coming-soon)
