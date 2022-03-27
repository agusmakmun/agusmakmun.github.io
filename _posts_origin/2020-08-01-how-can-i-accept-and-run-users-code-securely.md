---
layout: post
title:  "How can i accept and run user's code securely on my web app?"
date:   2020-08-01 20:02:00 +0700
categories: [python, django, security]
---


I am working on a django based web app that takes python file as input which contains some function,
then in backend i have some lists that are passed as parameters through the user's function,
which will generate a single value output.
The result generated will be used for some further computation.


Here is how the function inside the user's file look like :

```python
def somefunctionname(list):

    ''' some computation performed on list'''

    return float value
```

At present the approach that i am using is taking user's file as normal file input.
Then in my `views.py` i am executing the file as module and passing
the parameters with eval function. Snippet is given below.

Here modulename is the python file name that i had taken from user and importing as module

```python
exec("import "+modulename)

result = eval(f"{modulename}.{somefunctionname}(arguments)")
```

Which is working absolutely fine. But i know this is not the secured approach.


My question, Is there any other way through which i can run
users file securely as the method that i am using is not secure ?
I know the proposed solutions can't be full proof but what are the other ways
in which i can run this (like if it can be solved with dockerization
then what will be the approach or some external tools that i can use with API )?
Or if possible can somebody tell me how can i simply sandbox this or any tutorial that can help me..?

Any reference or resource will be helpful.

-------------------------

#### Answer


It is an important question. In python sandboxing is not trivial.

It is one of the few cases where the question which version of python interpreter you are using.
For example, Jyton generates Java bytecode, and JVM has its own mechanism to run code securely.

For CPython, the default interpreter,
originally there were some attempts to make a [restricted execution mode][1],
that were abandoned long time ago.

Currently, there is that unofficial project, [RestrictedPython][2] that might give you what you need.
It is **not a full sandbox**, i.e. will not give you restricted filesystem access or something,
but for you needs it may be just enough.

Basically the guys there just rewrote the python compilation in a more restricted way.

What it allows to do is to compile a piece of code and then execute,
all in a restricted mode. For example:

```python
from RestrictedPython import safe_builtins, compile_restricted

source_code = """
print('Hello world, but secure')
"""

byte_code = compile_restricted(
    source_code,
    filename='<string>',
    mode='exec'
)
exec(byte_code, {__builtins__ = safe_builtins})

>>> Hello world, but secure
```

Running with __builtins__ = safe_builtins disables the *dangerous* functions like open file, import or whatever.
There are also other variations of __builtins__ and other options, take some time to read the docs, they are pretty good.

**EDIT:**

Here is an example for you use case

```python
from RestrictedPython import safe_builtins, compile_restricted
from RestrictedPython.Eval import default_guarded_getitem


def execute_user_code(user_code, user_func, *args, **kwargs):
    """ Executed user code in restricted env
        Args:
            user_code(str) - String containing the unsafe code
            user_func(str) - Function inside user_code to execute and return value
            *args, **kwargs - arguments passed to the user function
        Return:
            Return value of the user_func
    """

    def _apply(f, *a, **kw):
        return f(*a, **kw)

    try:
        # This is the variables we allow user code to see. @result will contain return value.
        restricted_locals = {
            "result": None,
            "args": args,
            "kwargs": kwargs,
        }

        # If you want the user to be able to use some of your functions inside his code,
        # you should add this function to this dictionary.
        # By default many standard actions are disabled. Here I add _apply_ to be able to access
        # args and kwargs and _getitem_ to be able to use arrays. Just think before you add
        # something else. I am not saying you shouldn't do it. You should understand what you
        # are doing thats all.
        restricted_globals = {
            "__builtins__": safe_builtins,
            "_getitem_": default_guarded_getitem,
            "_apply_": _apply,
        }

        # Add another line to user code that executes @user_func
        user_code += "\nresult = {0}(*args, **kwargs)".format(user_func)

        # Compile the user code
        byte_code = compile_restricted(user_code, filename="<user_code>", mode="exec")

        # Run it
        exec(byte_code, restricted_globals, restricted_locals)

        # User code has modified result inside restricted_locals. Return it.
        return restricted_locals["result"]

    except SyntaxError as e:
        # Do whaever you want if the user has code that does not compile
        raise
    except Exception as e:
        # The code did something that is not allowed. Add some nasty punishment to the user here.
        raise
```

Now you have a function `execute_user_code`, that receives some unsafe code as a string,
a name of a function from this code, arguments, and returns the return value of the function with the given arguments.

Here is a very stupid example of some user code:

```python
example = """
def test(x, name="Johny"):
    return name + " likes " + str(x*x)
"""
# Lets see how this works
print(execute_user_code(example, "test", 5))
# Result: Johny likes 25
```

But here is what happens when the user code tries to do something unsafe:

```python
malicious_example = """
import sys
print("Now I have the access to your system, muhahahaha")
"""
# Lets see how this works
print(execute_user_code(malicious_example, "test", 5))
# Result - evil plan failed:
#    Traceback (most recent call last):
#  File "restr.py", line 69, in <module>
#    print(execute_user_code(malitious_example, "test", 5))
#  File "restr.py", line 45, in execute_user_code
#    exec(byte_code, restricted_globals, restricted_locals)
#  File "<user_code>", line 2, in <module>
#ImportError: __import__ not found
```

**Possible extension:**

Pay attention that the user code is compiled on each call to the function.
However, it is possible that you would like to compile the user code once,
then execute it with different parameters.
So all you have to do is to save the `byte_code` somewhere,
then to call exec with a different set of `restricted_locals` each time.

  [1]: https://docs.python.org/2/library/rexec.html
  [2]: https://restrictedpython.readthedocs.io/en/latest/index.html


------------------

Original Issue: https://stackoverflow.com/q/63160370/6396981
