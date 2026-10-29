---
title: "How DNS Resolution Works"
date: "Jan 23, 2026"
excerpt: "Understand DNS resolution, its layers, and the role of tools like `dig` in translating domain names to IP addresses effectively"
slug: "how-dns-resolution-works"
tags: "networking, hashnode"
---

Lets say we need to connect to google.com, but assume we don’t have the domain names but its all [IP address](https://en.wikipedia.org/wiki/IP_address) - a numerical label like _192.0.2.1_ which is assigned to each device connected on internet for communication. It feels difficult to remember the 10 digits phone numbers of everyone we know, remembering IP address of the websites would have been difficult task in itself. To avoid this, we have Domain Name System.

## What is DNS?

Domain Name System ( DNS ) is is a hierarchical and distributed [name service](https://en.wikipedia.org/wiki/Name_service) that provides a naming system for computers, services, and other resources on the Internet or other [Internet Protocol](https://en.wikipedia.org/wiki/Internet_Protocol) (IP) networks, in layman words - is a process where it helps internet users to search using the host names instead of numeric IP address. DNS is like a phonebook of internet, it transforms human readable host names into numeric IP address for computers to communicate through network.

As we know, each device connected to internet has a unique IP address which other machines can find and communicate to. Name resolution is process in converting hostnames ( simple english string ) to IP address for network communication. Human always understand descriptive names, but machine communication through network using IP address.

## What is the dig command and its uses

`dig` stands for Domain Information Groper, think of it as a tool that lets peek whats happening in DNS. It is a diagnostic tool, it performs interrogation with DNS name servers. It performs DNS lookups and display the answers that returned from the queries name server(s).

When you type [`google.com`](http://google.com) in your browser, DNS quietly works in the background to find the IP address. `dig` lets you manually ask those same DNS questions yourself and see all the details of what happens.

Usually DNS administrators use dig command to troubleshoot DNS problems because of its flexibility, easy to use and provides clear output.

When you run `dig google.com` you get a detailed report with sections like:

**1. Question Section** - What you asked

```
;; QUESTION SECTION:
;google.com.                    IN      A
```

Translation: "What is the A record (IP address) for google.com?"

**2. Answer Section** - The actual answer

```
;; ANSWER SECTION:
google.com.             300     IN      A       142.250.185.46
```

### The DNS Hierarchy: A Three-Tier Architecture

The sequence in which query resolves describes the hierarchial path of a DNS. The sequence is Root → TLD → Authoritative Servers.

**Root Servers** →  
The root of the DNS tree, represented by a dot (.). It is the starting point for all DNS queries. The root servers do not know the IP address of a domain but direct queries to the appropriate TLD server. There are 13 logical root server addresses, with hundreds of actual servers worldwide.

**Top-Level Domains(TLD)** →

If a website address is like a street address, the TLD is like the city, state, or country at the end. It tells you the general "location" or category that the website belongs to. Lets say, in the address [**www.google.com**](http://www.google.com), the TLD is just the **.com** part.

Why do we need them?

The internet is too big to be one giant list. TLDs help organize websites into different categories so they are easier to manage and understand.

They act like big labels that give you a hint about what a website is for:

-   **.com** usually means it is a **comm**ercial business (like Amazon or Google).
    
-   **.in** is for the India.
    
-   **.edu** means it is an **edu**cational institution (like a university).
    
-   **.gov** means it is a **gov**ernment agency.
    

**Authoritative Servers** →

Think of authoritative servers as **the official source of truth** for a specific domain, holding the actual DNS records ( A, AAAA, MX, etc ) for a specific domain name. They provide the final IP address to the resolver

```
                    [ROOT]
                      |
        +-------------+-------------+
        |             |             |
      [.com]        [.org]        [.net]  ← TLD level
        |
    +---+---+
    |       |
 [google] [facebook]  ← Authoritative level
    |
 [IP: 142.250.185.46]
```

#### Why this Layered System Exists?

**Scalability** - If one person tried to memorise every address in the world - is it ever possible? they’d fail. But if you divide the worlds into countries, then cities, then streets - each level only needs to know about their piece. The internet has billions of domain names. No single server could handle all those requests. By splitting it up, each layer handles a manageable portion.

Decentralisation - What if the master directory gets destroyed or hacked? The whole internet breaks. Instead, DNS spreads the responsibility:

-   13 root server systems (actually hundreds of physical servers)
    
-   Different organisations manage different TLDs (.com, .org, .uk, etc.)
    
-   Individual companies manage their own authoritative servers
    

If one piece fails, the rest keep working.

| command | what you’re Asking | what it reveals | DNS Layer | when to use |
| --- | --- | --- | --- | --- |
| `dig . NS` | Who runs the root of DNS? | The 13 root server identifiers ([a-m.root-servers.net](http://a-m.root-servers.net)) | **Layer 0: Root** | Learning DNS fundamentals; Understanding the starting point |
| `dig com NS` | Who manages .com domains? | TLD name servers for .com ([a-m.gtld-servers.net](http://a-m.gtld-servers.net)) | Layer 1: TLD | Understanding TLD infrastructure; Troubleshooting domain registration issues |
| `dig` [`google.com`](http://google.com) `NS` | Who are Google's official DNS servers? | Google's authoritative name servers ([ns1-4.google.com](http://ns1-4.google.com)) | Layer 2: Authoritative | Finding who hosts a domain's DNS; Verifying DNS configuration; Planning DNS migrations |
| `dig` [`google.com`](http://google.com) | What's Google's IP address? | The actual IP address (142.250.185.46) | Layer 3: Resolution | Normal DNS lookups; Troubleshooting connectivity; Verifying DNS changes went live |

### Behind the Scenes: How Recursive Resolvers Work

A recursive DNS server is a key part of DNS hierarchy, which handles the domain lookups. Let’s see how the recursive DNS works behind the scenes:

1.  `Request initiated` → When you type a website URL (e.g., `www.asample.com`) into your browser, your device sends a request to a recursive DNS resolver to find the corresponding IP address.
    
    1.  **Cache Check**: If this URL was recently requested, the resolver checks its cache first and immediately returns the IP address if found.
2.  `Query to the Root Server` → If the IP address isn't in cache, the recursive resolver begins searching through the DNS hierarchy starting with root DNS servers.
    
    -   Root servers don't store domain IP addresses, but they direct the resolver to the appropriate Top-Level Domain (TLD) server based on the domain extension.
3.  `Querying the TLD Server` → The TLD server manages all domains within a specific extension (`.com`, `.in`, etc.) and directs the recursive resolver to the authoritative DNS server responsible for the specific domain.
    
4.  `Querying the authoritative DNS server:` → The authoritative server holds the official DNS records for the domain, including the IP address. It responds with the exact IP address for the requested domain.
    
5.  `Returning the result to your device` **→** The recursive DNS resolver returns the IP address to your device, allowing your browser to connect to the website. The resolver also caches this IP address temporarily to speed up future requests for the same domain.
    

![](assets/image-1.png)

## Conclusion

The DNS resolution process efficiently translates domain names into IP addresses through a hierarchical lookup system. While multiple servers are involved, caching at each level ensures most requests are resolved within milliseconds. This distributed architecture makes DNS both scalable and reliable, serving as the foundational addressing system that keeps the internet accessible and performant for billions of users worldwide.

If you like the blog, please share it with others. Follow me on [linkedin](https://www.linkedin.com/in/vibhavari-bellutagi/)
