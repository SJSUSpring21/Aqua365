from flask import Flask
import pymongo
from pymongo import MongoClient
app = Flask(__name__)

cluster = MongoClient("mongodb+srv://admin:saiyangoku@cluster0.p6nod.mongodb.net/Aqua365?retryWrites=true&w=majority")
db = cluster["Aqua365"]
collection = db["collectedData"]

@app.route('/testapi', methods=['GET'])
def index():
    # id = collection.insert_one({"test": "success"}).inserted_id
    # print(id)
    import numpy
    import pandas
    from sklearn import neighbors,datasets
    from sklearn import linear_model
    from sklearn.model_selection import train_test_split

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

    import numpy as numpy

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

if __name__ == '__main__':
    app.run(debug=True)