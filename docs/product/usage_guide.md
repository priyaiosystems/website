# Usage Guide

## Introduction

GoAL3 is a high-fidelity ACORD AL3 parser that transforms insurance transaction data into structured formats (JSON, CSV, Parquet).

---

## Phase 2.1: Lexer (Low-Level Parsing)

### Overview

The lexer tokenizes AL3 byte streams into segments representing individual groups.

### Basic Usage

```go
package main

import (
    "fmt"
    "io"
    "os"
    
    "github.com/priyaiosystems/goal3/pkg/al3/parser"
)

func main() {
    // Read AL3 file
    data, err := os.ReadFile("transaction.al3")
    if err != nil {
        panic(err)
    }
    
    // Create lexer in parse mode (fail-fast)
    lexer := parser.NewLexer(data, parser.ModeParse)
    
    // Parse segments
    for {
        segment, err := lexer.NextSegment()
        if err == io.EOF {
            break
        }
        if err != nil {
            fmt.Printf("Parse error: %v\n", err)
            return
        }
        
        fmt.Printf("Group: %d%s, Length: %d bytes\n", 
            segment.Level, segment.GroupCode, segment.Length)
    }
}
```

### Parse vs Validate Mode

**Parse Mode** (fail-fast):
```go
lexer := parser.NewLexer(data, parser.ModeParse)
seg, err := lexer.NextSegment()
if err != nil {
    // Stop on first error
    return err
}
```

**Validate Mode** (collect all errors):
```go
lexer := parser.NewLexer(data, parser.ModeValidate)

// Parse entire file
for {
    seg, err := lexer.NextSegment()
    if err == io.EOF {
        break
    }
    // Errors are collected, not returned
}

// Check collected errors
if lexer.Collector().HasErrors() {
    for _, err := range lexer.Collector().Errors() {
        fmt.Printf("Error: %s\n", err.Message)
    }
}
```

### Segment Structure

Each segment represents one AL3 group:

```go
type Segment struct {
    Level      int    // Group level (1-9)
    GroupCode  string // e.g., "MHG", "TRG", "BIS"
    Length     int    // Total bytes (header + data)
    ByteOffset int    // Position in file
    RawHeader  []byte // Full header
    RawData    []byte // Payload
    
    // Parent reference (data groups only)
    ParentLevel int
    ParentCode  string
    ParentIter  int
}
```

### Error Handling

Errors follow the taxonomy defined in `docs/design/error_taxonomy.md`:

```go
seg, err := lexer.NextSegment()
if err != nil {
    parseErr, ok := err.(*parser.Error)
    if ok {
        fmt.Printf("Code: %s\n", parseErr.Code)
        fmt.Printf("Message: %s\n", parseErr.Message)
        fmt.Printf("Context: %v\n", parseErr.Context)
        fmt.Printf("Fix: %s\n", parseErr.Remediation)
    }
}
```

Common error codes:
- `E1002`: Invalid level
- `E1004`: Invalid length
- `E1006`: Unexpected EOF (truncated file)

---

## Phase 2.2: Hierarchy Builder

### Overview

The hierarchy builder constructs parent-child relationships from flat AL3 segments, creating a tree structure that reflects the AL3 message organization.

### Basic Usage

```go
package main

import (
    "fmt"
    "io"
    "os"
    "strings"
    
    "github.com/priyaiosystems/goal3/pkg/al3/parser"
)

func main() {
    // Read AL3 file
    data, err := os.ReadFile("policy.al3")
    if err != nil {
        panic(err)
    }
    
    // Parse segments
    lexer := parser.NewLexer(data, parser.ModeParse)
    var segments []*parser.Segment
    for {
        seg, err := lexer.NextSegment()
        if err == io.EOF {
            break
        }
        if err != nil {
            fmt.Printf("Parse error: %v\n", err)
            return
        }
        segments = append(segments, seg)
    }
    
    // Build hierarchy
    builder := parser.NewHierarchyBuilder(parser.ModeParse)
    roots, err := builder.Build(segments)
    if err != nil {
        fmt.Printf("Hierarchy error: %v\n", err)
        return
    }
    
    // Iterate tree
    for _, root := range roots {
        printNode(root, 0)
    }
}

func printNode(node *parser.GroupNode, depth int) {
    indent := strings.Repeat("  ", depth)
    fmt.Printf("%s%d%s (iteration %d, %d children)\n", 
        indent, node.Segment.Level, node.Segment.GroupCode, 
        node.Segment.Iteration, len(node.Children))
    
    for _, child := range node.Children {
        printNode(child, depth+1)
    }
}
```

### Parent Reference Handling

AL3 segments reference parents via header bytes 17-26 (1-indexed in spec):
- **Bytes 17-20**: Parent group designator (level + code)
- **Bytes 23-26**: Parent iteration number

The hierarchy builder uses **stack-based lookup** for O(1) parent matching:
- Maintains a stack for each group type (e.g., "3RIS", "4LOC")
- Attaches children to the **most recent** parent of the matching type
- Emits **warning W2001** if parent iteration doesn't match
- Returns **error E2002** if parent group doesn't exist

### Accessing Hierarchy Data

```go
// Get all nodes (including duplicates)
allNodes := builder.AllNodes()
fmt.Printf("Total nodes: %d\n", len(allNodes))

// Get root nodes only
roots := builder.Roots()
fmt.Printf("Root nodes: %d\n", len(roots))

// Access warnings
warnings := builder.GetWarnings()
for _, w := range warnings {
    fmt.Printf("Warning %s: %s\n", w.Code, w.Message)
}
```

---

## Phase 2.3: Field Extraction

### Overview

The field extractor maps raw segment data to typed fields using AL3 schema definitions.

### Basic Usage

```go
package main

import (
    "fmt"
    "os"
    
    "github.com/priyaiosystems/goal3/pkg/al3/parser"
)

func main() {
    data, _ := os.ReadFile("policy.al3")
    
    // Create parser (combines lexer + hierarchy + extraction)
    p := parser.NewParser(data)
    
    // Parse to structured data
    groups, warnings, err := p.ParseToData()
    if err != nil {
        fmt.Printf("Parse error: %v\n", err)
        return
    }
    
    // Iterate extracted fields
    for _, group := range groups {
        fmt.Printf("Group: %s (level %d)\n", group.GroupCode, group.Level)
        
        // Access fields by JSON key
        for key, value := range group.Fields {
            fmt.Printf("  %s: %v\n", key, value)
        }
        
        // Access metadata
        fmt.Printf("  Parent: %s\n", group.Parent)
        fmt.Printf("  Iteration: %d\n", group.Iteration)
    }
    
    // Handle warnings
    for _, w := range warnings {
        fmt.Printf("Warning: %s - %s\n", w.Code, w.Message)
    }
}
```

### Field Types

GoAL3 extracts fields based on AL3 schema class:

| Class | Type | Example | Description |
|-------|------|---------|-------------|
| **T** | Text | `"ACME Insurance"` | Trimmed strings |
| **A** | Alpha | `"NY"` | Letters only |
| **AN** | AlphaNumeric | `"ABC123"` | Letters and numbers |
| **N** | Numeric | `1250.00` | Integers or decimals |
| **D** | Date | `"2023-12-24"` | ISO 8601 (YYYY-MM-DD) |
| **TM** | Time | `"14:30:00"` | HH:MM:SS |
| **C** | Coded | `"01"` | Reference to coded value table |
| **NM** | Name | `{"name": "John Doe", "_format_code": "P"}` | Special handling with format |

### JSON Output Structure

```json
{
  "group_code": "3RIS",
  "level": 3,
  "iteration": 1,
  "parent": "2TRG:1",
  "fields": {
    "policy_number": "POL12345",
    "effective_date": "2023-01-01",
    "expiration_date": "2024-01-01",
    "premium_amount": 1250.00,
    "status_code": "A"
  },
  "children": [...]
}
```

### Advanced: Accessing Nested Groups

```go
// Parse to hierarchical JSON
jsonData, err := p.ParseToJSON()
if err != nil {
    panic(err)
}

// jsonData is hierarchical with nested children
fmt.Println(string(jsonData))
```

---

## Thread Safety

> [!WARNING]
> **Parser Instances Are NOT Thread-Safe**

Each `Parser`, `Lexer`, and `HierarchyBuilder` instance maintains internal state and **must not be shared across goroutines**.

### Safe Pattern

Create a new parser per goroutine:

```go
func processFiles(files []string) {
    var wg sync.WaitGroup
    for _, file := range files {
        wg.Add(1)
        go func(filename string) {
            defer wg.Done()
            
            data, _ := os.ReadFile(filename)
            p := parser.NewParser(data)  // ✅ New instance per goroutine
            groups, _, err := p.ParseToData()
            if err != nil {
                log.Printf("Error parsing %s: %v", filename, err)
                return
            }
            
            // Process groups...
        }(file)
    }
    wg.Wait()
}
```

### Unsafe Pattern (Race Condition)

```go
// ❌ NEVER DO THIS
var globalParser *parser.Parser

func processFile(data []byte) {
    groups, _, _ := globalParser.ParseToData()  // RACE CONDITION!
}
```

---

## Next Steps

For production HTTP API usage, see [`docs/design/api_spec.yaml`](../design/api_spec.yaml).

For batch processing patterns, see [`docs/deployment/aws_marketplace.md`](../deployment/aws_marketplace.md).

## Metering & Billing

For cloud marketplace metering and usage-based billing, see [metering.md](metering.md).

