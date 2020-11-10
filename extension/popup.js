// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

let namelist = document.getElementById("namelist");
let namepreview = document.getElementById("namepreview");
let testinput = document.getElementById("testinput");
let testpreview = document.getElementById("testpreview");
let launcher = document.getElementById("launcher");

function jiggleName(name) {
  const names = name.split(" ");
  const lastName = names.pop();
  const [firstName, ...middleNames] = names;
  const firstNames = nicknames[firstName] || [firstName];
  let res = firstNames.flatMap((firstName) => [
    // Edward Pembroke
    [firstName, lastName].join(" "),
    // Edward P
    [firstName, lastName[0]].join(" "),
    // Pembroke Edward
    [lastName, firstName].join(" "),
  ]);
  if (middleNames.length > 0) {
    res = res.concat(
      firstNames.flatMap((firstName) => [
        // Edward Stanley Pembroke
        [firstName, ...middleNames, lastName].join(" "),
        // Edward Stanley P
        [firstName, ...middleNames, lastName[0]].join(" "),
        // Edward S Pembroke
        [firstName, middleNames[0][0], lastName].join(" "),
        // Edward S P
        [firstName, middleNames[0][0], lastName].join(" "),
        // Pembroke Edward Stanley
        [lastName, firstName, ...middleNames].join(" "),
        // Pembroke Edward S
        [lastName, firstName, middleNames[0][0]].join(" "),
      ])
    );
  }
  return res;
}

var names = [];
namelist.oninput = function (e) {
  names = namelist.value
    .split("\n")
    .map((line) => line.split("\t", 2)[1])
    .map((name) => name.toLowerCase());
  namepreview.innerText = JSON.stringify(names);
};

testinput.oninput = function (e) {
  var input = testinput.value.toLowerCase();
  testpreview.innerText = `${JSON.stringify(
    stringSimilarity.findBestMatch(input, names).bestMatch
  )}
  ${JSON.stringify(
    stringSimilarity.findBestMatch(input, names.flatMap(jiggleName)).bestMatch
  )}`;
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

    var nicknamesUrl = chrome.runtime.getURL("nicknames.js");
    chrome.tabs.executeScript(tabs[0].id, {
      code:
        'var nicknames = document.createElement("script");' +
        `nicknames.setAttribute("src","${nicknamesUrl}");` +
        "document.head.appendChild(nicknames);",
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
