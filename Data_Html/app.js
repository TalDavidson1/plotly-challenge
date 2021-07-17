function buildMetadata(selection) {

    // Read the json data
    d3.json("samples.json").then((Data) => {

        console.log(Data);

        // Filter the data to get metadata
        var filteredData = Data.metadata;
        console.log(filteredData);

        var sample = filteredData.filter(item => item.id == selection);
        console.log("showing sample[0]:");
        console.log(sample[0]);

        var metadata = d3.select("#sample-metadata").html("");

        Object.entries(sample[0]).forEach(([key, value]) => {
            metadata.append("p").text(`${key}: ${value}`);
        });

        console.log("next again");
        console.log(metadata);
    });
}

//Get the data and generate the plots
function buildcharts(selection) {

    // Fetch the JSON data
    d3.json("samples.json").then((Data) => {

        var filteredData = Data.samples;
        console.log(filteredData);

        var items = filteredData.filter(item => item.id == selection)[0];
        console.log(items);

        // Lets get stuff for the barchart
        var values = items.sample_values; 
        var barChartValues = values.slice(0, 10).reverse();
        console.log(barChartValues);

        var idValues = items.otu_ids;
        var barChartLabels = idValues.slice(0, 10).reverse();
        console.log("otu_ids");
        console.log(barChartLabels);

        var reformattedLabels = [];
        barChartLabels.forEach((label) => {
            reformattedLabels.push("OTU " + label);
        });

        console.log("reformatted");
        console.log(reformattedLabels);

        var hovertext = items.otu_labels;
        var barCharthovertext = hovertext.slice(0, 10).reverse();
        console.log("otu_labels");
        console.log(barCharthovertext);

        //Now we're actually making the barchart.
        var barChartTrace = {
            type: "bar",
            y: reformattedLabels,
            x: barChartValues,
            text: barCharthovertext,
            orientation: 'h'
        };

        var barChartData = [barChartTrace];

        Plotly.newPlot("bar", barChartData);

        //Bubble chart time
        var bubbleChartTrace = {
            x: idValues,
            y: sampleValues,
            text: hovertext,
            mode: "markers",
            marker: {
                color: idValues,
                size: sampleValues
            }
        };

        var bubbleChartData = [bubbleChartTrace];

        var layout = {
            showlegend: false,
            height: 600,
            width: 1000,
            xaxis: {
                title: "OTU ID"
            }
        };

        Plotly.newPlot("bubble", bubbleChartData, layout);
    });
}

//Lets make this run with the page load
function init() {

    // Read json data
    d3.json("samples.json").then((Data) => {

        // Parse and filter data to get sample names
        var filteredData = Data.names;
        console.log(filteredData);

        // Add dropdown option for each sample
        var dropdownMenu = d3.select("#selDataset");

        filteredData.forEach((name) => {
            dropdownMenu.append("option").property("value", name).text(name);
        })

        // Use first sample to build metadata and initial plots
        buildMetadata(filteredData[0]);

        buildCharts(filteredData[0]);

    });
}

function optionChanged(newSelection) {

    // Update metadata and charts
    buildMetadata(newSelection); 
    buildCharts(newSelection);
}

// Initialize dashboard on page load
init();