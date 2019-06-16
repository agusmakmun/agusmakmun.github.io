---
layout: post
title:  "The Ease of Web-scraping with Python"
date:   2019-04-12 00:00:00 +2200
categories: [python]
---
Day-in-day-out, we face a myriad of tasks at work, and sometimes even from friends. Not too long ago, a friend of mine approached me to help with a task her manager assigned her.

![Screenshot broadcast](https://raw.githubusercontent.com/terryyylim/terryyylim.github.io/master/static/img/_posts/post1_image1.png  "Screenshot broadcast")

The task was simple, to find out the location of all Headquarters in a list of companies. The list consisted of approximately 1300 companies.

Just a little disclaimer first, in case you guys are wondering how could my friend just throw her job to me! My friend is actually really hardworking. She actually spent 5 days manually searching google for each company’s information and keying them in one at a time, to the excel spreadsheet. But unfortunately… she lost all her data because she forgot to save. A very costly mistake, oops! (Lesson 1: Always save your work at timely intervals)

She read online that it can be done with Python scraping but with no experience in it, she reckon that would take her too much time. With her deadline just round the corner, she had no choice but to ask around for help. When she approached me, I was really excited about it, since I could put what I’ve learnt previously to good use.

Alright, enough story-sharing, let’s get down to scraping!

## Getting Started
Make sure you have Python on your machines before we begin.

**Mac Users**  
Python comes pre-installed on Mac OS X so it is easy to start using. Open up the terminal and type `python —-version` . You should be able to see your Python version pop-up.

**Window Users**  
Python is not usually installed on Windows, so you may download it here.

Next, for scraping, we will utilize the BeautifulSoup library.
So friends, open up your terminal and type:
`pip install beautifulsoup4`

Before jumping into scraping websites, you should first familiarize yourself with HTML tags.

1. All HTML documents must start with a document type declaration: `<!DOCTYPE html>`.
2. The HTML document itself begins with `<html>` and ends with `</html>`.
3. The visible part of the HTML document is between `<body>` and `</body>`.
4. HTML headings are defined with the `<h1>` to `<h6>` tags.
5. HTML paragraphs are defined with the `<p>` tag.
6. HTML links are defined with the `<a>` tag.
7. These are just some basic tags, and there are many more such as HTML table with `<table>` tag, table row with `<tr>` tag etc. Read all about them on W3Schools website [here](https://www.w3schools.com/HTML/)!

Take note
Before scraping any website, ensure you’ve checked through their Terms and Conditions for the legal use of their data. Some websites also have mechanisms in place to prevent crawling of information. Remember to ask for permission if necessary!
Layout of websites may change over-time, meaning HTML tags may change and your web-scraper may not work anymore. 

Why? More information on this later!
Do not crawl data too aggressively on the website as you may crash it.

**Analyzing the Web-Page**  
As mentioned earlier, it is vital to check out the HTML tags prior to scraping. Let’s start with a simple page from Glassdoor as an example. We can easily do that by right-clicking on any page and clicking the `inspect` button.

![Screenshot broadcast](https://raw.githubusercontent.com/terryyylim/terryyylim.github.io/master/static/img/_posts/post1_image2.png  "Screenshot broadcast")

By simply hovering your cursor around the webpage, you will be able to find the respective HTML tag that nests the information you need.

From the `DevTools` view, under `Elements` section, we can see that there are multiple similar HTML tags `<div class=“infoEntity”>`. How can we then ensure we are getting the correct information we want?

Fear not, and let’s take a look at the code!

## Code!!!
Before starting, let’s import all the libraries we’ll need.

import requests
from bs4 import BeautifulSoup as BS
Next, we’ll utilize the requests library simple API to get the HTML of a webpage.

`r = requests.get('http://www.example.com', timeout=10)`  
It is advisable to set a timeout, to stop waiting for a response after a given number of seconds with the timeout parameter. Failure to do so can cause your program to hang indefinitely.

Then, we’ll access Response object, r body as bytes, by r.content and parsing the document with lxml, since CSS selectors are all we need, and also lxml is way faster than the other options.

`page = BS(r.content, 'lxml')`  
Next, we’ll extract a list of all the information nested within the similar `<div class=“infoEntity”>` HTML tags. This can be done easily with BeautifulSoup’s `findall` API.

![Screenshot broadcast](https://raw.githubusercontent.com/terryyylim/terryyylim.github.io/master/static/img/_posts/post1_image3.png  "Screenshot broadcast")

As we expand each `<div>` tag further, we’ll notice a similar pattern, where the “headers” are found within the `<label>` tags and the information we want are found within the `<span>` tags. Let’s tackle this one step at a time.

We’ll extract the text from these HTML tags first.

```python
# Returns a list of tags
relevant_tags = page.find_all('div', {'class': 'infoEntity'})
relevant_info = []
for tag in relevant_tags:
    relevant_info.append(tag.get_text())
# Never forget list comprehension
relevant_info = [tag.get_text() for tag in page.find_all('div', {'class': 'infoEntity'})]
# How relevant_info should look like
# ['Websitewww.glassdoor.com', 'HeadquartersMill Valley, CA', 'Size501 to 1000 employees', 'Founded 2007', ...etc]
```
Since we are only interested in the location of the headquarters, let’s extract only the string with “Headquarters” in it.

```python
# Get string with 'Headquarters' in it
hq_string = [hq for hq in relevant_info if 'Headquarters' in hq][0]
# hq_string = "HeadquartersMill Valley, CA"
# Extract only the location
# Without getting index 1, it returns ['Head', 'Mill Valley, CA']
hq_location = re.split('quarters', hq_string)[1]
```
And there you go! The information you need!

Not forgetting, how should you extract the information into the excel spreadsheet?

We can utilize the popular Pandas library. Install it using `pip install pandas`.

```python
# Import pandas
import pandas as pd
"""
Reading your existing company names ONLY csv file; Ensure your code and csv file is in the same directory if you're using the code format below
"""
companies_df = pd.read_csv('companies.csv')
companies_df.loc[companies_df['company'] == 'glassdoor', 'headquarters'] = hq_location
companies_df.to_csv('finishedmywork.csv')
```

## Advanced Usage
Well, let’s say if you had to further scrape more web-links nested within a HTML page, I’d recommend creating a Class object to store the information, so that you can easily access the information again.

```python
class Company:
  def __init__(self, name, google_query):
    self.name = name # name of the company you just scraped
    self.nested_urls = [] # list of urls found on first visited page
      
  def store_nested_url(self, url):
    self.nested_urls.append(url)
def get_all_nested_urls(url):
  r = requests.get("www.example.com", timeout=10)
  first_page = BS(r.content, "lxml")
  # all 'href' tags are within 'a' tags
  all_a_tags = first_page.find_all("a")
  all_href = [url['href'] for url in all_a_tags]
```
In such situations, I’d really encourage you to find a way to automate the process since it is cumbersome to perform it manually. Stay tuned for more automation tricks!

If you have any questions, please feel free to leave a comment below.

**References**  
- https://www.w3schools.com
- https://www.crummy.com/software/BeautifulSoup/bs4/doc/
- http://docs.python-requests.org/en/master/user/quickstart/