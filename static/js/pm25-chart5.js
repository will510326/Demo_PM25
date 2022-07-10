const chart1E1 = document.querySelector('#main');
const pm25HighSite = document.querySelector("#pm25_high_site");
const pm25HighValue = document.querySelector("#pm25_high_value");
const pm25LowSite = document.querySelector("#pm25_low_site");
const pm25LowValue = document.querySelector("#pm25_low_value");

let chart1 = echarts.init(chart1E1);
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

    function drawTest(datas) {
        var option;

        // prettier-ignore
        let dataAxis = datas['stationName'];
        // prettier-ignore
        let data = datas['result'];
        let yMax = 500;
        let dataShadow = [];
        for (let i = 0; i < data.length; i++) {
            dataShadow.push(yMax);
        }
        option = {
            title: {
                text: '特性示例：渐变色 阴影 点击缩放',
                subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
            },
            xAxis: {
                data: dataAxis,
                axisLabel: {
                    inside: true,
                    color: '#000'
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                z: 10
            },
            yAxis: {
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#999'
                }
            },
            dataZoom: [{
                type: 'inside'
            }],
            tooltip: {},
            legend: {
                data: ['PM2.5']
            },
            series: [{
                name: 'PM2.5',
                type: 'bar',
                showBackground: true,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00fa9a'
                        },
                        {
                            offset: 0.5,
                            color: '#7fffd4'
                        },
                        {
                            offset: 1,
                            color: '#ffff00'
                        }
                    ])
                },
                emphasis: {
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#2378f7'
                            },
                            {
                                offset: 0.7,
                                color: '#2378f7'
                            },
                            {
                                offset: 1,
                                color: '#83bff6'
                            }
                        ])
                    }
                },
                data: data
            }]
        };
        // Enable data zoom when user click bar.
        const zoomSize = 6;
        chart1.on('click', function (params) {
            console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
            chart1.dispatchAction({
                type: 'dataZoom',
                startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
            });
        });

        option && chart1.setOption(option);
    }
}