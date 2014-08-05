MapEvents = function(){
	var me = this;
	this.map = "";
	/**
	 * Función que crea y retorna un mapa
	 * 
	 * lat: {int} [default = 1] latitud para centrar el mapa 
	 * lng: {int} [default = 1] longitud para centrar el mapa 
	 * zoom: {int} [default = 2] zoom del mapa
	 * drawRectangle: {boolean} [default = false] true para que al hacer dos clicks en el mapa cree un rectangulo en los puntos indicados
	 * strokeWeight: {int} [default = 1] tamaño del borde del rectángulo
	 * strokeColor: {string} [default = "black"] color del borde del rectángulo
	 * fillColor: {string} [default = "black"] color de relleno del rectángulo
	 * fillOpacity: {int} [default = 0.25] opacidad en el relleno del rectángulo
	 * callbackDrawRectangle: {function} [default = function(){}] función que se ejecutará cuando se dibuje el rectángulo
	 * clickRectangle: {function} [default = function(){}] función que se ejecutará cuando clickeen el rectángulo dibujado
	 * resizable: {boolean} [default = false] true para que el rectangulo se reziseable
	 * colorAreaToMark: {string} [default = "#C9EAFF"] color que marca el area seleccionada
	 * opacityAreaToMark: {float} [default = 0.5] grado de opacidad del area seleccionada (entre 0 y 1)
	 * borderAreaToMark: {string} [default = "1px solid blue"] borde en el area seleccionada
	 */
	this.createMap = function(options){
		options.lat = options.lat || 1;
		options.lng = options.lng || 1;
		options.zoom = options.zoom || 2;
		options.drawRectangles = options.drawRectangles || false;
		options.callbackDrawRectangle = options.callbackDrawRectangle || function(r){};
		options.clickRectangles = options.clickRectangle || function(r){};
		options.strokeWeight = options.strokeWeight || 1;
		options.strokeColor = options.strokeColor || "black";
		options.fillColor = options.fillColor || "black";
		options.fillOpacity = options.fillOpacity || "0.25";
		options.resizable = options.resizable || true;
		options.colorAreaToMark = options.colorAreaToMark || "#C9EAFF";
		options.opacityAreaToMark = options.opacityAreaToMark || 0.5;
		options.borderAreaToMark = options.borderAreaToMark || "1px solid blue";
		var latlng = new google.maps.LatLng(options.lat,options.lng);
		var myOptions = {
			zoom: options.zoom,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var containerMap = document.getElementById(options.idContainer);
		var map = new google.maps.Map(containerMap, myOptions);
		if (options.drawRectangles){
			rectanglePointLat = 0;
			rectanglePointLng = 0;
			$(containerMap).mousemove(function(e){
				moveEv = e;
				$(".rectangleToMark").css({"position":"absolute","background-color":options.colorAreaToMark,"opacity":options.opacityAreaToMark,border:options.borderAreaToMark});
				if (moveEv.pageX > rectanglePointLat){
					$(".rectangleToMark").css("width",moveEv.pageX - rectanglePointLat-6);
				}else{
					$(".rectangleToMark").css("left",moveEv.pageX +3);
					$(".rectangleToMark").css("width",rectanglePointLat - moveEv.pageX+3);
				}

				if (moveEv.pageY > rectanglePointLng){
					$(".rectangleToMark").css("height",moveEv.pageY - rectanglePointLng-6);
				}else{
					$(".rectangleToMark").css("top",moveEv.pageY +3);
					$(".rectangleToMark").css("height",rectanglePointLng - moveEv.pageY +3);
				}
			});
			google.maps.event.addListener(map, "click", function(event) {
				if ($(".rectangleToMark").length == 0){
					$("body").append('<div class="rectangleToMark"></div>');
					$(".rectangleToMark").css({"left":moveEv.pageX, "top":moveEv.pageY});
					rectanglePointLat = moveEv.pageX;
					rectanglePointLng = moveEv.pageY;
					latlng1 = new google.maps.LatLng(event.latLng.lat(),event.latLng.lng());
					map.setOptions({draggableCursor:"crosshair"});
					
				}else{
					map.setOptions({draggableCursor:""});
					$(".rectangleToMark").remove();
					latlng2 = new google.maps.LatLng(event.latLng.lat(),event.latLng.lng());
					var rectangle = me.drawRectangleTwoCoordinates({"point1":latlng1,"point2":latlng2,});
					options.callbackDrawRectangle(rectangle);
					google.maps.event.addListener(rectangle, 'click', function(){
						options.clickRectangle(rectangle);
					});
				}
			});
		}
		me.map = map;
		return map;
	};
	

	
	this.relocateMap = function(options){
		options.map = options.map || me.map;
		options.zoom = options.zoom || 2;
		var latlng = new google.maps.LatLng(options.lat,options.lng);
		options.map.setCenter(latlng);
		options.map.setZoom(options.zoom);
	};

	/**
	 * Función que dibuja y retorna un marcador en un mapa
	 * 
	 * lat: {int} [default = ""] latitud del marcador
	 * lng: {int} [default = ""] longitud del marcador
	 * map: {object} [default = map] objeto mapa en el que dibujará el marcador
	 * draggable: {boolean} [default = false] true para que el marcador se pueda arrastrar y reposicionar
	 * title: {string} [default = ""] title que se mostrará al moverse sobre el marcador
	 * icon: {string} [default = ""(marcador default de googleMaps)] url de icono para el marcador
	 * cursor: {string} [default = "pointer"] tipo de cursor al moverse sobre el marcador
	 */
	this.drawMarker = function(options){
		options.map = options.map || me.map;
		options.draggable = options.draggable || false;
		options.title = options.title || "";
		options.icon  = options.icon  || "";
		options.cursor = options.cursor || "pointer";
		options.callbackDragend = options.callbackDragend || function(){};
		if(options.visible==null) options.visible=true;
		options.visible= options.visible || false;
		
		var myLatlng = new google.maps.LatLng(options.lat,options.lng);
		var marker = new google.maps.Marker({
		      position: myLatlng,
		      map: options.map,
		      title:options.title,
		      draggable:options.draggable,
		      icon:options.icon,
		      cursor:options.cursor,
		      visible:options.visible
		 });
		google.maps.event.addListener(marker, "dragend", function(event) {
			$("#latitude").val(event.latLng.lat())
			$("#longitude").val(event.latLng.lng())
		});
		options.map.setCenter(myLatlng);
		return marker;
	};

	/**
	 * Función que modifica un marcador ya existente
	 * 
	 * lat: {int} [default = ""] latitud del marcador
	 * lng: {int} [default = ""] longitud del marcador
	 * draggable: {boolean} [default = false] true para que el marcador se pueda arrastrar y reposicionar
	 * title: {string} [default = ""] title que se mostrará al moverse sobre el marcador
	 * icon: {string} [default = ""(marcador default de googleMaps)] url de icono para el marcador
	 * cursor: {string} [default = "pointer"] tipo de cursor al moverse sobre el marcador
	 */
	this.changeMarker = function(options){
		options.map = options.map || me.map;
		options.title = options.title || options.marker.getTitle();
		options.icon = options.icon || options.marker.getIcon();
		options.draggable = options.draggable || options.marker.getDraggable();
		options.cursor = options.cursor || options.marker.getCursor();
		if(options.visible==null) options.visible=true;
		options.visible= options.visible || false;
		var positionMarker;
		if (options.lat != null &&options.lng != null)
			positionMarker = new google.maps.LatLng(options.lat,options.lng);
		else
			positionMarker = options.marker.getPosition();
		options.marker.setOptions({
			title:options.title,
		    draggable:options.draggable,
		    icon:options.icon,
		    position:positionMarker,
		    cursor: options.cursor,
		    visible: options.visible
		});
		options.map.setCenter(positionMarker);
	};

	/**
	 * Función que elimina una marcador
	 * 
	 * marker: {object} [default = ""] marcador que desaparecerá del mapa
	 */
	this.deleteMarker = function(options){
		options.marker.setPosition(null);
	};
	
	/**
	 * Función que dibuja un rectángulo pasándole dos marcadores
	 * 
	 * point1: {object} [default = ""] primer objeto de referencia para dibujar el rectángulo
	 * point2: {object} [default = ""] segundo objeto de referencia para dibujar el rectángulo
	 * strokeWeight: {int} [default = 1] tamaño del borde del rectángulo
	 * strokeColor: {string} [default = "black"] color del borde del rectángulo
	 * fillColor: {string} [default = "black"] color de relleno del rectángulo
	 * fillOpacity: {int} [default = 0.25] opacidad en el relleno del rectángulo
	 */
	this.drawRectangleTwoCoordinates = function(options){
		var rectangle = me.drawRectangle({
			'latNorth':options.point1.lat(),
			'latSouth':options.point2.lat(),
			'lonEast':options.point1.lng(),
			'lonWest':options.point2.lng(),
			'strokeWeight':options.strokeWeight,
			'strokeColor':options.strokeColor,
			'fillColor':options.fillColor,
			'fillOpacity':options.fillOpacity,
			'map':options.map
		});
		return rectangle;
	};
	
	/**
	 * Función que dibuja un rectángulo en el mapa pasandole cuatro coordenadas
	 * 
	 * map: {object} [default = map] objeto mapa en el que dibujará el marcador
	 * latNorth: {int} [default = ""] latitud del punto norte
	 * latSouth: {int} [default = ""] latitud del punto sur
	 * latWest: {int} [default = ""] latitud del punto oeste
	 * latEast: {int} [default = ""] latitud del punto este
	 * strokeWeight: {int} [default = 1] tamaño del borde del rectángulo
	 * strokeColor: {string} [default = "black"] color del borde del rectángulo
	 * fillColor: {string} [default = "black"] color de relleno del rectángulo
	 * fillOpacity: {int} [default = 0.25] opacidad en el relleno del rectángulo
	 * resizable: {boolean} [default = false] true para que el rectángulo sea reziseable
	 */
	this.drawRectangle = function(options){
		options.map = options.map || me.map;
		options.strokeWeight = options.strokeWeight || 1;
		options.strokeColor = options.strokeColor || "black";
		options.fillColor = options.fillColor || "black";
		options.fillOpacity = options.fillOpacity || "0.25";
		options.resizable = options.resizable || false;
		options.clickRectangle = options.clickRectangle || function(){};
		var cordRectangle = [
			new google.maps.LatLng(options.latNorth, options.lonWest),
			new google.maps.LatLng(options.latSouth, options.lonWest),
			new google.maps.LatLng(options.latSouth, options.lonEast),
			new google.maps.LatLng(options.latNorth, options.lonEast)
		];
		var rectangle = new google.maps.Polygon({
			paths: cordRectangle,
			strokeWeight: options.strokeWeight,
			strokeColor: options.strokeColor,
			fillColor: options.fillColor,
			fillOpacity: options.fillOpacity
		});
		rectangle.setMap(options.map);
		rectangle.setMap(me.map);
		if (options.resizable){
			var point1 = me.drawMarker({"lat":options.latNorth,"lng":options.lonEast,draggable:true,"cursor":"nwse-resize"});
			var point2 = me.drawMarker({"lat":options.latSouth,"lng":options.lonWest,draggable:true,"cursor":"nwse-resize"});
			google.maps.event.addListener(point1, 'dragend', function(){				
				if (point1.position.lat() > point2.position.lat()){
					north = point1.position.lat();
					south = point2.position.lat();
					east = point1.position.lng();
					west = point2.position.lng();
				}else{
					north = point2.position.lat();
					south = point1.position.lat();
					east = point2.position.lng();
					west = point1.position.lng();
				}
				me.changeRectangle({"rectangle":rectangle,"latNorth":north,"latSouth":south,"lonWest":west,"lonEast":east});
			});
			google.maps.event.addListener(point2, 'dragend', function(){
				if (point1.position.lat() > point2.position.lat()){
					north = point1.position.lat();
					south = point2.position.lat();
					east = point1.position.lng();
					west = point2.position.lng();
				}else{
					north = point2.position.lat();
					south = point1.position.lat();
					east = point2.position.lng();
					west = point1.position.lng();
				}
				me.changeRectangle({"rectangle":rectangle,"latNorth":north,"latSouth":south,"lonWest":west,"lonEast":east});
			});
		}
		google.maps.event.addListener(rectangle, 'click', function(){
			options.clickRectangle(rectangle);
		});
		return rectangle;
	};


	/**
	 * Función que elimina un rectángulo
	 * 
	 * rectangle: {object} [default = ""]  rectángulo que desaparecerá del mapa
	 */
	this.DeleteRectangle = function(options){
		options.rectangle.setMap(null);
	};

	/**
	 * Función que modifica un rectángulo ya existente
	 * 
	 * latNorth: {int} [default = ""] latitud del punto norte
	 * latNorth: {int} [default = ""] latitud del punto norte
	 * latNorth: {int} [default = ""] latitud del punto norte
	 * latNorth: {int} [default = ""] latitud del punto norte
	 * strokeWeight: {int} [default = 1] tamaño del borde del rectángulo
	 * strokeColor: {string} [default = "black"] color del borde del rectángulo
	 * fillColor: {string} [default = "black"] color de relleno del rectángulo
	 * fillOpacity: {int} [default = 0.25] opacidad en el relleno del rectángulo
	 */
	
	this.changeRectangle = function(options){
		options.fillColor = options.fillColor || options.rectangle.get("fillColor");
		options.strokeWeight = options.strokeWeight || options.rectangle.get("strokeWeight");
		options.strokeColor = options.strokeColor || options.rectangle.get("strokeColor");
		options.fillOpacity = options.fillOpacity || options.rectangle.get("fillOpacity");
		options.latNorth = options.latNorth || null;
		options.latSouth = options.latSouth || null;
		options.lonWest = options.lonWest || null;;
		options.lonEast = options.lonEast || null;
		if (options.latNorth != null && options.latSouth != null && options.lonWest != null && options.lonEast != null){
			cordRectangle = [
	           new google.maps.LatLng(options.latNorth, options.lonWest),
	           new google.maps.LatLng(options.latSouth, options.lonWest),
	           new google.maps.LatLng(options.latSouth, options.lonEast),
	           new google.maps.LatLng(options.latNorth, options.lonEast)
			];
		}
		else
			cordRectangle = options.rectangle.getPath().getArray();
		if (options.fillColor != null)
			options.rectangle.setOptions({
				fillColor:options.fillColor,
				strokeWeight:options.strokeWeight,
				strokeColor:options.strokeColor,
				fillOpacity:options.fillOpacity,
				paths:cordRectangle
			});
	};
	
	
	/**
	 * Función que modifica un rectángulo ya existente
	 * 
	 * address: {string} [default = ""] direccion a ubicar
	 * putMarker: {boolean} [default = ""] pone un marcador en el punto ubicado
	 * map: {object} [default = map] objeto mapa en el que se ubicara la direccion
	 * zoom: {int} [default = 16] zoom para ver la direccion indicada
	 * callbackResults: {function} [default = function(){}] funcion que se ejecutara cuando se encuentre la direccion y pasara como parametro un objeto con el punto localizado
	 * callbackNoResults: {function} [default = function(){}] funcion que se ejecutara cuando NO se encuentre la direccion
	 */
	this.locateAddress = function(options){
		options.map = options.map || me.map;
		options.address = options.address || "";
		options.putMarker = options.putMarker || false;
		options.draggable = options.draggable || false; 
		options.zoom = options.zoom || 16;
		options.callbackNoResults = options.callbackNoResults || function(){};
		options.callbackResults = options.callbackResults || function(){};
		if(options.visible==null) options.visible=true;
		options.visible = options.visible || false;
		var markerMap;
		if (options.address != ""){
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({address: options.address},function(results,status) {
		        if (status == google.maps.GeocoderStatus.OK) {
		        	options.map.setCenter(results[0].geometry.location);
		        	options.map.setZoom(options.zoom);
		        	if (options.putMarker){
		        		markerMap = me.drawMarker({map:options.map,lat:results[0].geometry.location.lat(),lng:results[0].geometry.location.lng(),draggable:options.draggable, visible:options.visible});
		        		options.callbackResults(markerMap);	
		        	}
		        	else{
		        		options.callbackResults(results[0].geometry.location);	
		        	}
		        }
		        else {
		        	options.callbackNoResults();
		        }
			});
		}
	};
};