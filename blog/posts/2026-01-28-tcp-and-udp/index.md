---
title: "Networking Basics: Comparing TCP and UDP Protocols"
date: "Jan 28, 2026"
excerpt: "Discover the key differences between TCP and UDP protocols, their use cases, and why understanding them is crucial for networked applications"
slug: "tcp-and-udp"
tags: "networking, hashnode"
---

### Introduction

Every time you stream a video, send an email, or load a webpage, there's an invisible conversation happening between your device and servers across the internet. But how do these machines know how to talk to each other? The answer lies in protocols, the rules that govern network communication.

Two of the most fundamental protocols powering the internet are TCP (Transmission Control Protocol) and UDP (User Datagram Protocol). While they both move data from point A to point B, they take remarkably different approaches. In this blog, we'll pull back the curtain on how these protocols work, when to use each one, and why understanding the difference matters for anyone working with networked applications.

### What is TCP

TCP is the reliable workhorse of the internet. Think of it like sending a registered letter, you know it will arrive, you'll get confirmation, and the pages will be in the right order.

When you use TCP, your computer breaks data into small packets and sends them across the network. The receiving computer sends back acknowledgments saying "Got packet 1," "Got packet 2," and so on. If a packet goes missing, TCP notices and resends it. Before any data is sent, TCP establishes a connection through a "three-way handshake", essentially, the two computers introduce themselves and agree to communicate.

This reliability comes at a cost: TCP is slower because of all this checking and confirming. But for most internet activities, loading websites, sending emails, downloading files, you want that reliability.

![](assets/image-1.png)

### What is UDP?

→ UDP is more like shouting across a crowded room, fast and efficient, but with no guarantee anyone heard you. It is the speed demon of networking.

With UDP, data packets are simply fired off to their destination with no handshake, no acknowledgments, and no guarantees. There's no connection established beforehand. Packets might arrive out of order, get lost entirely, or even arrive duplicated, and UDP doesn't care. It just keeps sending.

This might sound terrible, but for certain applications, speed matters more than perfection. A few dropped packets in a video call or online game won't ruin the experience, but lag and delays absolutely will.

![](assets/image-2.png)

### Key differences between TCP and UDP

| TCP | UDP |
| --- | --- |
| Requires a connection (handshake) | No connection needed |
| Guarantees delivery | No guarantee |
| Packets arrive in order | Packets may arrive out of order |
| Slower ( due to handshake ) | Faster ( minimal overhead ) |
| Extensive error checking | Basic error checking |
| When accuracy matters | when speed matters |

### When to use what - TCP vs UDP?

Use TCP when:

-   Accuracy is critical – File transfers, emails, web browsing
    
-   Order matters – Loading a webpage, downloading software
    
-   You can't afford lost data – Bank transactions, text messages
    

**Examples:** HTTP/HTTPS (websites), FTP (file transfer), SMTP (email), SSH (remote access)

Use UDP when:

-   Speed is more important than perfection – Live streaming, gaming
    
-   Small amounts of data are lost – VoIP calls, video conferencing
    
-   Real-time communication matters – DNS lookups, online multiplayer games
    

**Examples:** Video streaming (Netflix, YouTube), online gaming, voice/video calls (Zoom, Discord), DNS queries

Think of it this way: If you're watching a live sports stream and a few frames drop, you barely notice. But if those frames arrived late because the protocol waited to resend them, you'd see frustrating buffering and lag.

### What is HTTP and relationship between TCP and HTTP

HTTP (Hypertext Transfer Protocol) is the language of the web, it's how your browser asks for a webpage and how the server sends it back. But here's the key: HTTP doesn't work alone. It relies on TCP to actually deliver the data.

Think of it like this:

-   **HTTP** is the _language_ being spoken ("Please send me the homepage")
    
-   **TCP** is the _delivery service_ that makes sure the message gets there reliably
    

When you type a URL in your browser:

1.  Your browser uses HTTP to format the request
    
2.  TCP breaks that request into packets and sends them
    
3.  TCP makes sure all packets arrive at the server
    
4.  The server uses HTTP to format its response
    
5.  TCP delivers that response back to you, in order and complete
    

This is why HTTP is called an "application layer" protocol, it sits on top of TCP (the "transport layer"). HTTP handles _what_ you're communicating, while TCP handles _how_ it gets there.

:::note
Modern websites use HTTPS (HTTP Secure), which adds encryption for security, but it still relies on TCP underneath for reliable delivery.
:::

If you like the blog, please share it with others. Follow me on [**linkedin**](https://www.linkedin.com/in/vibhavari-bellutagi/)
