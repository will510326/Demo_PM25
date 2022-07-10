const chart1E1 = document.querySelector('#main');
const chart2E2 = document.querySelector('#six');

const pm25HighSite = document.querySelector("#pm25_high_site");
const pm25HighValue = document.querySelector("#pm25_high_value");
const pm25LowSite = document.querySelector("#pm25_low_site");
const pm25LowValue = document.querySelector("#pm25_low_value");

let chart1 = echarts.init(chart1E1);
let chart2 = echarts.init(chart2E2);
$(document).ready(() => {
    drawPM25();
}); //網頁整個渲染後才執行內部函式

function rendyMaxPM25(data) {
    console.log(data);
    let stationName = data['stationName'];
    let result = data['result']

    let maxIndex = result.indexOf(Math.max(...result)); //找最大值的位置
    let minIndex = result.indexOf(Math.min(...result)); //找最小值位置

    pm25HighSite.innerText = stationName[maxIndex];
    pm25HighValue.innerText = result[maxIndex];
    pm25LowSite.innerText = stationName[minIndex];
    pm25LowValue.innerText = result[minIndex];

    console.log(maxIndex, minIndex)
}
//繪製六都function
function drawSixPM25() {
    chart2.showLoading();
    $.ajax({
        url: "/six-pm25-json",
        type: "POST",
        dataType: "json",
        success: (data) => {
            chart2.hideLoading();
            console.log(data);
            drawChart2(data);

        },
        error: () => {
            chart2.hideLoading();
            alert("六都資料讀取失敗！！");
        }
    });

    function drawChart2(data) {

        var option;

        option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['PM2.5']
            },


            xAxis: {
                type: 'category',
                data: data['citys']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                itemStyle: {
                    color: '#7fffd4'
                },
                name: 'PM2.5', // 可以將指標移動到想看的柱狀顯示資訊
                data: data['results'],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                },

            }]
        };

        option && chart2.setOption(option);
    }
}

//繪畫全台的function
function drawPM25() {
    //數值初始化
    pm25HighSite.innerText = "N/A";
    pm25HighValue.innerText = 0;
    pm25LowSite.innerText = "N/A";
    pm25LowValue.innerText = 0;
    chart1.showLoading(); //顯示Loading畫面
    $.ajax({
        url: "/pm25-json",
        type: "POST",
        dataType: "json",
        success: (data) => {
            chart1.hideLoading();
            console.log(data);
            drawChart1(data);
            rendyMaxPM25(data);
            drawSixPM25();
            $('#date').text(data["time"]) //get time data for pm25-chart.html
        },
        error: () => {
            chart1.hideLoading();
            alert("資料讀取失敗！！");
        }
    });


    function drawChart1(data) {

        var option;

        option = {

            title: {
                text: "全台PM25資訊"
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['PM2.5']
            },


            xAxis: {
                type: 'category',
                data: data['stationName']
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'left',
                top: 'center',
                feature: {
                    magicType: {
                        show: true,
                        type: ['line', 'bar', 'tiled']
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    }
                }
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: 'PM2.5', // 可以將指標移動到想看的柱狀顯示資訊
                data: data['result'],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }]
        };

        option && chart1.setOption(option);
    }
}