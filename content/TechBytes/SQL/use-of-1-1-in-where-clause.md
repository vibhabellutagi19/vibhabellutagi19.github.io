# always-true condition in SQL

Have you ever wondered why do we use `1=1` in the `WHERE` clause of SQL queries? It seems like a redundant condition that always evaluates to true. But there are specific scenarios where this condition can be quite useful, we will explore them in this TechByte.

## What is WHERE clause?

The `WHERE` clause is used to filter records based on a condition. It is used to fetch only records that satisfy the condition specified in the `Where` clause.

The `WHERE` clause is commonly used in SELECT, UPDATE, DELETE, and INSERT (with subqueries) statements.

```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition;
```

## Why use 1=1 in WHERE clause?

The primary reason to include 1=1 is for <Highlight color="#3e6980">dynamic query construction</Highlight> in programmatically generated SQL queries, where `where conditions` are not always fixed. It serves as a base to simplify appending additional conditions programmatically.

:::info

WHERE `1=1` acts as a placeholder that always evaluates to TRUE.

It allows developers to append additional conditions easily without worrying about handling the logical operator (AND) explicitly.
:::

### Example

```sql

SELECT * 
FROM users 
WHERE 1=1
  AND age > 25
  AND city = 'New York';

```
In the above example, lets say we have table `users` and we want to filter users who are above 25 years and live in New York. The `1=1` condition acts as a placeholder, and additional conditions can be appended with `AND` without worrying about the logical operator.

You might wonder why we need `1=1` in the above scenario when the query works fine without it.

Right, the query works fine even without `1=1`. The use of `1=1` is **not necessary** in static queries (queries where all conditions are predefined), and including it in such cases is redundant.

### Scenario Without `1=1`:
If you're building a query programmatically, you need to handle whether the `WHERE` clause already exists when appending conditions:

```python
query = "SELECT * FROM users"
if age_filter or city_filter:
    query += " WHERE"
    if age_filter:
        query += f" age > {age_filter}"
    if city_filter:
        if age_filter:
            query += " AND"
        query += f" city = '{city_filter}'"
```
This approach introduces extra complexity for maintaining logical correctness when adding conditions.

---

### With `1=1`:
Using `1=1` eliminates the need to check if you're adding the first condition:
```python
query = "SELECT * FROM users WHERE 1=1"
if age_filter:
    query += f" AND age > {age_filter}"
if city_filter:
    query += f" AND city = '{city_filter}'"
```
This method ensures that any condition can be appended as `AND` without special handling for the first condition.

---

### Static Queries vs. Dynamic Queries
- **Static Queries**: 
  - `WHERE 1=1` adds no functional benefit.
  - Example: 
    ```sql
    SELECT * 
    FROM users 
    WHERE age > 25 AND city = 'New York';
    ```
    This is concise and efficient without `1=1`.

- **Dynamic Queries**:
  - `WHERE 1=1` simplifies query construction.
  - Example:
    ```sql
    SELECT * 
    FROM users 
    WHERE 1=1 -- Placeholder
      AND age > 25 -- Condition added dynamically
      AND city = 'New York'; -- Another dynamic condition
    ```

---
## Drawbacks of `1=1`

While `WHERE 1=1` can make query construction easier, it might not always be necessary and <Highlight color="#3e6980">could be considered redundant in static queries where conditions are predefined</Highlight>. 
Use it judiciously in contexts where it adds value, such as dynamic query building.

## Final Note
- If you're writing a **fixed/static query**, **omit `1=1`** for clarity and simplicity. 
- If you're generating queries dynamically in code, **use `1=1`** to simplify the logic of conditionally appending filters.

---

I hope this TechByte helped you understand the use of `1=1` in the `WHERE` clause of SQL queries. If you have any questions or feedback, feel free to reach out to me on [Twitter](https://x.com/buildwith_vibs).