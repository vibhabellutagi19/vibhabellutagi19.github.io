---
slug: columns-and-expressions
title: Columns and Expressions
authors: [me]
tags: [
        de,
        apache-spark,
    ]
keywords: [
            data engineering,
            apache spark,
            columns and expressions,
        ]
hide_table_of_contents: false
---

import SocialLinks from '@site/src/components/SocialLinks/socialLinks.js'

Apache Spark's `Column and Expression` play a big role in making your pipeline more efficient. In this Tech Byte we will look into ALL the possible ways to select columns, use built-in functions and perform calculations with column objects and expressions in PySpark. So, whether you build an ETL pipeline or doing exploratory data analysis, these techniques methods will come in handy.

<!-- truncate -->

## Columns and Experssions

In Spark, columns are not actual data; they are logical constructs—formulas, basically—that say how to calculate a value for every row in a table. These formulas by themselves don’t contain any real data, just return real values when they are applied to rows in a DataFrame. For this reason, columns can’t exist in isolation — you need a DataFrame and some of its rows for a column’s formula to be evaluated. Therefore, the creation or manipulation of columns should always occur by transforming on a DataFrame instead of on the column alone.

### Ways of Constructing the Column

There are many ways to construct and refer to columns but the simplest ways are by using the `col, column functions or expr`. `col(), column() or expr` are from package `pyspark.sql.functions`. Find the syntax below:

```python
from pyspark.sql.functions import col, column, expr
col("columnName")
column("columnName")
expr("columnName")
```

### Selecting Columns

You can select columns from a DataFrame using the `select()` method. the `select()` takes a list of column objects or expressions.

#### Setting up the Spark Session and dummy data

```python

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, column, expr

spark_session = (
    SparkSession
    .builder
    .appName("ColumnsAndExpressionsDemo")
    .config("spark.master", "local")
    .getOrCreate()
)

data = [
    {"Name": "car1", "Horsepower": 130, "Acceleration": 12.0, "Weight_in_lbs": 3504, "Year": 1970},
    {"Name": "car2", "Horsepower": 165, "Acceleration": 11.5, "Weight_in_lbs": 3693, "Year": 1970},
    {"Name": "car3", "Horsepower": 150, "Acceleration": 10.5, "Weight_in_lbs": 3436, "Year": 1970},
    {"Name": "car4", "Horsepower": 150, "Acceleration": 10.0, "Weight_in_lbs": 3761, "Year": 1970},
    {"Name": "car5", "Horsepower": 140, "Acceleration": 9.0,  "Weight_in_lbs": 3200, "Year": 1971},
    {"Name": "car6", "Horsepower": 198, "Acceleration": 8.5,  "Weight_in_lbs": 4341, "Year": 1971},
    {"Name": "car7", "Horsepower": 220, "Acceleration": 8.0,  "Weight_in_lbs": 4354, "Year": 1971},
    {"Name": "car8", "Horsepower": 215, "Acceleration": 7.5,  "Weight_in_lbs": 4312, "Year": 1972},
    {"Name": "car9", "Horsepower": 225, "Acceleration": 7.7,  "Weight_in_lbs": 4425, "Year": 1972},
    {"Name": "car10","Horsepower": 190, "Acceleration": 9.5,  "Weight_in_lbs": 3850, "Year": 1972},
]

cars_df = spark_session.createDataFrame(data)
cars_df.show()
```

#### Selecting Columns using `col` and `select`

```python
first_column = col("Name")  # return Column object

cars_df.select(
    first_column, # using Column object
    col("Acceleration"),
    column("Weight_in_lbs"),
    cars_df.Weight_in_lbs, # using dot (.) notation
    'Horsepower',       # using string-based column reference
    expr('Year')        # using Spark SQL expression
).show(10)
```

- <Highlight color="#3e6980">col("columnName") and column("columnName")</Highlight> are functionally equivalent. They create a Column object that you can pass to DataFrame transformations.
- You can also refer to columns directly by their <Highlight color="#3e6980">string name ('Horsepower')</Highlight>.
- <Highlight color="#3e6980">expr("Year")</Highlight> showcases how you can mix SQL expressions right within the select statement.

#### Performing Calculations with Columns

```python
from pyspark.sql.column import Column

simple_expression: Column = col("Weight_in_lbs")
weight_in_kgs_expression: Column = col("Weight_in_lbs") / 2.2 # performing arithmetic on columns

cars_df.select(
    col("Name"),
    col("Weight_in_lbs"),
    weight_in_kgs_expression.alias("Weight_in_kgs")
).show(5)

```

1. Spark allows you to perform arithmetic on columns just like regular Python variables.
2. alias("Weight_in_kgs") labels your computed column for clarity in the output.

#### Using `expr` to perform calculations

An expression is a set of transformations on one or more values in a record in a DataFrame. Think of it like a function that takes as input one or more column names, resolves them, and then potentially applies more expressions to create a single value for each record in the dataset.

In the simplest case, an expression, created via the `expr function`, is just a DataFrame column reference. In the simplest case, expr("someCol") is equivalent to col("someCol").

```python

print("Select with expr...")
cars_df.select(
    col("Name"),
    col("Weight_in_lbs"),
    expr("Weight_in_lbs / 2.2") # using expr to perform arithmetic
).show(5)

```

#### Using `selectExpr` 

The `select method` when you’re working with columns or expressions, and the `selectExpr method` when you’re working with expressions in strings. 

```python

cars_df.selectExpr(
    'Name',
    'Weight_in_lbs',
    'Weight_in_lbs / 2.2'
).show(5)

```

## Conclusion

Choosing between `col()`, `column()`, `expr()`, or even raw string references comes down to personal preference, readability, and complexity of your transformations. For simple column references, col() is often the most straightforward. However, if you prefer writing SQL-like expressions directly in your code or need complex SQL functions, `expr()` and `selectExpr()` provide the flexibility you need.

---
I hope this TechByte helped you understand the use of `Columns and Expressions` in Apache Spark.

If you have any questions or feedback, feel free to reach out to me on 
<SocialLinks />