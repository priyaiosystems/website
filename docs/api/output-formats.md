---
sidebar_position: 4
title: Output Formats
description: JSON, CSV, and Parquet schema details for GOAL3 output
---

# Output Formats

GOAL3 supports three output formats, each optimized for different use cases.

## Format Comparison

| Format | Size | Speed | Best For |
|--------|------|-------|----------|
| **JSON** | Largest (2-3x AL3) | Fast | APIs, web apps, integrations |
| **CSV** | Medium (1.5-2x AL3) | Medium | Excel, legacy systems, SQL imports |
| **Parquet** | Smallest (0.5-1x AL3) | Slowest | Analytics, AI/ML, data warehouses |

---

## JSON Output

### Structure

```json
{
  "status": "success",
  "metadata": {
    "filename": "policy_123.al3",
    "parsed_at": "2026-01-02T19:20:00Z",
    "parser_version": "1.0.0",
    "file_size_bytes": 524288
  },
  "header": {
    "message_id": "MSG001",
    "transaction_type": "SUBMISSION",
    "effective_date": "2026-01-01"
  },
  "data": {
    "transactions": [
      {
        "id": "TX001",
        "type": "POLICY",
        "groups": [
          {
            "code": "5LOB",
            "description": "Line of Business",
            "elements": {
              "line_of_business": "AUTO",
              "policy_number": "POL-2026-001"
            }
          }
        ]
      }
    ]
  },
  "validation_summary": {
    "warnings": [],
    "errors": []
  }
}
```

### Use Cases

✅ **Ideal for:**
- REST API responses
- Modern web applications
- Document databases (MongoDB, DynamoDB)
- QueueKey services (SQS, Kafka)

### Advantages

- Preserves hierarchical structure
- Self-describing schema
- Easy to work with in JavaScript/Python

---

## CSV Output

### Structure

Multi-file normalized design delivered as `.zip`:

```
policy_123_al3.zip
├── header.csv
├── transactions.csv
├── coverages.csv
├── vehicles.csv
├── drivers.csv
└── _manifest.json
```

### Sample: `coverages.csv`

```csv
transaction_id,coverage_code,limit,deductible,premium
TX001,BI,250000,500,850.00
TX001,PD,100000,500,425.00
```

### Relationships

Each CSV includes foreign keys to maintain referential integrity:

```csv
# drivers.csv
driver_id,transaction_id,name,license_number,birth_date
DRV001,TX001,John Doe,D1234567,1985-06-15

# vehicles.csv
vehicle_id,transaction_id,primary_driver_id,vin,year,make,model
VEH001,TX001,DRV001,1HGBH41JXMN109186,2022,Honda,Accord
```

### Use Cases

✅ **Ideal for:**
- Excel analysis and pivot tables
- SQL database imports
- Legacy ETL tools
- Data analysts familiar with relational design

### Advantages

- Familiar tabular format
- Easy to open in Excel/Google Sheets
- Works with any SQL database

---

## Parquet Output

### Structure

Columnar file format optimized for analytics:

```
s3://output-bucket/parquet/
├── _manifest.json
├── header.parquet
├── transactions.parquet
├── coverages.parquet
├── vehicles.parquet
└── drivers.parquet
```

### Schema Example

```python
# Python with PyArrow
import pyarrow.parquet as pq

table = pq.read_table('coverages.parquet')
print(table.schema)

# Output:
# transaction_id: string
# coverage_code: string
# limit: int64
# deductible: int64
# premium: double
```

### Partitioning

For large datasets, Parquet files can be partitioned:

```
s3://output-bucket/parquet/
└── coverages/
    ├── year=2026/
    │   ├── month=01/
    │   │   ├── part-0001.parquet
    │   │   └── part-0002.parquet
    │   └── month=02/
    │       └── part-0001.parquet
```

### Use Cases

✅ **Ideal for:**
- **Data Warehouses**: Snowflake, BigQuery, Redshift
- **Analytics Engines**: Athena, Presto, Spark
- **AI/ML Pipelines**: TensorFlow, PyTorch data loading
- **BI Tools**: Tableau, Looker, Power BI

### Advantages

- **Compression**: Typically 50-70% smaller than AL3
- **Columnar Storage**: Only read columns you need
- **Schema Evolution**: Add columns without breaking existing queries
- **Native Support**: Works out-of-the-box with modern analytics tools

### Query Example (AWS Athena)

```sql
CREATE EXTERNAL TABLE coverages (
  transaction_id STRING,
  coverage_code STRING,
  limit BIGINT,
  deductible BIGINT,
  premium DOUBLE
)
STORED AS PARQUET
LOCATION 's3://your-bucket/parquet/coverages/';

SELECT coverage_code, AVG(premium) as avg_premium
FROM coverages
GROUP BY coverage_code;
```

---

## Choosing a Format

### Use JSON if:
- Building APIs or web applications
- Need hierarchical relationships preserved
- Working with JavaScript/Node.js ecosystem

### Use CSV if:
- Data analysts need Excel access
- Loading into traditional SQL databases
- Using legacy ETL tools

### Use Parquet if:
- Building analytics pipelines
- Working with large datasets (> 1GB)
- Using Snowflake, BigQuery, or Databricks
- Training ML models

---

## Metadata & Validation

All formats include:

### Metadata
- Original filename
- Parse timestamp
- Parser version
- File size

### Validation Summary
- Warnings (non-fatal issues)
- Errors (parsing failures)
- Line numbers for debugging

### Example `_manifest.json`

```json
{
  "batch_id": "batch-20260102-abc123",
  "processed_files": 1247,
  "successful": 1245,
  "failed": 2,
  "format": "parquet",
  "schema_version": "1.0.0",
  "created_at": "2026-01-02T19:30:00Z"
}
```

---

## Next Steps

- [Realtime API](./realtime-api) - Parse files on-demand
- [Batch Processing](./batch-processing) - Process at scale
- [Pricing](../pricing) - Understand costs
