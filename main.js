require([
  'esri/Map',
  'esri/views/MapView',
  'esri/layers/FeatureLayer',
  'esri/symbols/WebStyleSymbol',
  'esri/renderers/UniqueValueRenderer',
  'esri/renderers/SimpleRenderer',
  'esri/widgets/Legend',
  'esri/widgets/BasemapGallery',
  'esri/widgets/Home',
  'esri/widgets/Expand',
  'esri/layers/GeoJSONLayer',
  'esri/widgets/LayerList',
  'esri/PopupTemplate',
  'esri/layers/support/LabelClass',
  'esri/symbols/TextSymbol',
  'esri/symbols/PictureMarkerSymbol',
], (
  Map,
  MapView,
  FeatureLayer,
  WebStyleSymbol,
  UniqueValueRenderer,
  SimpleRenderer,
  Legend,
  BasemapGallery,
  Home,
  Expand,
  GeoJSONLayer,
  LayerList,
  PopupTemplate,
  LabelClass,
  TextSymbol,
  PictureMarkerSymbol
) => {
  //const server = 'http://127.0.0.1:5500/';
  const server = location.origin + '/';
  const map = new Map({
    basemap: 'streets-vector',
  });

  const view = new MapView({
    container: viewDiv,
    map: map,
    zoom: 3,
    center: [-95, 40],
  });

  // Home widget - top-left
  const homeWidget = new Home({
    view,
  });
  view.ui.add(homeWidget, 'top-left');

  const bgExpand = new Expand({
    view,
    content: new BasemapGallery({ view }),
    expandIcon: 'basemap',
  });
  view.ui.add(bgExpand, 'top-right');

  const labelClass = new LabelClass({
    symbol: new TextSymbol({
      color: 'darkgreen',
      //backgroundColor: [255, 255, 255, 0.75],
      // borderLineColor: 'green',
      // borderLineSize: 0.5,
      yoffset: 1,
      font: {
        // autocast as new Font()
        family: 'Playfair Display',
        size: 7,
        weight: 'bold',
        textshadow: '2px 2px #ff0000',
      },
    }),
    labelPlacement: 'above-right',
    labelExpressionInfo: {
      expression: `$feature.TEAM`,
    },
  });

  function buildTitle(feature) {
    //console.log(feature.graphic.attributes);

    let name = feature.graphic.attributes['Name'];
    let nameParts = name.toLowerCase().split(' ');
    let url = `${server}/eaglesProfilePics/${nameParts[1]}_${nameParts[0]}.webp`;
    // console.log(url);

    let result = `<img width="120" height="60" src="${url}" alt="{Name}"> {Name} : {Team} {Position}`;
    //console.log(result);
    return result;
  }
  const buildContent = (feature) => {
    let result = `<p><ul><li>{EventType} : {EventYear}
	<li>  {Team} </li>
	<li> {Position} </li>
	</ul>
	</p>
  	</div>`;
    return result;
  };

  const template = new PopupTemplate({
    title: buildTitle,
    // '<img width="120" height="60" src="{PlayerPhoto}" alt="{Name}"> {Name} : {Team} {Position}',
    content: buildContent,
    outFields: ['*'],
  });
  const stadiumTemplate = new PopupTemplate({
    title: '{ TEAM }',
    outFields: ['*'],

    content: [
      {
        // It is also possible to set the fieldInfos outside of the content
        // directly in the popupTemplate. If no fieldInfos is specifically set
        // in the content, it defaults to whatever may be set within the popupTemplate.
        type: 'fields',
        fieldInfos: [
          {
            fieldName: 'NAME1',
            label: 'Stadium Name',
          },
          {
            fieldName: 'CONFERENCE',
            label: 'Conference',
          },
          {
            fieldName: 'DIVISION',
            label: 'Division',
          },
          {
            fieldName: 'ROOF_TYPE',
            label: 'Roof Type',
          },
        ],
      },
    ],
  });

  const eventRenderer = new UniqueValueRenderer({
    field: 'EventType',
  });
  const stadiumRenderer = new SimpleRenderer({
    symbol: new PictureMarkerSymbol({
      url: 'eagles.png',
      width: '40px',
      height: '40px',
    }),
  });

  //   const addClass = function (val, renderer) {
  //     var lbl, sym;
  //     lbl = 'Yes';
  //     sym = new PictureMarkerSymbol({
  //       url: 'eagles.png',
  //       width: '75px',
  //       height: '75px',
  //     });

  //     renderer.addUniqueValueInfo({
  //       value: val,
  //       symbol: sym,
  //       label: lbl,
  //     });
  //   };

  //   addClass('eagles', stadiumRenderer);

  const addPlayerType = function (type, iconName, renderer) {
    renderer.addUniqueValueInfo({
      value: type,
      symbol: new WebStyleSymbol({
        name: iconName,
        styleName: 'Esri2DPointSymbolsStyle',
      }),
    });
  };

  const geojsonUrl = server + 'Players.geojson';

  addPlayerType('Birth', 'hospital', eventRenderer);
  //addPlayerType('High School Graduation', 'school', eventRenderer);
  addPlayerType('Last Year of College', 'university', eventRenderer);
  addPlayerType('Now', 'shield-2', eventRenderer);
  const playerlayer = new GeoJSONLayer({
    title: 'Eagles Players',
    url: geojsonUrl,
    latitudeField: 'Lat',
    longitudeField: 'Long',
    popupTemplate: template,
    renderer: eventRenderer,
    // labelingInfo: [labelClass]
  });
  map.add(playerlayer);
  //   playerlayer.when(function () {
  //     playerlayer.queryFeatures().then((results) => {
  //       //console.log(results);
  //       results.features.forEach(function (player, index) {
  //         let attributes = player.attributes;
  //         let name = attributes['Name'];
  //         let nameParts = name.toLowerCase().split(' ');
  //         let url = `./eaglesProfilePics/${nameParts[1]}_${nameParts[0]}.webp`;
  //         player.attributes.PhotoPlayer = url;
  //       });
  //       console.log(results.features);
  //       // graphics.forEach(function (org, index) {
  //       // 	let attributes = org.attributes;
  //       // 	let name = attributes.NAME;
  //       // 	if (name.indexOf("Bucks") > -1) {
  //       // 		name = "**Pick me** " + name;
  //       // 	}
  //       // 	let li = document.createElement("li");
  //       // 	li.classList.add("panel-result");
  //       // 	li.tabIndex = 0;
  //       // 	li.setAttribute("data-result-id", index);
  //       // 	li.textContent = name + " (" + attributes.PHONE + ")";
  //       // 	fragment.appendChild(li);

  //       // });
  //     });
  //   });
  const stadiumUrl = server + 'Stadiums.geojson';

  const stadiums = new GeoJSONLayer({
    title: 'NFL Stadiums',
    url: stadiumUrl,
    latitudeField: 'LATITUDE',
    longitudeField: 'LONGITUDE',
    popupTemplate: stadiumTemplate,

    renderer: stadiumRenderer,
    labelingInfo: [labelClass],
  });
  map.add(stadiums);

  const legend = new Legend({
    view: view,
    layerInfos: [
      {
        layer: playerlayer,
        title: 'Eagles Players',
      },
    ],
  });

  const LayerListWidgetExpand = new Expand({
    view: view,
    content: new LayerList({
      view: view,
    }),
    group: 'bottom-right',
    expanded: false,
  });
  view.ui.add([LayerListWidgetExpand], 'bottom-right');
  const lgExpand = new Expand({
    view,
    content: legend,
    expandIcon: 'legend',
    group: 'top-right',
  });
  view.ui.add(lgExpand, 'top-right');
});
