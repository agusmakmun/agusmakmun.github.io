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
4. Add static-UI pages into /resources/webapp
5. Export API docs

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
After this setup if you start the server and hit the url `http://localhost:8080/`, you should be able to see the swagger.json API docs. 

### STEP 4. Add static-UI pages into /resources/webapp 

Lets try to make it more human redable. Swagger-UI package holds a directory `/dist/` which contains the html package to build static UI page. You need to go to swagger-UI github and copy the content of `dist/` into `/resources/webapp` of your project directory. You may require to change the value of source in index.html to `localhost:8080/openapi/swagger.json`. This will create a hook between static resources to your swagger.json. And finally add resourceBasePath for this to work as below - 

```java
// Setup Swagger-UI static resources
String resourceBasePath = ServiceLoader.class.getResource("/webapp").toExternalForm();
servletContextHandler.setWelcomeFiles(new String[] {"index.html"});
servletContextHandler.setResourceBase(resourceBasePath);
servletContextHandler.addServlet(new ServletHolder(new DefaultServlet()), "/*");
```

At last, start the server: 

```java
// Start the Server so it starts accepting connections from clients.
server.start();
server.join();
```

Build.gradle should have dependencies like this - 

```gradle
dependencies {
    implementation 'org.eclipse.jetty:jetty-server:11.0.0'
    implementation 'org.eclipse.jetty:jetty-util:11.0.0'
    implementation 'org.eclipse.jetty:jetty-servlet:11.0.0'

    // Jersey dependencies
    implementation 'org.glassfish.jersey.containers:jersey-container-jetty-http:3.0.2'
    implementation 'org.glassfish.jersey.containers:jersey-container-servlet-core:3.0.2'
    implementation 'org.glassfish.jersey.media:jersey-media-json-binding:3.0.2'
    implementation 'org.glassfish.jersey.core:jersey-common:3.0.2'
    implementation 'org.glassfish.jersey.inject:jersey-hk2:3.0.2'
    implementation 'org.glassfish.jaxb:jaxb-runtime:3.0.1'

    // Swagger & Jakarta namespace dependencies
    implementation 'org.apache.commons:commons-lang3:3.7'
    implementation 'io.swagger.core.v3:swagger-jaxrs2-jakarta:2.1.9'
    implementation 'io.swagger.core.v3:swagger-jaxrs2-servlet-initializer-jakarta:2.1.9'
    implementation 'jakarta.ws.rs:jakarta.ws.rs-api:3.0.0'
    implementation 'jakarta.servlet:jakarta.servlet-api:5.0.0'
}
```

Open `http://localhost:8080/` in your browser and you should be able to see the swagger-ui for all your APIs. 

### STEP 5. Export API docs

If you are willing to export all your docs to share with others in your team or at your workplace, you can go to the URL `http://localhost:8080/openapi/openapi.yaml` or `http://localhost:8080/openapi/openapi.json` to export the docs as YAML or JSON file respectively. 

### Further Scope

The saved yaml or json documentation can be used to exercise the APIs into tools like postman. Also, If you want to generate client sdk using docs, you can use `swagger-generate` tool in your favorite language like this - 
```bash
swagger-generate -i <openapi.yaml-OR-running-server-URL> -l <language-of-choice> -o <output-directory>
```
example:
```bash
swagger-generate -i http://localhost:8080/openapi/openapi.yaml -l python -o /tmp/sdk-client-python
```

### Summary

If you are working with Jetty 11 and developing REST Apis, you are tend to require the documentation for your API. OpenAPi is the most standard specification that can be followed for API development and is popularly accepted in the industry today. All you need to do is - import dependencies in dependency tool, annotate code with OAS standards, hookup jersey and swagger into Jetty and enjoy using API docs. 
