---
layout: post
title: 	"Hooking up OpenAPI with Jetty Server"
data:	2021-06-12 06:038:56
categories: [java, jetty, swagger, openapi]
---

### Background

Jetty 11.X is released now and has deprecated its support for `javax` namespace required for the development of API. Instead, it has started supporting `jakarta` namespace which is part of Jakarta EE 9 and this changes the game entirely. When you need to annotate your API, we `import javax.ws.rs.*` packages which is now on will be `import jakarta.ws.rs.*`. 

Nonetheless, swagger (OpenAPI) documentation that used to seamlessly integrate with core java APIs now has an additional dependency whether is a maven or gradle based project. Lets get started into the detailed process of how the new integration is done. 

### What is Jetty?

The Ecplise Jetty Project provides a web server and servlet container, additionally providing support for HTTP/2, WebSocket, OSGi, JMX, JNDI, JAAS and many other integrations. These components are open source and are freely available for commercial use and distribution.

Jetty is used in a wide variety of projects and products, both in development and production. Jetty has long been loved by developers due to its long history of being easily embedded in devices, tools, frameworks, application servers, and modern cloud services.

Biggest advantage of using Jetty is that Jetty has been designed to have a small memory foot print. This is a critical basis for good performance and scalability. The less memory the server uses, the more memory is available for the application and/or more instances of the server can be run on virtual hardware. As such Jetty is very cloud friendly. 

Most recent release as this blog is being written by is `Jetty:11.0.5`.

### What is Jersey?

According to [Wikipedia](https://en.wikipedia.org/wiki/Project_Jersey#:~:text=Jersey%20RESTful%20Web%20Services%20%2C%20formerly,%26%20JSR%20370)%20Reference%20Implementation.), Jersey RESTful Web Services , formerly Glassfish Jersey, currently Eclipse Jersey framework is an open source framework for developing RESTful Web Services in Java. It provides support for JAX-RS APIs and serves as a JAX-RS (JSR 311 & JSR 339 & JSR 370) Reference Implementation.

Developing RESTful Web services that seamlessly support exposing your data in a variety of representation media types and abstract away the low-level details of the client-server communication is not an easy task without a good toolkit. In order to simplify development of RESTful Web services and their clients in Java, a standard and portable JAX-RS API has been designed.

Jersey RESTful Web Services 2.x framework is open source, production quality, framework for developing RESTful Web Services in Java that provides support for JAX-RS APIs and serves as a JAX-RS (JSR 311 & JSR 339 & JSR 370) Reference Implementation.

Jersey RESTful Web Services 3.x framework is open source, production quality, framework for developing RESTful Web Services in Java that provides support for Jakarta RESTful Web Services 3.0.

Jersey framework is more than the JAX-RS Reference Implementation. Jersey provides it’s own API that extend the JAX-RS toolkit with additional features and utilities to further simplify RESTful service and client development. Jersey also exposes numerous extension SPIs so that developers may extend Jersey to best suit their needs.

Goals of Jersey project can be summarized in the following points:

* Track the JAX-RS API and provide regular releases of production quality Reference Implementations that ships with GlassFish;
* Provide APIs to extend Jersey & Build a community of users and developers; and finally
* Make it easy to build RESTful Web services utilizing Java and the Java Virtual Machine.

The latest published release of Jakarta EE 9 Jersey is `3.0.2`.

### What is Swagger/OpenAPI?

Swagger is an open source set of rules, specifications and tools for developing and describing RESTful APIs. The Swagger framework allows developers to create interactive, machine and human-readable API documentation.

API specifications typically include information such as supported operations, parameters and outputs, authorization requirements, available endpoints and licenses needed. Swagger can generate this information automatically from the source code by asking the API to return a documentation file from its annotations.

Swagger helps users build, document, test and consume RESTful web services. It can be used with both a top-down and bottom-up API development approach. In the top-down, or design-first, method, Swagger can be used to design an API before any code is written. In the bottom-up, or code-first method, Swagger takes the code written for an API and generates the documentation.

**The OpenAPI Specification (OAS):**

The OpenAPI Specification was originally based on the Swagger Specification, donated by SmartBear Software.

The OpenAPI Specification (OAS) defines a standard, programming language-agnostic interface description for HTTP APIs, which allows both humans and computers to discover and understand the capabilities of a service without requiring access to source code, additional documentation, or inspection of network traffic. 

When properly defined via OpenAPI, a consumer can understand and interact with the remote service with a minimal amount of implementation logic. Similar to what interface descriptions have done for lower-level programming, the OpenAPI Specification removes guesswork in calling a service.

### What steps it should follow?

The rules are very simple and as follows:
1. Create a jetty server 
2. Intercept API using Jersey
3. Add OpenAPI servlet into Jetty Server
4. Export API docs
5. Add static-UI pages into /resources/webapp

### STEP 1. Create Jetty Server

The general idea here is create jetty server instance, add contextHandler for the API on a particular path such as `/sampleapi` below and start the server. 

```java
// Create and configure a ThreadPool.
QueuedThreadPool threadPool = new QueuedThreadPool();
threadPool.setName("server");

// Create a Server instance.
Server server = new Server(threadPool);

// HTTP configuration and connection factory.
HttpConfiguration httpConfig = new HttpConfiguration();
HttpConnectionFactory http11 = new HttpConnectionFactory(httpConfig);

// Create a ServerConnector to accept connections from clients.
ServerConnector connector = new ServerConnector(server, 1, 1, http11);
connector.setPort(8080);
connector.setHost("0.0.0.0");
connector.setAcceptQueueSize(128);
server.addConnector(connector);

// Create ContextHandlerCollection context
ContextHandlerCollection contexts = new ContextHandlerCollection();
server.setHandler(contexts);

// Adding server path for API
ContextHandler sampleApiHandler = new ContextHandler("/sampleapi");
sampleApiHandler.setHandler(new SampleApiHandler());
contexts.addHandler(sampleApiHandler);
```

### STEP 2. Intercept API using Jersey

Extending the ContextHandler for server, now lets add Jersey servlet to intercept the REST API you have developed. Package `jersey.config.server.provider.packages` is the key and the value `com.example.sample-package` holds all your APIs. Additional resources that need to be scanned can also be specified in the value section as below -

```java
// Setup Jetty Servlet
ServletContextHandler servletContextHandler = new ServletContextHandler(ServletContextHandler.SESSIONS);
servletContextHandler.setContextPath("/");
contexts.addHandler(servletContextHandler);

// Setup API resources to be intercepted by Jersey 
ServletHolder jersey = servletContextHandler.addServlet(ServletContainer.class, "/api/*");
jersey.setInitOrder(1);
jersey.setInitParameter("jersey.config.server.provider.packages",
		"com.example.sample-package;io.swagger.v3.jaxrs2.integration.resources");
```
Due to hooking up jersey servlet with Jetty server context, you are now able to intercept all the calls. Interception is possible because of the code annotation. An example of how code can be annotated is as follows - 
```java
@OpenAPIDefinition(
        info = @Info(
                title = "MyTitle",
                version = "1.0.0",
                description = "API Documentation",
                license = @License(name = "Test License", url = "https://example.com"),
                contact = @Contact(url = "https://example.com/contact")
        )
)
@Path("/sampleapi")
@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
public class SampleApiClass extends AbstractHandler {
	@GET
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(
            summary = "SampleApi",
            description = "returns a list of clients"
    )
    @ApiResponse(content = @Content(mediaType = "application/json"))
    @ApiResponse(responseCode = "200", description = "Ok")
    @ApiResponse(responseCode = "400", description = "Bad Request")
    @ApiResponse(responseCode = "404", description = "Error")
    @ApiResponse(responseCode = "500", description = "Internal Server Error")
    @ApiResponse(responseCode = "503", description = "Service Unavailable")
    @Tag(name = "MyApi")
    public void SampleApi(@Context Request jettyRequest, @Context HttpServletRequest request,
                                  @Context HttpServletResponse response) {...}
```

### STEP 3. Add OpenAPI servlet into Jetty Server

Let's now add an OpenAPI servlet into the server context on a separate path `/openapi` so that we would be able to generate API docs independently when the serer is running. Also, this will allow us to download and save the docs as YAML or JSON. 

```java
// Expose API definition independently into yaml/json
ServletHolder openApi = servletContextHandler.addServlet(OpenApiServlet.class, "/openapi/*");
openApi.setInitOrder(2);
openApi.setInitParameter("openApi.configuration.resourcePackages", "com.example.sample-package");
```

### STEP 4. Add static-UI pages into /resources/webapp 

```java
// Setup Swagger-UI static resources
String resourceBasePath = ServiceLoader.class.getResource("/webapp").toExternalForm();
servletContextHandler.setWelcomeFiles(new String[] {"index.html"});
servletContextHandler.setResourceBase(resourceBasePath);
servletContextHandler.addServlet(new ServletHolder(new DefaultServlet()), "/*");
```

Finally start the server: 

```java
// Start the Server so it starts accepting connections from clients.
server.start();
server.join();
```

Build.gradle should have dependencies like this - 

```gradle
```

### STEP 4. Export API docs
```java
```

```java
public class EmployeeRecord {
	/*the private data members inside a class that is public*/
	private int empId;
	private String empName;
	private String empAddr;
	private int empSal;
		public int getEmpId() {
		return empId;
	}

	public void setEmpId(int idIn) {
		empId = idIn;
	}
		public String getEmpName() {
		return empName;
	}
		public void setEmpName(String nameIn) {
		empName = nameIn;
	}

	public String getEmpAddr() {
		return empAddr;
	}

	public void setEmpAddr(String addrIn) {
		empAddr = addrIn;
	}

	public int getEmpSal() {
		empSal;
	}

	public void setEmpSal(int salaryIn) {
		empSal = salaryIn;
	}
}
```

### Further Scope

The saved yaml or json documentation of your API can be used to exercise the APIs into tools like postman. If you want to generate client sdk using docs, you can use `swagger-generate` tool in your favorite language like this - 
```bash
swagger-generate -i <openapi.yaml-OR-running-server-URL> -l <language-of-choice> -o <output-directory>
```
example:
```bash
swagger-generate -i htttp://localhost:8080/openapi/openapi.yaml -l python -o /tmp/sdk-client-python
```

### Summary

In J2EE environment, POJO based programming model helps a lot to achieve the functionalities of dependency injection and inversion of control. Also this type of practice helps writing modules that are high cohesive and low coupled thereby making the project robust. Spring, one of the most popular Java framework in the industry always promotes the POJO based development. 
