import pandas as pd
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

url = 'https://sta.ci.taiwan.gov.tw/STA_AirQuality_v2/v1.0/Datastreams?$expand=Thing,Observations($orderby=phenomenonTime%20desc;$top=1)&$filter=name%20eq%20%27PM2.5%27%20and%20Thing/properties/authority%20eq%20%27%E8%A1%8C%E6%94%BF%E9%99%A2%E7%92%B0%E5%A2%83%E4%BF%9D%E8%AD%B7%E7%BD%B2%27%20and%20substringof(%27%E7%A9%BA%E6%B0%A3%E5%93%81%E8%B3%AA%E6%B8%AC%E7%AB%99%27,Thing/name)&$count=true'

df = None

# citys = [] result = []


def get_six_pm25():
    global df

    six_city = ['臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市']
    result = []
    try:
        for city in six_city:
            result.append(
                round(df.groupby('city').get_group(city)['result'].mean(), 2))
    except Exception as e:
        print(e)
    return six_city, result


def get_pm25(sort=False, show=False):
    global df
    columns = ['city', 'stationName', 'result', 'resultTime']
    datas = pd.read_json(url)['value']
    values = []
    for data in datas:
        try:
            city, stationName = data['Thing']['properties']['city'],\
                data['Thing']['properties']['stationName']

            result, resultTime = data['Observations'][0]['result'], data['Observations'][0]['resultTime']
            resultTime = pd.to_datetime(
                resultTime).strftime('%Y-%m-%d %H:%M:%S')
            if show:
                print(city, stationName, result, resultTime)
            values.append([city, stationName, result, resultTime])
        except Exception as e:
            print(e)
    df = pd.DataFrame(values, columns=columns)
    if sort:
        values = sorted(values, key=lambda x: x[2], reverse=True)
    return columns, values


if __name__ == '__main__':
    get_pm25()
    print(get_six_pm25())
