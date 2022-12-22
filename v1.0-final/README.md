# Final Writeup
 
**Title:** Let’s Talk About Death

**Members:** Sihyeon Kim, Andrew Seo, Alex Yuwen
 
## Overview:
<img width="1280" alt="Screen Shot 2022-11-27 at 11 16 16 PM" src="https://user-images.githubusercontent.com/59451513/204206974-f90748a2-5297-41d8-b128-8bfa9f72c58a.png">

Our scrollytelling project attempts to walk through a number of different statistics related to death, specifically the different causes of death and how they have changed over time. We utilize a number of different datasets in order to visualize how the leading causes of death have changed over the past century, highlighting the history of death in the United States as well as the biggest contributors to death in the modern world. By utilizing a number of visualization mediums to explore death statistics, we are able to view death through different lenses, allowing us to draw new insights from similar sets of data.


## **Data description:**

The first dataset will contain the death rates of 5 major causes of death each year from 1900 - 2017. 

Attributes:
Year
- Attribute Type: Ordered, Quantitative, Sequential
- Cardinality: 118
Cause
- Attribute Type: Categorical
- Cardinality: 5
Age-Adjusted Deaths
- Attribute Type: Ordered, Quantitative, Sequential
- Cardinality: 596

The second dataset will contain the death rates of several causes of death in each US state each year from 1999 - 2016.

Attributes:
Year
- Attribute Type: Ordered, Quantitative, Sequential
- Cardinality: 18
Cause Name
- Attribute Type: Categorical
- Cardinality: 11
State
- Attribute Type: Categorical
- Cardinality: 50
Deaths
- Attribute Type: Ordered, Quantitative, Sequential
- Cardinality: 10296
Age Adjusted Death Rate
- Attribute Type: Ordered, Quantitative, Sequential
- Cardinality: 10296

The third dataset will contain the average life expectancy of people in the US from 1900 to 2017.

Attributes:

Year
- Attribute Type: Ordered, Quantitative, Sequential
- Cardinality: 118

Race
- Attribute Type: Categorical
- Cardinality: 3

Sex
- Attribute Type: Categorical
- Cardinality: 3

Average Life Expectancy (Years)
- Attribute Type: Ordered, Quantitative, Sequential
- Cardinality: 1062

Age-adjusted Death Rate
- Attribute Type: Ordered, Quantitative, Sequential
- Cardinality: 1062

https://datasetsearch.research.google.com/search?src=0&query=death&docid=L2cvMTFqbno5dDhocA%3D%3D&filters=WyJbXCJpc19hY2Nlc3NpYmxlX2Zvcl9mcmVlXCIsW11dIl0%3D&property=aXNfYWNjZXNzaWJsZV9mb3JfZnJlZQ%3D%3D

https://data.world/us-hhs-gov/3fd8159c-1043-4ac5-b030-547c998c3bcc

Some data preprocessing was performed.  We transformed the raw datasets into Javascript data structures that could be more easily utilized and manipulated for D3 visualization. Using methods such as data wrangling and data parsing.


## **Goals and Tasks**

The intended tasks supported by our visualization are to identify and compare the leading causes of death in each state and in the entire United States.


## **Idioms**

*Succinctly describe the interface that you have built.*

We built a series of charts to visualize how death rates from the leading causes of death and life expectancy have changed over the past century. Our interface is a simple black webpage with white text. As the user scrolls down, they can see each of the visualizations, each headed by a title.

*What are the implemented visualizations and what do they allow a user to do?*

The line chart shows a select five leading causes of death and how each of their age-adjusted death rates have fluctuated from 1900-2017. It allows the user to hover over individual lines to highlight/accent them as compared to the other lines.

The donut chart visualizes the top five leading causes of death in America in 1900.  It provides the user with a valuable historical perspective on causes of death more than a century ago.

The bar chart visualizes the life expectancy of both races (black and white) and both sexes (male and female) at birth starting from years 1999 to 2017.

The bubble chart visualizes the top 10 leading causes of death in the United States, with each bubble’s size representing the number of deaths that cause is responsible for in 2016.

The heat map visualizes the most common causes of death between 1999 and 2016. It provides the user with a valuable perspective on the relative prevalence of the leading causes of death, using color intensity as a visual indicator.

The innovative visualization visualizes the death tolls of top 10 leading causes of death in the U.S. from years 1999 to 2016. It lets the user select the disease and year attribute so they can look at the death tolls of a certain disease at a certain year specifically.

*For each visualization, describe the encoding choices and your rationale for the design decisions.*

The line chart encodes the height of the line over a given year as the age-adjusted death rate for that cause of death for that year. This design allows the user to easily visualize and compare the difference in magnitude between the different causes of death and see how the death rate has changed over time.

<img width="558" alt="Screen Shot 2022-11-27 at 11 16 59 PM" src="https://user-images.githubusercontent.com/59451513/204207089-d2155da9-7242-4651-9443-aa9b1b969799.png">

The bubble chart encodes the size of the bubble surrounding a specific cause of death as proportional to the number of deaths that cause was responsible for in 2016. This design allows for the user to easily see which causes had the greatest magnitude for that year and compare the relative impact of each cause in 2016.

<img width="558" alt="Screen Shot 2022-11-27 at 11 17 14 PM" src="https://user-images.githubusercontent.com/59451513/204207125-6e618bd6-7338-4fd7-8c9a-2d7eb9aa89bc.png">

The bar chart encodes the height of the line (y-axis) as age expectancy (age at death) and the x-axis as each year starting from 1999 to 2017. Each bar indicating the life expectancy at each year being next to each other makes it easy for users to directly compare the statistics of how the average life expectancy of people generally increased from the past.

<img width="539" alt="Screen Shot 2022-11-27 at 11 17 48 PM" src="https://user-images.githubusercontent.com/59451513/204207197-98df183a-7147-4a71-ae1e-93f5fb0f87bc.png">

The innovative design encodes the height of the tank (or a sink) visualization as the total number of deaths caused by a certain disease that is selected from the Select Attribute dropdown at a certain year selected from the Year dropdown.The total number of death marked on the height of the visualization (y-axis) is written in the unit of a thousand. Therefore, the level of 10 means a total of 10,000 deaths.

<img width="539" alt="Screen Shot 2022-11-27 at 11 18 18 PM" src="https://user-images.githubusercontent.com/59451513/204207285-a67cbae2-fb99-4d01-ae8a-bd51b90f4711.png">

The donut chart encodes the size of the donut slice as the number of deaths for a given cause of death in a given year, both specified by the user.  This design allows the user to easily visualize and compare the difference in prevalence between the top five leading causes of death in 1900’s America.

<img width="558" alt="Screen Shot 2022-11-27 at 11 18 37 PM" src="https://user-images.githubusercontent.com/59451513/204207330-a1cca947-2f30-4ccd-8ffd-01ff998dc184.png">

The heat map encodes the color intensity of a given square on the map as the prevalence of deaths for the year and cause of death represented by that square.  This design allows the user to easily visualize and compare the difference in prevalence between the most common causes of death in America between 1999-2016.  The design also allows the user to visualize how the prevalence of different causes of death has changed over time.

<img width="558" alt="Screen Shot 2022-11-27 at 11 18 54 PM" src="https://user-images.githubusercontent.com/59451513/204207394-e0b24502-edaf-4a97-8443-0f1c7ad5e850.png">

*What are the interactions?*

The line chart allows users to hover over individual lines, which focuses the chart on that line by modifying the opacity of the other lines.

The donut chart allows users to hover their mouse over each section and show the name of the disease and the total count of deaths. 

The innovative visualization design allows users to select a disease and year to visualize the number of deaths caused by that disease in that year.

*How are the views linked?*

The views for our charts are not linked.

*What algorithms are necessary to support your idioms?*

We employed some standard algorithms for data preprocessing, which involved iteration through raw data then transforming and mapping the data into new data structures suitable for use in data visualization.

## **Reflection**

*Describe how your project developed from an initial proposal to WIP to the final product.*

At first, we came up with the overall concept, which is death. We wanted to visualize different datasets to show the different causes and rates of deaths mainly related to disease. Our project did not have major changes in plans or contents since the initial proposal. 

*Did the goals change?*

The goals did not change. There was one small change in content, which was also mentioned in the WIP report, where we decided to replace a pie chart with a donut chart to implement the desired interaction effects. 

*How realistic was the original proposal?*

The original proposal was very realistic. We had planned out the steps in a timely manner from the beginning and had meetings regularly to keep up with the progress and discuss the next steps. Therefore, we were able to finish each step of the project in time.

*Were there any unexpected challenges that arose? Were there features you wanted to implement that you ultimately did not? What workarounds did you do?*

There were no unexpected challenges that arose. All the features that we planned to implement in the initial proposal were implemented successfully. 

*What would you do differently next time?*
We would consider implementing more animation effects to provide a smoother user experience.

## **Team workload**

*Briefly describe which team member worked on which tasks.*

Andrew Seo:

- Line Chart
- Bubble Chart

Alex Yuwen:

- Pie Chart
- Heat Map

Sihyeon Kim:

- Bar Chart
- Innovative Design

Our workloads were well distributed and team members helped each other when any one of us encountered issues.

