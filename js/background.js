/*
 Copyright 2012 Etienne Giraudy

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

// init for Opera
if (typeof opera !== "undefined") {
	window.addEventListener("DOMContentLoaded", function() {
		console.log("######## DynaFav2 - background process loading");
		
		opera.extension.onconnect = function(event) {
		   console.log("######## DynaFav2 - onconnect, sending options");
			event.source.postMessage(loadOptions()); 
		};
		
		opera.extension.onmessage = function(event) {
		   console.log("######## DynaFav2 - (unexpected) message received: " + event.data);
		   event.source.postMessage("DynaFav2:foo:bar");
		};
	}, false);
}

// init for Chrome
if (typeof chrome !== "undefined") {
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		console.log("######## message received: " + request.method);
		var options = loadOptions();
		//if (request.method == "getgmailEnabled") {
			sendResponse({options: options});
		//}
	});
}

// read options from local storage
function loadOptions() {
	var options = '';
	var idx = 0;
	if (localStorage.getItem('numberofsites') && localStorage.getItem('numberofsites').length>0) {
		idx = 0 + localStorage.getItem('numberofsites');
		options = localStorage.getItem('numberofsites');
	} else {
		options = '0';
	}
	for (var i=0; i<idx; i++) {
		var values = localStorage.getItem('org'+(i+1));
		if (values) {
			options += '||' + values;
		}
	}
	return options;
}

