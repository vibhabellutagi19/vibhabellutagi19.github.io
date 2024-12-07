---
slug: de-bootcamp-dimensional-modelling-scd
title: Dimensional Modelling - SCD
authors: [me]
tags: [
        de,
        dim,
        de-bootcamp,
        scd
    ]
keywords: [
            data engineering,
            data engineering bootcamp, 
            dimensional modeling, 
            slowly changing dimensions
        ]
hide_table_of_contents: false

---
Im sharing my learning from the Data Engineering Bootcamp, where we are learning about Data Engeering. Today we are learning about Dimensional modelling - Idempotency and SCDs.

I would like to extend my gratitude to Zach Wilson, the founder of [DataExpert.io](https://bootcamp.techcreator.io/lessons), for his invaluable guidance and the comprehensive Data Engineering Bootcamp.
Connect with Zach Wilson on [LinkedIn](https://www.linkedin.com/in/eczachly/).
Thank you, Zach, for this amazing intense bootcamp on Data engineering!

---

Day-2: Dimensional Modelling - Slowly Changing Dimensions (Theory)

<!-- truncate -->

## What is an Idempotent Pipeline?
> Idempotency: An idempotent pipeline ensures that processing the same data multiple times (whether it's live production data or backfill data) yields the same result without any unintended side effects. This consistency is crucial for reliability and simplicity in data workflows.

Pipelines should produce the same results:
1. The day they are run
2. How many times they are run
3. What hour they are run

### Why is hard to troubleshoot non-idempotent pipelines?
1. Silent Failure: The non-idempotent pipelines can produce different results every time they are run, it doesnt fail. This results in <Highlight color="#3e6980">non reproduceable results</Highlight>.
2. This causes inconsistency in the data to the downstream systems too.

### What can make a pipline non-idempotent?
1. `INSERT INTO` without `TRUNCATE`:
    1. If you dont `TRUNCATE` data before INSERT, it will keep on adding the data to the table, creating duplicates. 
    2. Thus your pipeline will not be idempotent, as it will keep on adding the data to the table.
    3. Highly recommended to use <Highlight color="#3e6980">MERGE</Highlight> or <Highlight color="#3e6980">INSERT OVERWRITE</Highlight> always.
2. Using `start_date >` without a corresponding `end_date <`:
    1. If you dont have `end_date` in your SCD, you will not be able to track the changes in the data.
    2. This can create a out of memory exceptions, when you backfill the data.
    3. Highly recommended to use <Highlight color="#3e6980">end_date</Highlight> in your SCD always.
3. Not using a full set of partition sensors:
    1. Your pipeline may run with partial set of inputs.
    2. pipeline might run when there is no/partial data
4. Not using `depends_on_past` for cumulative pipelines:
    1. When you process the data in parallel ( lets say processing parallel days ), pipeline may end up processing yesterday's data, which hasnt been created yet.

:::info
The beauty of an idempotent pipeline lies in its ability to produce consistent results for both production and backfill data.
:::

**Example:**
Imagine a pipeline that:
1. Reads data (e.g., transactions).
2. Cleans and deduplicates it.
3. Stores the cleaned data in a database.

- **Production:** As new transactions come in, they’re cleaned, deduplicated, and stored.
- **Backfill:** When historical transactions are added, they go through the same cleaning and deduplication process, ensuring no duplicate records and consistent results.

Because the pipeline is idempotent:
- Processing the same data again won’t alter the results or create issues.
- Whether it's production or backfill data, the behavior remains identical.

### Few more problems that can make a pipeline non-idempotent

1. Relying on the **latest** partition of a not properly modeled SCD table.
    - Cumulative table design AMPLIFIES this bug.
2. One exception relying on latest partition is when you have properly modeled SCD table and <Highlight color="#3e8045">you are backfilling not in production</Highlight>.

### The pains of not having an idempotent pipeline

- Backfilling causes inconsistencies between the old and restated data.
- Hard to troubleshoot bugs and fix the issues.
- Unit testing cannot replicate the production behavior.
- The pipeline doesnt fail, but the data is inconsistent, which is silent failures.

## Slowly Changing Dimensions (SCD)

The Slowly Changing Dimensions (SCD) are dimensions that change slowly over time, which would have time frame with them. For example,
    1. Customer Address
    2. Product Description
    3. Employee Details
    4. etc.

:::warning
Not modelling the SCDs properly can impact the idempotency.
:::

:::tip
The slower the changes in a Slowly Changing Dimension (SCD), the more effectively it can be modeled.
:::

### How can you model dimensions that change over time?

- Singular snapshot: The dimension table only contains the most recent data.
    - Be Careful: This pipelines are not idempotent.
- Daily partitioned snapshots: The dimension table contains a snapshot of the data for each day.
    - Very simple way of implementing SCD.
- SCD Types 1,2,3

### Types of Slowly Changing Dimensions

Here’s a Markdown table summarizing the content provided:

| **Type**  | **Description**                                                                                             | **Key Features**                                                                                      | **Limitations**                                                                                   |
|-----------|-------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| **Type 0** | Static dimensions, not actually slowly changing.                                                           | - No temporal columns. <br /> - Table contains only identifier and value.                              | - No changes tracked or maintained.                                                              |
| **Type 1** | Overwrites old data with new data, only latest data is retained.                                           | - Simple and efficient. <br /> - No history maintained.                                                | - Cannot retrieve historical data.                                                               |
| **Type 2** | Gold standard of Slowly Changing Dimensions, maintains history using temporal columns.                     | - Uses `start_date` and `end_date`. <br /> - Current rows have `end_date = NULL` or `9999-12-31`. <br /> - Optionally uses `is_current` column. | - More than one row per dimension can complicate filtering and querying.                         |
| **Type 3** | Maintains only two versions of the data: `original` and `current`.                                         | - One row per dimension.                                                                             | - Loses history of changes between `original` and `current`. <br /> - Partially idempotent.        |


### Which types are idempotent?

| Type      | Idempotent | Reason                                                                                           |
|-----------|------------|--------------------------------------------------------------------------------------------------|
| Type 0 | Yes        | The values are unchanging.                                                                       |
| Type 2 | Yes        | It is idempotent, but you need to be careful with how you use the `start_date` and `end_date`.   |
| Type 1 | No         | Backfilling with this dataset gives the dimension as it is now, not as it was before.           |
| Type 3 | No         | Backfilling makes it impossible to determine whether to pick "original" or "current."           |

### Loading SCD2

- Load the entire history in one query
    - Inefficient but nimble
- Incremnetally load the data after the previoud SCD is generated
    - Has the same `depends_on_past`. its efficient but cumbersome.