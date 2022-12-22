let top_five_causes_of_death = { 1900: [], 1950: [], 2000: [] };
let leading_causes_of_death = [];
var death_rates_life_expectancy, width, height, svg;
var barPart = [];
var dummy = [];
var heat_map_range_min = Infinity;
var heat_map_range_max = 0;

document.addEventListener('DOMContentLoaded', () => {
  Promise.all([
    d3.csv(
      'data/age-adjusted-death-rates-for-selected-major-causes-of-death.csv',
      (d) => {
        return d;
      }
    ),
    d3.csv('data/death-rates-and-life-expectancy-at-birth.csv', (d) => {
      return d;
    }),
    d3.csv('data/top-five-leading-causes-of-death.csv', (d) => {
      return d;
    }),
    d3.csv('data/leading_causes_of_death_united_states.csv', (d) => {
      return d;
    }),
    d3.csv('data/data.csv', (d) => {
      return d;
    }),
  ]).then((values) => {
    const CAUSE = 'Cause';
    const DEATH_RATE = 'Age Adjusted Death Rate';
    const YEAR = 'Year';
    const major_causes_parsed = {};

    death_rates_major_causes_of_death = values[0];
    death_rates_life_expectancy = values[1];
    temp = values[2];
    leading_causes_of_death_data = values[3];
    dummy = values[4];

    death_rates_major_causes_of_death.forEach((data_obj) => {
      if (data_obj[DEATH_RATE] < 10000) {
        const cause = data_obj[CAUSE];
        const newObj = {
          year: parseInt(data_obj[YEAR]),
          death_rate: parseFloat(data_obj[DEATH_RATE]),
        };
        if (cause in major_causes_parsed) {
          major_causes_parsed[cause].push(newObj);
        } else {
          major_causes_parsed[cause] = [newObj];
        }
      }
    });

    lineChart(major_causes_parsed);

    const CAUSE_NAME = 'Cause Name';
    const DEATHS = 'Deaths';
    const leading_causes_2017_parsed = {};
    leading_causes_of_death_data.forEach((data_obj) => {
      if (data_obj[YEAR] === '2016' && data_obj[CAUSE_NAME] !== 'All causes') {
        const cause = data_obj[CAUSE_NAME];
        const deaths = data_obj[DEATHS];
        if (cause in leading_causes_2017_parsed) {
          leading_causes_2017_parsed[cause] += parseInt(deaths);
        } else {
          leading_causes_2017_parsed[cause] = parseInt(deaths);
        }
      }
    });
    bubbleChart(leading_causes_2017_parsed);

    for (let i = 0; i < 15; i++) {
      let year = 1900 + 50 * Math.floor(i / 5);
      let cause = temp[i]['Cause'];
      let number_of_deaths = temp[i]['Number of Deaths'];
      top_five_causes_of_death[year].push({
        cause: cause,
        number_of_deaths: number_of_deaths,
      });
    }

    heat_map_range_min = Infinity;
    heat_map_range_max = 0;
    for (const item of leading_causes_of_death_data) {
      let cause_name = item['Cause Name'];
      let deaths_log_transformed = Math.log2(item['Deaths']);
      let state = item['State'];
      let year = +item['Year'];
      if (state === 'United States') {
        leading_causes_of_death.push({
          cause_name: cause_name,
          deaths: deaths_log_transformed,
          state: state,
          year: year,
        });
      }
      heat_map_range_min = Math.min(heat_map_range_min, deaths_log_transformed);
      heat_map_range_max = Math.max(heat_map_range_max, deaths_log_transformed);
    }

    death_rates_life_expectancy.map(function (d) {
      d.year = new Date(+d.Year, 0, 1);
      d['Average Life Expectancy'] = +d['Average Life Expectancy (Years)'];
    });

    // data for all-races and both sexes
    for (let i = 0; i < 118; i++) {
      barPart[i] = death_rates_life_expectancy[i];
    }
    barchart();
    // end

    drawDonutChart(1900);
    drawHeatMap();

    innovative();
  });
});

function innovative() {
  d3.select('#inn_svg').selectAll('*').remove();

  const width = 1000;
  const height = 700;
  const margin = { top: 10, right: 30, bottom: 90, left: 40 };
  const svg = d3
    .select('#inn_svg')
    .append('g')
    .attr('transform', 'translate(50,0)');

  //svg.selectAll('*').remove();
  const xScale = d3
    .scaleOrdinal()
    .domain([0, 1])
    .range([50, width - 50]);

  const yScale = d3
    .scaleLinear()
    .domain([0, 20])
    .range([height - 50, 200]);

  // const g = svg
  //   .append('g')
  //   .attr('transform', 'translate(-50,650)')
  //   .call(d3.axisBottom(xScale));

  // svg.append('g').attr('class', 'yAxis').call(d3.axisLeft(yScale));

  var e = document.getElementById('attributes');
  var selectedAttribute = e.options[e.selectedIndex].text;
  var w = document.getElementById('years');
  var selectedYear = w.options[w.selectedIndex].value;

  const wave_svg = d3.select('#wave_svg');
  //console.log(leading_causes_of_death[0].deaths);

  for (i = 0; i < 198; i++) {
    //console.log(selectedAttribute + ", " + selectedYear);
    if (
      leading_causes_of_death[i].cause_name == selectedAttribute &&
      leading_causes_of_death[i].year == selectedYear
    ) {
      yValue = leading_causes_of_death[i].deaths;
      console.log(selectedAttribute + ' at ' + selectedYear + ' drawing');

      wave_svg.attr('transform', 'translate(0,' + yScale(yValue) + ')');

      svg
        .selectAll('.rect')
        .data(leading_causes_of_death)
        .enter()
        .append('rect')
        .attr('transform', 'translate(' + -50 + ',' + 0 + ')')
        .attr('width', 900)
        .attr('height', function (d) {
          return height - yScale(yValue) - 50;
        })
        .attr('x', function (d) {
          return xScale(0);
        })
        .attr('y', function (d) {
          return yScale(yValue);
        })
        .attr('fill', 'rgb(229,29,29)');

      svg
      .append('text')
      .attr('class', 'y label')
      .attr('text-anchor', 'end')
      .attr('y', -35)
      .attr('x', -300)
      .attr('transform', 'rotate(-90)')
      .text('Total Number of Deaths (Thousands)');
    }
  }
}

function barchart() {
  const width = 1300;
  const height = 800;
  const margin = { top: 10, right: 30, bottom: 90, left: 40 };
  const svg = d3
    .select('#bar_svg')
    .append('g')
    .attr('transform', 'translate(50,0)');

  const xScale = d3
    .scaleTime()
    .domain([new Date(1899, 0), new Date(2018, 0)])
    .range([50, width - 50]);

  const yScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([height - 50, 50]);

  const g = svg
    .append('g')
    .attr('transform', 'translate(-50,750)')
    .call(d3.axisBottom(xScale));

  svg.append('g').attr('class', 'yAxis').call(d3.axisLeft(yScale));

  // non-animation bar chart
  //   svg.selectAll("mybar")
  //   .data(barPart)
  //   .enter()
  //   .append("rect")
  //   .attr("transform", "translate("+ -52 + "," + 0 + ")")
  //   .attr('width',5)
  //   .attr('height', function(d){return height - yScale(d["Average Life Expectancy"]) - 50})
  //   .attr('x', function(d){return xScale(d.year)})
  //   .attr('y', function(d){return yScale(d["Average Life Expectancy"])})
  //   .attr("fill","pink");

  // animation bar chart
  svg
    .selectAll('mybar')
    .data(barPart)
    .enter()
    .append('rect')
    .attr('transform', 'translate(' + -52 + ',' + 8 + ')')
    .attr('width', 5)
    .attr('height', function (d) {
      return height - yScale(0) - 50;
    })
    .attr('x', function (d) {
      return xScale(d.year);
    })
    .attr('y', function (d) {
      return yScale(0);
    })
    .attr('fill', 'pink');

    svg
    .append('text')
    .attr('class', 'y label')
    .attr('text-anchor', 'end')
    .attr('y', -35)
    .attr('x', -300)
    .attr('transform', 'rotate(-90)')
    .text('Life Expectancy at Birth');

  //animation effects
  svg
    .selectAll('rect')
    .transition()
    .duration(100)
    .attr('y', (d) => yScale(d['Average Life Expectancy']))
    .attr('height', (d) => height - yScale(d['Average Life Expectancy'] - 8.3))
    .delay((d, i) => {
      return i * 20;
    });
}

function lineChart(data) {
  const data_to_graph = [];
  for (cause in data) {
    if (data[cause].length > 100) {
      data_to_graph.push({
        id: cause,
        items: data[cause],
      });
    }
  }

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  const width = 1100;
  const height = 800;
  const svg = d3
    .select('#linechart_svg')
    .append('g')
    .attr('transform', 'translate(50,0)');

  const x = d3
    .scaleTime()
    .domain([new Date(1900, 0), new Date(2017, 0)])
    .range([50, width - 50]);

  svg
    .append('g')
    .attr('transform', 'translate(-50,750)')
    .call(d3.axisBottom(x));

  const m = d3.max(data_to_graph, (d) => d3.max(d.items, (e) => e.death_rate));
  //console.log(m);
  const y = d3
    .scaleLinear()
    .domain([0, m])
    .range([height - 50, 50]);
  yAxis = d3.axisLeft(y);
  svg.append('g').attr('class', 'yAxis').call(yAxis);

  svg
    .append('text')
    .attr('class', 'y label')
    .attr('text-anchor', 'end')
    .attr('y', -35)
    .attr('x', -300)
    .attr('transform', 'rotate(-90)')
    .text('Age-Adjusted Death Rate');

  const singleLine = d3
    .line()
    .x((d) => x(new Date(d.year, 0)))
    .y((d) => y(d.death_rate));

  const lines = svg
    .selectAll('.line')
    .data(data_to_graph)
    .join((enter) => {
      const g = enter.append('g').attr('class', 'line');
      g.append('path')
        .style('fill', 'none')
        .style('stroke', (d) => colorScale(d.id))
        .style('stroke-width', '1')
        .attr('d', function (d) {
          return singleLine(d.items);
        })
        .attr('transform', 'translate(-50,0)');

      g.append('text')
        .attr('x', (d) => x(new Date(d.items[d.items.length - 1].year, 0)))
        .attr('y', (d) => y(d.items[d.items.length - 1].death_rate))
        .text((d) => d.id)
        .style('fill', (d) => colorScale(d.id))
        .attr('transform', 'translate(-40,5)');

      g.on('mouseover', function (d, i) {
        svg.selectAll('.line').style('opacity', 0.3);
        d3.select(this).style('opacity', 1);
      }).on('mouseout', function (d, i) {
        svg.selectAll('.line').style('opacity', 1);
      });
    });
}

function bubbleChart(data) {
  const dataset = { children: [] };
  for (key in data) {
    dataset.children.push({ Name: key, Count: data[key] });
  }
  //console.log(data);
  var diameter = 700;
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var bubble = d3.pack(dataset).size([diameter, diameter]).padding(1.5);

  var svg = d3.select('#bubblechart_svg');

  var nodes = d3.hierarchy(dataset).sum(function (d) {
    return d.Count;
  });

  var node = svg
    .selectAll('.node')
    .data(bubble(nodes).descendants())
    .enter()
    .filter(function (d) {
      return !d.children;
    })
    .append('g')
    .attr('class', 'node')
    .attr('transform', function (d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });

  node.append('title').text(function (d) {
    return d.Name + ': ' + d.Count;
  });

  node
    .append('circle')
    .attr('r', function (d) {
      return d.r;
    })
    .style('fill', function (d, i) {
      return color(i);
    });

  node
    .append('text')
    .attr('dy', '.2em')
    .style('text-anchor', 'middle')
    .text(function (d) {
      return d.data.Name;
    })
    .attr('font-family', 'sans-serif')
    .attr('font-size', function (d) {
      return d.r / 6;
    })
    .attr('fill', 'white');

  node
    .append('text')
    .attr('dy', '1.3em')
    .style('text-anchor', 'middle')
    .text(function (d) {
      return d.data.Count;
    })
    .attr('font-family', 'Gill Sans', 'Gill Sans MT')
    .attr('font-size', function (d) {
      return d.r / 5;
    })
    .attr('fill', 'white');

  d3.select(self.frameElement).style('height', diameter + 'px');
}

//
// #region Alex Yuwen
//
function drawArcLabel(year, arcLabel) {
  let deaths = top_five_causes_of_death[year].filter(
    (obj) => obj.cause === arcLabel
  )[0].number_of_deaths;
  let arcText = `${arcLabel}: ${deaths}`;
  d3.select('#pie_svg')
    .append('text')
    .text(arcText)
    .attr('x', 290)
    .attr('y', 200)
    .attr('text-anchor', 'middle');
}

function removeArcLabel() {
  d3.select('#pie_svg').select('text').remove();
}

function drawDonutChart(year) {
  var svg_width = 580;
  var svg_height = 400;
  var width = 360;
  var height = 360;
  var radius = Math.min(width, height) / 2;
  var donutWidth = 75;

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var svg = d3
    .select('#pie_svg')
    .append('svg')
    .append('g')
    .attr(
      'transform',
      'translate(' + svg_width / 2 + ',' + svg_height / 2 + ')'
    );

  var arc = d3
    .arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);

  var arcBorder = d3
    .arc()
    .innerRadius(radius)
    .outerRadius(radius + 1);

  var pie = d3
    .pie()
    .value(function (d) {
      return d.number_of_deaths;
    })
    .sort(null);

  var arcs = svg
    .selectAll('arcs')
    .data(pie(top_five_causes_of_death[year]))
    .enter();
  arcs
    .append('path')
    .attr('stroke', 'black')
    .style('stroke-width', '1px')
    .attr('d', arc)
    .attr('fill', (d, i) => color(d.data.cause))
    .on('mouseover', function (d, i) {
      d3.select(d.target).transition().style('stroke-width', '4px');
      drawArcLabel(year, i['data']['cause']);
    })
    .on('mouseout', function (d, i) {
      d3.select(d.target).transition().style('stroke-width', '1px');
      removeArcLabel();
    });
  arcs.append('path').attr('d', arcBorder).attr('fill', 'black');
}

function drawHeatMap() {
  var margin = { top: 40, right: 40, bottom: 60, left: 130 };
  var width = 1030;
  var height = 500;

  var svg = d3
    .select('#heat_svg')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var years = [
    1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
    2011, 2012, 2013, 2014, 2015, 2016,
  ];
  var cause_names = [
    "Alzheimer's disease",
    'Cancer',
    'CLRD',
    'Diabetes',
    'Heart disease',
    'Influenza and pneumonia',
    'Kidney disease',
    'Stroke',
    'Suicide',
    'Unintentional injuries',
  ];
  cause_names.reverse();

  var x = d3
    .scaleBand()
    .range([0, width - margin.left - margin.right])
    .domain(years)
    .padding(0.01);
  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));

  var y = d3.scaleBand().range([height, 0]).domain(cause_names).padding(0.01);
  svg.append('g').call(d3.axisLeft(y));

  var color = d3
    .scaleLinear()
    .range(['white', 'red'])
    .domain([heat_map_range_min, heat_map_range_max]);

  svg
    .selectAll()
    .data(leading_causes_of_death, function (d) {
      return d.year + ':' + d.cause_name;
    })
    .enter()
    .append('rect')
    .attr('x', function (d) {
      return x(d.year);
    })
    .attr('y', function (d) {
      return y(d.cause_name);
    })
    .attr('width', x.bandwidth())
    .attr('height', y.bandwidth())
    .style('fill', function (d) {
      return color(d.deaths);
    });
}

function drawHeatMapDummy() {
  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 30, bottom: 30, left: 30 };
  var width = 650;
  var height = 650;

  // append the svg object to the body of the page
  var svg = d3
    .select('#heat_svg')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Labels of row and columns
  var myGroups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  var myVars = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10'];

  // Build X scales and axis:
  var x = d3
    .scaleBand()
    .range([0, width - margin.left - margin.right])
    .domain(myGroups)
    .padding(0.01);
  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Build X scales and axis:
  var y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.01);
  svg.append('g').call(d3.axisLeft(y));

  // Build color scale
  var myColor = d3.scaleLinear().range(['white', '#69b3a2']).domain([1, 100]);

  svg
    .selectAll()
    .data(dummy, function (d) {
      return d.group + ':' + d.variable;
    })
    .enter()
    .append('rect')
    .attr('x', function (d) {
      return x(d.group);
    })
    .attr('y', function (d) {
      return y(d.variable);
    })
    .attr('width', x.bandwidth())
    .attr('height', y.bandwidth())
    .style('fill', function (d) {
      return myColor(d.value);
    });
}
//
// #endregion Alex Yuwen
//
