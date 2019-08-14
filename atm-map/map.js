const initializeAtmMapPage = (function() {
	const merapiPath = "https://api-prd.just.cash/atm/";
	const googleMapsKey = "AIzaSyD6YQC_GPrnFcaY1z18d8llaKryEtXQYQM";
	const useMockLocation = false;
	const UserMarkerImage = "./marker-user.png";
	const AtmMarkerImage = "./marker-atm.png";
	
	const mockLocation = {
		currentPosition: {
			coords: {
				accuracy: 10,
				altitude: null,
				altitudeAccuracy: null,
				heading: null,
				latitude: 25.866, //26.8075,
				longitude: -80.294, //-80.069,
				speed: null
			},
			timestamp: new Date()
		}
	};
	
	var GM, dom;

	const dce = function(tag) { return document.createElement(tag); }

	function initializeAddressSearch(onSetLocation) {
		const autoComplete = new GM.places.Autocomplete(
			dom.addressSearch.input, {
				"types": [
					"geocode"
				],
				"fields": [
					"name",
					"geometry.location"
				]
			}
		);

		autoComplete.addListener("place_changed", () => {
			const place = autoComplete.getPlace();

			if (place.geometry) {
				const latLng = place.geometry.location;

				onSetLocation({
					latitude: latLng.lat(),
					longitude: latLng.lng(),
					accuracy: 0,
					title: place.name
				});
			} else {
				// User pressed Enter, did not select one of the suggested choices.
				// Geocode to find location
				const geocoder = new GM.Geocoder();
				geocoder.geocode({
						"address": place.name
					}, (results, status) => {
						if (status === GM.GeocoderStatus.OK)
						{
							var place = results[0];
							var latLng = place.geometry.location;

							onSetLocation({
								"latitude": latLng.lat(),
								"longitude": latLng.lng(),
								"accuracy": 0,
								"title": place.formatted_address
							});
						}
					});
			}
		});
	}

	function buildAddressSearch() {
		const container = dce("div");
		container.className = "address-search-container";

		const input = dce("input");
		input.setAttribute("type", "text");
		input.setAttribute("placeholder", "Enter your current address to find nearby ATM");
		input.setAttribute("autocomplete", "off");
		container.appendChild(input);

		return {
			container: container,
			input: input
		};
	}

	var mapInitPromise = null;
	var mapLocation = null;
	var mapInstance = null;
	function getMap(location) {
		if (mapInitPromise) {
			if (!location || location === mapLocation) {
				return mapInitPromise;
			} else {
				return mapInitPromise
					.then(function(map) {
						mapLocation = new GM.LatLng(location.latitude, location.longitude);
						map.setCenter(mapLocation);
					});
			}
		}

		mapLocation = new GM.LatLng(location.latitude, location.longitude);

		const options = {
			mapTypeControl: false,
			navigationControlOptions: {
				style: GM.NavigationControlStyle.SMALL
			},
			mapTypeId: GM.MapTypeId.ROADMAP,
			center: mapLocation,
			zoom: location.zoom || 15
		};

		mapInstance = new GM.Map(dom.map, options);
		initAtm();

		mapInitPromise = Promise.resolve(mapInstance);
		return mapInitPromise;
	}

	var mapUserMarker = null;
	function setUserMarker(map, location) {
		if (location) {
			const title = "You are here!";
			const centerLatLng = new GM.LatLng(location.latitude, location.longitude);

			if (!mapUserMarker) {
				mapUserMarker = new GM.Marker({
					map: map,
					position: centerLatLng,
					title: title,
					icon: {
						url: UserMarkerImage
					},
					optimized: false,
					zIndex: GM.Marker.MAX_ZINDEX + 1
				});
			} else {
				mapUserMarker.setTitle(title);
				mapUserMarker.setPosition(centerLatLng);
			}
		} else {
			if (mapUserMarker) {
				mapUserMarker.setMap(null);
				mapUserMarker = null;
			}
		}
	}

	function buildDom1() {
		const root = dce("div");
		root.className = "map-section";

		// Address search
		const addressSearch = buildAddressSearch();
		root.appendChild(addressSearch.container);

		// Error message
		const errorContainer = dce("div");
		errorContainer.className = "error-container";
		root.appendChild(errorContainer);
		const errorMessage = dce("div");
		errorMessage.className = "error-message";
		errorContainer.appendChild(errorMessage);

		// Map area
		const mapArea = dce("div");
		mapArea.className = "map-area";
		root.appendChild(mapArea);

		// Map placeholder (no location)
		const mapPlaceholder = dce("div");
		mapPlaceholder.className = "map-placeholder";
		mapArea.appendChild(mapPlaceholder);
		const pText = dce("div");
		pText.textContent = "Finding your location...";
		pText.className = "text";
		mapPlaceholder.appendChild(pText);
		const spinner = dce("div");
		spinner.className = "spinner";
		mapPlaceholder.appendChild(spinner);

		// Map (with location)
		const mapReal = dce("div");
		mapReal.className = "map-real";
		mapArea.appendChild(mapReal);

		return {
			root: root,
			addressSearch: addressSearch,
			map: mapReal,
			error: {
				container: errorContainer,
				message: errorMessage
			}
		};
	}

	function setError(message) {
		dom.error.container.classList.add("visible");
		dom.error.message.textContent = message;
	}

	function clearError() {
		dom.error.container.classList.remove("visible");
	}

	function buildDom2() {
		const onSetLocation = function(location) {
			if (location) {
				dom.root.classList.add("with-location");

				getMap(location)
					.then(function(map) {
						setUserMarker(map, location);
					}, function(error) {
					});

			} else {
				dom.root.classList.remove("with-location");
			}
		};

		initializeAddressSearch(onSetLocation);

		geoGetPosition()
			.then(function(position) {
				const coords = position.coords;
				const location = { longitude: coords.longitude, latitude: coords.latitude };
				onSetLocation(location);
			}, function(error) {
			});
	}

	function geoGetPosition() {
		if (useMockLocation) {
			return Promise.resolve(mockLocation.currentPosition);
		}
	
		const geo = navigator.geolocation;
	
		if (!geo) {
			return Promise.reject({ message: "Geolocation is not available" });
		}
	
		return new Promise(function(resolve, reject) {
			geo.getCurrentPosition(
				function(position) {
					resolve(position);
				},
				function(error) {
					reject(error);
				}
			);
		});
	}
	
	function wrapMerapiResponse(httpResponse) {
		return httpResponse.json()
			.then(function(jsonResult) {
				return jsonResult.data;
			});
	}
	
	function loadAtm() {
		return fetch(merapiPath + "atm/atm/list/up", {
				method: "POST",
				cache: "no-cache"
			})
			.then(wrapMerapiResponse)
			.then(function(data) {
				const items = data.items;
				items.forEach(function(item) {
					item.loc_lon = parseFloat(item.loc_lon);
					item.loc_lat = parseFloat(item.loc_lat);
					item.atm_buy_profit = parseFloat(item.atm_buy_profit);
					item.atm_sell_profit = parseFloat(item.atm_sell_profit);
				});

				return items;
			});
	}

	var infoWindow = null;
	function onAtmClick(marker, item) {
		// Create content
		const root = dce("div");
		root.className = "atm-popup-content";

		const title = dce("h1"); root.appendChild(title);
		title.textContent = item.loc_desc;

		const desc = dce("div"); root.appendChild(desc);
		desc.className = "desc";
		desc.textContent = item.atm_desc;

		const address = dce("div"); root.appendChild(address);
		address.className = "address";
		const street = dce("div"); address.appendChild(street);
		street.className = "street";
		street.textContent = formatAddressStreet(item.loc_street, item.loc_detail);
		const city = dce("div"); address.appendChild(city);
		city.className = "city";
		city.textContent = formatAddressCity(item.loc_city, item.loc_state, item.loc_zip, item.loc_country);
		const coords = dce("div"); address.appendChild(coords);
		coords.className = "coordinates";
		coords.textContent = item.loc_lat.toString() + ", " + item.loc_lon.toString();
		const directions = dce("a"); address.appendChild(directions);
		directions.className = "directions";
		directions.textContent = "Directions (Google)";
		directions.title = "Opens in new window";
		directions.href = makeGoogleMapsDirectionsLink(item.loc_lat, item.loc_lon);
		directions.setAttribute("rel", "noopener noreferrer");
		directions.setAttribute("target", "_blank");

		const currency = dce("div"); root.appendChild(currency);
		currency.className = "currency";
		const cType = dce("div"); currency.appendChild(cType);
		cType.className = "type";
		cType.textContent = item.atm_currency;

		const markup = dce("div"); root.appendChild(markup);
		markup.className = "markup";
		const markupLabel = dce("div"); markup.appendChild(markupLabel);
		markupLabel.className = "label";
		markupLabel.textContent = "Markup";
		const buyProfit = dce("div"); markup.appendChild(buyProfit);
		buyProfit.className = "buy profit";
		buyProfit.textContent = item.atm_buy_profit === 0 ? "Default" : ("" + item.atm_buy_profit + "%");
		const sellProfit = dce("div"); markup.appendChild(sellProfit);
		sellProfit.className = "sell profit";
		sellProfit.textContent = item.atm_sell_profit === 0 ? "Default" : ("" + item.atm_sell_profit + "%");

		// Show info window
		if (!infoWindow) {
			infoWindow = new GM.InfoWindow();
		}
		infoWindow.setContent(root);
		infoWindow.open(mapInstance, marker);
	}

	var atmMarkers = [];
	function setAtmMarkers(items) {

		// Remove old markers
		atmMarkers.forEach(function(marker) {
			marker.setMap(null);
		});
		atmMarkers.length = 0;

		// Add new
		items.forEach(function(item) {
			const marker = new GM.Marker({
				map: mapInstance,
				position: new GM.LatLng(item.loc_lat, item.loc_lon),
				title: item.loc_desc,
				// animation: GM.Animation.DROP,
				// label: {
				// 	text: "A",
				// 	fontWeight: "700",
				// 	fontSize: "16px",
				// 	color: "white"
				// },
				icon: {
					url: AtmMarkerImage,
					// labelOrigin: new GM.Point(11, 13)
				}
			});

			marker.addListener("click", function() {
				onAtmClick(marker, item);
			});

			atmMarkers.push(marker);
		});
	}

	function initAtm() {
		loadAtm()
			.then(function(items) {
				setAtmMarkers(items);
			}, function(error) {
				setError(error.message);
			});
	}

	return function(rootEl) {
		_injectCss("./map.css");

		dom = buildDom1();
		rootEl.innerHTML = "";
		rootEl.appendChild(dom.root);

		initGoogleMaps(googleMapsKey)
			.then(function(gm) {
				GM = gm;
				buildDom2();
			}, function(error) {
				setError(error.message);
			});
	}

})();

const initGoogleMaps = (function() {
	var initPromise = null;

	return function(googleMapsKey) {
		if (initPromise) {
			return initPromise;
		}

		initPromise = injectScript("https://maps.google.com/maps/api/js?libraries=places&key=" + googleMapsKey)
			.catch(() => {
				throw new Error("Google Maps failed to load");
			})
			.then(() => {
				return window.google.maps;
			});

		return initPromise;
	};

})();

function _injectScript(src, properties, attributes) {
	const doc = window.document;
	const element = doc.createElement("script");

	Object.keys(attributes).forEach(key => {
		if (key !== "src") {
			element.setAttribute(key, attributes[key]);
		}
	});
	element.src = src;

	Object.assign(element, properties);

	const existingScript = doc.getElementsByTagName("script")[0];
	const parent = existingScript ? existingScript.parentNode : (doc.getElementsByName("head")[0] || doc.head);
	parent.insertBefore(element, existingScript);

	return element;
}

function _injectCss(href) {
	const doc = window.document;
	const element = doc.createElement("link");
	element.rel = "stylesheet";
	element.type = "text/css";
	element.href = href;

	const existingLink = doc.getElementsByTagName("link")[0];
	const parent = existingLink ? existingLink.parentNode : (doc.getElementsByName("head")[0] || doc.head);
	parent.insertBefore(element, existingLink);

	return element;
}

/**
 * Inject a script element to the page, asynchronously, as a promise.
 * 
 * @param {String} src The URL to the script to inject to the page
 * @param {Object} attributes Additional attributes to set on the script element. The attributes "src", "async" are used internally.
 * 
 * @returns {Promise} A promise that is resolved on load.
 */
function injectScript(src, attributes)
{
	return new Promise(function(resolve, reject) {
		_injectScript(src, {
				onload: resolve,
				onerror: reject
			}, {
			...attributes,
			async: true
		});
	});
}

/**
 * Filters and then joins the items of an array
 * 
 * @param {Array<String>} items Array of strings to join
 * @param {String} separator The separator character to join the strings
 * @param {Function} filter Function to pass to the Array.filter to filter the items
 */
function filterJoin(items, separator, filter) {
	if (!items) {
		return null;
	}

	if (!filter) {
		filter = function(item) { return !!item; };
	}

	return items.filter(filter).join(separator);
}

/**
 * Format the street part of an address
 * 
 * @param {String} street The street
 * @param {String} detail The street detail
 */
function formatAddressStreet(street, detail) {
	return filterJoin([street, detail], " ");
}

/**
 * Format the city/state/zip/country part of an address
 * 
 * @param {String} city The city
 * @param {String} state The state
 * @param {String} zip ZIP code
 * @param {String} country The country
 */
function formatAddressCity(city, state, zip, country) {
	return filterJoin(
		[ city, filterJoin([state, zip], " "), country ],
		", "
	);
}

/**
 * Format an address
 * 
 * @param {String} street The street
 * @param {String} detail The street detail
 * @param {String} city The city
 * @param {String} state The state
 * @param {String} zip ZIP code
 * @param {String} country The country
 */
function formatAddress(street, detail, city, state, zip, country) {
	return filterJoin([
			formatAddressStreet(street, detail),
			formatAddressCity(city, state, zip, country)
		],
		", "
	);
}

/**
 * Encode an object to URI compatible format
 * 
 * @param {Object} data The data to encode
 * 
 * @returns {String}
 */
function encodeUriData(data) {
	if (!data) {
		return "";
	}

	const parameters = Object.keys(data).map(name => {
		let key = encodeURIComponent(name);
		let value = data[name];

		if (value == null) {
			return key;
		} else {
			return key + "=" + encodeURIComponent(value);
		}
	});

	return parameters.join("&");
}

function makeGoogleMapsDirectionsLink(lat, lon) {
	const parameters = encodeUriData({
		destination: [lat, lon].join(",")
	});

	return "https://www.google.com/maps/dir/?api=1&" + parameters;
}
