/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.89875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "29 /"], "isController": false}, {"data": [1.0, 500, 1500, "28 /"], "isController": false}, {"data": [1.0, 500, 1500, "6 /ocsp"], "isController": false}, {"data": [0.38, 500, 1500, "9 /click"], "isController": false}, {"data": [0.38, 500, 1500, "27 /"], "isController": false}, {"data": [0.92, 500, 1500, "26 /"], "isController": false}, {"data": [0.8, 500, 1500, "25 /"], "isController": false}, {"data": [0.9, 500, 1500, "24 /"], "isController": false}, {"data": [1.0, 500, 1500, "8 /"], "isController": false}, {"data": [1.0, 500, 1500, "23 /"], "isController": false}, {"data": [1.0, 500, 1500, "1 /GTSGIAG3"], "isController": false}, {"data": [1.0, 500, 1500, "22 /"], "isController": false}, {"data": [1.0, 500, 1500, "21 /"], "isController": false}, {"data": [1.0, 500, 1500, "20 /"], "isController": false}, {"data": [0.5, 500, 1500, "3 /GTSGIAG3"], "isController": false}, {"data": [1.0, 500, 1500, "19 /"], "isController": false}, {"data": [1.0, 500, 1500, "18 /"], "isController": false}, {"data": [1.0, 500, 1500, "17 /"], "isController": false}, {"data": [1.0, 500, 1500, "16 /"], "isController": false}, {"data": [1.0, 500, 1500, "15 /"], "isController": false}, {"data": [1.0, 500, 1500, "14 /"], "isController": false}, {"data": [1.0, 500, 1500, "13 /"], "isController": false}, {"data": [1.0, 500, 1500, "7 /GTSGIAG3"], "isController": false}, {"data": [1.0, 500, 1500, "12 /"], "isController": false}, {"data": [1.0, 500, 1500, "2 /GTSGIAG3"], "isController": false}, {"data": [1.0, 500, 1500, "4 /GTSGIAG3"], "isController": false}, {"data": [1.0, 500, 1500, "10 /"], "isController": false}, {"data": [1.0, 500, 1500, "11 /"], "isController": false}, {"data": [1.0, 500, 1500, "5 /ocsp"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 725, 0, 0.0, 277.8151724137933, 9, 12302, 361.5999999999999, 1161.2999999999993, 3035.34, 14.692471375012666, 47.10807278472996, 7.0974492413111765], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["29 /", 50, 0, 0.0, 80.82, 58, 124, 102.0, 104.89999999999999, 124.0, 1.2365830736508878, 1.4273839775931147, 0.7897708302418757], "isController": false}, {"data": ["28 /", 25, 0, 0.0, 32.28, 30, 39, 35.400000000000006, 38.099999999999994, 39.0, 0.6193484454354019, 0.47660798340146165, 0.2637069552830422], "isController": false}, {"data": ["6 /ocsp", 25, 0, 0.0, 169.92000000000002, 132, 291, 193.20000000000002, 262.19999999999993, 291.0, 0.616294835449279, 0.42490640022186615, 0.26120308455565144], "isController": false}, {"data": ["9 /click", 25, 0, 0.0, 1478.5999999999997, 1140, 2720, 2467.4, 2648.8999999999996, 2720.0, 0.600139232301894, 26.612963269978636, 1.1068349106992823], "isController": false}, {"data": ["27 /", 50, 0, 0.0, 1455.96, 975, 3046, 3000.0, 3023.45, 3046.0, 1.1890040901740702, 27.6435555235185, 0.7983976683629792], "isController": false}, {"data": ["26 /", 25, 0, 0.0, 242.4, 31, 3057, 587.8000000000001, 2321.999999999998, 3057.0, 0.6128352208658137, 1.0604921986076385, 0.2579413869073884], "isController": false}, {"data": ["25 /", 25, 0, 0.0, 1561.1200000000001, 57, 12302, 9064.4, 11330.899999999998, 12302.0, 0.61041117296611, 1.056297459468698, 0.2569211089339779], "isController": false}, {"data": ["24 /", 25, 0, 0.0, 381.9200000000001, 290, 656, 638.6, 651.5, 656.0, 0.6486935312281066, 0.5448012078673551, 0.27746852214639717], "isController": false}, {"data": ["8 /", 25, 0, 0.0, 316.0400000000001, 296, 405, 330.20000000000005, 384.9, 405.0, 0.6132260596546311, 0.515014073538069, 0.26169901178620486], "isController": false}, {"data": ["23 /", 25, 0, 0.0, 31.560000000000002, 29, 37, 33.400000000000006, 36.099999999999994, 37.0, 0.6545359340227779, 0.5036858554784658, 0.2786891281581359], "isController": false}, {"data": ["1 /GTSGIAG3", 25, 0, 0.0, 124.56000000000002, 109, 153, 143.0, 150.9, 153.0, 0.6174059073397213, 0.4256724322088314, 0.26046811715894497], "isController": false}, {"data": ["22 /", 25, 0, 0.0, 32.2, 29, 38, 37.0, 37.7, 38.0, 0.6545016624342226, 0.2032534459512527, 0.28059202129748406], "isController": false}, {"data": ["21 /", 25, 0, 0.0, 81.32000000000001, 29, 324, 273.20000000000005, 310.2, 324.0, 0.6506858228572916, 0.19914544617526875, 0.2789561291351084], "isController": false}, {"data": ["20 /", 25, 0, 0.0, 31.279999999999998, 29, 33, 33.0, 33.0, 33.0, 0.6458613206572285, 0.4970104694120079, 0.2749956404360856], "isController": false}, {"data": ["3 /GTSGIAG3", 50, 0, 0.0, 3335.76, 141, 16986, 7440.2, 14752.499999999987, 16986.0, 1.0436452441086226, 35.94469136801019, 6.735568180039241], "isController": false}, {"data": ["19 /", 25, 0, 0.0, 299.9200000000001, 257, 459, 454.20000000000005, 459.0, 459.0, 0.6418320453903622, 0.6086122227285564, 0.2789211525378039], "isController": false}, {"data": ["18 /", 25, 0, 0.0, 261.28, 251, 276, 274.4, 275.7, 276.0, 0.6446954458713704, 0.6113274198643561, 0.28016550137964824], "isController": false}, {"data": ["17 /", 25, 0, 0.0, 67.32000000000002, 9, 500, 198.60000000000002, 411.1999999999998, 500.0, 0.6430206538234008, 0.5732177476915559, 0.28132153604773785], "isController": false}, {"data": ["16 /", 25, 0, 0.0, 63.28, 59, 71, 68.4, 70.4, 71.0, 0.6421782686873876, 0.49417624582584124, 0.2746817203955818], "isController": false}, {"data": ["15 /", 25, 0, 0.0, 193.88, 169, 287, 282.6, 286.4, 287.0, 0.6464792738744796, 1.4754121709420496, 0.27399609849758216], "isController": false}, {"data": ["14 /", 25, 0, 0.0, 31.32, 28, 35, 34.400000000000006, 35.0, 35.0, 0.6427065658902772, 0.19959051557920715, 0.27428004813872175], "isController": false}, {"data": ["13 /", 25, 0, 0.0, 32.64, 29, 43, 38.400000000000006, 41.8, 43.0, 0.6425413796648504, 0.49445567107021693, 0.2735820718104246], "isController": false}, {"data": ["7 /GTSGIAG3", 25, 0, 0.0, 126.28, 107, 175, 151.60000000000002, 168.7, 175.0, 0.6164620012822409, 0.425021653227795, 0.2600699067909454], "isController": false}, {"data": ["12 /", 25, 0, 0.0, 175.4, 169, 197, 189.20000000000002, 195.2, 197.0, 0.6483066231004616, 1.4795825958845497, 0.27477058049375036], "isController": false}, {"data": ["2 /GTSGIAG3", 25, 0, 0.0, 119.71999999999998, 103, 141, 131.0, 138.9, 141.0, 0.617848404715419, 0.4259775134073104, 0.2606547957393174], "isController": false}, {"data": ["4 /GTSGIAG3", 25, 0, 0.0, 125.72, 108, 188, 145.4, 175.39999999999998, 188.0, 0.6174211553184659, 0.42568294497542664, 0.26047454989997776], "isController": false}, {"data": ["10 /", 25, 0, 0.0, 192.36, 169, 345, 274.4000000000002, 342.0, 345.0, 0.6372673973999491, 1.4108253807672702, 0.26635785750700997], "isController": false}, {"data": ["11 /", 25, 0, 0.0, 62.64000000000001, 58, 70, 67.60000000000001, 70.0, 70.0, 0.6419638959504917, 0.19935988175025038, 0.2739631079398095], "isController": false}, {"data": ["5 /ocsp", 25, 0, 0.0, 133.24000000000004, 102, 360, 152.40000000000003, 301.4999999999999, 360.0, 0.6165836334040349, 0.4251055128742663, 0.2613254852513195], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 725, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
