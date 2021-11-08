//  Create a modular table for the id "table"

// get values from slider

function updateGraph() {
  var table = document.getElementById("table");
  var tableTitle = document.getElementById("table-title");

  table.innerHTML = "";
  tableTitle.innerHTML = `<h2>mod ${modNum} (${modType})<h2>`;

  var header = table.appendChild(document.createElement("tr"));
  var headerRow = header.appendChild(document.createElement("td"));
  headerRow.innerHTML = `🖱`;

  for (var i = 0; i < modNum; i++) {
    var headerRow = header.appendChild(document.createElement("td"));
    headerRow.innerHTML = i;
  };

  var rows = 0;

  for (var i = 0; i < modNum; i++) {
    var row = table.appendChild(document.createElement("tr"));

    row.appendChild(document.createElement("td")).innerHTML = i;

    for (var j = 0; j < modNum; j++) {
      if (modType == "+") {
        var value = j + rows;
      } else {
        var value = j * rows;
      }

      row.appendChild(document.createElement("td")).innerHTML = `<a class="hovernum" onclick="rotateLineAnimation(${(360/modNum)*value})">${value % modNum}</a>`;
      // add class
      row.lastChild.classList.add("num");
    };
    rows++;
  };

};

var fromAngle, toAngle, 
		fromCoordX, fromCoordY, 
    toCoordX, toCoordY, 
    path, d;

function createPie(cx, cy, r, slices) {
  for (var i = 0; i < slices; i++) {
    path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    fromAngle = i * 360 / slices;
    toAngle = (i + 1) * 360 / slices;
    //console.log(fromAngle + ' ' + toAngle);
    fromCoordX = cx + (r * Math.cos(fromAngle * Math.PI / 180));
    fromCoordY = cy + (r * Math.sin(fromAngle * Math.PI / 180));
    toCoordX = cx + (r * Math.cos(toAngle * Math.PI / 180));
    toCoordY = cy + (r * Math.sin(toAngle * Math.PI / 180));
    //console.log(fromCoord + ' ' + toCoord);
    d = 'M' + cx + ',' + cy + ' L' + fromCoordX + ',' + fromCoordY + ' A' + r + ',' + r + ' 0 0,1 ' + toCoordX + ',' + toCoordY + 'z';
    //console.log(d);
    path.setAttributeNS(null, "d", d);
    document.getElementById('pie').appendChild(path);

    // add number i to the middle of each slice. Translate the text by the radius of the slice
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttributeNS(null, "x", cx + ((r-(0.5*r)) * Math.cos((fromAngle +  toAngle) / 2 * Math.PI / 180)));
    text.setAttributeNS(null, "y", cy + ((r-(0.5*r)) * Math.sin((fromAngle + toAngle) / 2 * Math.PI / 180)));
    text.setAttributeNS(null, "text-anchor", "middle");
    text.setAttributeNS(null, "dominant-baseline", "central");
    text.setAttributeNS(null, "font-size", "10");
    text.setAttributeNS(null, "fill", "black");
    // add white highlight to the text
    text.innerHTML = i;
    document.getElementById('pie').appendChild(text);

  };

  line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  // set ID
  line.setAttributeNS(null, "id", "line");
  line.setAttributeNS(null, "x1", cx);
  line.setAttributeNS(null, "y1", cy);
  line.setAttributeNS(null, "x2", toCoordX);
  line.setAttributeNS(null, "y2", toCoordY);
  line.setAttributeNS(null, "stroke", "red");
  // rotate the line to (360/slices)/2 degrees
  line.setAttributeNS(null, "transform", "rotate(" + ((360/slices)/2) + " " + cx + " " + cy + ")");
  document.getElementById('pie').appendChild(line);

  // rotate the pie around cx, cy
};

function rotateLineAnimation(deg) {
  // add class "fade-out"
  var line = document.getElementById('line');
  var cx = line.getAttributeNS(null, "x1");
  var cy = line.getAttributeNS(null, "y1");
  var r = 50;
  var toCoordX = line.getAttributeNS(null, "x2");
  var toCoordY = line.getAttributeNS(null, "y2");
  var d = 'M' + cx + ',' + cy + ' L' + toCoordX + ',' + toCoordY + ' A' + r + ',' + r + ' 0 0,1 ' + toCoordX + ',' + toCoordY + 'z';
  line.setAttributeNS(null, "d", d);
  line.setAttributeNS(null, "transform", "rotate(" + ((360/modNum)/2) + " " + cx + " " + cy + ")");
  var angle = ((360/modNum)/2);
  var finalAngle = deg + ((360/modNum)/2);
  function rotate() {
    line.setAttributeNS(null, "transform", "rotate(" + (angle++) + " " + cx + " " + cy + ")");
    (angle < finalAngle) && requestAnimationFrame(rotate); // +- 60 fps
  };
  rotate();
};

window.onload = function() {
  var slider = document.getElementById("slider");
  var output = document.getElementById("output");
  var select = document.getElementById("typeSelect");

  modNum = slider.value;

  if (select.value == 1) {
    modType = "+";
  } else {
    modType = "*";
  };


  updateGraph();
  createPie(55, 55, 50, modNum);

  output.innerHTML = slider.value;

  slider.oninput = function() {
    output.innerHTML = this.value;
    modNum = this.value;
    // clear svg 
    document.getElementById('pie').innerHTML = "";
    createPie(55, 55, 50, this.value);

    line.innerHTML = "";

    updateGraph();
  } 
  
  select.onchange = function() {
    console.log(this.value);
    if (this.value == 1) {
      modType = "+";
    } else {
      modType = "*";
    };

    console.log(modType);
    updateGraph();
  };
};
