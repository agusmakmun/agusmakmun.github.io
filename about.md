---
description: "About Agus Makmun, SDE Lead (CDP, CASP): career, experience and the tools I work with."
layout: page
title: About
permalink: /about/
---

Hi 👋, I'm **Agus**, an **SDE Lead** based in Indonesia, and a
**Certified DevSecOps Professional (CDP)** and **Certified API Security Professional (CASP)**.

I'm a Linux, Python, Django, AI & automation enthusiast. I started out building web apps with Python & Django, and these days
I work across the whole stack: backend, frontend, databases and the infrastructure that ships them.

My focus right now is **infrastructure and the Next.js stack**: taking production apps off managed platforms and onto
infrastructure we own, such as moving from Vercel to self-hosted, and
[migrating from Supabase to self-hosted Postgres]({% post_url 2026-10-24-migrating-off-supabase-to-drizzle-and-nextauth %}).

- 🔭 Currently **SDE Lead at [Design Shifu](https://github.com/Design-Shifu)** (since Jan 2026), sister company of **Hysn Pte. Ltd.**
- 🛡️ Before that, **5+ years at [Practical DevSecOps](https://www.practical-devsecops.com/)**: from part-time full-stack engineer to
  **Head of Regional Operations & SDE Lead**, leading the team behind its hands-on lab platform
  (~2k lab machines at once, start-up time cut from 6s to 2.5s, ~30% lower infrastructure cost)
- 🏢 Also previously at [@hyperhaul](https://github.com/hyperhaul), [@titipbeliin](https://github.com/titipbeliin) and [@doaai](https://github.com/doaai)
- 🛠️ Focused on **self-hosting, Next.js, PostgreSQL, Docker** and zero-downtime migrations
- 📦 Maintainer of [Martor](https://github.com/agusmakmun/django-markdown-editor), a Markdown editor for Django (898★, 1.2k+ forks)
- 💬 Ask me about **Infrastructure, Self-hosting, DevSecOps, Frontend, Backend, Stocks, Business, Financials**
- 📝 I regularly write articles here, mostly about things I've learned while building and running production systems

Things I've built, open source and at work, are on the [Projects]({{ '/projects/' | relative_url }}) page.

### Experience

{% include experience.html %}

### Certifications & education

- **Certified API Security Professional (CASP)**, Practical DevSecOps, Jul 2024
- **Certified DevSecOps Professional (CDP)**, Practical DevSecOps, Mar 2024
- **Employee of the Month 2023, Best Lead**, Practical DevSecOps
- **S1 Teknik Informatika** (B.Sc. Informatics Engineering), Muhammadiyah University of Surakarta, 2013 – 2018
- Paper: *Performance of Similarity Algorithms for Statement Mapping in a SWOT Analysis Application*, ICETIA 2017
- Earlier community work: member of the Indonesian Backtrack Team (2014 – 2017) and software developer on the DracOS Linux team (2016 – 2017)

### Languages and Tools

{% comment %}id:Name pairs. Ids are skillicons.dev names; "brand" ids aren't on skillicons and use _includes/brand-icon.html.{% endcomment %}
{% assign skills = "aws:AWS,bash:Bash,bootstrap:Bootstrap,css:CSS,digitalocean:DigitalOcean,django:Django,docker:Docker,fastapi:FastAPI,flask:Flask,git:Git,grafana:Grafana,hetzner:Hetzner,html:HTML,js:JavaScript,jest:Jest,kubernetes:Kubernetes,linux:Linux,mongodb:MongoDB,mysql:MySQL,nextjs:Next.js,nginx:Nginx,postgres:PostgreSQL,postman:Postman,py:Python,react:React,redis:Redis,selenium:Selenium,sqlite:SQLite,ts:TypeScript,vercel:Vercel,supabase:Supabase" | split: "," %}
<div class="skill-icons">
  {% for s in skills %}{% assign id = s | split: ":" | first %}{% assign name = s | split: ":" | last %}
    {% if id == "digitalocean" or id == "hetzner" %}
      <span class="skill-tile brand-{{ id }}" title="{{ name }}" role="img" aria-label="{{ name }}">{% include brand-icon.html name=id %}</span>
    {% else %}
      <img class="only-light" src="https://skillicons.dev/icons?i={{ id }}&amp;theme=light" alt="{{ name }}" title="{{ name }}" width="48" height="48" loading="lazy">
      <img class="only-dark" src="https://skillicons.dev/icons?i={{ id }}&amp;theme=dark" alt="{{ name }}" title="{{ name }}" width="48" height="48" loading="lazy">
    {% endif %}
  {% endfor %}
</div>

- **Infrastructure:** Docker, Kubernetes, Nginx, Linux, Bash, AWS, DigitalOcean, Hetzner, Vercel, Supabase, Grafana, GitHub Actions
- **Frontend:** Next.js, React, TypeScript, JavaScript, Node.js, HTML, CSS, Bootstrap
- **Backend:** Python, Django, Django Channels, FastAPI, Flask
- **Data:** PostgreSQL, MySQL, SQLite, MongoDB, Redis
- **Tooling & testing:** Git, Jest, Selenium, Postman

### Connect with me

- GitHub: [@agusmakmun](https://github.com/agusmakmun) (questions welcome at [agusmakmun/askme](https://github.com/agusmakmun/askme/issues/new))
- LinkedIn: [linkedin.com/in/agusmakmun](https://linkedin.com/in/agusmakmun)
- Stack Overflow: [profile](https://stackoverflow.com/users/6396981)
- Email: `summon.agus[at]gmail.com`
