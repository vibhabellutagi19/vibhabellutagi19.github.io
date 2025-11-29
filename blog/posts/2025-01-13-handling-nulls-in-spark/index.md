---
title: "Handling Nulls in Spark"
date: "Jan 13, 2025"
readTime: "8 min read"
excerpt: "In SQL null is a special marker used to indicate that a data value does not exist in the database. A null should not be confused with a value of 0. Let's deep dive into handling nulls in Spark."
slug: "handling-nulls-in-spark"
---

In SQL `null` or `Null` is a special marker used to indicate that a data value does not exist in the database. A null should not be confused with a value of 0. A null indicates a lack of a value, which is not the same as a zero value.

For example:
Consider the question "How many books does Krishna own?" 
The answer may be `zero` (we know that he owns none) or `null` (we do not know how many he owns).

Let's deep dive into handling nulls in Spark.

<!-- truncate -->

## Handling nulls in Spark

In Spark, a null value represents the absence of any value: it is not zero, an empty string, or false. Spark treats nulls in a way similar to SQL. When performing operations on null values, you need to be explicit about how to handle them, as any operation with a null value generally yields a null result (unless specifically handled).

Key Points about Nulls in Spark:
1. **Null propagation**: If you do an arithmetic operation (e.g., `colA + colB`) and either `colA` or `colB` is null, the result is null unless there is a function to handle null explicitly (like coalesce).

2. **Comparison**: Comparisons with null always yield false or unknown. For example, df.filter(`df("age") == null`) might not work as intended. Instead, you need to use methods like isNull or isNotNull.

3. **Equi-Null safe join**: Spark SQL provides nullSafeEq or eqNullSafe (`<=>` in SQL) to compare two columns including nulls. This means if both sides are null, it returns true.

:::note
In SQL, null is a marker, not a value.
:::

### Data Preparation 

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, isnull, when, coalesce

spark = SparkSession.builder \
    .appName("NullHandlingExample") \
    .getOrCreate()

data = [
    (6.1,   1071,  "12-Jun-98",  None,  None,                "The Land Girls"),
    (6.9,   207,   "7-Aug-98",   None,  None,                "First Love, Last Rites"),
    (6.8,   865,   "28-Aug-98",  None,  None,                "I Married a Strange Person"),
    (5.8,   3275,  "1-Jul-86",  "13",  None,                "Pirates"),
    (3.4,   165,   "9-Oct-98",   "62",  "Original Screenplay","Slam"),
    (None,  None,  "15-Jan-99",  None,  None,                "Mississippi Mermaid"),
    (7.7,   15133, "4-Apr-99",   None,  None,                "Following"),
    (3.8,   353,   "9-Apr-99",   None,  "Original Screenplay","Foolish"),
    (5.8,   3275,  "1-Jul-86",   "25",  None,                "Pirates"),
    (7.0,   2906,  "31-Dec-46",  "86",  None,                "Duel in the Sun")
]

columns = ["IMDB_Rating", "IMDB_Votes", "Release_Date", "Rotten_Tomatoes_Rating", "Source", "Title"]
df = spark.createDataFrame(data, columns)

df.show()
```

<details>
<summary>Output: You will see the movies data with some null values.</summary>
```
+-----------+----------+------------+----------------------+-------------------+--------------------------+
|IMDB_Rating|IMDB_Votes|Release_Date|Rotten_Tomatoes_Rating|Source             |Title                     |
+-----------+----------+------------+----------------------+-------------------+--------------------------+
|6.1        |1071      |12-Jun-98   |NULL                  |NULL               |The Land Girls            |
|6.9        |207       |7-Aug-98    |NULL                  |NULL               |First Love, Last Rites    |
|6.8        |865       |28-Aug-98   |NULL                  |NULL               |I Married a Strange Person|
|5.8        |3275      |1-Jul-86    |13                    |NULL               |Pirates                   |
|3.4        |165       |9-Oct-98    |62                    |Original Screenplay|Slam                      |
|NULL       |NULL      |15-Jan-99   |NULL                  |NULL               |Mississippi Mermaid       |
|7.7        |15133     |4-Apr-99    |NULL                  |NULL               |Following                 |
|3.8        |353       |9-Apr-99    |NULL                  |Original Screenplay|Foolish                   |
|5.8        |3275      |1-Jul-86    |25                    |NULL               |Pirates                   |
|7.0        |2906      |31-Dec-46   |86                    |NULL               |Duel in the Sun           |
+-----------+----------+------------+----------------------+-------------------+--------------------------+
```
</details>

### Coalesce
- In Spark SQL and DataFrame APIs, `coalesce()` is used to return the first non-null value among its arguments.
- If you have multiple columns and want a single column which picks up a non-null value from one of them in order, or you want to replace a single column’s null value with a fallback.

```python
rating_df = df.select(col("Title"),  
              col("Rotten_Tomatoes_Rating"),  
              col("IMDB_Rating"),  
              coalesce(col("Rotten_Tomatoes_Rating"), col("IMDB_Rating") * 10).alias("Rating"))

rating_df.show(10, False)
```
<details>
<summary>Output: You will see when `Rotten_Tomatoes_Rating` is null, `Rating` is calculated as `IMDB_Rating * 10`.</summary>
```
+--------------------------+----------------------+-----------+------+
|Title                     |Rotten_Tomatoes_Rating|IMDB_Rating|Rating|
+--------------------------+----------------------+-----------+------+
|The Land Girls            |NULL                  |6.1        |61.0  |
|First Love, Last Rites    |NULL                  |6.9        |69.0  |
|I Married a Strange Person|NULL                  |6.8        |68.0  |
|Pirates                   |13                    |5.8        |13    |
|Slam                      |62                    |3.4        |62    |
|Mississippi Mermaid       |NULL                  |NULL       |NULL  |
|Following                 |NULL                  |7.7        |77.0  |
|Foolish                   |NULL                  |3.8        |38.0  |
|Pirates                   |25                    |5.8        |25    |
|Duel in the Sun           |86                    |7.0        |86    |
+--------------------------+----------------------+-----------+------+
```
</details>

### Checking for nulls
In Spark, null indicates missing or unknown data. To check if a column has null values, you can use:

- `isNull()`
- `isNotNull()`
- `eqNullSafe()`: compares two columns, treating null values as equal.

```python
# Check if Rotten_Tomatoes_Rating is null
check_nulls = df.select(col("Title")
               ,col("Rotten_Tomatoes_Rating"),col("IMDB_Rating")
               ,coalesce(col("Rotten_Tomatoes_Rating")
               , col("IMDB_Rating") * 10).alias("Rating")).where(col("Rating").isNotNull())
check_nulls.show(10, False)
```
<details>
<summary>Output: You will see only rows where `Rating` is not null.</summary>
```
+--------------------------+----------------------+-----------+------+
|Title                     |Rotten_Tomatoes_Rating|IMDB_Rating|Rating|
+--------------------------+----------------------+-----------+------+
|The Land Girls            |NULL                  |6.1        |61.0  |
|First Love, Last Rites    |NULL                  |6.9        |69.0  |
|I Married a Strange Person|NULL                  |6.8        |68.0  |
|Pirates                   |13                    |5.8        |13    |
|Slam                      |62                    |3.4        |62    |
|Following                 |NULL                  |7.7        |77.0  |
|Foolish                   |NULL                  |3.8        |38.0  |
|Pirates                   |25                    |5.8        |25    |
|Duel in the Sun           |86                    |7.0        |86    |
+--------------------------+----------------------+-----------+------+
```
</details>
---

```python
# Check for equi-null safe join

df_eq_null_safe = df.filter(col("IMDB_Rating").eqNullSafe("Rotten_Tomatoes_Rating"))
df_eq_null_safe.show()
```

<details>
<summary>Output: You will see only rows where `IMDB_Rating` is equal to `Rotten_Tomatoes_Rating`.</summary>
```python
+-----------+----------+------------+----------------------+------+-------------------+
|IMDB_Rating|IMDB_Votes|Release_Date|Rotten_Tomatoes_Rating|Source|              Title|
+-----------+----------+------------+----------------------+------+-------------------+
|       NULL|      NULL|   15-Jan-99|                  NULL|  NULL|Mississippi Mermaid|
+-----------+----------+------------+----------------------+------+-------------------+
```
</details>

### Nulls when ordering columns

When you order a DataFrame in Spark, null handling can change your result. By default, Spark sorts `nulls first in ascending order` and `last in descending order`.

1. `asc_nulls_first`: Ascending order, placing nulls at the top.
2. `asc_nulls_last`: Ascending order, placing nulls at the bottom.
3. `desc_nulls_first`: Descending order, placing nulls at the top.
4. `desc_nulls_last`: Descending order, placing nulls at the bottom


```python
# Move nulls to the end in descending order

move_nulls_to_end = df.orderBy(col("Rotten_Tomatoes_Rating").desc_nulls_last())
move_nulls_to_end.show()
```
<details>
<summary>Output: You will see the rows ordered by `Rotten_Tomatoes_Rating` with nulls at the end.</summary>
```
+-----------+----------+------------+----------------------+-------------------+--------------------+
|IMDB_Rating|IMDB_Votes|Release_Date|Rotten_Tomatoes_Rating|             Source|               Title|
+-----------+----------+------------+----------------------+-------------------+--------------------+
|        7.0|      2906|   31-Dec-46|                    86|               NULL|     Duel in the Sun|
|        3.4|       165|    9-Oct-98|                    62|Original Screenplay|                Slam|
|        5.8|      3275|    1-Jul-86|                    25|               NULL|             Pirates|
|        5.8|      3275|    1-Jul-86|                    13|               NULL|             Pirates|
|        6.9|       207|    7-Aug-98|                  NULL|               NULL|First Love, Last ...|
|       NULL|      NULL|   15-Jan-99|                  NULL|               NULL| Mississippi Mermaid|
|        7.7|     15133|    4-Apr-99|                  NULL|               NULL|           Following|
|        6.8|       865|   28-Aug-98|                  NULL|               NULL|I Married a Stran...|
|        3.8|       353|    9-Apr-99|                  NULL|Original Screenplay|             Foolish|
|        6.1|      1071|   12-Jun-98|                  NULL|               NULL|      The Land Girls|
+-----------+----------+------------+----------------------+-------------------+--------------------+
```
</details>


### Replace nulls with a value
Spark provides multiple ways to replace null values:

- `DataFrame.na.fill(value, subset=None)` – Fill null values in specified columns.
- `DataFrame.fillna(value, subset=None)` – Same as na.fill, a common alias.


```python
# Replace nulls with a value for Source column
replace_nulls = df.na.fill("Un Source",["Source"])
replace_nulls.show(5, False)
```
<details>
<summary>Output: You will see the rows with nulls in the `Source` column replaced with `Un Source`.</summary>
```
+-----------+----------+------------+----------------------+-------------------+--------------------------+
|IMDB_Rating|IMDB_Votes|Release_Date|Rotten_Tomatoes_Rating|Source             |Title                     |
+-----------+----------+------------+----------------------+-------------------+--------------------------+
|6.1        |1071      |12-Jun-98   |NULL                  |Un Source          |The Land Girls            |
|6.9        |207       |7-Aug-98    |NULL                  |Un Source          |First Love, Last Rites    |
|6.8        |865       |28-Aug-98   |NULL                  |Un Source          |I Married a Strange Person|
|5.8        |3275      |1-Jul-86    |13                    |Un Source          |Pirates                   |
|3.4        |165       |9-Oct-98    |62                    |Original Screenplay|Slam                      |
+-----------+----------+------------+----------------------+-------------------+--------------------------+
```
</details>

```python
# Replacing multiple columns with nulls

fill_values = {
    "IMDB_Rating": 0.0,
    "IMDB_Votes":  0,
    "Source":      "Unknown Source"
}

df_fill_multiple = df.na.fill(fill_values)
df_fill_multiple.show(5, False)
```
<details>
<summary>Output: You will see the rows with nulls in the specified columns replaced with the provided values.</summary>
```
+-----------+----------+------------+----------------------+-------------------+--------------------------+
|IMDB_Rating|IMDB_Votes|Release_Date|Rotten_Tomatoes_Rating|Source             |Title                     |
+-----------+----------+------------+----------------------+-------------------+--------------------------+
|6.1        |1071      |12-Jun-98   |NULL                  |Unknown Source     |The Land Girls            |
|6.9        |207       |7-Aug-98    |NULL                  |Unknown Source     |First Love, Last Rites    |
|6.8        |865       |28-Aug-98   |NULL                  |Unknown Source     |I Married a Strange Person|
|5.8        |3275      |1-Jul-86    |13                    |Unknown Source     |Pirates                   |
|3.4        |165       |9-Oct-98    |62                    |Original Screenplay|Slam                      |
+-----------+----------+------------+----------------------+-------------------+--------------------------+
```
</details>

### Remove nulls
Sometimes you might want to drop rows that contain any null or all nulls, or conditionally drop rows with null in specific columns.

Example 1:
```python
# Drop rows with all null values

df_drop_any = df.na.drop("any") # "any" means if any column in the row has null, that row is dropped.
df_drop_any.show(5, False)
```

<details>
<summary>Output: You will see the rows with any null values dropped.</summary>
```
+-----------+----------+------------+----------------------+-------------------+-----+
|IMDB_Rating|IMDB_Votes|Release_Date|Rotten_Tomatoes_Rating|             Source|Title|
+-----------+----------+------------+----------------------+-------------------+-----+
|        3.4|       165|    9-Oct-98|                    62|Original Screenplay| Slam|
+-----------+----------+------------+----------------------+-------------------+-----+
```
</details>

Example 2:
```python
# Drop rows with all null values
df_drop_all = df.na.drop("all") # "all" means a row must have all columns as null to be dropped.
df_drop_all.show()
```
<details>
<summary>Output: You will see the rows with all null values dropped.</summary>
```
+-----------+----------+------------+----------------------+-------------------+--------------------------+
|IMDB_Rating|IMDB_Votes|Release_Date|Rotten_Tomatoes_Rating|Source             |Title                     |
+-----------+----------+------------+----------------------+-------------------+--------------------------+
|6.1        |1071      |12-Jun-98   |NULL                  |NULL               |The Land Girls            |
|6.9        |207       |7-Aug-98    |NULL                  |NULL               |First Love, Last Rites    |
|6.8        |865       |28-Aug-98   |NULL                  |NULL               |I Married a Strange Person|
|5.8        |3275      |1-Jul-86    |13                    |NULL               |Pirates                   |
|3.4        |165       |9-Oct-98    |62                    |Original Screenplay|Slam                      |
+-----------+----------+------------+----------------------+-------------------+--------------------------+
```
</details>

Example 3:
```python
# Drop rows if "IMDB_Rating" or "IMDB_Votes" is null

df_drop_subset = df.na.drop("any", subset=["IMDB_Rating", "IMDB_Votes"])
df_drop_subset.show()
```
<details>
<summary>Output: You will see the rows with null values in `IMDB_Rating` or `IMDB_Votes` dropped.</summary>
```python
+-----------+----------+------------+----------------------+-------------------+--------------------+
|IMDB_Rating|IMDB_Votes|Release_Date|Rotten_Tomatoes_Rating|             Source|               Title|
+-----------+----------+------------+----------------------+-------------------+--------------------+
|        6.1|      1071|   12-Jun-98|                  NULL|               NULL|      The Land Girls|
|        6.9|       207|    7-Aug-98|                  NULL|               NULL|First Love, Last ...|
|        6.8|       865|   28-Aug-98|                  NULL|               NULL|I Married a Stran...|
|        5.8|      3275|    1-Jul-86|                    13|               NULL|             Pirates|
|        3.4|       165|    9-Oct-98|                    62|Original Screenplay|                Slam|
|        7.7|     15133|    4-Apr-99|                  NULL|               NULL|           Following|
|        3.8|       353|    9-Apr-99|                  NULL|Original Screenplay|             Foolish|
|        5.8|      3275|    1-Jul-86|                    25|               NULL|             Pirates|
|        7.0|      2906|   31-Dec-46|                    86|               NULL|     Duel in the Sun|
+-----------+----------+------------+----------------------+-------------------+--------------------+
```
</details>

### Special Null functions

1. **equal_null**: Returns `true` if both expressions are equal (including both being `NULL`), else `false`.  
2. **ifnull**: Returns the second expression if the first is `NULL`, otherwise returns the first. Same as `coalesce`. 
3. **nvl**: Same as `ifnull`—substitutes a `NULL` value with a provided fallback. Same as `coalesce`.
4. **nullif**: Returns `NULL` if both expressions match, otherwise returns the first expression.  
5. **nvl2**: Returns the second expression if the first is not `NULL`, otherwise returns the third.

```python
special_nulls = df.selectExpr(
    "Title",
    "Rotten_Tomatoes_Rating",
    "IMDB_Rating",
    "equal_null(Rotten_Tomatoes_Rating, IMDB_Rating) as equal_null",
    "ifnull(Rotten_Tomatoes_Rating, IMDB_Rating * 10) as if_null", 
    "nvl(Rotten_Tomatoes_Rating, IMDB_Rating * 10) as nvl",
    "nullif(Rotten_Tomatoes_Rating, IMDB_Rating * 10) as nullif",
    "nvl2(Rotten_Tomatoes_Rating, IMDB_Rating * 10, 0.0)" # if (first != null) second else third
)

special_nulls.show(10, False)
```
<details>
<summary>Output: You will see the special null functions applied to the columns.</summary>
```
+--------------------------+----------------------+-----------+----------+-------+----+------+----+
|Title                     |Rotten_Tomatoes_Rating|IMDB_Rating|equal_null|if_null|nvl |nullif|nvl2|
+--------------------------+----------------------+-----------+----------+-------+----+------+----+
|The Land Girls            |NULL                  |6.1        |false     |61.0   |61.0|NULL  |0.0 |
|First Love, Last Rites    |NULL                  |6.9        |false     |69.0   |69.0|NULL  |0.0 |
|I Married a Strange Person|NULL                  |6.8        |false     |68.0   |68.0|NULL  |0.0 |
|Pirates                   |13                    |5.8        |false     |13     |13  |13    |58.0|
|Slam                      |62                    |3.4        |false     |62     |62  |62    |34.0|
|Mississippi Mermaid       |NULL                  |NULL       |true      |NULL   |NULL|NULL  |0.0 |
|Following                 |NULL                  |7.7        |false     |77.0   |77.0|NULL  |0.0 |
|Foolish                   |NULL                  |3.8        |false     |38.0   |38.0|NULL  |0.0 |
|Pirates                   |25                    |5.8        |false     |25     |25  |25    |58.0|
|Duel in the Sun           |86                    |7.0        |false     |86     |86  |86    |70.0|
+--------------------------+----------------------+-----------+----------+-------+----+------+----+
```
</details>

## Conclusion

Putting all together - 

| **Function / Operation**                            | **One-Line Explanation**                                                                                       |
|------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| **coalesce(expr1, expr2, …)**                       | Returns the first non-null expression in the list.                                                             |
| **isNull(column)**                                   | Checks if the column’s value is null, returning a boolean.                                                     |
| **isNotNull(column)**                                | Checks if the column’s value is not null, returning a boolean.                                                 |
| **eqNullSafe(col1, col2)** or **col1 `<=>` col2**      | Returns `true` if `col1` equals `col2` or both are null, otherwise `false`.                                    |
| **ifnull(expr1, expr2)**                            | Returns `expr2` if `expr1` is null, otherwise returns `expr1`.                                                |
| **nvl(expr1, expr2)**                               | Same as `ifnull`: substitutes `expr2` when `expr1` is null.                                                    |
| **nullif(expr1, expr2)**                            | Returns `NULL` if `expr1` equals `expr2`, otherwise returns `expr1`.                                           |
| **nvl2(expr1, expr2, expr3)**                       | Returns `expr2` if `expr1` is not null, otherwise returns `expr3`.                                             |
| **fillna / na.fill(value[, subset])**               | Replaces null values in specified columns (or all) with a given value.                                         |
| **dropna / na.drop([how, subset])**                 | Removes rows containing null values (based on any/all columns or a subset).                                    |
| **asc_nulls_first / asc_nulls_last** (when sorting) | Orders rows ascending, placing nulls either first or last.                                                     |
| **desc_nulls_first / desc_nulls_last** (when sorting)| Orders rows descending, placing nulls either first or last.                                                    |

I hope you enjoyed reading this blog on handling nulls in Spark, if you are interested in more such content, do check out [Apache Spark](/blog/tags/apache-spark). series.

If you have any questions or feedback, feel free to reach out to me.
