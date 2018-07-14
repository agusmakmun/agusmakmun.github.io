---
layout: post
title: 	"POJO explained in details"
data:	2018-07-14 02:02:56
categories: [java, j2ee, backend]
---

### What is the concept of pojo?

POJO stands for **P**lain **O**ld **J**ava **O**bject that follows a few simple rule(s) and it becomes useful in developing codes with dependency injection and inversion of control features. In Software Engineering, this term is used to designate very simple Java objects. These objects have no restrictions or dependencies on them. They do not contain someone else's properties.

The term POJO was first coined by Martin Fowler, Rebecca Parsons and Josh MacKenzie in September 2000. Martin Fowler is a british software developer. 

### What rule(s) it should follow?

The rules are very simple and as follows:
1. The class is public.
2. The properties of the class are all private.
3. For each property, there are public getter and public setter methods.
4. The class should not extend from any other Java class as in
```java
	public class Foo extends ParentFoo {
		...
	}
```
5. The class should not implement any interface as in
```java
	public class Foo implements FooInterface {
		...
	}
```
6. The class definition should not have any annotation(s).
```java
	@java.persistence.Entity public class Foo {
		...
	}
```

### How a typical POJO class would look like?

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

In J2EE environment, POJO based programming model helps a lot to achieve the functionalities of dependency injection and inversion of control. Also this type of practice helps writing modules that are high cohesive and low coupled thereby making the project robust. Spring, one of the most popular Java framework in the industry always promotes the POJO based development. 
