---
layout: post
title:  "Real-Time EC2 WebSocket Terminal with Django, Channels, and OpenTelemetry"
date:   2024-04-23 10:15:00 +0700
categories: [python, django, observability, websocket]
---

Are you looking to build a real-time, browser-based terminal that streams interactive shell sessions from an AWS EC2 instance, with full observability and distributed tracing? In this post, I'll walk you through a modern Django stack that does exactly that—leveraging Django Channels, xterm.js, Celery, Redis, and OpenTelemetry for a seamless developer and monitoring experience.

### Why Real-Time WebSocket Terminals Matter

Web-based terminals are invaluable for cloud management, remote debugging, and DevOps workflows. By streaming an SSH session from EC2 directly to your browser, you can securely manage infrastructure from anywhere, with full auditability and performance monitoring.

### The Stack: Django, Channels, xterm.js, and More

This project combines:
- **Django + Channels** for WebSocket support
- **xterm.js** for a beautiful, interactive frontend terminal
- **Celery** for background tasks and periodic health checks
- **Redis** as cache and message broker
- **OpenTelemetry, Jaeger, and Grafana** for distributed tracing and service performance monitoring

All services are orchestrated with Docker Compose for easy local development and deployment.

### Key Features

- **WebSocket Terminal**: Real-time, interactive shell in your browser
- **EC2 SSH Integration**: Backend logic ready to stream from AWS EC2 (just add your credentials)
- **Distributed Tracing**: End-to-end observability for HTTP, WebSocket, Celery, and Redis
- **Health Check API**: `/health-check/` endpoint and periodic Celery task
- **Grafana Dashboards**: Visualize traces and service performance

### Getting Started

#### 1. Clone and Set Up
```bash
git clone git@github.com:agusmakmun/django-aws-terminal-websocket.git
cd django-aws-terminal-websocket/
pip install -r requirements.txt
```

#### 2. Run the Full Stack
```bash
docker-compose up --build
```
- Django app: [http://localhost:8000/](http://localhost:8000/)
- Jaeger UI: [http://localhost:16686/](http://localhost:16686/)
- Grafana: [http://localhost:3000/](http://localhost:3000/)

#### 3. Access the Terminal
Open [http://localhost:8000/](http://localhost:8000/) in your browser. You'll see a live terminal powered by xterm.js.

### EC2 SSH Configuration

To connect to your EC2 instance:
- Set environment variables:
  ```bash
  export AWS_HOSTNAME=your-ec2-public-dns
  export AWS_USERNAME=ec2-user
  ```
- Place your SSH private key as `terminal/aws.pem` (chmod 600, not tracked by git)

The backend will use these to establish an SSH session for the WebSocket terminal.

### Observability: Tracing Everything

- **OpenTelemetry**: Traces HTTP, WebSocket, Celery, and Redis operations
- **Jaeger**: Visualize traces and debug performance bottlenecks
- **Grafana**: Build dashboards for service monitoring

#### Class-Level Tracing
Decorators like `@traced_class` and `@traced_async_class` automatically trace all methods in a class, reducing boilerplate and ensuring consistent observability.

#### Redis Tracing
All Redis and Django cache operations are automatically traced and enriched with context—no manual instrumentation needed.

### Health Checks and Periodic Tasks
- `/health-check/` endpoint for monitoring
- Celery task runs every minute, calling the health check and logging results (fully traced)

### Customization
- **Frontend**: Edit `terminal/templates/terminal/terminal.html`
- **Backend**: Extend `TerminalConsumer` for authentication, EC2 connection, and streaming logic

### Running the Slidev Presentation
Want to demo or learn more? Run the included Slidev presentation:
```bash
npm install --save-dev @slidev/cli
npx slidev
```
This opens an interactive presentation in your browser using `slides.md`.

### Final Thoughts

This project is a great starting point for building secure, observable, and scalable web-based terminals for cloud infrastructure. With full tracing and monitoring out of the box, you can focus on features—not plumbing.

**Check out the [GitHub repo](https://github.com/agusmakmun/django-aws-terminal-websocket) for the full code and documentation!** 
