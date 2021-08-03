function init() {
    
    //load data from samples.json
    d3.json("samples.json").then(function(data) {
        var names = data.names;
        console.log(names);

        var dropDown = d3.select("#selDataset");

        dropDown
            .selectAll("options")
            .data(names)
            .enter()
            .append("option")
            .text(function (d) { return d; })
            .attr("value", function (d) { return d; });

        optionChanged(names[0])

    })

}

function getDemographics(id) {
    d3.json("samples.json").then(data => {
        var metaData = data.metadata;

        // filter demographic data for subject id selected
        var testSubject = metaData.filter(subject => {
            return subject.id == id;
        });

        // assign variable for demographic info box
        var demographicBox = d3.select("#sample-metadata");

        // clear demographic info box
        demographicBox.selectAll("*").remove();

        for(var [key, value] of Object.entries(testSubject[0])) {
            demographicBox
                .insert("h5")
                .text(`${key.toUpperCase()}: ${value}`);
        };

    });
}

function getSamples(id) {
    d3.json("samples.json").then(data => {
        var samples = data.samples

        // filter sample data for subject id
        var subjectSamples = samples.filter(subject => {
            return subject.id == id;
        })[0];
        console.log(subjectSamples);

        var otuIds = subjectSamples.otu_ids;
        console.log(otuIds);
        var sampleValues = subjectSamples.sample_values;
        console.log(sampleValues);
        
        // generate to otu labels
        var otuLabels = otuIds.map(id => 'OTU ' + id);


        // get top 10 bacteria cultures
        var top10Samples = sampleValues.slice(0, 10).reverse();
        var topl10Labels = otuLabels.slice(0,10).reverse();
 

        // generate bar chart
         var trace1 = {
             x: top10Samples,
             y: topl10Labels,
             orientation: "h",
             type: "bar"
         };

         var data1 = [trace1];

         var layout1 = {
             title: "Top 10 Bacteria Culture Found",
             yaxis: {
                 type: "category"
             }
         }

         Plotly.newPlot("bar", data1, layout1)

         // generate bubble chart
         var trace2 = {
             x: otuIds,
             y: sampleValues,
             mode: "markers",
             marker: {
                 // scale size to better fit
                 size: sampleValues.map(value => value * .7),
                 color: otuIds
             },
             text: otuLabels
         };

         var data2 =[trace2];

         var layout2 = {
    
             title: "Bacteria Cultures Per Sample",
             xaxis: {
                 title: "OTU ID"
             }
         };

         Plotly.newPlot("bubble", data2, layout2)

         // Guage chart
         // get washing frequency
         var demographics = data.metadata

         var subjectDemo = demographics.filter(subject => {
             return subject.id == id;
         })[0];

         var washFrequency = subjectDemo.wfreq; 
         console.log(washFrequency)

         var trace3 = {
             domain: { x: [0, 1], y: [0, 1]},
             value: washFrequency,
             title: { text: "Scrubs per Week", font: {size: 17} },
             type: "indicator",
             mode: "gauge",
             gauge: {
                 axis: { range: [null, 9], tickmode: "linear"},
                 steps: [
                     { range: [0, 1], color: "#b4f6fd" },
                     { range: [1, 2], color: "#a1e8f3" },
                     { range: [2, 3], color: "#8ed9ea" },
                     { range: [3, 4], color: "#7bcbe1" },
                     { range: [4, 5], color: "#69bcd8" },
                     { range: [5, 6], color: "#57aecf" },
                     { range: [6, 7], color: "#46a0c6" },
                     { range: [7, 8], color: "#3491bd" },
                     { range: [8, 9], color: "#2283b4" },
                 ],
                 threshold: {
                     value: washFrequency,
                     line: {
                         width: 5,
                         color: "royalpurple"
                     }
                 }
             }
         };

         var data3 = [trace3];
         var layout3 = {title: "Belly  Button Washing Frequency"};

         Plotly.newPlot("gauge", data3, layout3);

    })
}


function optionChanged(subjectId) {

    console.log(subjectId);
    getSamples(subjectId);
    getDemographics(subjectId);
}



init();