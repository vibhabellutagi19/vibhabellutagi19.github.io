---
slug: de-bootcamp-fact-vs-dimension
title: Data Modelling - Fact vs Dimension
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
I'm sharing my learnings from the Data Engineering Bootcamp, where we are currently focusing on Fact vs Dimension.

| Resource | Link |
|----------|------|
| DataExpert.io | [DataExpert.io](https://bootcamp.techcreator.io/lessons) |
| Zach Wilson on LinkedIn | [LinkedIn](https://www.linkedin.com/in/eczachly/) |

Thank you, Zach, for your invaluable guidance and this comprehensive bootcamp!
---

Week-2, Day-2: Fact vs Dimension

<!-- truncate -->
## Fact vs Dimension

- The examples of `dim is active` and `dim is activated`, both user dimensions on Facebook. 
- `Dim is active` is based on whether a user has engaged with the app in a given timeframe. This could be considered an aggregation of facts (e.g. likes, comments, shares), potentially making it difficult to categorise as purely a dimension. 
- In contrast, `dim is activated` indicates whether a user has explicitly deactivated their account. This is a pure dimension, as it's an attribute of the user object, independent of their actions within the app.

### Bucketisation
*   **Necessity for Meaningful Analysis:** When creating dimensions based on user activity (e.g., number of likes), bucketisation becomes crucial to avoid excessively high cardinality that would lead to groups of one, rendering analysis less meaningful.
*   **Data Distribution Awareness:** The choice of buckets shouldn't be arbitrary. Instead, it should be informed by the data's statistical distribution. Examining percentiles, quartiles, or quintiles can help define meaningful bucket ranges.
*   **Impact on Compression and Flexibility:** Bucketisation can improve data compression by reducing the number of unique values. However, it comes at the expense of flexibility, as pre-defined buckets may limit the types of analyses possible.
*   **Avoiding Arbitrary Buckets:** The author cautions against arbitrarily choosing bucket ranges without considering the underlying data distribution, as it can lead to misleading analyses and weaken the credibility of the derived insights.
*   **Stakeholder Involvement:** When defining buckets for dimensions that could impact business decisions, it's crucial to involve relevant stakeholders to ensure alignment and minimise the need for future changes, which can be costly and time-consuming.

Zach also provides examples where bucketisation plays a significant role:

*   **Facebook's "Dim is active":** While not explicitly bucketised, this dimension demonstrates the aggregation of user actions (facts) into a broader category. A more refined approach could involve bucketising users into activity levels (e.g., low, medium, high) based on their engagement metrics.
*   **Airbnb superhosts:** Determining superhost status involves evaluating multiple criteria and potentially bucketising hosts based on their performance across these dimensions. This illustrates how bucketisation can create a meaningful dimension that reflects a collection of behaviours.

## Properties of Fact and Dimension tables

### Dimensions
- Usually show up in `GROUP BY` clause when doing analytics.
- Can be "high cardinality" (e.g., user_id) or "low cardinality" (e.g., region).
- Generally come from a snapshot of state.

### Facts
- Usually aggregated (e.g., SUM, COUNT, AVG) in analytics.
- Almost always higher volume that dimensions, although some fact sources are low-volume, think "rare events".
- Generally are events and logs.