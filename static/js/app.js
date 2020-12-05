//Use the D3 library to read in samples.json.

var selectId = d3.select("#selDataset");

d3.json("samples.json").then((importedData) => {
  var idName = importedData.names;
  console.log(idName)

  idName.forEach((id) => {
    selectId
      .append("option")
      .property("value", id)
      .text(id);
  });

  optionChanged(idName[0]);
});

//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
//Use sample_values as the values for the bar chart.
//Use otu_ids as the labels for the bar chart.
//Use otu_labels as the hovertext for the chart.

function optionChanged(selNumber) {
  d3.json("samples.json").then((data) => {
  
    var sampleData = data.samples;
    var results = sampleData.filter(data => data.id == selNumber);
    var result = results[0];
    console.log(result);

    var sampleValues = result.sample_values;
    var otuIds = result.otu_ids;
    var otuLabels = result.otu_labels;
    
    var label = otuIds.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    
    var trace = {
      x: sampleValues.slice(0, 10).reverse(),
      y: label,
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    };

    var data = [trace];

    var layout = {
      title: "Top 10 OTUs",
      margin: {
        l: 100, 
        t: 40
       }
    };

    Plotly.newPlot("bar", data, layout);

//Create a bubble chart that displays each sample.
//Use otu_ids for the x values.
//Use sample_values for the y values.
//Use sample_values for the marker size.
//Use otu_ids for the marker colors.
//Use otu_labels for the text values.

var results = sampleData.filter(data => data.id == selNumber);
var result = results[0];


var sampleValues = result.sample_values;
var otuIds = result.otu_ids;
var otuLabels = result.otu_labels;

var trace1 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Earth"
      }
    };

    var data = [trace1];

    var layout = {
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: {
        t: 20 }
    };

Plotly.newPlot("bubble", data, layout);

});
  

//Display the sample metadata, i.e., an individual's demographic information.
//Display each key-value pair from the metadata JSON object somewhere on the page.
//Update all of the plots any time that a new sample is selected.

d3.json("samples.json").then((data) => {
  var metadata = data.metadata;
  console.log(metadata);

  var results = metadata.filter(data => data.id == selNumber);
  var info = d3.select("#sample-metadata");

  info.html("");

  Object.entries(results[0]).forEach(([key, value]) => {
    info.append("h5").text(`${key}: ${value}`);
    });

  });
}
