"use strict";(self.webpackChunkvibhavari_bellutagi=self.webpackChunkvibhavari_bellutagi||[]).push([[634],{3175:(e,t,i)=>{i.r(t),i.d(t,{default:()=>w});var n=i(4164),r=i(8774),s=i(4586),a=i(7823),o=i(6540),l=Object.defineProperty,c=(e,t,i)=>((e,t,i)=>t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i)(e,"symbol"!=typeof t?t+"":t,i),d=new Map,h=new WeakMap,u=0,g=void 0;function m(e){return Object.keys(e).sort().filter((t=>void 0!==e[t])).map((t=>{return`${t}_${"root"===t?(i=e.root,i?(h.has(i)||(u+=1,h.set(i,u.toString())),h.get(i)):"0"):e[t]}`;var i})).toString()}function y(e,t,i={},n=g){if(void 0===window.IntersectionObserver&&void 0!==n){const r=e.getBoundingClientRect();return t(n,{isIntersecting:n,target:e,intersectionRatio:"number"==typeof i.threshold?i.threshold:0,time:0,boundingClientRect:r,intersectionRect:r,rootBounds:r}),()=>{}}const{id:r,observer:s,elements:a}=function(e){const t=m(e);let i=d.get(t);if(!i){const n=new Map;let r;const s=new IntersectionObserver((t=>{t.forEach((t=>{var i;const s=t.isIntersecting&&r.some((e=>t.intersectionRatio>=e));e.trackVisibility&&void 0===t.isVisible&&(t.isVisible=s),null==(i=n.get(t.target))||i.forEach((e=>{e(s,t)}))}))}),e);r=s.thresholds||(Array.isArray(e.threshold)?e.threshold:[e.threshold||0]),i={id:t,observer:s,elements:n},d.set(t,i)}return i}(i),o=a.get(e)||[];return a.has(e)||a.set(e,o),o.push(t),s.observe(e),function(){o.splice(o.indexOf(t),1),0===o.length&&(a.delete(e),s.unobserve(e)),0===a.size&&(s.disconnect(),d.delete(r))}}o.Component;var x=i(4848);const v=e=>{let{year:t,icon:i,text:n}=e;const{ref:r,inView:s}=function({threshold:e,delay:t,trackVisibility:i,rootMargin:n,root:r,triggerOnce:s,skip:a,initialInView:l,fallbackInView:c,onChange:d}={}){var h;const[u,g]=o.useState(null),m=o.useRef(),[x,v]=o.useState({inView:!!l,entry:void 0});m.current=d,o.useEffect((()=>{if(a||!u)return;let o;return o=y(u,((e,t)=>{v({inView:e,entry:t}),m.current&&m.current(e,t),t.isIntersecting&&s&&o&&(o(),o=void 0)}),{root:r,rootMargin:n,threshold:e,trackVisibility:i,delay:t},c),()=>{o&&o()}}),[Array.isArray(e)?e.toString():e,u,r,n,s,a,i,c,t]);const j=null==(h=x.entry)?void 0:h.target,p=o.useRef();u||!j||s||a||p.current===j||(p.current=j,v({inView:!!l,entry:void 0}));const f=[g,x.inView,x.entry];return f.ref=f[0],f.inView=f[1],f.entry=f[2],f}({threshold:.1});return(0,x.jsxs)("div",{ref:r,className:"timeline-item "+(s?"visible":""),children:[(0,x.jsx)("div",{className:"timeline-icon",children:i}),(0,x.jsxs)("div",{className:"timeline-content",children:[(0,x.jsx)("h3",{children:t}),(0,x.jsx)("p",{children:n})]})]})},j=()=>{const[e,t]=(0,o.useState)(0),n=(e,t)=>{let i;return function(){const n=arguments,r=this;i||(e.apply(r,n),i=!0,setTimeout((()=>i=!1),t))}},r=()=>{const e=window.scrollY;t(e)};return(0,o.useEffect)((()=>{const e=n(r,200);return window.addEventListener("scroll",e),()=>{window.removeEventListener("scroll",e)}}),[]),(0,x.jsxs)("div",{className:"page-container",children:[(0,x.jsx)("div",{className:"header",style:{backgroundColor:e>50?"#282c34":"transparent",transition:"background-color 0.3s ease"},children:(0,x.jsx)("h1",{children:"Responsive Scroll Header"})}),(0,x.jsx)("div",{className:"scrollable-section",children:(0,x.jsxs)("div",{className:"timeline-container",children:[(0,x.jsx)("h2",{children:"My Journey"}),(0,x.jsxs)("div",{className:"timeline",children:[(0,x.jsx)(v,{year:"2023",icon:"\ud83d\udd16",text:"Certified as AWS Specialty - Big Data Analytics"}),(0,x.jsx)(v,{year:"2021",icon:"\ud83d\udda5\ufe0f",text:"Joined AgileLab as Data Engineer"}),(0,x.jsx)(v,{year:"2021",icon:"\ud83c\uddeb\ud83c\uddf7",text:"Moved to France with my spouse"}),(0,x.jsx)(v,{year:"2019",icon:"\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc68",text:"Started New Journey, Married to one of the best human being"}),(0,x.jsx)(v,{year:"2018",icon:"\ud83d\udcca",text:"Joined Deloitte as Consultant ( Big Data Engineer )"}),(0,x.jsx)(v,{year:"2017",icon:"\ud83d\udcc8",text:"Started my career as Big Data Engineer, After joining Attra Infotech"}),(0,x.jsx)(v,{year:"2015",icon:"\ud83d\udcbb",text:"Joined Infosys as Systems Trainee"}),(0,x.jsx)(v,{year:"2015",icon:"\ud83d\udc69\ud83c\udffc\u200d\ud83d\udcbb",text:"Graduated as Computer Science Student From Sapthagiri College Of Engineering"}),(0,x.jsx)(v,{year:"1994",icon:"\ud83c\uddee\ud83c\uddf3",text:"I was born in Karnataka, Southern India"})]})]})}),(0,x.jsxs)("div",{className:"activities-section",children:[(0,x.jsx)("h2",{children:"Things I Do Outside of Work"}),(0,x.jsxs)("div",{className:"activities",children:[(0,x.jsxs)("div",{className:"activity-item",children:[(0,x.jsx)("span",{role:"img","aria-label":"Travel",children:"\u2708\ufe0f"}),(0,x.jsx)("p",{children:"I love traveling and exploring new cultures, cuisines, and landscapes. It's my way to recharge and find inspiration."})]}),(0,x.jsxs)("div",{className:"activity-item",children:[(0,x.jsx)("span",{role:"img","aria-label":"Photography",children:"\ud83d\udcf8"}),(0,x.jsx)("p",{children:"Photography is my passion. Capturing moments, whether during travels or in daily life, allows me to tell stories visually."})]})]})]}),(0,x.jsxs)("div",{className:"gallery-section",children:[(0,x.jsx)("h2",{children:"Photography Gallery"}),(0,x.jsx)("div",{className:"gallery",children:(0,x.jsxs)("div",{className:"gallery-column",children:[(0,x.jsx)("img",{src:i(9222).A,alt:"Travel Photo 1",className:"gallery-image"}),(0,x.jsx)("img",{src:i(9726).A,alt:"Travel Photo 2",className:"gallery-image"})]})}),(0,x.jsxs)("p",{children:["Check out more of my photography on ",(0,x.jsx)("a",{href:"https://www.instagram.com/your_instagram",target:"_blank",rel:"noopener noreferrer",children:"Instagram"}),"."]})]})]})};var p=i(1107);const f={heroBanner:"heroBanner_qdFl",buttons:"buttons_AeoN"};function b(){const{siteConfig:e}=(0,s.A)();return(0,x.jsx)("header",{className:(0,n.A)("hero hero--primary",f.heroBanner),children:(0,x.jsxs)("div",{className:"container",children:[(0,x.jsx)(p.A,{as:"h1",className:"hero__title",children:e.title}),(0,x.jsx)("p",{className:"hero__subtitle",children:e.tagline}),(0,x.jsx)("div",{className:f.buttons,children:(0,x.jsx)(r.A,{className:"button button--secondary button--lg",to:"/Resume/experience",children:"Know Me Better"})})]})})}function w(){const{siteConfig:e}=(0,s.A)();return(0,x.jsxs)(a.A,{title:`Hello from ${e.title}`,description:"Description will go into a meta tag in <head />",children:[(0,x.jsx)(b,{}),(0,x.jsx)("main",{children:(0,x.jsx)(j,{})})]})}},9222:(e,t,i)=>{i.d(t,{A:()=>n});const n=i.p+"assets/images/photo1-8a9df4bbfca20e15c50a4cc10684989e.jpg"},9726:(e,t,i)=>{i.d(t,{A:()=>n});const n=i.p+"assets/images/photo2-1e1efa537875d20d74a825be1be82efc.jpg"}}]);