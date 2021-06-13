---
layout: post
title: 	"Hooking up OpenAPI with Jetty Server"
data:	2021-06-12 06:038:56
categories: [java, jetty, swagger, openapi]
---

### Background

Jetty 11.X is released now and has deprecated its support for `javax` namespace required for the development of API. Instead, it has started supporting `jakarta` namespace now and this changes the game entirely. Because when you need to annotate your API, we `import javax.ws.rs.*` packages which is now on will be `import jakarta.ws.rs.*`. Nonetheless, swagger (OpenAPI) documentation that used to seamlessly integrate with core java APIs now has an additional dependency whether is a maven or gradle based project. Lets get started into the detailed process of how the new integration is done. 

### What is Jetty?

The Ecplise Jetty Project provides a web server and servlet container, additionally providing support for HTTP/2, WebSocket, OSGi, JMX, JNDI, JAAS and many other integrations. These components are open source and are freely available for commercial use and distribution.

Jetty is used in a wide variety of projects and products, both in development and production. Jetty has long been loved by developers due to its long history of being easily embedded in devices, tools, frameworks, application servers, and modern cloud services.

Biggest advantage of using Jetty is that Jetty has been designed to have a small memory foot print. This is a critical basis for good performance and scalability. The less memory the server uses, the more memory is available for the application and/or more instances of the server can be run on virtual hardware. As such Jetty is very cloud friendly. 

### What is Jersey?



### What is Swagger/OpenAPI?


### What steps it should follow?

The rules are very simple and as follows:
1. Create a jetty server 
2. Intercept API using Jersey
3. Add OpenAPI servlet into Jetty Server
4. Export API docs
5. The class should not extend from any other Java class as in

### STEP 1. Create Jetty Server

```java
```

### STEP 2. Intercept API using Jersey

```java
```

### STEP 3. Add OpenAPI servlet into Jetty Server

```java
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
### Summary

In J2EE environment, POJO based programming model helps a lot to achieve the functionalities of dependency injection and inversion of control. Also this type of practice helps writing modules that are high cohesive and low coupled thereby making the project robust. Spring, one of the most popular Java framework in the industry always promotes the POJO based development. 
