---
layout: post
title:  "LST and NDVI Time series using google earth engine"
date:   2021-08-04 
categories: [study]
---
---
**impormation**

site: Korea and japan (123, 30, 148, 45)

time: 2010 ~ 2020 (6~8month)

method: GEE, MODIS

---

**LST CODE**
```

var dataset = ee.ImageCollection('MODIS/006/MOD11A2')
.filterDate('2000-06-01','2020-09-01') .filter(ee.Filter.dayOfYear(152, 244));
var LST = dataset.select('LST_Day_1km');

LST = LST.map(function(image) {
return image.addBands(image.multiply(0.02).subtract(273.15).rename('Daytime_LST'));
 });
var LST_degC = LST.select('Daytime_LST');

var LST_degC_2018 = LST.select('Daytime_LST').filterDate('2000-06-01','2020-09-01').filter(ee.Filter.dayOfYear(152, 244));
var rectangle = ee.Geometry.Rectangle([123, 30, 148, 45]);


var series1 = ui.Chart.image.series(LST_degC_2018, geometry, ee.Reducer.mean(), 1000);
print(series1); //2018 年のみ 2018년도만
var series2 = ui.Chart.image.doySeriesByYear(
LST_degC, 'Daytime_LST', rectangle, ee.Reducer.mean(), 1000);
print(series2); //2010 年~2020 年Map.addLayer(rectangle);

Map.addLayer(rectangle);

![ee-chart (1)](https://user-images.githubusercontent.com/88094893/128096574-1fda2c8c-ef25-4105-a71d-07eca6dc4165.png)

```

![ee-chart](https://user-images.githubusercontent.com/88094893/128096567-1f4b52f5-ca29-4220-a6be-7cf99f7d73eb.png)

![ee-chart (1)](https://user-images.githubusercontent.com/88094893/128096579-07b3c2c7-bb5d-4dc0-bce6-fb59de2aa7d0.png)

