// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

let namelist = document.getElementById("namelist");
let namepreview = document.getElementById("namepreview");
let testinput = document.getElementById("testinput");
let testpreview = document.getElementById("testpreview");
let launcher = document.getElementById("launcher");

namelist.oninput = function (e) {
  namepreview.innerText = JSON.stringify(
    namelist.value.split("\n").map((line) => line.split("\t", 2)[1])
  );
};

testinput.oninput = function (e) {
  testpreview.innerText = JSON.stringify(
    stringSimilarity.findBestMatch(
      testinput.value,
      namelist.value.split("\n").map((line) => line.split("\t", 2)[1])
    ).bestMatch
  );
};

launcher.onclick = function (element) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var rxjsUrl = chrome.runtime.getURL("rxjs.umd.js");
    chrome.tabs.executeScript(tabs[0].id, {
      code:
        'var rxjs = document.createElement("script");' +
        `rxjs.setAttribute("src","${rxjsUrl}");` +
        "document.head.appendChild(rxjs);",
    });

    var stringSimilarityUrl = chrome.runtime.getURL("string-similarity.min.js");
    chrome.tabs.executeScript(tabs[0].id, {
      code:
        'var stringSimilarity = document.createElement("script");' +
        `stringSimilarity.setAttribute("src","${stringSimilarityUrl}");` +
        "document.head.appendChild(stringSimilarity);",
    });

    // this is incredibly sketchy:
    chrome.tabs.executeScript(tabs[0].id, {
      code:
        'var namevar = document.createElement("script");' +
        'namevar.textContent = "window.nameList = `" +' +
        JSON.stringify(namelist.value) +
        ' + "`";' +
        "document.head.appendChild(namevar);",
    });

    var url = chrome.runtime.getURL("waitingroombot.js");
    setTimeout((_) => {
      chrome.tabs.executeScript(tabs[0].id, {
        code:
          'var bbSource = document.createElement("script");' +
          `bbSource.setAttribute("src","${url}");` +
          "document.head.appendChild(bbSource);",
      });
    }, 300);
  });
  launcher.disabled = true;
};
