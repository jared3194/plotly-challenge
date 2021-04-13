// Function to pull names from json file and add them in the filter


var drawChart = function(otu_ids, sample_value, hoverText, metadata) {


    var metadata_panel = d3.select("#sample-metadata");
    metadata_panel.html("");
    Object.entries(metadata).forEach(([key, value]) => {
        metadata_panel.append("p").text(`${key}: ${value}`);
    });
  
    var trace = {
        x: sample_value.slice(0, 10).reverse(),
        y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        text: hoverText,
        type: 'bar',
        orientation: 'h'
    };
  
    var data = [trace];
  
    Plotly.newPlot('bar', data);
  
    var trace2 = {
        x: otu_ids,
        y: sample_value,
        text: hoverText,
        mode: 'markers',
        marker: {
            size: sample_value,
            color: otu_ids
        }
    };
  
    var data2 = [trace2];
  
    Plotly.newPlot('bubble', data2);
  
  
  };
  
  var populateDropdown = function(names) {
  
    var selectTag = d3.select("#selDataset");
    var options = selectTag.selectAll('option').data(names);
  
    options.enter()
        .append('option')
        .attr('value', function(d) {
            return d;
        })
        .text(function(d) {
            return d;
        });
  
  };
  
  var optionChanged = function(newValue) {
  
    d3.json("samples.json").then(function(data) {
  
    sample_new = data["samples"].filter(function(sample) {
  
        return sample.id == newValue;
  
    });
    
    metadata_new = data["metadata"].filter(function(metadata) {
  
        return metadata.id == newValue;
  
    });
    
    
    otu_ids = sample_new[0]["otu_ids"];
    sample_value = sample_new[0]["sample_values"];
    hoverText = sample_new[0]["otu_labels"];
    
    drawChart(otu_ids, sample_value, hoverText, metadata_new[0]);
    });
  };
  
  d3.json("samples.json").then(function(data) {
  
    //Populate dropdown with names from json file
    populateDropdown(data["names"]);
  
    //Initialize the page with the first value in the json file
    otu_ids = data["samples"][0]["otu_ids"];
    sample_value = data["samples"][0]["sample_values"];
    hoverText = data["samples"][0]["otu_labels"];
    metadata = data["metadata"][0];
  
    //Draw the chart on load
    drawChart(otu_ids, sample_value, hoverText, metadata);
  
  
  });
