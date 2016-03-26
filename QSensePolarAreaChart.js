define(["./Chart.min", "css!./QSensePolarAreaChart.css"],
  function(chart, template) {
    "use strict";
    
    var palette = [
        "#4477aa",
        "#7db8da",
        "#b6d7ea",
        "#46c646",
        "#f93f17",
        "#ffcf02",
        "#276e27",
    ];
    
    //définition de l'objet
    return {
      initialProperties: {
        qHyperCubeDef: {
          qDimensions: [],
          qMeasures: [],
          qInitialDataFetch: [{
            qWidth: 2,
            qHeight: 50
          }]
        }
      },
      definition: {
        type: "items",
        component: "accordion",
        items: {
          dimensions: {
            uses: "dimensions",
            min: 1,
            max: 1
          },
          measures: {
            uses: "measures",
            min: 1,
            max: 1
          },
          Setting: {
            uses: "settings"
          }
        }
      },
      snapshot: {
        canTakeSnapshot: true
      },

      //affichage de l'objet
      paint: function($element, layout) {
        var hc = layout.qHyperCube;
        var dataDef = hc.qDataPages[0].qMatrix;
          
        var numFormat = hc.qMeasureInfo[0].qNumFormat;
        var numFormat = numFormat.qFmt.split(";")[0];

          
          
        var re0 = new RegExp("0","gi");
        var nbDec = numFormat.match(re0).length - 1;  

        console.log(nbDec);
          
        
        //var data = new Array();
        for (var i = 0; i < dataDef.length; i++) {
          var dataTmp = dataDef[i];
        
          var numValue = dataTmp[1].qNum;
          //var numValue = new Intl.NumberFormat({maximumSignificantDigits: nbDec}).format(dataTmp[1].qNum);
            
          if (typeof data == 'undefined') {
            var data = new Array({
              value: numValue,
              label: dataTmp[0].qText,
              color: palette[i%7]
            })
          } else {
            data.push({
              value: numValue,
              label: dataTmp[0].qText,
              color: palette[i%7]
            });
          }
        }
        
        var options = {
          segmentShowStroke: false,
          animateRotate: true,
          tooltipTemplate: '<%= label + ": " + new Intl.NumberFormat().format(value.toFixed('+nbDec+')) %>'
        }
                //Taille de l'objet
        var width = $element.width();
        var height = $element.height();
        
        var id = "container_" + layout.qInfo.qId;

        if (document.getElementById(id)) {
          $("#" + id).empty();
        } else {
          $element.append($('<div />').attr("id", id).attr("class", "viz").width(width).height(height));
        }
        var div = document.getElementById(id);
        div.innerHTML = '<canvas class="chart" id="myNewChart" width="'+width+'" height="'+height+'"></canvas><div id="js-legend" class="chart-legend"></div>';
        //div.render('<canvas id="myChart" width="400" height="400"></canvas>')
        //$element.append('<canvas id="myChart" width="400" height="400"></canvas>');
        var ctx = document.getElementById("myNewChart").getContext("2d");
        var myNewChart = new Chart(ctx).PolarArea(data, options);
//        var ratio = height/width;
//        document.getElementById('js-legend').innerHTML = myNewChart.generateLegend();
//        document.getElementById('myNewChart').style.width = width - document.getElementById('js-legend').offsetWidth +"px";
//        document.getElementById('myNewChart').style.height = (width - document.getElementById('js-legend').offsetWidth)*ratio +"px";
//        console.log(div);//.generateLegend());
      }
    }

  });