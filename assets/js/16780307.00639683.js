"use strict";(self.webpackChunkvibhavari_bellutagi=self.webpackChunkvibhavari_bellutagi||[]).push([[8727],{5072:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>r,contentTitle:()=>l,default:()=>h,frontMatter:()=>o,metadata:()=>t,toc:()=>d});var t=i(811),a=i(4848),s=i(8453);const o={slug:"de-bootcamp-fact-modelling",title:"Data Modelling - Fact Modelling",authors:["me"],tags:["de","fact","de-bootcamp"],keywords:["data engineering","data engineering bootcamp","data modelling","fact data modelling"],hide_table_of_contents:!1},l=void 0,r={authorsImageUrls:[void 0]},d=[{value:"Fact Data Modelling",id:"fact-data-modelling",level:2},{value:"What is a fact?",id:"what-is-a-fact",level:3},{value:"Hardest part of modelling facts",id:"hardest-part-of-modelling-facts",level:3},{value:"How does fact data work?",id:"how-does-fact-data-work",level:3},{value:"How does fact modelling work?",id:"how-does-fact-modelling-work",level:3},{value:"How logging fit into fact data?",id:"how-logging-fit-into-fact-data",level:3},{value:"Potential options when working with high volume fact data",id:"potential-options-when-working-with-high-volume-fact-data",level:3},{value:"Retention of Fact Data",id:"retention-of-fact-data",level:3},{value:"Deduplication of Fact Data",id:"deduplication-of-fact-data",level:3}];function c(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,s.R)(),...e.components},{Highlight:i}=n;return i||function(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Highlight",!0),(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.p,{children:"Im sharing my learning from the Data Engineering Bootcamp, where we are learning about Data Engeering.\nToday we are learning about Fact Modelling."}),"\n",(0,a.jsxs)(n.p,{children:["I would like to extend my gratitude to Zach Wilson, the founder of ",(0,a.jsx)(n.a,{href:"https://bootcamp.techcreator.io/lessons",children:"DataExpert.io"}),", for his invaluable guidance and the comprehensive Data Engineering Bootcamp.\nConnect with Zach Wilson on ",(0,a.jsx)(n.a,{href:"https://www.linkedin.com/in/eczachly/",children:"LinkedIn"}),".\nThank you, Zach, for this amazing intense bootcamp on Data engineering!"]}),"\n",(0,a.jsx)(n.hr,{}),"\n",(0,a.jsx)(n.p,{children:"Week-2, Day-1: Fact Data Modeling"}),"\n",(0,a.jsx)(n.admonition,{type:"caution",children:(0,a.jsx)(n.p,{children:"Fact data is the biggest data you work as data engineer. Zach shares, he worked 2PB of data in a day at Netflix !!"})}),"\n",(0,a.jsx)(n.h2,{id:"fact-data-modelling",children:"Fact Data Modelling"}),"\n",(0,a.jsx)(n.h3,{id:"what-is-a-fact",children:"What is a fact?"}),"\n",(0,a.jsx)(n.p,{children:"Fact can be thought as a record of an event that happened or occured."}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"A user logs in to an app ( an action )"}),"\n",(0,a.jsx)(n.li,{children:"A transaction is made"}),"\n",(0,a.jsx)(n.li,{children:"You run a mile with your smartwatch - ( a mile can be a aggregated, considering each step in that mile as a granular)"}),"\n"]}),"\n",(0,a.jsx)(n.admonition,{type:"info",children:(0,a.jsx)(n.p,{children:"Fact cannot be broken down further. It is the most granular data you have. ( this is way you think about fact )"})}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(i,{color:"#3e6980",children:"Facts are not slowly changing"}),", which makes them easier to model than dimensions."]}),"\n",(0,a.jsx)(n.h3,{id:"hardest-part-of-modelling-facts",children:"Hardest part of modelling facts"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"Fact data is usually 10-100x bigger than dimension data."}),"\n",(0,a.jsx)(n.li,{children:"Fact data can need a lot of context for effective analysis like which dimension is it related to etc."}),"\n",(0,a.jsx)(n.li,{children:"Facts would have duplicate data which is way more common than dimensions."}),"\n"]}),"\n",(0,a.jsx)(n.h3,{id:"how-does-fact-data-work",children:"How does fact data work?"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"Normalized facts dont have any dimesnional attributes, just IDs to join to get that information."}),"\n",(0,a.jsx)(n.li,{children:"Denormalized facts bring in some dimension attributes to make it quicket analysis at the cost of storage."}),"\n"]}),"\n",(0,a.jsx)(n.admonition,{type:"info",children:(0,a.jsx)(n.p,{children:"Normalised facts works well for a small scale, you would remove the duplicate facts and data integrity is achieved."})}),"\n",(0,a.jsx)(n.h3,{id:"how-does-fact-modelling-work",children:"How does fact modelling work?"}),"\n",(0,a.jsxs)(n.p,{children:["Here\u2019s a concise table highlighting the differences between ",(0,a.jsx)(n.strong,{children:"fact data"})," and ",(0,a.jsx)(n.strong,{children:"raw log data"}),", as described in the slide:"]}),"\n",(0,a.jsxs)(n.table,{children:[(0,a.jsx)(n.thead,{children:(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.th,{children:(0,a.jsx)(n.strong,{children:"Aspect"})}),(0,a.jsx)(n.th,{children:(0,a.jsx)(n.strong,{children:"Raw Logs"})}),(0,a.jsx)(n.th,{children:(0,a.jsx)(n.strong,{children:"Fact Data"})})]})}),(0,a.jsxs)(n.tbody,{children:[(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.strong,{children:"Schema Design"})}),(0,a.jsx)(n.td,{children:"Ugly schemas designed for online systems, making data analysis difficult."}),(0,a.jsx)(n.td,{children:"Well-structured with nice column names."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.strong,{children:"Data Quality"})}),(0,a.jsx)(n.td,{children:"May contain duplicates and other quality issues."}),(0,a.jsx)(n.td,{children:"Includes quality guarantees like uniqueness, non-null constraints, etc."})]}),(0,a.jsxs)(n.tr,{children:[(0,a.jsx)(n.td,{children:(0,a.jsx)(n.strong,{children:"Retention"})}),(0,a.jsx)(n.td,{children:"Usually has shorter retention."}),(0,a.jsx)(n.td,{children:"Retained for longer periods."})]})]})]}),"\n",(0,a.jsx)(n.p,{children:"Though Fact data and Raw logs are dependent, they are not the same. Fact data is a subset of raw logs, and it is the data that is used for analysis."}),"\n",(0,a.jsxs)(n.p,{children:["Fact can be identified as ",(0,a.jsx)(n.code,{children:"Who"}),", ",(0,a.jsx)(n.code,{children:"What"}),", ",(0,a.jsx)(n.code,{children:"When"}),", ",(0,a.jsx)(n.code,{children:"Where"}),", ",(0,a.jsx)(n.code,{children:"How"})," of the data."]}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"Who"})," - User ID ( user who did the action )"]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"Where"}),' - Location ID ( where the action happened ), most likely modeled out like who with "IDs" to join, but more likely to bring in dimensions.']}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"How"}),' - Similiar to where, "He used an iphone to make this click"']}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"When"})," - Timestamp ( when the action happened ). fundamentally part of the nature of the fact."]}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:'Mostly an "event_timestamp" field or "event_date" field. ( always to be not null )'}),"\n"]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"What"})," - The action that happened. ( what is the fact ) ( always to be not null )"]}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:'In notification world, it could be "notification_sent", "notification_delivered", "notification_clicked"'}),"\n"]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsx)(n.p,{children:"Fact datasets should have quality guarantees like uniqueness, non-null constraints, etc."}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsx)(n.p,{children:"Fact data < raw logs"}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsx)(n.p,{children:"Fact data should parse out hard-to-understand columns."}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsx)(n.p,{children:"Expected to have the simple data types, in some cases, there can be complex data types"}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(n.h3,{id:"how-logging-fit-into-fact-data",children:"How logging fit into fact data?"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"It brings in all the crtical context for your fact data"}),"\n",(0,a.jsx)(n.li,{children:"Do not log everything, log what you need"}),"\n",(0,a.jsxs)(n.li,{children:["Logging should conform to values specified by the online teams, define the standard schema for logging","\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"Thrift was used at Netflix and Airbnb"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(n.h3,{id:"potential-options-when-working-with-high-volume-fact-data",children:"Potential options when working with high volume fact data"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"Sampling"}),": This involves analysing a subset of the data, which can be significantly faster and require less storage, especially for gauging trends or directionality. However, sampling is unsuitable for situations like security analysis, where capturing rare events is crucial."]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"Bucketing"}),": This involves dividing the data into smaller partitions based on a key, like user ID. Bucketing can speed up joins, especially when employing techniques like bucket joins or sorted merge bucket joins (SMB joins) that minimise or eliminate shuffle."]}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(n.h3,{id:"retention-of-fact-data",children:"Retention of Fact Data"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"High volumes make fact data much more costly to store."}),"\n",(0,a.jsxs)(n.li,{children:["Any fact tables < 10 TBs, Retention is not a big deal.","\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"Anonymisation of facts usually happens after 60-90 days, the data would be moved to a new table the PII data would be removed."}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(n.li,{children:"Fact tables > 100 TBs, very short retention is common. (~ 14 days)"}),"\n"]}),"\n",(0,a.jsx)(n.h3,{id:"deduplication-of-fact-data",children:"Deduplication of Fact Data"}),"\n",(0,a.jsx)(n.p,{children:"As duplicate records are much more common in fact datasets compared to dimensional data. These duplicates can arise from various sources, such as:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.strong,{children:"Data quality errors:"})," Software bugs in logging systems can lead to duplicate entries every time an event occurs."]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.strong,{children:"Genuine duplicate actions:"})," Users might perform the same action multiple times within a given timeframe, resulting in multiple legitimate entries that need to be accounted for without inflating metrics. For example, a user might click on a notification multiple times, or a step-tracking app might record multiple steps in quick succession."]}),"\n"]}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"Deduplication is crucial for accurate analysis"}),", as failing to address duplicates can distort metrics like click-through rates or user engagement. For example, if duplicates aren't removed from notification click data, the click-through rate might appear artificially inflated."]}),"\n",(0,a.jsxs)(n.p,{children:["The suggestion here is to consider the ",(0,a.jsx)(n.strong,{children:"timeframe"})," for deduplication.  While it's essential to remove duplicates within a specific period where they significantly impact analysis, duplicates occurring over a longer timeframe might be less critical. For instance, a user clicking on a notification a year after initially clicking on it might not be relevant for measuring short-term engagement."]}),"\n",(0,a.jsx)(n.p,{children:"Two approaches to efficiently handle deduplication for high-volume fact data:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.strong,{children:"Streaming:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"This method processes data in real time, deduplicating records as they arrive."}),"\n",(0,a.jsx)(n.li,{children:"Windowing matters in streaming, you need to have a window to deduplicate the data."}),"\n",(0,a.jsx)(n.li,{children:"Entire day deduplication is not possible in streaming, because it needs to hold onto such a big window of memory."}),"\n",(0,a.jsx)(n.li,{children:"Large number of duplicates happens within a short time of first event."}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.strong,{children:"Deduplication window"})," - 15 minutes, a sweet spot"]}),"\n"]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.strong,{children:"Microbatch processing:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"This technique involves processing data in small batches, such as hourly, to deduplicate records within each batch and subsequently merge the deduplicated batches."}),"\n",(0,a.jsx)(n.li,{children:"There is a specific microbatch deduplication pattern involving hourly aggregation followed by a series of full outer joins to merge deduplicated data from different hours."}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:"The choice between streaming and microbatch processing depends on factors like latency requirements and the complexity of the deduplication logic."})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(c,{...e})}):c(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>o,x:()=>l});var t=i(6540);const a={},s=t.createContext(a);function o(e){const n=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),t.createElement(s.Provider,{value:n},e.children)}},811:e=>{e.exports=JSON.parse('{"permalink":"/blog/de-bootcamp-fact-modelling","source":"@site/blog/2024-12-14-de-bootcamp-fact-modelling/index.md","title":"Data Modelling - Fact Modelling","description":"Im sharing my learning from the Data Engineering Bootcamp, where we are learning about Data Engeering.","date":"2024-12-14T00:00:00.000Z","tags":[{"inline":false,"label":"data-engineering","permalink":"/blog/tags/de","description":"DE tag description"},{"inline":false,"label":"fact-dimensional-modeling","permalink":"/blog/tags/fact","description":"Fact Dimensional Modeling tag description"},{"inline":false,"label":"data-engineering-bootcamp","permalink":"/blog/tags/de-bootcamp","description":"Tags on Data Engineering Bootcamp by Zach Wilson"}],"readingTime":5.84,"hasTruncateMarker":true,"authors":[{"name":"Vibhavari Bellutagi","title":"Data Engineer","url":"https://github.com/vibhabellutagi19","socials":{"github":"https://github.com/vibhabellutagi19","linkedin":"https://www.linkedin.com/in/vibhavari-bellutagi-837871189/"},"imageURL":"https://avatars.githubusercontent.com/u/39341524?s=400&u=5d760c052fe0614d3af649de9e85474d1cafeba7&v=4","key":"me","page":null}],"frontMatter":{"slug":"de-bootcamp-fact-modelling","title":"Data Modelling - Fact Modelling","authors":["me"],"tags":["de","fact","de-bootcamp"],"keywords":["data engineering","data engineering bootcamp","data modelling","fact data modelling"],"hide_table_of_contents":false},"unlisted":false,"prevItem":{"title":"Data Modelling - Fact vs Dimension","permalink":"/blog/de-bootcamp-fact-vs-dimension"},"nextItem":{"title":"Data Modelling - Graph Databases and Additve Dimensions","permalink":"/blog/de-bootcamp-graph-databases"}}')}}]);