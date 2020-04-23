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

    var data = {"OkPercent": 85.0, "KoPercent": 15.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 4, 7, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 4, 7, "Get the card tokenized 1000181800"], "isController": false}, {"data": [0.0, 4, 7, "Fill Registration page with all fields"], "isController": false}, {"data": [0.0, 4, 7, "Project Registration confirmation and get Project Id"], "isController": false}, {"data": [0.0, 4, 7, "Get Payment page nonces"], "isController": false}, {"data": [0.0, 4, 7, "Make Credit card Payment"], "isController": true}, {"data": [0.0, 4, 7, "Start payment for project registration"], "isController": false}, {"data": [0.0, 4, 7, "Get project registration payment billing info"], "isController": false}, {"data": [0.0, 4, 7, "Login"], "isController": true}, {"data": [0.0, 4, 7, "Sdn status validation api"], "isController": false}, {"data": [0.0, 4, 7, "Log out"], "isController": true}, {"data": [0.0, 4, 7, "LEED Online login page api"], "isController": false}, {"data": [0.0, 4, 7, "Registration page"], "isController": false}, {"data": [0.0, 4, 7, "Create_Project "], "isController": true}, {"data": [0.0, 4, 7, "Receipt page"], "isController": false}, {"data": [0.0, 4, 7, "Get Payment process Id of the payment"], "isController": false}, {"data": [0.0, 4, 7, "Projet registration payment completion and get the order Id"], "isController": false}, {"data": [0.0, 4, 7, "LEED Online  "], "isController": false}, {"data": [0.0, 4, 7, "Get Registration page nonces "], "isController": false}, {"data": [0.0, 4, 7, "Validate Zip code"], "isController": false}, {"data": [0.0, 4, 7, "Payment page"], "isController": false}, {"data": [0.0, 4, 7, "Payment page - validate zipcode"], "isController": false}, {"data": [0.0, 4, 7, "Agreement Page"], "isController": false}, {"data": [0.0, 4, 7, "Click on logout button"], "isController": false}, {"data": [0.0, 4, 7, "Projects page  "], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 20, 3, 15.0, 1032.05, 0, 5584, 2407.4000000000015, 5428.099999999998, 5584.0, 0.08021883698730137, 8.839034761830273, 0.2987838322944994], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["Get the card tokenized 1000181800", 1, 0, 0.0, 852.0, 852, 852, 852.0, 852.0, 852.0, 1.1737089201877935, 3.566974765258216, 3.3835827464788735], "isController": false}, {"data": ["Fill Registration page with all fields", 1, 1, 100.0, 1842.0, 1842, 1842, 1842.0, 1842.0, 1842.0, 0.5428881650380022, 75.8034108645494, 5.753342155266015], "isController": false}, {"data": ["Project Registration confirmation and get Project Id", 1, 0, 0.0, 5584.0, 5584, 5584, 5584.0, 5584.0, 5584.0, 0.17908309455587393, 0.12836620254297995, 0.11070273325573067], "isController": false}, {"data": ["Get Payment page nonces", 1, 0, 0.0, 158.0, 158, 158, 158.0, 158.0, 158.0, 6.329113924050633, 3.566307357594937, 2.4970332278481013], "isController": false}, {"data": ["Make Credit card Payment", 1, 1, 100.0, 4584.0, 4584, 4584, 4584.0, 4584.0, 4584.0, 0.2181500872600349, 46.001973576570684, 3.1314337232766145], "isController": true}, {"data": ["Start payment for project registration", 1, 0, 0.0, 148.0, 148, 148, 148.0, 148.0, 148.0, 6.756756756756757, 6.802945523648649, 4.757442989864865], "isController": false}, {"data": ["Get project registration payment billing info", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 16.666666666666668, 9.147135416666668, 14.94140625], "isController": false}, {"data": ["Login", 1, 0, 0.0, 4517.0, 4517, 4517, 4517.0, 4517.0, 4517.0, 0.22138587558113793, 354.31987837613457, 3.9745682975426164], "isController": true}, {"data": ["Sdn status validation api", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 1.658374792703151, 0.7384950248756219, 1.0769719112769487], "isController": false}, {"data": ["Log out", 1, 0, 0.0, 1033.0, 1033, 1033, 1033.0, 1033.0, 1033.0, 0.968054211035818, 18.346707103097774, 7.3209099709583745], "isController": true}, {"data": ["LEED Online login page api", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 1.9723865877712032, 1.2057753944773175, 1.2192585059171597], "isController": false}, {"data": ["Registration page", 1, 0, 0.0, 1064.0, 1064, 1064, 1064.0, 1064.0, 1064.0, 0.9398496240601504, 132.50686530780075, 8.817514978853383], "isController": false}, {"data": ["Create_Project ", 1, 1, 100.0, 10507.0, 10507, 10507, 10507.0, 10507.0, 10507.0, 0.0951746454744456, 35.54224638931189, 3.2951432675835157], "isController": true}, {"data": ["Receipt page", 1, 1, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["Get Payment process Id of the payment", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 4.184100418410042, 4.5232413702928875, 2.762160041841004], "isController": false}, {"data": ["Projet registration payment completion and get the order Id", 1, 1, 100.0, 1880.0, 1880, 1880, 1880.0, 1880.0, 1880.0, 0.5319148936170213, 0.374522107712766, 0.42231133643617025], "isController": false}, {"data": ["LEED Online  ", 1, 0, 0.0, 2466.0, 2466, 2466, 2466.0, 2466.0, 2466.0, 0.40551500405515006, 300.31276928730733, 2.4259618309002433], "isController": false}, {"data": ["Get Registration page nonces ", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 4.975124378109452, 2.8033659825870645, 1.7976523631840795], "isController": false}, {"data": ["Validate Zip code", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 3.7735849056603774, 3.3350530660377355, 2.1005306603773586], "isController": false}, {"data": ["Payment page", 1, 0, 0.0, 1021.0, 1021, 1021, 1021.0, 1021.0, 1021.0, 0.9794319294809011, 197.82898965475027, 7.239570580313419], "isController": false}, {"data": ["Payment page - validate zipcode", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 4.424778761061947, 3.9105710730088497, 2.7914131637168142], "isController": false}, {"data": ["Agreement Page", 1, 0, 0.0, 948.0, 948, 948, 948.0, 948.0, 948.0, 1.0548523206751055, 95.16436741824894, 13.14032832278481], "isController": false}, {"data": ["Click on logout button", 1, 0, 0.0, 1033.0, 1033, 1033, 1033.0, 1033.0, 1033.0, 0.968054211035818, 18.346707103097774, 7.3209099709583745], "isController": false}, {"data": ["Projects page  ", 1, 0, 0.0, 1544.0, 1544, 1544, 1544.0, 1544.0, 1544.0, 0.6476683937823834, 556.5286745061528, 7.35268073996114], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 1,842 milliseconds, but should not have lasted longer than 1,800 milliseconds.", 1, 33.333333333333336, 5.0], "isController": false}, {"data": ["Test failed: text expected to contain \/&quot;status&quot;:&quot;success&quot;\/", 1, 33.333333333333336, 5.0], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 69: https:\/\/leedonline-stg.usgbc.org\/payment\/confirm\/project\/1000181800\/${order_id}", 1, 33.333333333333336, 5.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 20, 3, "The operation lasted too long: It took 1,842 milliseconds, but should not have lasted longer than 1,800 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Fill Registration page with all fields", 1, 1, "The operation lasted too long: It took 1,842 milliseconds, but should not have lasted longer than 1,800 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Receipt page", 1, 1, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 69: https:\/\/leedonline-stg.usgbc.org\/payment\/confirm\/project\/1000181800\/${order_id}", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Projet registration payment completion and get the order Id", 1, 1, "Test failed: text expected to contain \/&quot;status&quot;:&quot;success&quot;\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
