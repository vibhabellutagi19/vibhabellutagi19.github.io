---
title: "DNS Record Types Explained"
date: "Jan 26, 2026"
excerpt: "Pointing a domain at your website takes one DNS record. Receiving email takes another. Proving to Google you own it takes a third. A, AAAA, CNAME, NS, MX and TXT records, and the job each one does."
slug: "dns-record-types"
tags: "networking, hashnode"
---

Say you buy `vibhavari.com` for your blog. Pointing it at your website takes one DNS record. Receiving email at `hello@vibhavari.com` takes a different one. Proving to Google that you own the domain takes a third.

One domain, three jobs, three different records.

> A domain isn't one address. It's a set of records, and each record answers a different question about it.

In [How DNS Resolution Works](/blog/how-dns-resolution-works) we followed a lookup down to the authoritative server that "holds the records". This post is about those records: the six types you'll actually use, what each one does, and when you need it.

## One Domain, Many Jobs

Think about a contact in your phone. You don't store just one piece of information: you save their mobile number, work number, email, maybe their home address. Each one serves a different purpose, but they all belong to the same person.

DNS records work the same way. Your website needs to load. Emails need to arrive. Subdomains need to work. Ownership needs to be verified. A single IP address can't express all of that, so DNS stores **records**: different types of entries that tell the internet how to handle different requests for your domain.

## A Record: Name → IPv4 Address

A → "Address", the most fundamental record type. It maps a domain to an IPv4 address. When a [DNS resolver](/blog/how-dns-resolution-works) asks for a domain's address, the A record returns the 32-bit IPv4 address attached to it.

```
example.com.    3600    IN    A           93.184.216.34
```

-   TTL (Time To Live): 3600 seconds
-   Class: IN (Internet)
-   Type: A
-   Value: IPv4 address

Most websites have a single A record, but some high-traffic sites have several, and resolvers rotate between them as a simple form of load balancing (round robin).

Imagine you're looking up "Krishna's Kapi Shop" in a city directory. The A record is the entry that says "Krishna's Kapi Shop → 742 Evergreen Terrace." Now you know exactly which building (server) to go to. Without it, you know the name but can't find the place.

#### When and Why Used

-   **Primary use**: Pointing your domain to your web server
-   **When**: Every website needs at least one A record for the root domain (or an AAAA record for IPv6)
-   **Why**: Without it, browsers can't find your website; they need the IP address to connect
-   **Example scenario**: You host your website on a server at IP 203.0.113.50. You create an A record so `mysite.com` points to that IP

## AAAA Record: Name → IPv6 Address

An AAAA record maps a domain name to a 128-bit IPv6 address. It works exactly like an A record, but for the newer IPv6 addressing scheme. The name comes from IPv6 addresses being four times larger than IPv4 (128 bits vs 32 bits).

```
example.com. 3600 IN AAAA 2001:0db8:85a3:0000:0000:8a2e:0370:7334
```

Think of phone numbers. The old system had short local numbers (IPv4), and we ran out. Now there are longer numbers with country codes and more digits (IPv6). Both get you to the same place; they're just different numbering systems.

#### When and Why Used

-   **Primary use**: Making your services reachable over IPv6
-   **When**: Increasingly necessary as IPv4 addresses run out; major sites have both A and AAAA records
-   **Why**: Some networks are IPv6-only, and IPv6 clients can reach you directly without translation
-   **Example scenario**: Your hosting provider gives you an IPv6 address. You add an AAAA record so visitors on IPv6 networks can reach you directly

## CNAME Record: Name → Another Name

CNAME is easiest to understand with a common setup: a blog on GitHub Pages.

**The default.** GitHub hosts every Pages site at its own address:

-   Personal site: `username.github.io`
-   Project site: `username.github.io/repository-name`

Say my GitHub username is `vibhavari`. Then my site lives at `vibhavari.github.io`.

**The problem.** I want my blog at `www.vibhavari.com` instead, because:

-   A custom domain looks more professional
-   It's easier to remember
-   I control the branding
-   I can move away from GitHub Pages later without breaking links

#### How CNAME Solves This

My content actually lives at `vibhavari.github.io`, on servers whose IP addresses GitHub controls, and can change. I don't want to copy those IPs into my DNS. I want to say "`www.vibhavari.com` is whatever `vibhavari.github.io` is".

That's exactly a CNAME. In the DNS provider (Cloudflare, GoDaddy, Route53, etc.), I create:

```
www.vibhavari.com.  3600  IN  CNAME  vibhavari.github.io.
```

This means:

-   "When someone asks for `www.vibhavari.com`, look up `vibhavari.github.io` instead"
-   The resolver follows the chain: `www.vibhavari.com` → `vibhavari.github.io` → (GitHub's A records) → IP address

Then, in the repository settings, I tell GitHub to accept traffic for `www.vibhavari.com`, and GitHub adds a `CNAME` file containing `www.vibhavari.com` to the repository root.

So a CNAME record creates an alias: it maps one domain name to another (the canonical name). When a resolver meets a CNAME, it performs another lookup for the target. If GitHub changes its IPs tomorrow, my site keeps working.

:::warning
You CANNOT have a CNAME at the root domain (`example.com`) - only subdomains (`www.example.com`, `blog.example.com`, etc.). A CNAME can't share its name with any other record, and the root domain always needs NS records.
:::

## NS Record: Who Answers for This Domain

An NS record delegates a DNS zone to a specific `authoritative name server`. It tells resolvers which servers are allowed to answer questions about a domain. Every domain should have at least two NS records, for redundancy.

```
example.com. 86400 IN NS ns1.nameserver.com.
```

Think of a **corporate directory**: the main receptionist doesn't know everyone's extension. When you ask for Marketing, they say: "Marketing is handled by extension 5000, let me transfer you." The NS record is that transfer.

#### When and Why Used

-   **Primary use**: Delegating DNS authority for a domain or subdomain
-   **When**: Setting up a domain, delegating subdomains to different DNS providers, using a CDN
-   **Why**: Lets different teams or services control their own part of a domain
-   **Example scenario**: You register `example.com` at a registrar, then point its NS records to your DNS hosting provider (like Cloudflare or Route53)

## MX Record: Where Email Goes

An MX record names the mail servers that accept email for a domain. Each has a priority value (lower number = tried first), which allows fallback servers. When someone sends email to `user@example.com`, their mail server looks up the MX records to find where to deliver it.

```
example.com. 3600 IN MX 10 mail1.example.com.
```

-   Priority: 10 (lower is preferred)
-   Mail server: `mail1.example.com`

Think of a **company mail room with backups**:

-   **Priority 10**: Main mail room - `mail1.example.com`
-   **Priority 20**: Backup mail room, if the main one is closed - `mail2.example.com`
-   **Priority 30**: Emergency off-site facility - `mail3.example.com`

The postal service tries the priority 10 location first. If it's unavailable, it tries priority 20, and so on.

#### When and Why Used

-   **Primary use**: Directing email to the correct mail servers
-   **When**: Setting up email for your domain, for example with Google Workspace or Microsoft 365
-   **Why**: Keeps email separate from web hosting, and gives you redundancy
-   **Example scenario**: You use Google Workspace for email, so you create MX records:

```
  example.com. IN MX 1 aspmx.l.google.com.
  example.com. IN MX 5 alt1.aspmx.l.google.com.
  example.com. IN MX 5 alt2.aspmx.l.google.com.
```

If the primary server is down, email automatically goes to the backups.

## TXT Record: Notes for Machines

A TXT record stores arbitrary text on a domain. It was originally meant for human-readable notes, but today it's mostly used for machine-readable data: domain verification and email security policies (SPF, DKIM, DMARC). Each string can be up to 255 characters, and several strings can be combined.

```
example.com. 3600 IN TXT "v=spf1 include:_spf.google.com ~all"
```

Think of a notice board outside your house:

-   "This is indeed the Johnson residence" (domain verification)
-   "We only accept mail from USPS and FedEx" (SPF)
-   "Packages should be left with neighbor at #125" (special instructions)

#### When and Why Used

-   **Primary use**: Domain verification, email authentication, security policies
-   **When**: Proving domain ownership, preventing email spoofing, setting up third-party services
-   **Why**: A flexible way to attach data to a domain without inventing new record types

**Common Use Cases:**

**1\. Domain Verification**

-   **When**: Setting up Google Workspace, Microsoft 365, or any service that needs proof you own the domain
-   **Example**: `example.com. IN TXT "google-site-verification=abc123xyz"`
-   **Why**: Proves you control the domain before the service activates

**2\. SPF (Sender Policy Framework)**

-   **When**: Configuring email to prevent spoofing
-   **Example**: `example.com. IN TXT "v=spf1 ip4:192.0.2.1 include:_spf.google.com ~all"`
-   **Why**: Lists which servers may send email for your domain, which reduces spam and phishing
-   **Translation**: "Only these mail servers can send email claiming to be from @example.com"

## The Whole Domain as a City

-   **NS Records** → City charter (who governs)
-   **A/AAAA Records** → Building addresses (where things are)
-   **CNAME Records** → Street signs & aliases (how to find things)
-   **MX Records** → Post office system (mail delivery)
-   **TXT Records** → Business licenses & permits (verification & security)

So back to `vibhavari.com`: a CNAME for the blog, MX records for email, a TXT record for Google, and NS records saying who answers for all of them. One domain, a different record for every job.

More posts on [networking](/blog/tags/networking/).
