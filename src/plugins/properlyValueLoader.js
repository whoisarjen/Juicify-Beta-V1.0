import Vue from 'vue'
import store from '../store'

Vue.prototype.$properlyValueLoader = async (whenAdded, underDate, limitOfResults, loadMore, loginFROMparam, dateFROMparam) => {
    if(!underDate) underDate = await Vue.prototype.$getCorrectDate()
    return new Promise(resolve => {
        (async () => {
            let array = []
            const emptyObject = {
                "weight": 0,
                "nutrition_diary": [],
                "workout_result": []
            }
            if((Vue.prototype.$dateMINlimit <= dateFROMparam || !dateFROMparam) && loginFROMparam == store.state.userToken.login && !loadMore){
                if(whenAdded){
                    array = await Vue.prototype.$getIndexedDBbyID('daily_measurement', await Vue.prototype.$dateTOiso(dateFROMparam))
                    if(!array) array = emptyObject // For not created days yet
                }else array = await Vue.prototype.$getAllIndexedDB('daily_measurement')
            }else{
                try{
                    let valueFromDB = await Vue.prototype.$selectFROM(false, 'daily_measurement',  await Vue.prototype.$addDAYStoISO(await Vue.prototype.$dateTOiso(underDate), 1), null, limitOfResults, await Vue.prototype.$dateTOiso(whenAdded), false, loginFROMparam)
                    if(valueFromDB){
                        if(Array.isArray(valueFromDB)) array = valueFromDB
                        else array = valueFromDB
                    }else array = emptyObject
                }catch{
                    if(dateFROMparam < Vue.prototype.$dateMINlimit){ // Offline accepts only dates bigger than limit
                        Vue.prototype.$router.push('/' + store.state.userToken.login + '/nutrition_diary/' + Vue.prototype.$dateMINlimit)
                        resolve();
                    }else array = emptyObject
                }
            }
            resolve(array);
        })();
    })
},

Vue.prototype.$loadMOREvalueFROMmongoDB = async (underDatePlusTheDate, limitOfResults, loginFROMparam) => {
    return new Promise(resolve => {
        (async () => {
            if(underDatePlusTheDate == '') underDatePlusTheDate = await Vue.prototype.$getCorrectDate()
            let array = await Vue.prototype.$selectFROM(false, 'daily_measurement', await Vue.prototype.$addDAYStoISO(await Vue.prototype.$dateTOiso(underDatePlusTheDate), -1), null, limitOfResults, false, loginFROMparam)
            if(!array){
                // If value doesnt exist, bring back empty schema
                array = [{
                    "weight": 0,
                    "nutrition_diary": [],
                    "workout_result": []
                }]
            }
            resolve(array);
        })();
    })
},

Vue.prototype.$properlyValueLoaderByID = async (where, keyToFindSpecificObject, loginFROMparam) => {
    return new Promise(resolve => {
        (async () => {
            let responseFromDB
            if(keyToFindSpecificObject){ // For only one result
                if(store.state.userToken.login == loginFROMparam){
                    responseFromDB = await Vue.prototype.$getIndexedDBbyID(where, keyToFindSpecificObject) 
                    if(!responseFromDB) responseFromDB = await Vue.prototype.$selectFROM(false, where, null, null, 1, keyToFindSpecificObject, false, loginFROMparam) // Checking if user have not in cache
                }else responseFromDB = await Vue.prototype.$selectFROM(false, where, null, null, 1, keyToFindSpecificObject, false, loginFROMparam)
            }else{
                if(store.state.userToken.login == loginFROMparam){
                    responseFromDB = await Vue.prototype.$getAllIndexedDB(where) // bringing back all results from cache
                }else responseFromDB = await Vue.prototype.$selectFROM(false, where, null, null, null, keyToFindSpecificObject, false, loginFROMparam)
            }
            resolve(responseFromDB);
        })();
    })
},

Vue.prototype.$selectFROM = async (resetIndexedDB, where, underDatePlusTheDate, overDatePlusTheDate, limitOfResults, keyToFindSpecificObject, AddToIndexedDB, loginFROMparam) => {
    return new Promise(resolve => {
        Vue.prototype.$http.post('requests/find/' + where, {
            where: where,
            limitOfResults: limitOfResults,
            overDatePlusTheDate: overDatePlusTheDate,
            underDatePlusTheDate: underDatePlusTheDate,
            keyToFindSpecificObject: keyToFindSpecificObject,
            loginFromRoute: loginFROMparam,
            user_ID: store.state.userToken._id
        })
        .then(async (response) => {
            await Vue.prototype.$gotNewToken(response.data.tokenGenerated, response.data.tokenRefreshGenerated)
            if(response.data.user) store.state.guest = response.data.user // Guest bring back user's settings
            if(AddToIndexedDB){ // Add values to indexedDB
                if(resetIndexedDB){ // Clean indexedDB before adding value to indexedDB
                    let valueToDeleteFromIndexedDB = await Vue.prototype.$getAllIndexedDB(where)
                    if(valueToDeleteFromIndexedDB.length>0){
                        for(let i=0;i<valueToDeleteFromIndexedDB.length;i++){
                            if(where == 'daily_measurement') await Vue.prototype.$deleteIndexedDB(where, valueToDeleteFromIndexedDB[i].whenAdded)
                            else if(valueToDeleteFromIndexedDB[i].user_ID != 0) await Vue.prototype.$deleteIndexedDB(where, valueToDeleteFromIndexedDB[i]._id) // user_ID is for cached values, which u download only once and not touch
                        }
                    }
                }
                await Vue.prototype.$addIndexedDB(where, response.data.item)
            }
            resolve(response.data.item);
        })
        .catch(async (err) => {
            await Vue.prototype.$catchThis(err)
            resolve()
        })
    });
}