---
title: "Getting Started with cURL"
date: "Jan 28, 2026"
excerpt: "Learn the basics of cURL, a command-line tool for data transfer and web interactions, essential for developers testing APIs and automating tasks"
slug: "getting-started-with-curl"
tags: "networking, hashnode"
---

Have you ever wondered how developers test APIs, download files, or communicate with web servers without opening a browser? The answer is **cURL** - one of the most powerful and widely-used command-line tools in a programmer's toolkit.

cURL (short for "Client URL") is a command-line tool for transferring data using URLs. Whether you're testing REST APIs, downloading files, debugging web services, or automating data transfers, cURL is your go-to solution. It's free, open-source, and comes pre-installed on most Unix-based systems (Linux and macOS) and Windows 10+.

### Why programmers need cURL

Before diving into cURL, let's understand the basics of how the internet works.

A **server** is a computer that stores and provides information to other computers over a network. These other computers are called **clients**. When you open a website, your browser (the client) sends a request to a web server, and the server responds with the webpage data.

Normally, this communication happens through a graphical interface like a web browser. But what if you want to:

-   Test an API during development?
    
-   Automate file downloads?
    
-   Debug server responses?
    
-   Write scripts that interact with web services?
    

This is where **cURL** becomes invaluable.

### cURL: Your Command-Line Messenger

Think of cURL as a messenger that works directly from your terminal. Instead of clicking buttons in a browser, you type commands that:

1.  **Send requests** to a server (asking for data or sending information)
    
2.  **Receive responses** from the server (getting the data you requested)
    
3.  **Display results** right in your terminal (or save them to files)
    

### Making your first request using cURL

```
curl https://api.github.com
```

This fetches data from GitHub's API and displays it in your terminal.

### Common curl commands to try:

**Save output to a file:**

```
curl https://api.github.com -o output.json
```

**Make a GET request with headers:**

```
curl -H "Accept: application/json" https://api.github.com
```

**Make a POST request with data:**

```
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "age": 30}'
```

**See response headers:**

```
curl -i https://api.github.com
```

### Understanding request and response

The Request (what you send) →

When you use curl, you're sending an HTTP request to a server. A request has several parts:

1.  Method (GET, POST, PUT, DELETE, etc.)
    
2.  URL (where you're sending the request)
    
3.  Headers (metadata about your request)
    
4.  Body (optional data you're sending)
    

The Response (what you get back) →

The server sends back an HTTP response with:

1.  Status code (200 = success, 404 = not found, etc.)
    
2.  Headers (metadata about the response)
    
3.  Body (the actual data/content)
    

Try this command to see **both** the request and response:

```
curl -v https://httpbin.org/get
```

The `-v` (verbose) flag shows you everything. Let me explain what you'll see:

```
> GET /get HTTP/1.1              ← REQUEST METHOD
> Host: httpbin.org               ← REQUEST HEADER
> User-Agent: curl/7.x            ← REQUEST HEADER
> Accept: */*                     ← REQUEST HEADER

< HTTP/1.1 200 OK                 ← RESPONSE STATUS
< Content-Type: application/json  ← RESPONSE HEADER
< Content-Length: 315             ← RESPONSE HEADER

{                                 ← RESPONSE BODY
  "args": {},
  "headers": {...},
  "url": "https://httpbin.org/get"
}
```

:::tip
`>` → request (what you sent) and `<` → response (what you got back)
:::

### GET and POST Methods

#### GET - "I want to read something" - It is like asking a question or looking something up. You're just requesting information without changing anything.

-   Opening a website in your browser
    
-   Searching Google
    
-   Checking the weather
    
-   Looking at your bank balance
    

**Curl example:**

```
curl https://api.github.com/users/octocat
```

This asks: "Hey GitHub, can I see octocat's profile?"

#### POST - "I want to send/create something", it is like filling out a form and submitting it. You're sending data to create or update something.

-   Submitting a contact form
    
-   Creating a new social media post
    
-   Logging into a website
    
-   Uploading a file
    

**Curl example:**

```
curl -X POST https://httpbin.org/post \
  -d "username=john&password=secret123"
```

This says: "Hey server, here's some data I want to send you."

I hope you have enough knowledge on the cURL. If you like the blog, please share it with others. Follow me on [**linkedin**](https://www.linkedin.com/in/vibhavari-bellutagi/)
