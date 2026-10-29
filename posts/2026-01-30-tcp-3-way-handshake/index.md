---
title: "TCP Working: 3-Way Handshake & Reliable Communication"
date: "Jan 30, 2026"
excerpt: "Before your browser sends a byte of HTTP, it trades three packets with the server, and none of them carry data. They exist to agree on one thing: where to start counting."
slug: "tcp-3-way-handshake"
tags: "networking"
---

Before your browser sends a single byte of an HTTP request, it has already exchanged three packets with the server. None of them carry any data.

They exist so that both sides agree on one thing: which number each of them will start counting bytes from.

> The handshake isn't a greeting. It's how both sides synchronize sequence numbers, and every TCP guarantee is built on those numbers.

This post covers why TCP is needed at all, what can go wrong on a network, the handshake step by step, how data is acknowledged, and how a connection is closed.

## IP Makes No Promises; TCP Does

**TCP (Transmission Control Protocol)** is one of the core protocols of the Internet Protocol Suite. It runs at the Transport Layer (Layer 4) and gives applications reliable, ordered, error-checked delivery of data.

It's needed because the layer below it, the Internet Protocol (IP), is **unreliable**: packets can be lost, duplicated, delayed or arrive out of order. Applications don't want to deal with that. A developer wants to write data into a stream and trust it arrives intact.

Think of TCP as a postal service with tracking and confirmation. When you send a package, you want to know:

-   Did it arrive?
-   Did it arrive intact?
-   Did it arrive in the right order (if you sent several)?

TCP answers all three for every byte. Web browsers, email clients, file transfers and SSH all rely on it.

* * *

## Six Ways a Network Breaks Your Data

| **Problem** | **Description** | **TCP's Solution** |
| --- | --- | --- |
| **Packet Loss** | Networks are unreliable. Packets can be dropped due to network congestion, router failures, or buffer overflows. | Acknowledgments (ACKs) and retransmissions. The sender retransmits data if it doesn't receive an acknowledgment within a timeout period. |
| **Out-of-Order Delivery** | Packets can take different routes through the network and arrive in a different order than they were sent. | Sequence numbers. Each byte of data is numbered, allowing the receiver to reorder packets correctly. |
| **Data Corruption** | Bits can be flipped during transmission due to electrical interference or hardware issues. | Checksums. TCP includes a checksum in every segment to detect corrupted data. |
| **Duplicate Packets** | Network devices might accidentally send the same packet multiple times. | Sequence numbers help identify and discard duplicate packets. |
| **Flow Control** | A fast sender can overwhelm a slow receiver. | Sliding window mechanism that allows the receiver to tell the sender how much data it can handle. |
| **Congestion Control** | Too many senders can overwhelm the network itself. | Congestion control algorithms (like Slow Start, Congestion Avoidance) that detect network congestion and reduce sending rates. |

Notice how many of these rely on **sequence numbers**. That's why the connection can't start until both sides have agreed on them.

## The Handshake Is About Sequence Numbers

Imagine starting a phone call with a friend:

**You:** "Hey, can you hear me?" (This is the **SYN**: you're initiating contact)
**Friend:** "Yes, I can hear you! Can you hear me?" (This is the **SYN-ACK**: they acknowledge you AND check that you can hear them)
**You:** "Yep, I hear you too!" (This is the **ACK**: you confirm you got their response)

Now you both know the line works in both directions, and the actual conversation can start.

In TCP terms:

**Step 1: SYN (Synchronize)**

-   The client sends a segment with the **SYN flag** set
-   It includes its **initial sequence number (ISN)**, say `seq=1000`
-   Meaning: "I want to connect, and I'll start numbering my bytes from 1000"

**Step 2: SYN-ACK (Synchronize-Acknowledge)**

-   The server responds with **both SYN and ACK flags** set
-   It sends its own initial sequence number, say `seq=5000`
-   It acknowledges the client's number: `ack=1001` (client's seq + 1)
-   Meaning: "Got it. I'll start numbering from 5000, and I expect your next byte to be 1001"

**Step 3: ACK (Acknowledge)**

-   The client sends an ACK back
-   `seq=1001` (as the server expects)
-   `ack=5001` (server's seq + 1)
-   Meaning: "Got your number too. I expect your next byte to be 5001"

**Connection is now ESTABLISHED!** Both sides know where the other starts counting.

:::note
Real initial sequence numbers are random, not 1000 and 5000. That makes it much harder for an attacker to guess them and inject fake packets into a connection.
:::

![](assets/image-1.png)

### Every Byte Gets a Number

Once connected, TCP splits data into **segments**, each labelled with the sequence number of its first byte. The receiver acknowledges by saying which byte it expects next.

**Example:** You send "Hello World" (11 bytes), numbering from 1 for readability:

-   TCP sends two segments: `[SEQ=1, "Hello"]` and `[SEQ=6, " World"]`
-   The receiver gets segment 1 → sends `ACK=6` (expecting byte 6 next)
-   The receiver gets segment 2 → sends `ACK=12`

If `" World"` were lost, the receiver would keep saying `ACK=6`, and the sender would know exactly what to resend.

## How TCP Keeps Its Promises

| Mechanism | How It Works |
| --- | --- |
| **Sequence Numbers** | Each byte gets a number. Receiver reorders out-of-order packets. |
| **Acknowledgments (ACKs)** | Receiver confirms receipt. Missing ACK triggers retransmission. |
| **Checksum** | Detects corrupted data. Bad packets are discarded and resent. |
| **Retransmission Timer** | If no ACK arrives in time, sender resends the segment. |
| **Flow Control** | Receiver advertises window size to prevent overwhelming it. |

## Closing Takes Four Messages, Not Three

Either side can start closing, using the **FIN** (finish) flag. Each direction is closed separately, so it takes four messages:

```
    Client                    Server
       |                         |
       |-------- FIN ----------->|   1. Client: "I'm done sending"
       |<------- ACK ------------|   2. Server: "Got it"
       |                         |
       |<------- FIN ------------|   3. Server: "I'm done too"
       |-------- ACK ----------->|   4. Client: "Got it, closing"
       |                         |
    CLOSED                    CLOSED
```

**Example:** closing an HTTP connection

1.  The browser is done sending → sends **FIN**
2.  The server acknowledges with **ACK**
3.  The server finishes its response → sends its own **FIN**
4.  The browser sends the final **ACK** → both sides close

The side that closed first then waits in a **TIME\_WAIT** state, for twice the maximum segment lifetime (60 seconds on Linux), so any delayed packets from the old connection die out before the same address and port are reused.

---

Three packets with no data in them look like overhead. They're what lets TCP spot a missing byte, put segments back in order and throw away duplicates. Every guarantee TCP makes starts with two numbers agreed in that handshake.

Compare with UDP in [TCP vs UDP](/blog/tcp-and-udp). More posts on [networking](/blog/tags/networking/).
