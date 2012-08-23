// ==UserScript==
// @name DynaFav2
// @version 2.0.2
// @include https://*salesforce.com*
// ==/UserScript==
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


if (typeof opera !== "undefined") {
    opera.extension.onmessage = function(event) {
        //console.log("++++++++++++ DynaFav2 - message received: " + event.data);
        favicon.processOptions(event.data);
        if ( favicon.process() ) {
            setInterval('favicon.process()', 3000);
        }
    };
}

if (typeof chrome !== "undefined") {
    //console.log("++++++++++++DynaFav2");
    chrome.extension.sendRequest({method: "getOptions"}, function(response) {
        //console.log("++++++++++++DynaFav2 options: " + response.options);
        favicon.processOptions(response.options);
        if ( favicon.process() ) {
            setInterval('favicon.process()', 3000);
        }
    });
}

var favicon = {
    config:
        [
            ['Foo', 'www.bar.com', '00D000000000042', 'X' ]
        ],

    process:
        function() {
            if (this.config===null || this.config.length === 0) {
                return false;
            }
            if (window.top!=window.self) {
                return false;
            }
            var head = document.getElementsByTagName('head')[0];
            if (head === null) {
                return false;
            }
            var title = document.getElementsByTagName('title')[0];
            //if (title === null || !title) {
            //    return false;
            //}

            var color = 'black';
            if (title!==null && title && title.innerHTML==='New Chatter updates!')
                color = 'red';

            var buddy = document.getElementById('buddy_list_notify');
            if (buddy && buddy.style.display && buddy.style.display!=='none') {
                if (color=='red') color = 'orange';
                else color = 'blue';
            }

            for (var i=0; i<this.config.length; i++) {
                if (window.location.hostname === this.config[i][1]) {
                    if (this.config[i][2]===null
                        || this.config[i][2].length===0
                        || head.innerHTML.indexOf(this.config[i][2]) !== -1
                        ) {
                        favicon.build("/favicon.ico", color, this.config[i][3]);
                        return true;
                    }
                }
            }
            return false;
        },

    processOptions:
        function(opts) {
            if (opts === null || opts.length<1) {
                return;
            }

            var options = opts.split('||');
            if (options.length>0) {
                var nOpts = parseInt(options[0]);
                var configs = new Array();
                for (var i=1; i<=nOpts; i++) {
                    configs.push(options[i].split(';'));
                }
                this.config = configs;
            }
        },

    build:
        function(favUrl, color, text) {
            var canvas = document.createElement('canvas');
            var ctx;

            if (canvas.getContext) {
                canvas.height = 16;
                canvas.width = 16;
                ctx = canvas.getContext('2d');
                img = document.createElement('img');
                img2 = document.createElement('img');
                img.onload = function () { // once the image has loaded
                    ctx.drawImage(this, 0, 0);
                    ctx.font = 'bold 8px "helvetica", sans-serif';
                    ctx.fillStyle = color;
                    ctx.fillText(text, 3, 12);
                    img2.src = canvas.toDataURL('image/png');
                    favicon.change(canvas.toDataURL('image/png'));
                };
                img.src = favUrl;
            } else {
                alert('no canvas...');
            }
        },

    change:
        function(iconURL) {
            this.addLink(iconURL, true);
        },

    addLink:
        function(iconURL) {
            var link = document.createElement("link");
            link.type = "image/x-icon";
            link.rel = "shortcut icon";
            link.href = iconURL;
            this.removeLinkIfExists();
            this.docHead.appendChild(link);
        },

    removeLinkIfExists:
        function() {
            var links = this.docHead.getElementsByTagName("link");
            for (var i=0; i<links.length; i++) {
                var link = links[i];
                if (/*link.type=="image/x-icon" &&*/ link.rel=="shortcut icon") {
                    this.docHead.removeChild(link);
                    //return; // Assuming only one match at most.
                }
            }
        },

    docHead:
        document.getElementsByTagName("head")[0]
}

