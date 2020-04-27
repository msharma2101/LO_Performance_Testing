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

    var data = {"OkPercent": 90.625, "KoPercent": 9.375};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.78125, 4000, 7000, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 4000, 7000, "GetProjectTimelineSummary"], "isController": false}, {"data": [1.0, 4000, 7000, "GetBlockList"], "isController": false}, {"data": [1.0, 4000, 7000, "GetProjectAddresses"], "isController": false}, {"data": [1.0, 4000, 7000, "ChangeAdmin"], "isController": false}, {"data": [1.0, 4000, 7000, "GetProjectTeamInfo"], "isController": false}, {"data": [0.0, 4000, 7000, "GetProjectClarificationList"], "isController": false}, {"data": [0.0, 4000, 7000, "GetProjectDocumentList"], "isController": false}, {"data": [1.0, 4000, 7000, "GetCirList"], "isController": false}, {"data": [1.0, 4000, 7000, "AddProjectTeamMember"], "isController": false}, {"data": [1.0, 4000, 7000, "CreateCir"], "isController": false}, {"data": [1.0, 4000, 7000, "GetPrototypeList"], "isController": false}, {"data": [1.0, 4000, 7000, "GetUserBpNumber"], "isController": false}, {"data": [1.0, 4000, 7000, "GetUserDetails"], "isController": false}, {"data": [1.0, 4000, 7000, "GetCampusProjectList"], "isController": false}, {"data": [1.0, 4000, 7000, "GetUserRole"], "isController": false}, {"data": [1.0, 4000, 7000, "GetProjectsForPrototypeOrBlock"], "isController": false}, {"data": [1.0, 4000, 7000, "GetCampusList"], "isController": false}, {"data": [0.0, 4000, 7000, "ChangeProjectTimeline"], "isController": false}, {"data": [1.0, 4000, 7000, "GetPortfolioList"], "isController": false}, {"data": [1.0, 4000, 7000, "RemoveProjectTeamMember"], "isController": false}, {"data": [1.0, 4000, 7000, "GetMasterList"], "isController": false}, {"data": [0.0, 4000, 7000, "ReplyProjectClarification"], "isController": false}, {"data": [1.0, 4000, 7000, "GetProjectCertificationDetails"], "isController": false}, {"data": [0.0, 4000, 7000, "Create Project"], "isController": false}, {"data": [1.0, 4000, 7000, "Project Payment"], "isController": false}, {"data": [1.0, 4000, 7000, "ChangeProjectTeam "], "isController": false}, {"data": [0.5, 4000, 7000, "GetProjectListBySel"], "isController": false}, {"data": [1.0, 4000, 7000, "UpdateProject"], "isController": false}, {"data": [0.0, 4000, 7000, "GetProjectTimelineOptions"], "isController": false}, {"data": [1.0, 4000, 7000, "GetClarificationDetail"], "isController": false}, {"data": [1.0, 4000, 7000, "GetAliasDetails"], "isController": false}, {"data": [1.0, 4000, 7000, "GetProjectDetails"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 32, 3, 9.375, 10316.749999999998, 297, 254780, 8490.1, 96075.99999999948, 254780.0, 0.09688484932892104, 10.356561081734482, 0.10482947793447557], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["GetProjectTimelineSummary", 1, 0, 0.0, 5484.0, 5484, 5484, 5484.0, 5484.0, 5484.0, 0.18234865061998543, 2.4027640066557256, 0.18359517459883296], "isController": false}, {"data": ["GetBlockList", 1, 0, 0.0, 1307.0, 1307, 1307, 1307.0, 1307.0, 1307.0, 0.7651109410864575, 1.297102142310635, 0.7591335118592196], "isController": false}, {"data": ["GetProjectAddresses", 1, 0, 0.0, 1369.0, 1369, 1369, 1369.0, 1369.0, 1369.0, 0.7304601899196493, 0.6769596877282689, 0.7204734295105917], "isController": false}, {"data": ["ChangeAdmin", 1, 0, 0.0, 1189.0, 1189, 1189, 1189.0, 1189.0, 1189.0, 0.8410428931875525, 0.7441258410428931, 0.9634212047939444], "isController": false}, {"data": ["GetProjectTeamInfo", 1, 0, 0.0, 1221.0, 1221, 1221, 1221.0, 1221.0, 1221.0, 0.819000819000819, 3.0472589066339064, 0.8078035421785421], "isController": false}, {"data": ["GetProjectClarificationList", 1, 0, 0.0, 8554.0, 8554, 8554, 8554.0, 8554.0, 8554.0, 0.11690437222352117, 0.20892089957914425, 0.11781768763151741], "isController": false}, {"data": ["GetProjectDocumentList", 1, 1, 100.0, 2535.0, 2535, 2535, 2535.0, 2535.0, 2535.0, 0.3944773175542406, 0.2600314349112426, 0.38946930473372776], "isController": false}, {"data": ["GetCirList", 1, 0, 0.0, 1997.0, 1997, 1997, 1997.0, 1997.0, 1997.0, 0.500751126690035, 1.1985752065598396, 0.5085753630445669], "isController": false}, {"data": ["AddProjectTeamMember", 1, 0, 0.0, 1163.0, 1163, 1163, 1163.0, 1163.0, 1163.0, 0.8598452278589854, 0.913585554600172, 0.9925166595012898], "isController": false}, {"data": ["CreateCir", 1, 0, 0.0, 2813.0, 2813, 2813, 2813.0, 2813.0, 2813.0, 0.35549235691432635, 0.2322503777106292, 0.442282483114113], "isController": false}, {"data": ["GetPrototypeList", 1, 0, 0.0, 1284.0, 1284, 1284, 1284.0, 1284.0, 1284.0, 0.778816199376947, 15.18007082359813, 0.8145626460280374], "isController": false}, {"data": ["GetUserBpNumber", 1, 0, 0.0, 1198.0, 1198, 1198, 1198.0, 1198.0, 1198.0, 0.8347245409015025, 0.5950672996661102, 0.8037484348914858], "isController": false}, {"data": ["GetUserDetails", 1, 0, 0.0, 1247.0, 1247, 1247, 1247.0, 1247.0, 1247.0, 0.8019246190858059, 2.8012542602245385, 0.8802375701684041], "isController": false}, {"data": ["GetCampusProjectList", 1, 0, 0.0, 1327.0, 1327, 1327, 1327.0, 1327.0, 1327.0, 0.7535795026375283, 4.329402552750565, 0.7874317068575735], "isController": false}, {"data": ["GetUserRole", 1, 0, 0.0, 1164.0, 1164, 1164, 1164.0, 1164.0, 1164.0, 0.8591065292096219, 0.682922573024055, 0.7903108891752578], "isController": false}, {"data": ["GetProjectsForPrototypeOrBlock", 1, 0, 0.0, 1389.0, 1389, 1389, 1389.0, 1389.0, 1389.0, 0.7199424046076314, 2.054366900647948, 0.7881400737940965], "isController": false}, {"data": ["GetCampusList", 1, 0, 0.0, 1272.0, 1272, 1272, 1272.0, 1272.0, 1272.0, 0.7861635220125787, 7.948389593160377, 0.7638991253930818], "isController": false}, {"data": ["ChangeProjectTimeline", 1, 0, 0.0, 8341.0, 8341, 8341, 8341.0, 8341.0, 8341.0, 0.11988970147464333, 0.11485527065100108, 0.1219971376333773], "isController": false}, {"data": ["GetPortfolioList", 1, 0, 0.0, 1260.0, 1260, 1260, 1260.0, 1260.0, 1260.0, 0.7936507936507936, 5.223059275793651, 0.7936507936507936], "isController": false}, {"data": ["RemoveProjectTeamMember", 1, 0, 0.0, 1152.0, 1152, 1152, 1152.0, 1152.0, 1152.0, 0.8680555555555555, 0.9273952907986112, 1.0053846571180556], "isController": false}, {"data": ["GetMasterList", 1, 0, 0.0, 1349.0, 1349, 1349, 1349.0, 1349.0, 1349.0, 0.7412898443291327, 13.038448619347665, 0.7499768346923648], "isController": false}, {"data": ["ReplyProjectClarification", 1, 0, 0.0, 10620.0, 10620, 10620, 10620.0, 10620.0, 10620.0, 0.09416195856873823, 0.06795477283427495, 0.10565633827683617], "isController": false}, {"data": ["GetProjectCertificationDetails", 1, 0, 0.0, 1368.0, 1368, 1368, 1368.0, 1368.0, 1368.0, 0.7309941520467835, 0.7167169225146198, 0.7117198921783625], "isController": false}, {"data": ["Create Project", 1, 1, 100.0, 254780.0, 254780, 254780, 254780.0, 254780.0, 254780.0, 0.003924954863019075, 0.00890780771646126, 0.0], "isController": false}, {"data": ["Project Payment", 1, 0, 0.0, 1806.0, 1806, 1806, 1806.0, 1806.0, 1806.0, 0.5537098560354374, 0.7045741625138427, 1.5692050802879292], "isController": false}, {"data": ["ChangeProjectTeam ", 1, 0, 0.0, 1415.0, 1415, 1415, 1415.0, 1415.0, 1415.0, 0.7067137809187278, 0.7598553445229682, 0.8343915636042403], "isController": false}, {"data": ["GetProjectListBySel", 1, 0, 0.0, 5583.0, 5583, 5583, 5583.0, 5583.0, 5583.0, 0.17911517105498836, 590.9079459967759, 0.1785904195772882], "isController": false}, {"data": ["UpdateProject", 1, 0, 0.0, 1112.0, 1112, 1112, 1112.0, 1112.0, 1112.0, 0.8992805755395684, 0.8518575764388489, 1.3945874550359711], "isController": false}, {"data": ["GetProjectTimelineOptions", 1, 1, 100.0, 1735.0, 1735, 1735, 1735.0, 1735.0, 1735.0, 0.5763688760806917, 0.5842489193083573, 0.5791831772334294], "isController": false}, {"data": ["GetClarificationDetail", 1, 0, 0.0, 1361.0, 1361, 1361, 1361.0, 1361.0, 1361.0, 0.7347538574577516, 1.2980173126377663, 0.7699129775900073], "isController": false}, {"data": ["GetAliasDetails", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 3.3670033670033668, 13.619265572390573, 3.393308080808081], "isController": false}, {"data": ["GetProjectDetails", 1, 0, 0.0, 1444.0, 1444, 1444, 1444.0, 1444.0, 1444.0, 0.6925207756232687, 7.735402960526316, 0.7297167157202217], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out (Connection timed out)", 1, 33.333333333333336, 3.125], "isController": false}, {"data": ["Test failed: text expected to contain \/&lt;RvwDescription&gt;\/", 1, 33.333333333333336, 3.125], "isController": false}, {"data": ["Test failed: text expected to contain \/ApplicationId\/", 1, 33.333333333333336, 3.125], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 32, 3, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GetProjectDocumentList", 1, 1, "Test failed: text expected to contain \/ApplicationId\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Create Project", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GetProjectTimelineOptions", 1, 1, "Test failed: text expected to contain \/&lt;RvwDescription&gt;\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
