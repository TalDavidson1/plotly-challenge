//Create function for ID dropdown selection
function init() {
    var dropdown=d3.select("#selDataset");

    //Pull data from json file
    d3.json("data/samples.json").then((data) => {

    //Display ID selection    
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });
        //Update charts and panel when there is an ID change
        updateBarChart(data.names[0]);
        updateBubbleChart(data.names[0]);
        updateInfo(data.names[0]);
        updateGuageChart(data.names[0]);
    });
    
}

init();

//Display demographic information on the panel
function updateInfo(id) {
    //Pull data from json file
    d3.json("data/samples.json").then((data) => {
        var sampleData=data.metadata;

        //Select id to filter sample values
        var result=sampleData.filter(row => row.id.toString()=== id)[0];
        var panelData=d3.select("#sample-metadata");

        panelData.html("");

        //Append demographic information on panel by ID
        Object.entries(result).forEach((key) => {
            panelData.append("h5").text(key[0].toUpperCase() + ":" + '\n' + key[1] + '\n');
        });
    });
}
//Create function to display changes on the panel and charts
function optionChanged(id) {
    updateBarChart(id);
    updateBubbleChart(id);
    updateInfo(id);
    updateGuageChart(id);
}

//Display Bar chart
function updateBarChart(id) {

    //Pull data from json file
    d3.json("data/samples.json").then((data) => {

    //Select id to filter sample values
    var sampleIDs=data.samples.filter(row => row.id.toString()=== id)[0];
     
    //Display ID + OTU on the bar chart
    var otuData=sampleIDs.otu_ids.slice(0,10).reverse();
    var otuIDs=otuData.map(otuId => "OTU" +  " " + otuId)

    //Select 10 values to display on graph but reversed
    var otuLabels=sampleIDs.otu_labels.slice(0,10).reverse();

    var sampleValues=sampleIDs.sample_values.slice(0,10).reverse();
        
    var trace1 = {
        x: sampleValues,
        y: otuIDs,
        type: "bar",
        text: otuLabels,
        orientation: "h",
        marker: {color: "#008B8B"}
    };
    
    var data=[trace1];

    var layout ={
        title: "Top 10 OTU"
    }
    
    Plotly.newPlot("bar", data, layout);

    });
}

//Create function to display bubble chart
function updateBubbleChart(id) {
    //Pull data from json file
    d3.json("data/samples.json").then((data) => {

    //Select id to filter sample values
    var sampleIDs=data.samples.filter(row => row.id.toString()=== id)[0];
    
    //Extract Otu Ids to display on graph
    var otuData=sampleIDs.otu_ids;
    
    //Extract Otu labes to display on graph
    var otuLabels=sampleIDs.otu_labels;
    
    //Extract sample values to display on graph
    var sampleValues=sampleIDs.sample_values;

    var trace2 = {
        x: otuData,
        y: sampleValues,
        mode: 'markers',
        text: otuLabels,
        marker: {
            size: sampleValues,
            color:otuData,
            colorscale: "Earth"
        }
    };
          
    var data = [trace2];
          
    var layout = {
        showlegend: false,
        height: 600,
        width: 1200,
        sizemode:"area",
        hovermode:"closet",
        xaxis:{title:"OTU_IDS"}
    };
          
    Plotly.newPlot('bubble', data, layout);

    });
}

//Create function to display guage chart

function updateGuageChart(id) {
    //Pull data from json file
   d3.json("data/samples.json").then((data) => {

    //Select id to filter sample values
    var allMetadata=data.metadata.filter(metaId => metaId.id.toString()=== id)[0];
    
    //Extract wash frequency to display on chart
    var weekFreq=allMetadata.wfreq;

    var level=weekFreq*20;
    var degrees=180 - level,
        radius= .5;
    var radians= degrees * Math.PI/ 180;
    var x=radius * Math.cos(radians);
    var y=radius * Math.sin(radians);
    var mainPath= 'M -.0 -0.05 L .0 0.05 L',
        pathX=String(x),
        space= ' ',
        pathY= String(y),
        pathEnd = 'Z';
    var path=mainPath.concat(pathX, space, pathY, pathEnd);
    var data=[{type: 'scatter',
        x:[0], y:[0],
        marker: {size: 12, color:'850000'},
        showlegend: false,
        name: 'Freq',
        text: level,
        hoverinfo: 'text + name'    
    },
        {values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
        rotation: 90,
        text:['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        textinfo: 'text',
        textposition:'inside',
        marker: {
            colors:[
                'rgba(0, 105, 11, .5)', 'rgba(10, 120, 22, .5)',
                'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                'rgba(240, 230, 215, .5)', 'rgba(255, 255, 255, 0)']},
        //Display labels on on guage chart        
        labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
    }];
        var layout= {
            shapes:[{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000',
            }
        }],
        title: '<b>Belly Button Washing Frequency</b> <br>Scrubs per Week</br>',
        height: 500,
        width: 500,
        xaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                    showgrid:false, range:[-1, 1]}    
    };

    Plotly.newPlot("gauge", data, layout);

    }); 
}