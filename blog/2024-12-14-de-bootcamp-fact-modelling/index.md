---
slug: de-bootcamp-fact-modelling
title: Data Modelling - Fact Modelling
authors: [me]
tags: [
        de,
        fact,
        de-bootcamp
    ]
keywords: [
            data engineering,
            data engineering bootcamp, 
            data modelling, 
            fact data modelling
        ]
hide_table_of_contents: false
---
Im sharing my learning from the Data Engineering Bootcamp, where we are learning about Data Engeering. 
Today we are learning about Fact Modelling.

I would like to extend my gratitude to Zach Wilson, the founder of [DataExpert.io](https://bootcamp.techcreator.io/lessons), for his invaluable guidance and the comprehensive Data Engineering Bootcamp.
Connect with Zach Wilson on [LinkedIn](https://www.linkedin.com/in/eczachly/).
Thank you, Zach, for this amazing intense bootcamp on Data engineering!

---

Week-2, Day-1: Fact Data Modeling

<!-- truncate -->
:::caution
Fact data is the biggest data you work as data engineer. Zach shares, he worked 2PB of data in a day at Netflix !!
:::

## Fact Data Modelling

### What is a fact?

Fact can be thought as a record of an event that happened or occured. 
- A user logs in to an app ( an action )
- A transaction is made
- You run a mile with your smartwatch - ( a mile can be a aggregated, considering each step in that mile as a granular)

:::info
Fact cannot be broken down further. It is the most granular data you have. ( this is way you think about fact )
:::

<Highlight color="#3e6980">Facts are not slowly changing</Highlight>, which makes them easier to model than dimensions.

### Hardest part of modelling facts

- Fact data is usually 10-100x bigger than dimension data.
- Fact data can need a lot of context for effective analysis like which dimension is it related to etc.
- Facts would have duplicate data which is way more common than dimensions.

### How does fact data work?

- Normalized facts dont have any dimesnional attributes, just IDs to join to get that information.
- Denormalized facts bring in some dimension attributes to make it quicket analysis at the cost of storage.

:::info
Normalised facts works well for a small scale, you would remove the duplicate facts and data integrity is achieved.
:::

### How does fact modelling work?

Here’s a concise table highlighting the differences between **fact data** and **raw log data**, as described in the slide:

| **Aspect**           | **Raw Logs**                                                                                  | **Fact Data**                                   |
|-----------------------|-----------------------------------------------------------------------------------------------|------------------------------------------------|
| **Schema Design**     | Ugly schemas designed for online systems, making data analysis difficult.                     | Well-structured with nice column names.        |
| **Data Quality**      | May contain duplicates and other quality issues.                                              | Includes quality guarantees like uniqueness, non-null constraints, etc. |
| **Retention**         | Usually has shorter retention.                                                                | Retained for longer periods.                   |

Though Fact data and Raw logs are dependent, they are not the same. Fact data is a subset of raw logs, and it is the data that is used for analysis.

Fact can be identified as `Who`, `What`, `When`, `Where`, `How` of the data.

- **Who** - User ID ( user who did the action )
- **Where** - Location ID ( where the action happened ), most likely modeled out like who with "IDs" to join, but more likely to bring in dimensions.
- **How** - Similiar to where, "He used an iphone to make this click"
- **When** - Timestamp ( when the action happened ). fundamentally part of the nature of the fact.
    - Mostly an "event_timestamp" field or "event_date" field. ( always to be not null )
- **What** - The action that happened. ( what is the fact ) ( always to be not null )
    - In notification world, it could be "notification_sent", "notification_delivered", "notification_clicked"

- Fact datasets should have quality guarantees like uniqueness, non-null constraints, etc.
- Fact data < raw logs
- Fact data should parse out hard-to-understand columns. 
- Expected to have the simple data types, in some cases, there can be complex data types 

### How logging fit into fact data?

- It brings in all the crtical context for your fact data
- Do not log everything, log what you need
- Logging should conform to values specified by the online teams, define the standard schema for logging
    - Thrift was used at Netflix and Airbnb

### Potential options when working with high volume fact data

- **Sampling**: This involves analysing a subset of the data, which can be significantly faster and require less storage, especially for gauging trends or directionality. However, sampling is unsuitable for situations like security analysis, where capturing rare events is crucial.

- **Bucketing**: This involves dividing the data into smaller partitions based on a key, like user ID. Bucketing can speed up joins, especially when employing techniques like bucket joins or sorted merge bucket joins (SMB joins) that minimise or eliminate shuffle.

### Retention of Fact Data

- High volumes make fact data much more costly to store.
- Any fact tables < 10 TBs, Retention is not a big deal.
    - Anonymisation of facts usually happens after 60-90 days, the data would be moved to a new table the PII data would be removed.
- Fact tables > 100 TBs, very short retention is common. (~ 14 days)

### Deduplication of Fact Data

As duplicate records are much more common in fact datasets compared to dimensional data. These duplicates can arise from various sources, such as:

*   **Data quality errors:** Software bugs in logging systems can lead to duplicate entries every time an event occurs.
*   **Genuine duplicate actions:** Users might perform the same action multiple times within a given timeframe, resulting in multiple legitimate entries that need to be accounted for without inflating metrics. For example, a user might click on a notification multiple times, or a step-tracking app might record multiple steps in quick succession. 

**Deduplication is crucial for accurate analysis**, as failing to address duplicates can distort metrics like click-through rates or user engagement. For example, if duplicates aren't removed from notification click data, the click-through rate might appear artificially inflated. 

The suggestion here is to consider the **timeframe** for deduplication.  While it's essential to remove duplicates within a specific period where they significantly impact analysis, duplicates occurring over a longer timeframe might be less critical. For instance, a user clicking on a notification a year after initially clicking on it might not be relevant for measuring short-term engagement. 

Two approaches to efficiently handle deduplication for high-volume fact data:

*   **Streaming:** 
    - This method processes data in real time, deduplicating records as they arrive.
    - Windowing matters in streaming, you need to have a window to deduplicate the data.
    - Entire day deduplication is not possible in streaming, because it needs to hold onto such a big window of memory.
    - Large number of duplicates happens within a short time of first event.
    - **Deduplication window** - 15 minutes, a sweet spot
*   **Microbatch processing:** 
    - This technique involves processing data in small batches, such as hourly, to deduplicate records within each batch and subsequently merge the deduplicated batches. 
    - There is a specific microbatch deduplication pattern involving hourly aggregation followed by a series of full outer joins to merge deduplicated data from different hours.

The choice between streaming and microbatch processing depends on factors like latency requirements and the complexity of the deduplication logic. 
