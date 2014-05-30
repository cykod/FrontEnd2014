function loadGraphs() { 
  d3.text("hiring.csv",function(hiringText) { 
    d3.text("responses.csv", function(datasetText) {

      var data= d3.csv.parse(datasetText);
      var hiring = d3.csv.parse(hiringText);

      var dollars = //range(data,"salary")
      ["$10,000 - $30,000", "$30,000 - $50,000", "$50,000 - $80,000", "$80,000 - $100,000", "$100,000 - $130,000", "$130,000+"]

      barGraph("#graph1",data, "salary", dollars,false);

      var years = ["<1 years", "1-2 years", "2-5 years", "5+ years"] 

      barGraph("#years",data, "years", years);

      var jobs = [ "Myself",  "A Web Consultency", "A Web Startup","A Large Web Company",  "A Non-web company", "A Large Non-web company",""]
      //range(data,"job");
  //    barGraph("#job",data, "job", jobs);


      var levels = ["Jr. (<2 years)","Experienced (2-4 years)", "Senior (4+ years)", "Tech Lead"] 
      splitRange(hiring,"levels");
      barGraph("#levels",hiring, "levels", levels,true);

 var important =  ["Experience in specific technologies", "References from previous jobs", "Willingness to learn new technologies", "Interest in the mission of the company", "Involvement in the community", "GitHub profile", "Computer Science Degree", "Well formatted resume", "Involvement in open-source projects", "Past experience", "Creative Thinking"]
      splitRange(hiring,"important");
      barGraph("#important",hiring, "important", important,true);


      var tech = ["JavaScript", "jQuery", "Sass", "Ember.js", "Responsive Design", "Backbone.js", "Node.js", "Less", "Angular.js", "D3.js", "css", "SVG", "WebRTC", "dojo","CoffeeScript", "WebGL"]
      splitRange(hiring,"tech");
      barGraph("#tech",hiring, "tech", tech,true);

      var use = ["JavaScript", "jQuery", "Less", "Backbone.js", "Responsive Design", "Sass", "SVG", "Ember.js", "Node.js", "D3.js", "Angular.js", "HTML5 Canvas", "CoffeeScript","Bootstrap"]
      splitRange(data,"use");
      barGraph("#use",data, "use", use,true);
    });

  });
}

function range(data,column) {
  var values = [];
  _.map(data,function(d) { values = values.concat(d[column]); });
  return d3.set(values).values();
}
function splitRange(data,column) {
  var values = [];
  _.map(data,function(d) { 
    d = (d[column]||"").split(", ");
    values = values.concat(d); 
  });
  return d3.set(values).values();
}




function barGraph(target,input,column,buckets,split) {

  var values = {};
  _.map(input,function(d) {
    var val = d[column];
    if(val && split) { 
      _.map(val.split(", "),function(v2) { 
        values[v2] = values[v2] || 0;
        values[v2] += 1;
      });
    } else {
      values[val] = values[val] || 0;
      values[val] += 1;
    }
  });

  // A formatter for counts.
  var formatCount = d3.format(",.0f");

  var margin = {top: 10, right: 100, bottom: 100, left: 30},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom,
  colWidth = width / buckets.length

  var x = d3.scale.ordinal()
  .domain(buckets)
.rangeBands([0,width]);


var data = _.map(buckets,function(d) { 
  return [ d, values[d] ];
});


var y = d3.scale.linear()
.domain([0, d3.max(data, function(d) { return d[1]; })])
.range([height, 0]);

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");

var svg = d3.select(target).append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var bar = svg.selectAll(".bar")
.data(data)
.enter().append("g")
.attr("class", "bar")
.attr("transform", function(d,i) { return "translate(" + x(d[0]) + "," + y(d[1]) + ")"; });

bar.append("rect")
.attr("x", 1)
.attr("width", colWidth - 1)
                .attr("height", function(d) { return height - y(d[1]); });

                bar.append("text")
                .attr("dy", ".75em")
                .attr("y", 6)
                .attr("x", colWidth / 2)
                .attr("text-anchor", "middle")
              .text(function(d) { return formatCount(d[1]); });

              svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
              .selectAll("text")  
              .style("text-anchor", "start")
              .attr("transform", function(d) {
                return "rotate(10) translate(0,5)" 
              });

            }
