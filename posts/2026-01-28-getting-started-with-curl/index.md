---
title: "Getting Started with cURL"
date: "Jan 28, 2026"
excerpt: "When an API call fails in the browser, all you see is 'Something went wrong'. One terminal command sends the same request and shows you everything the server sent back."
slug: "getting-started-with-curl"
tags: "networking, hashnode"
---

An API call fails in your app and the page just says "Something went wrong". Was it a 401? A 500? Did the server even get the request? The browser hides most of that.

With one terminal command you can send the same request yourself and see every line the server sent back.

> cURL is a browser without the window: it sends a request and shows you exactly what came back.

cURL (short for "Client URL") is a command-line tool for transferring data using URLs. It's free, open source, and comes pre-installed on Linux, macOS and Windows 10+. This post covers why it's worth learning, your first requests, how to read a full request and response, and the difference between GET and POST.

## Why Not Just Use the Browser?

A **server** is a computer that stores and provides information to other computers over a network, which are called **clients**. When you open a website, your browser (the client) sends a request to a web server, and the server responds with the page.

The browser is built to *show* you the result, not the conversation. But as a developer, you often want to:

-   Test an API during development
-   Automate file downloads
-   Debug what a server actually responded with
-   Write scripts that talk to web services

For all of these, you want to send a precise request and see the raw response. That's what cURL does.

### cURL: Your Command-Line Messenger

Think of cURL as a messenger that works directly from your terminal. Instead of clicking buttons in a browser, you type a command that:

1.  **Sends a request** to a server (asking for data or sending information)
2.  **Receives the response** (the data you asked for, plus details about it)
3.  **Displays the result** right in your terminal (or saves it to a file)

## Your First Request

```
curl https://api.github.com
```

This fetches data from GitHub's API and prints it in your terminal. No browser, no clicking.

## The Flags You'll Use Most

**Save output to a file:**

```
curl https://api.github.com -o output.json
```

**Send a request header:**

```
curl -H "Accept: application/json" https://api.github.com
```

**Make a POST request with data:**

```
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "age": 30}'
```

**See the response headers (and status code):**

```
curl -i https://api.github.com
```

## -v Shows the Whole Conversation

Every time you use curl, you send an HTTP **request**. A request has:

1.  Method (GET, POST, PUT, DELETE, etc.)
2.  URL (where you're sending the request)
3.  Headers (metadata about your request)
4.  Body (optional data you're sending)

The server sends back an HTTP **response** with:

1.  Status code (200 = success, 404 = not found, 500 = server error, etc.)
2.  Headers (metadata about the response)
3.  Body (the actual data/content)

The `-v` (verbose) flag shows **both**:

```
curl -v https://httpbin.org/get
```

Here's how to read what comes back:

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

This is the view the browser hides. When "Something went wrong", the status line and headers here usually tell you what.

## GET Reads, POST Sends

#### GET - "I want to read something"

GET is like asking a question or looking something up. You request information without changing anything:

-   Opening a website in your browser
-   Searching Google
-   Checking the weather
-   Looking at your bank balance

```
curl https://api.github.com/users/octocat
```

This asks: "Hey GitHub, can I see octocat's profile?" GET is curl's default, so you don't need `-X GET`.

#### POST - "I want to send or create something"

POST is like filling out a form and submitting it. You send data to create or update something:

-   Submitting a contact form
-   Creating a new social media post
-   Logging into a website
-   Uploading a file

```
curl -X POST https://httpbin.org/post \
  -d "username=john&password=secret123"
```

This says: "Hey server, here's some data I want to send you."

---

So the next time an API call fails with nothing but "Something went wrong", copy the request into `curl -v` and read what the server actually said.

More posts on [networking](/blog/tags/networking/).
