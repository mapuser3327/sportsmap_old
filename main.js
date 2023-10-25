require(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer",
"esri/symbols/WebStyleSymbol", "esri/renderers/UniqueValueRenderer",
"esri/widgets/Legend","esri/widgets/BasemapGallery","esri/widgets/Home","esri/widgets/Expand",
"esri/layers/GeoJSONLayer", "esri/widgets/LayerList", "esri/PopupTemplate","esri/layers/support/LabelClass",
"esri/symbols/TextSymbol"],
 (Map,MapView,FeatureLayer,WebStyleSymbol,UniqueValueRenderer,
 Legend,BasemapGallery,Home,Expand,GeoJSONLayer,LayerList,PopupTemplate,LabelClass,TextSymbol)=>{

                const map = new Map({
                    basemap: "streets-vector"
                });

                const view = new MapView({
                    container: viewDiv,
                    map: map,
                    zoom: 3,
                    center: [-95, 40]

                });

				// Home widget - top-left
				const homeWidget = new Home({
				  view,
				});
				view.ui.add(homeWidget, 'top-left');

			    const bgExpand = new Expand({
				  view,
				  content: new BasemapGallery({ view }),
				  expandIcon: "basemap"
				});
				view.ui.add(bgExpand, "top-right");

				const labelClass = new LabelClass( {
				  
			        symbol: new TextSymbol({
					color: "green",
					backgroundColor: [255, 255, 255, 0.75],
					borderLineColor: "green",
					borderLineSize: 0.5,
					yoffset: 2,
					font: {
					  // autocast as new Font()
					  family: "Playfair Display",
					  size: 6,
					//  weight: "bold"
					}
				  }),
				  labelPlacement: "above-right",
				  labelExpressionInfo: {
					expression: "$feature.NAME"
				  }
				});

				 const template = new PopupTemplate ({
						title: "{Name} : {Team} {Position}",
						 content: "{EventType} : {EventYear}"
				 });
				
				      const eventRenderer = new UniqueValueRenderer({
							field: 'EventType',
					});
					
			const addPlayerType = function (type, iconName, renderer) {
					  renderer.addUniqueValueInfo({
						value: type,
						symbol: new WebStyleSymbol({
								name:iconName,
								styleName: "Esri2DPointSymbolsStyle"
						}),
					  });
					};
	
				addPlayerType('Birth','hospital',eventRenderer);
				//addPlayerType('High School Graduation', 'school', eventRenderer);
				addPlayerType('Last Year of College', 'university', eventRenderer);
				addPlayerType('Now','shield-2', eventRenderer);
 				const layer = new GeoJSONLayer({   
					title: "Eagles Players",
				    url: "https://playermap.000webhostapp.com/Players.geojson",
				    latitudeField:"Lat",
				    longitudeField:"Long",
					popupTemplate: template,
					renderer: eventRenderer,
					// labelingInfo: [labelClass]
  				});
  				map.add(layer); 
/* 				const stadiums = new FeatureLayer({  
					title: "NFL Stadiums",
					url: "https://hub.arcgis.com/maps/990d0191f2574db495c4304a01c3e65b/explore?location=35.226958%2C-99.069600%2C3.70"
				});	
				map.add(stadiums);
				 */
				const legend = new Legend({
				view: view,
				layerInfos: [{
				  layer: layer,
				  title: "Eagles Players"}]  });
				
				  view.ui.add(legend, "bottom-right");

            }
            );

