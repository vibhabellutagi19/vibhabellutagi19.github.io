---
title: "DNS Record Types Explained"
date: "Jan 26, 2026"
excerpt: "Learn about different DNS record types and their uses, including A, AAAA, CNAME, NS, MX, and TXT records, in this comprehensive guide"
slug: "dns-record-types"
tags: "networking, hashnode"
---

Have you ever wondered how your browser knows where to find website? There are billions of websites on the internet, each one stored on a server somewhere in the world. So when you type [`amazon.com`](http://amazon.com), how does your browser know exactly where to go?

Every website has an IP address (like `192.0.2.1`), but nobody wants to memorise numbers. DNS (Domain Name System) is the internet's phonebook, it translates human-friendly names into machine-readable addresses. When you type a domain, your browser asks a DNS server: "What's the address for this name?" The server looks it up and responds. Your browser then connects to that IP address. All of this happens in milliseconds, invisibly.

## Why records exists?

Think about a contact in your phone. You don't just store one piece of information, you save their mobile number, work number, email, maybe even their home address. Each serves a different purpose, but they all belong to the same person.

DNS records work the same way. A domain name isn't just one thing, it's an identity that needs to handle multiple jobs. Your website needs to load. Emails need to arrive. Subdomains need to work. Security needs to be verified. A single IP address can't communicate all of that.

That's why DNS uses **records**, different types of entries that tell the internet how to handle different requests for your domain.

## Types of DNS records

### A Record

A → “Address”, the most fundamental type of DNS record type. It contains the IP address of a given domain. When a [DNS resolver](https://vibhavaribellutagi.hashnode.dev/how-dns-resolution-works) queries for a domain name, the A record returns the 32-bit IPV4 address attached to it.

```
example.com.    3600    IN    A           93.184.216.34
```

-   TTL (Time To Live): 3600 seconds
    
-   Class: IN (Internet)
    
-   Type: A
    
-   Value: IPv4 address
    

Majority of websites will have only one A record, however some high profile websites might have several different A records as a part of technique called round robin load balancing.

Imagine you're looking up "Krishna's Kapi Shop" in a city directory. The A Record is like finding the entry that says "Krishna's Kapi Shop → 742 Evergreen Terrace." When you want to visit (send a request), you now know exactly which building (server) to go to. Without this address, you know the name but can't find the actual location.

#### When and Why Used

-   **Primary use**: Pointing your domain to your web server
    
-   **When**: Every website needs at least one A Record for the root domain
    
-   **Why**: Without it, browsers can't find your website - they need the IP address to establish a connection
    
-   **Example scenario**: You host your website on a server at IP 203.0.113.50. You create an A Record so [`mysite.com`](http://mysite.com) points to that IP
    

### AAAA Record

An AAAA Record maps a domain name to a 128-bit IPv6 address. It's functionally identical to an A Record but uses the newer IPv6 addressing scheme. The "AAAA" name comes from IPv6 addresses being four times larger than IPv4 (128 bits vs 32 bits).

```
example.com. 3600 IN AAAA 2001:0db8:85a3:0000:0000:8a2e:0370:7334
```

Think of international phone numbers. The old system had 7-digit local numbers (IPv4), but we ran out. Now we have longer international format numbers with country codes and more digits (IPv6): +1-555-0123-4567-8901. Both get you to the same place, just different numbering systems.

### When and Why Used

-   **Primary use**: Enabling IPv6 connectivity to your services
    
-   **When**: Increasingly necessary as IPv4 addresses are exhausted; major sites have both A and AAAA records
    
-   **Why**: Future-proofing your infrastructure; some networks are IPv6-only; better performance in IPv6 networks
    
-   **Example scenario**: Your hosting provider gives you an IPv6 address. You add an AAAA Record so visitors on IPv6 networks can reach you directly without IPv4 translation
    

### **CNAME Record**

The GitHub Pages -

**Default Setup -** When I create a GitHub Pages site, GitHub automatically hosts it at:

-   Personal site: `username.github.io`
    
-   Project site: `username.github.io/repository-name`
    

**Example**: Lets say my GitHub username is `vibhavari`, so your site lives at `vibhavari.github.io`

**The Problem?**

You want your professional blog at `www.vibhavari.com` instead of `vibhavari.github.io` because:

-   Custom domain looks more professional
    
-   Easier to remember
    
-   You control the branding
    
-   You can migrate away from GitHub Pages later without breaking links
    

* * *

#### How CNAME Solves This

GitHub's Infrastructure GitHub Pages hosts your content on their servers with a generic address:

-   Your content actually lives at: `vibhavari.github.io`
    
-   GitHub's servers are at specific IP addresses they control
    

In your DNS provider (Cloudflare, GoDaddy, Route53, etc.), you create:

```
www.vibhavari.com.  3600  IN  CNAME  vibhavari.github.io.
```

this means:

-   "When someone visits `www.vibhavari.com`, go look up `vibhavari.github.io` instead"
    
-   The DNS resolver follows the chain: `www.vibhavari.com` → `vibhavari.github.io` → (GitHub's A records) → IP address
    

In your GitHub repository settings, you tell GitHub:

-   "Accept traffic for `www.vibhavari.com`"
    
-   GitHub creates a `CNAME` file in your repository root containing: `www.vibhavari.com`
    

So what does CNAME record do? A CNAME Record creates an alias by mapping one domain name to another domain name (the canonical name). When a DNS resolver encounters a CNAME, it performs another lookup for the target domain. CNAMEs cannot coexist with other record types at the same name level (this is a critical DNS protocol requirement).

:::warning
You CANNOT have a CNAME at the root domain (`example.com`) - only subdomains (`www.example.com`, `blog.example.com`, etc.)
:::

### NS Record

An NS Record delegates a DNS zone to a specific `authoritative name server.` It tells DNS resolvers which server(s) are authoritative for answering queries about a particular domain. Every domain must have at least two NS records (for redundancy) pointing to name servers that host the domain's DNS information.

```
example.com. 86400 IN NS ns1.nameserver.com.
```

Think of a **corporate directory**: The main receptionist doesn't know everyone's extension. When you call asking for the Marketing department, they say: "Marketing is handled by Extension 5000, transfer there." The NS Record is that transfer.

### When and Why Used

-   **Primary use**: Delegating DNS authority for a domain or subdomain
    
-   **When**: Setting up a domain, delegating subdomains to different DNS providers, using a CDN
    
-   **Why**: Enables distributed DNS management; allows different teams/services to control their own subdomains
    
-   **Example scenario 1**: You register [`example.com`](http://example.com) at a registrar. You must point NS records to your DNS hosting provider (like Cloudflare, Route53, etc.)
    

### **MX Record**

An MX Record specifies the mail servers responsible for accepting email on behalf of a domain. It includes a priority value (lower numbers = higher priority) to enable fallback mail servers. When someone sends email to [`user@example.com`](mailto:user@example.com), their mail server queries the MX records to find where to deliver the message.

```
example.com. 3600 IN MX 10 mail1.example.com.
```

-   Priority: 10 (lower is preferred)
    
-   Mail server: [mail1.example.com](http://mail1.example.com)
    

Think of a **corporate mail room hierarchy**. Your company receives physical mail, but there's a priority system:

-   **Priority 10**: Main mail room (handles 95% of mail) - [`mail1.example.com`](http://mail1.example.com)
    
-   **Priority 20**: Backup mail room (if main is full/closed) - [`mail2.example.com`](http://mail2.example.com)
    
-   **Priority 30**: Emergency off-site facility - [`mail3.example.com`](http://mail3.example.com)
    

The postal service tries the Priority 10 location first. If it's unavailable, they try Priority 20, and so on.

### When and Why Used

-   **Primary use**: Directing email to the correct mail servers
    
-   **When**: Setting up email for your domain; using email services like Google Workspace, Microsoft 365
    
-   **Why**: Separates email infrastructure from web hosting; enables redundancy and load balancing for email
    
-   You use Google Workspace for email. You create MX records:
    

```
  example.com. IN MX 1 aspmx.l.google.com.
  example.com. IN MX 5 alt1.aspmx.l.google.com.
  example.com. IN MX 5 alt2.aspmx.l.google.com.
```

If the primary server is down, email automatically routes to backups.

### **TXT Record**

A TXT Record stores arbitrary text data associated with a domain. Though originally intended for human-readable notes, TXT records are now primarily used for machine-readable data like domain verification, email security policies (SPF, DKIM, DMARC), and site ownership verification. The data is stored as a string (up to 255 characters per string, but multiple strings can be concatenated).

```
example.com. 3600 IN TXT "v=spf1 include:_spf.google.com ~all"
```

Think of a bulletin board outside your house with various notices:

-   "This is indeed the Johnson residence" (domain verification)
    
-   "We only accept mail from USPS and FedEx" (SPF)
    
-   "Packages should be left with neighbor at #125" (special instructions)
    

### When and Why Used

-   **Primary use**: Domain verification, email authentication, security policies
    
-   **When**: Proving domain ownership, preventing email spoofing, setting up third-party services
    
-   **Why**: Provides a flexible mechanism for adding metadata to domains without creating new DNS record types
    

**Common Use Cases:**

**1\. Domain Verification**

-   **When**: Setting up Google Workspace, Microsoft 365, or any service that needs to verify you own the domain
    
-   **Example**: [`example.com`](http://example.com)`. IN TXT "google-site-verification=abc123xyz"`
    
-   **Why**: Proves you control the domain before the service activates
    

**2\. SPF (Sender Policy Framework)**

-   **When**: Configuring email to prevent spoofing
    
-   **Example**: [`example.com`](http://example.com)`. IN TXT "v=spf1 ip4:192.0.2.1 include:_`[`spf.google.com`](http://spf.google.com) `~all"`
    
-   **Why**: Lists which servers are allowed to send email from your domain; reduces spam/phishing
    
-   **Translation**: "Only these mail servers can send email claiming to be from @[example.com](http://example.com)"
    

So in summary, if you think of it as a city:

-   **NS Records** → City charter (who governs)
    
-   **A/AAAA Records** → Building addresses (where things are)
    
-   **CNAME Records** → Street signs & aliases (how to find things)
    
-   **MX Records** → Post office system (mail delivery)
    
-   **TXT Records** → Business licenses & permits (verification & security)
    

If you like the blog, please share it with others. Follow me on [**linkedin**](https://www.linkedin.com/in/vibhavari-bellutagi/)
