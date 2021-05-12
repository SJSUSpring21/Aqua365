from flask import Flask , jsonify, request
import pymongo
from pymongo import MongoClient
from flask import request
import numpy
import pandas
from sklearn import neighbors,datasets
from sklearn import linear_model
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from statsmodels.tsa.arima.model import ARIMA
import seaborn as sns
import warnings
warnings.filterwarnings("ignore")
app = Flask(__name__)
# from bson.json_util import dumps
# from bson.objectid import objectId

cluster = MongoClient("mongodb+srv://admin:saiyangoku@cluster0.p6nod.mongodb.net/Aqua365?retryWrites=true&w=majority")
db = cluster["Aqua365"]
collection = db["collectedData"]
collectionUser = db["users"]

@app.route('/testapi', methods=['GET'])
def index():
    # id = collection.insert_one({"test": "success"}).inserted_id
    # print(id)

    # import numpy
    # import pandas
    # from sklearn import neighbors,datasets
    # from sklearn import linear_model
    # from sklearn.model_selection import train_test_split

    df=pandas.read_csv("water_dataX.csv")
    df=df.rename(columns={"CONDUCTIVITY (�mhos/cm)": "CONDUCTIVITY"})

    #conversions
    df['Temp']=pandas.to_numeric(df['Temp'],errors='coerce')
    df['D.O. (mg/l)']=pandas.to_numeric(df['D.O. (mg/l)'],errors='coerce')
    df['PH']=pandas.to_numeric(df['PH'],errors='coerce')
    df['B.O.D. (mg/l)']=pandas.to_numeric(df['B.O.D. (mg/l)'],errors='coerce')
    df['CONDUCTIVITY']=pandas.to_numeric(df['CONDUCTIVITY'],errors='coerce')
    df['NITRATENAN N+ NITRITENANN (mg/l)']=pandas.to_numeric(df['NITRATENAN N+ NITRITENANN (mg/l)'],errors='coerce')
    df['TOTAL COLIFORM (MPN/100ml)Mean']=pandas.to_numeric(df['TOTAL COLIFORM (MPN/100ml)Mean'],errors='coerce')

    start=2
    end=1779
    station=df.iloc [start:end ,0]
    location=df.iloc [start:end ,1]
    state=df.iloc [start:end ,2]
    do= df.iloc [start:end ,4].astype(numpy.float64)
    value=0
    ph = df.iloc[ start:end,5]  
    co = df.iloc [start:end ,6].astype(numpy.float64)   
    
    year=df.iloc[start:end,11]
    tc=df.iloc [2:end ,10].astype(numpy.float64)


    bod = df.iloc [start:end ,7].astype(numpy.float64)
    na= df.iloc [start:end ,8].astype(numpy.float64)

    df=pandas.concat([station,location,state,do,ph,co,bod,na,tc,year],axis=1)
    df.columns = ['station','location','state','do','ph','co','bod','na','tc','year']
    
    df['numpyH']=df.ph.apply(lambda x: (100 if (8.5>=x>=7)  
                                 else(80 if  (8.6>=x>=8.5) or (6.9>=x>=6.8) 
                                      else(60 if (8.8>=x>=8.6) or (6.8>=x>=6.7) 
                                          else(40 if (9>=x>=8.8) or (6.7>=x>=6.5)
                                              else 0)))))

    df['ndo']=df.do.apply(lambda x:(100 if (x>=6)  
                                    else(80 if  (6>=x>=5.1) 
                                        else(60 if (5>=x>=4.1)
                                            else(40 if (4>=x>=3) 
                                                else 0)))))

    df['nco']=df.tc.apply(lambda x:(100 if (5>=x>=0)  
                                    else(80 if  (50>=x>=5) 
                                        else(60 if (500>=x>=50)
                                            else(40 if (10000>=x>=500) 
                                                else 0)))))

    df['nbdo']=df.bod.apply(lambda x:(100 if (3>=x>=0)  
                                    else(80 if  (6>=x>=3) 
                                        else(60 if (80>=x>=6)
                                            else(40 if (125>=x>=80) 
                                                else 0)))))

    #calculation of electrical conductivity
    df['nec']=df.co.apply(lambda x:(100 if (75>=x>=0)  
                                    else(80 if  (150>=x>=75) 
                                        else(60 if (225>=x>=150)
                                            else(40 if (300>=x>=225) 
                                                else 0)))))

    df['nna']=df.na.apply(lambda x:(100 if (20>=x>=0)  
                                    else(80 if  (50>=x>=20) 
                                        else(60 if (100>=x>=50)
                                            else(40 if (200>=x>=100) 
                                                else 0)))))

    df['wph']=df.numpyH * 0.165
    df['wdo']=df.ndo * 0.281
    df['wbdo']=df.nbdo * 0.234
    df['wec']=df.nec* 0.009
    df['wna']=df.nna * 0.028
    df['wco']=df.nco * 0.281
    df['year']=df['year']+6
    df['wqi']=df.wph+df.wdo+df.wbdo+df.wec+df.wna+df.wco 

    ag=df.groupby('year')['wqi'].mean()

    data=ag.reset_index(level=0,inplace=False)

    data = data[numpy.isfinite(data['wqi'])]

    data=data.reset_index(level=0,inplace=False)
    cols =['year']

    y = data['wqi']
    x=data[cols]

    reg=linear_model.LinearRegression()
    x_train,x_test,y_train,y_test=train_test_split(x,y,test_size=0.2,random_state=4)

    reg.fit(x_train,y_train)

    a=reg.predict(x_test)
    dt = pandas.DataFrame({'Actual': y_test, 'Predicted': a}) 

    x = (x - x.mean()) / x.std()
    x = numpy.c_[numpy.ones(x.shape[0]), x]

    # import numpy as numpy

    #Optimized using gradient descent
    newB=[74.76, 2.13]

    def rmse(y,y_pred):
        rmse= numpy.sqrt(sum(y-y_pred))
        return rmse
    

    y_pred=x.dot(newB)

    dt = pandas.DataFrame({'Actual': y, 'Predicted': y_pred})  
    dt=pandas.concat([data, dt], axis=1)

    df1 = df[['year','wph', 'wdo', 'wbdo','wec','wna','wco','wqi']].copy()
    dfg= df1.groupby("year").mean()
    dt=dt.drop(columns=['index'])

    year_list = dt['year'].tolist()
    actual_wqi = dt['Actual'].tolist()
    predicted_wqi = dt['Predicted'].tolist()

    return_obj = {
        'name': 'Hello from Flask',
        'yearList': year_list,
        'actualWqi': actual_wqi,
        'predictedWqi': predicted_wqi,
    }

    print(return_obj)

    return return_obj


@app.route('/graphsAndAverages', methods=['GET'])
def graphsAndAverages():
    df=pandas.read_csv("water_dataX.csv")
    df=df.rename(columns={"CONDUCTIVITY (�mhos/cm)": "CONDUCTIVITY"})
    df['Temp']=pandas.to_numeric(df['Temp'],errors='coerce')
    df['D.O. (mg/l)']=pandas.to_numeric(df['D.O. (mg/l)'],errors='coerce')
    df['PH']=pandas.to_numeric(df['PH'],errors='coerce')
    df['B.O.D. (mg/l)']=pandas.to_numeric(df['B.O.D. (mg/l)'],errors='coerce')
    df['CONDUCTIVITY']=pandas.to_numeric(df['CONDUCTIVITY'],errors='coerce')
    df['NITRATENAN N+ NITRITENANN (mg/l)']=pandas.to_numeric(df['NITRATENAN N+ NITRITENANN (mg/l)'],errors='coerce')
    df['TOTAL COLIFORM (MPN/100ml)Mean']=pandas.to_numeric(df['TOTAL COLIFORM (MPN/100ml)Mean'],errors='coerce')
    start=2
    end=1779
    station=df.iloc [start:end ,0]
    location=df.iloc [start:end ,1]
    state=df.iloc [start:end ,2]
    do= df.iloc [start:end ,4].astype(numpy.float64)
    value=0
    ph = df.iloc[ start:end,5]  
    co = df.iloc [start:end ,6].astype(numpy.float64)   
    
    year=df.iloc[start:end,11]
    tc=df.iloc [2:end ,10].astype(numpy.float64)


    bod = df.iloc [start:end ,7].astype(numpy.float64)
    na= df.iloc [start:end ,8].astype(numpy.float64)
    # na.dtype

    df=pandas.concat([station,location,state,do,ph,co,bod,na,tc,year],axis=1)
    df.columns = ['station','location','state','do','ph','co','bod','na','tc','year']

    df['npH']=df.ph.apply(lambda x: (100 if (8.5>=x>=7)  
                                 else(80 if  (8.6>=x>=8.5) or (6.9>=x>=6.8) 
                                      else(60 if (8.8>=x>=8.6) or (6.8>=x>=6.7) 
                                          else(40 if (9>=x>=8.8) or (6.7>=x>=6.5)
                                              else 0)))))
    
    df['ndo']=df.do.apply(lambda x:(100 if (x>=6)  
                                 else(80 if  (6>=x>=5.1) 
                                      else(60 if (5>=x>=4.1)
                                          else(40 if (4>=x>=3) 
                                              else 0)))))
    
    df['nco']=df.tc.apply(lambda x:(100 if (5>=x>=0)  
                                 else(80 if  (50>=x>=5) 
                                      else(60 if (500>=x>=50)
                                          else(40 if (10000>=x>=500) 
                                              else 0)))))
    
    df['nbdo']=df.bod.apply(lambda x:(100 if (3>=x>=0)  
                                 else(80 if  (6>=x>=3) 
                                      else(60 if (80>=x>=6)
                                          else(40 if (125>=x>=80) 
                                              else 0)))))
    
    df['nec']=df.co.apply(lambda x:(100 if (75>=x>=0)  
                                 else(80 if  (150>=x>=75) 
                                      else(60 if (225>=x>=150)
                                          else(40 if (300>=x>=225) 
                                              else 0)))))
    
    df['nna']=df.na.apply(lambda x:(100 if (20>=x>=0)  
                                 else(80 if  (50>=x>=20) 
                                      else(60 if (100>=x>=50)
                                          else(40 if (200>=x>=100) 
                                              else 0)))))
    
    df['wph']=df.npH * 0.165
    df['wdo']=df.ndo * 0.281
    df['wbdo']=df.nbdo * 0.234
    df['wec']=df.nec* 0.009
    df['wna']=df.nna * 0.028
    df['wco']=df.nco * 0.281
    df['year']=df['year']+6
    df['wqi']=df.wph+df.wdo+df.wbdo+df.wec+df.wna+df.wco 

    ag=df.groupby('year')['wqi'].mean()
    data=ag.reset_index(level=0,inplace=False)
    data = data[numpy.isfinite(data['wqi'])]
    data=data.reset_index(level=0,inplace=False)

    cols =['year']
    y = data['wqi']
    x=data[cols]

    reg=linear_model.LinearRegression()
    x_train,x_test,y_train,y_test=train_test_split(x,y,test_size=0.2,random_state=4)

    reg.fit(x_train,y_train)

    a=reg.predict(x_test)

    dt = pandas.DataFrame({'Actual': y_test, 'Predicted': a}) 

    x = (x - x.mean()) / x.std()
    x = numpy.c_[numpy.ones(x.shape[0]), x]

    alpha = 0.1 
    iterations = 3000 
    m = y.size
    numpy.random.seed(4) 
    theta = numpy.random.rand(2)
    def gradient_descent(x, y, theta, iterations, alpha):
        past_costs = []
        past_thetas = [theta]
        for i in range(iterations):
            prediction = numpy.dot(x, theta)
            error = prediction - y
            cost = 1/(2*m) * numpy.dot(error.T, error)
            past_costs.append(cost)
            theta = theta - (alpha * (1/m) * numpy.dot(x.T, error))
            past_thetas.append(theta)
            
        return past_thetas, past_costs

    past_thetas, past_costs = gradient_descent(x, y, theta, iterations, alpha)
    theta = past_thetas[-1]
    print("Gradient Descent: {:.2f}, {:.2f}".format(theta[0], theta[1]))

    newB=[74.76, 2.13]

    def rmse(y,y_pred):
        rmse= numpy.sqrt(sum(y-y_pred))
        return rmse
    

    y_pred=x.dot(newB)

    dt = pandas.DataFrame({'Actual': y, 'Predicted': y_pred})  
    dt=pandas.concat([data, dt], axis=1)
    df1 = df[['year','wph', 'wdo', 'wbdo','wec','wna','wco','wqi']].copy()
    dfg= df1.groupby("year").mean()
    dt=dt.drop(columns=['index'])
    dfg=dfg.reset_index(level=0,inplace=False)
    dt=dt.drop(columns=['wqi'])
    ##########################################################################
    # Graph1
    y_actual=dt['Actual'].to_numpy() #actual value
    y_actual_converted=dt['Actual'].tolist() #actual value
    y_predicted = dt['Predicted'].values # predicted value
    y_predicted_converted = dt['Predicted'].tolist()
    ##########################################################################

    # Actual Value Forecast (Graph2)
    model = ARIMA(y_actual, order=(1, 1, 1))
    model_fit = model.fit()
    yhat = model_fit.predict(len(y_actual), len(y_actual), typ='levels')
    ###########################################################################
    # Return this value for graph 2
    forecast = model_fit.forecast(steps=5) #graph 2
    forecast_converted = forecast.tolist()

    df1=df1.groupby(["year"]).mean()
    df1=df1.reset_index(level=0,inplace=False)

    # ph forecast
    wph_np = df1['wph'].to_numpy()
    model1 = ARIMA(wph_np, order=(1, 1, 1))
    model_fit1 = model1.fit()
    yhat1 = model_fit1.predict(len(wph_np), len(wph_np), typ='levels')

    ###########################################################################
    forecast1 = model_fit1.forecast(steps=5)
    forecast1_converted = forecast1.tolist()

    # DO forecast
    wdo_np = df1['wdo'].to_numpy()
    model2 = ARIMA(wdo_np, order=(1, 1, 1))
    model_fit2 = model2.fit()
    yhat2 = model_fit2.predict(len(wdo_np), len(wdo_np), typ='levels')

    ###########################################################################
    forecast2 = model_fit2.forecast(steps=5)
    forecast2_converted = forecast2.tolist()

    # BDO forecast
    wbdo_np = df1['wbdo'].to_numpy()
    model3 = ARIMA(wbdo_np, order=(1, 1, 1))
    model_fit3 = model3.fit()
    yhat3 = model_fit3.predict(len(wbdo_np), len(wbdo_np), typ='levels')

    ###########################################################################
    forecast3 = model_fit3.forecast(steps=5)
    forecast3_converted = forecast3.tolist()

    # WEC forecast
    wec_np = df1['wec'].to_numpy()
    model4 = ARIMA(wec_np, order=(1, 1, 1))
    model_fit4 = model4.fit()
    yhat4 = model_fit4.predict(len(wec_np), len(wec_np), typ='levels')

    ###########################################################################
    forecast4 = model_fit4.forecast(steps=5)
    forecast4_converted = forecast4.tolist()

    # WNA forecast
    wna_np = df1['wna'].to_numpy()
    model5 = ARIMA(wna_np, order=(1, 1, 1))
    model_fit5 = model5.fit()
    yhat5 = model_fit5.predict(len(wna_np), len(wna_np), typ='levels')

    ###########################################################################
    forecast5 = model_fit5.forecast(steps=5)
    forecast5_converted = forecast5.tolist()

    # WCO forecast
    wco_np = df1['wco'].to_numpy()
    model6 = ARIMA(wco_np, order=(1, 1, 1))
    model_fit6 = model6.fit()
    yhat6 = model_fit6.predict(len(wco_np), len(wco_np), typ='levels')

    ###########################################################################
    forecast6 = model_fit6.forecast(steps=5)
    forecast6_converted = forecast6.tolist()
    
    # Pedicted WQI forecast
    y_predicted=dt['Predicted'].to_numpy() 
    model7 = ARIMA(y_predicted, order=(1, 1, 1))
    model_fit7 = model7.fit()
    yhat7 = model_fit7.predict(len(y_predicted), len(y_predicted), typ='levels')

    ###########################################################################
    forecast7 = model_fit7.forecast(steps=5) #graph 2 option
    forecast7_converted = forecast7.tolist()

    # Calculations
    a1=dfg.iloc[8]-dfg.iloc[0]
    difference_fromstart1=(a1*100/(dfg.iloc[0]))

    ###########################################################################
    # Percent difference in WQI since start
    a=difference_fromstart1['wqi']

    ###########################################################################
    # Percent difference in ph since start
    b=difference_fromstart1['wph']

    ###########################################################################
    # Percent difference in DO since start
    c=difference_fromstart1['wdo']

    ###########################################################################
    # Percent difference in BDO since start
    d=difference_fromstart1['wbdo']

    ###########################################################################
    # Percent difference in EC since start
    e=difference_fromstart1['wec']

    ###########################################################################
    # Percent difference in NA since start
    f=difference_fromstart1['wna']

    ###########################################################################
    # Percent difference in CO since start
    g=difference_fromstart1['wco']

    ###########################################################################
    # Percent difference since last year
    a1_new=dfg.iloc[8]-dfg.iloc[7]
    difference_fromlast=(a1_new*100/(dfg.iloc[0]))

    a2=difference_fromlast['wqi']
    b2=difference_fromlast['wdo']
    c2=difference_fromlast['wdo']
    d2=difference_fromlast['wbdo']
    e2=difference_fromlast['wec']
    f2=difference_fromlast['wna']
    g2=difference_fromlast['wco']

    ###########################################################################
    # Average values
    a3=dfg['wqi'].mean()
    b3=dfg['wph'].mean()
    c3=dfg['wdo'].mean()
    d3=dfg['wbdo'].mean()
    e3=dfg['wec'].mean()
    f3=dfg['wna'].mean()
    g3=dfg['wco'].mean()

    return_obj = {
        'graph1_y_actual': y_actual_converted,
        'graph1_y_predicted': y_predicted_converted,
        'graph2_arima_forecast': forecast_converted,
        'phForecast': forecast1_converted,
        'doForecast': forecast2_converted,
        'bdoForecast': forecast3_converted,
        'wecForecast': forecast4_converted,
        'wnaForecast': forecast5_converted,
        'wcoForecast': forecast6_converted,
        'predictedWqiForecast': forecast7_converted,
        'percentDiffWqiSinceStart': a,
        'percentDiffPhSinceStart': b,
        'percentDiffDoSinceStart': c,
        'percentDiffBdoSinceStart': d,
        'percentDiffEcSinceStart': e,
        'percentDiffNaSinceStart': f,
        'percentDiffCoSinceStart': g,
        'percentDiffWqiSinceLastYear': a2,
        'percentDiffPhSinceStart': b2,
        'percentDiffDoSinceStart': c2,
        'percentDiffBdoSinceStart': d2,
        'percentDiffEcSinceStart': e2,
        'percentDiffNaSinceStart': f2,
        'percentDiffCoSinceStart': g2,
        'avgWQI': a3,
        'avgPh': b3,
        'avgDo': c3,
        'avgBdo': d3,
        'avgEc': e3,
        'avgNa': f3,
        'avgCo': g3,
    }

    print(return_obj)

    return return_obj

@app.route('/savedetails', methods=['POST'])
def save():
    req = request.get_json(force=True)
    print(req)
    return req

@app.route('/login', methods=['POST'])
def login():
    req = request.get_json(force=True)
    print(req['email'])
    x = collectionUser.find_one({"email":req["email"]})
    if x['password'] ==req['password']:
        return_obj = {
            "status":200,
            "email": x["email"],
            "password": x["password"]
        }
        return return_obj
    else:
        return {
            "status":400
        }
        
    return req



if __name__ == '__main__':
    app.run(debug=True)