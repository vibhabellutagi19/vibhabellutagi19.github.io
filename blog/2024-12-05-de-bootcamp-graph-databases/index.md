---
slug: de-bootcamp-graph-databases
title: Data Modelling - Graph Databases and Additve Dimensions
authors: [me]
tags: [
        de,
        dim,
        de-bootcamp,
        graph-database
    ]
keywords: [
            data engineering,
            data engineering bootcamp, 
            data modelling, 
            graph database
        ]
hide_table_of_contents: false
---
Im sharing my learning from the Data Engineering Bootcamp, where we are learning about Data Engeering. 
Today we are learning about Data Modelling - Graph Databases

I would like to extend my gratitude to Zach Wilson, the founder of [DataExpert.io](https://bootcamp.techcreator.io/lessons), for his invaluable guidance and the comprehensive Data Engineering Bootcamp.
Connect with Zach Wilson on [LinkedIn](https://www.linkedin.com/in/eczachly/).
Thank you, Zach, for this amazing intense bootcamp on Data engineering!

---

Day - 3: Data Modeling: Graph Databases

<!-- truncate -->

## Additive vs non-additive dimensions

### What makes a dimension additive

- A additive dimension is a dimension that can be summed up across all the dimensions in the fact table.
For Example: You manage a sales database that tracks daily transactions. 
You want to analyze the <Highlight color="#3e6980">total revenue generated</Highlight> by your business.
The Revenue measure is an additive dimension because it can be summed across all levels of the data (e.g., by day, month, region, product, etc.).

- Non-additive dimensions are dimensions that cannot be summed up across all the dimensions in the fact table.
For Example: Application interface is not additive.
The number of active users != # of active users on web + # of active users on mobile (Android + iOS).

    Why is this?
    Overlapping Users: A single user can be active on multiple platforms (e.g., logging in on both web and mobile during the same time period). Simply summing active users across platforms would `double-count` those users.

:::important
A deminsion is additive over a specific window of time, if and only if, the grain of data over that window can
only ever be one value at a time.
:::

### How additivity help?

1. **No need for COUNT(DISTINCT)**: When a measure is additive, you can aggregate it (e.g., SUM) across dimensions without needing a COUNT(DISTINCT) to avoid duplicates.

2. **Additivity Applies Mostly to SUM:**
   - Non-additive dimensions (like active users) are usually problematic only when using `COUNT` because you might double-count. However, **SUM** aggregations typically remain additive.

:::note
Can the dimension be 2 things at once? If yes, it's non-additive.
:::

## All about ENUMS

### What is an ENUM type?
ENUM is a data type that contains a fixed set of values.

### When should you use ENUMs?
- Enums are great for low-to-medium cardinality columns.
- Country is a great example of where Enums start to struggle.

:::info
Enums are great if the set of value count is < 50. 
:::

### Why use ENUMs?

- Built in data quality:
    - IF you model a column as ENUM, you can be sure that the data in that column is one of the values in the ENUM. if the data is not in the ENUM, the pipeline will fail.
- Built in static fields:
    - If you have a column that is not going to change, you can use ENUMs.
    - Example: Employee Type (Full Time, Part Time, Contractor)
- Built in documentation:
    - You would know already what the values are, it is self documented.

In Postgres you can create ENUMs like this:
```sql
CREATE TYPE employee_type AS ENUM ('Full Time', 'Part Time', 'Contractor');
```

### Enumerations and sup partitions

- Enumerations make it easy to create sup partitions, because:
    - You can be sure that the data in the column is one of the values in the ENUM.
    - They chunk up the big data problem into manageable pieces.

**For example:** Deduping the Notification channel (Email, SMS, Push) is defined as ENUM. You can process the data with date and notification channel in parallel.

- The [little book of pipelines](https://github.com/EcZachly/little-book-of-pipelines/tree/master) by Zach:
    - The **Little Book of Enums** is a design pattern for organizing and managing complex data pipelines with multiple sources. It groups similar data sources together, defines a shared schema for consistency, and uses enums to document metadata, data quality rules, and constants for each group. 
    - How is this little book generated?
        - The **ENUMs** are typically defined in Python or Scala to represent the metadata.  
        - A dedicated job is used to convert the enumerated list into a table.  
        - The resulting table is small, as it only contains as many entries as there are ENUMs.  
        - This table can then be used to share metadata between data quality (DQ) checks (passed as a table) and source functions (passed as Python objects) by joining them as needed.
    - What type of use cases is this ENUM pattern useful for?
        - Whenever you have many sources mapping to a shared schema.
        - Airbnb
            - Unit Economics (fees, coupons, credits, insurance, infrastructure cost, taxes etc)
    - How do you model data from disparate sources into a shared schema?
        - Flexible schema: Using map

### Flexible schema

- Benefits
    - No need to run ALTER TABLE each time a new column is added.
    - Easier management of numerous columns.
    - Schemas are not cluttered with many "NULL" columns.
    - "Other_properties" columns are excellent for "rarely-used-but-needed" data.
- Drawbacks
    - Typically results in poorer compression.
    - Can affect readability and queryability.

## Graph data modeling

### What is a graph database?
Graph databases are a type of NoSQL database that uses graph structures for semantic queries with nodes, edges, and properties to represent and store data.

Graph modelling is RELATIONSHIP focused, not entity focused. There would be chances of poor job at modelling the entities.


Usually the model look like this for entities(vertices):

```
- Identifier: STRING
- Type: STRING
- Properties: MAP<STRING,STRING>
```
:::warning
We dont care about the entities, we care about the relationships.
:::

The schema for edges would look like this:
```
- subject_identifier: STRING
- subject_type: VertexType
- object_identifier: STRING
- object_type: VertexType
- edge_type: EdgeType (always a verb: is_a, place_with, has_a etc)
- Properties: MAP<STRING,STRING>
``` 