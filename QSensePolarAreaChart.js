define(["./Chart.min", "css!./QSensePolarAreaChart.css"],
  function (chart, template) {
    "use strict";
    
	  //Palette de couleur
    var palette = [
      "#4477aa",
      "#7db8da",
      "#b6d7ea",
      "#46c646",
      "#f93f17",
      "#ffcf02",
      "#276e27"
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
          sorting: {
		        uses: "sorting"
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
      paint: function ($element, layout) {
          
        //données QSense
        var hc = layout.qHyperCube, dataDef = hc.qDataPages[0].qMatrix,
					//Nom de la dimension
				  //dimName = hc.qDimensionInfo[0].qFallbackTitle,
					//Format du nombre
					numFormat = hc.qMeasureInfo[0].qNumFormat,
					//RegExp pour compter le nombre de 0
					re0 = new RegExp("0", "gi");
				//on peut le premir membre
				numFormat = numFormat.qFmt.split(";")[0];
				//nombre de décimal
				var nbDec = numFormat.match(re0).length - 1,
					//nombre de couleur
				  nbColor = palette.length,
					//iterateur
					i = 0;
        //Si plusieurs format, on chope le 1er
        //Pour toutes les valeurs de la mesure, ajout des données pour la generation du graphique
        for (i; i < dataDef.length; i++) {
          //Valeur de i
          var dataTmp = dataDef[i],
					  numValue = dataTmp[1].qNum,
						dimLabel = dataTmp[0].qText,
						dataArray = {
              value: numValue,
              label: dataTmp[0].qText,
              color: palette[i % nbColor]
            };
           
          //Création des données de résultat s'il n'existe pas, sinon on ajout les données à la fin
          if (typeof data === 'undefined') {
						//donnees du graph
            var data = new Array(dataArray),
						//donnees pour la sélection
						  dataDim = new Array(dimLabel);
          } else {
            data.push(dataArray);
            dataDim.push(dimLabel);
          }
        }
        
        //options du graphique
        var options = {
          segmentShowStroke: false,
          animateRotate: true,
          tooltipTemplate: '<%= label + ": " + new Intl.NumberFormat().format(value.toFixed(' + nbDec + ')) %>'
        },
				//taille de l'objet
          width = $element.width(),
          height = $element.height(),
				//id de l'objet QS
          id = "container_" + layout.qInfo.qId;
				//création de la div
        if (document.getElementById(id)) {
          $("#" + id).empty();
        } else {
          $element.append($('<div />').attr("id", id).width(width).height(height));
        }
        //reccuperation de la div
        var div = document.getElementById(id);
				//creation du canvas du graph
        div.innerHTML = '<canvas class="chart" id="myNewChart" width="' + width + '" height="' + height + '" qva-activate="sel($event)"></canvas>';
        //recuperation du canvas
				var ctx = document.getElementById("myNewChart").getContext("2d"),
				//cr"ation du graph
					myNewChart = new Chart(ctx).PolarArea(data, options),
				  self = this;
				//Event sur la div
        div.onclick = function (evt) {
					//donnees de l'event
          var activePoints = myNewChart.getSegmentsAtEvent(evt);
					//si il y a une selection QS
          if (activePoints.length !== 0) {
						//selection
            self.selectValues(0, dataDim.indexOf(activePoints[0].label) + 1, false);
          }
        };
      }
    };

  });