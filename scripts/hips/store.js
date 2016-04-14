define(['hips/io'], function(io) {
  // if(window.store) return window.store;
  var debug = require.mozuData('pagecontext').isDebugMode,
  noop = function(){};
  var history = [];
  var store = {
    constants: {

    },
    views: {

    },
    log: debugOnly(function(message, source, lineNum, colNum, stack) {
      history.push({message: message, source: source, lineNum: lineNum, colNum: colNum, timeStamp: Date.now(), stack: stack});
      console.log({message: message, source: source, lineNum: lineNum, colNum: colNum, timeStamp: Date.now(), stack: stack});
    }),
    info: debugOnly(function(message, source, lineNum, colNum, stack) {
      history.push({message: message, source: source, lineNum: lineNum, colNum: colNum, timeStamp: Date.now(), stack: stack});
      console.info({message: message, source: source, lineNum: lineNum, colNum: colNum, timeStamp: Date.now(), stack: stack});
    }),
    warn: debugOnly(function(message, source, lineNum, colNum, stack) {
      history.push({message: message, source: source, lineNum: lineNum, colNum: colNum, timeStamp: Date.now(), stack: stack});
      console.warn({message: message, source: source, lineNum: lineNum, colNum: colNum, timeStamp: Date.now(), stack: stack});
    }),
    error: debugOnly(function(message, source, lineNum, colNum, stack) {
      history.push({message: message, source: source, lineNum: lineNum, colNum: colNum, timeStamp: Date.now(), stack: stack});
      console.error({message: message, source: source, lineNum: lineNum, colNum: colNum, timeStamp: Date.now(), stack: stack});
    }),
    'try': function(fun, context) {
      try {
        fun.apply(context || null);
      } catch(e) {
        this.error(e.message, e.source, e.lineNum, e.colNum, e.timeStamp, e.stack);
      }
    },
    history: (function() {
      var historyLogger = function() {
        return history;
      };
      historyLogger.search = function(term) {
        if(!term) return 'no search term';
        if(!term.toLowerCase) return 'cant search with that term';
        return history.sort(function(a, b) {
          var aCount = 0;
          var bCount = 0;
          for(var aKey in a) {
            if(a[aKey] && a.hasOwnProperty(aKey)) {
              var aIntermediate;
              if(typeof a[aKey] === 'object' && !(a[aKey] instanceof Array)) {
                aIntermediate = JSON.stringify(a[aKey]).toLowerCase();
              } else {
                aIntermediate = a[aKey].toString().toLowerCase();
              }
              if(!aIntermediate || !aIntermediate.indexOf) continue;
              if(aIntermediate.indexOf(term.toLowerCase()) >= 0) aCount += 20;
            }
          }
          for(var bKey in b) {
            if(b[bKey] && b.hasOwnProperty(bKey)) {
              var bIntermediate;
              if(typeof b[bKey] === 'object' && !(b[bKey] instanceof Array)) {
                bIntermediate = JSON.stringify(b[bKey]).toLowerCase();
              } else {
                bIntermediate = b[bKey].toString().toLowerCase();
              }
              if(!bIntermediate || !bIntermediate.indexOf) continue;
              if(bIntermediate.indexOf(term.toLowerCase()) >= 0) bCount += 20;
            }
          }
          return aCount > bCount ? -1 : (aCount < bCount ? 1 : 0);
        });
      };
      return historyLogger;
    })(),
    customer: DataStore(io.getCustomer)

  };

  if(debug)  {
    window.store = store;
    window.onerror = function(message, source, lineNum, colNum, error) {
      store.log.err(message, lineNum);
    };
  }



  // cb get supported only for simplicity
  // expect shouldFire to be a function that determines whether
  // the relevant subscriber should be notified of a data change
  // dataStore(setVal), dataStore(subscribe), dataStore(subscribe, shouldFire)
  function DataStore(get, shouldFire) {
    var data = null;
    var subscriptions = [];
    var shouldFireList = [];
    var fire = function() {
        subscriptions.forEach(function(sub, dex) {
            if(!shouldFireList[dex]) return store.error('invalid shouldFireList');
            if(shouldFireList[dex]()) sub(data);
        });
    };
    var getData = function(cb) {
      if(!get) return;
      get(function(res) {
        data = res;
        fire();
        if(cb && typeof cb === 'function') cb(data);
      });
    };
    var dataStore = function(val) {
      if(typeof val === 'function') {
        if(data) val(data);
        else {
          subscriptions.push(val);
          shouldFireList.push(shouldFire || function(){ return true; });
          return;
        }
      }


      if(val) {
        data = val;
        fire();
      }
      else return data;
    };
    dataStore.apiGet = getData;
    getData();
    return dataStore;
  }

  function logger(color) {
    return function(message, lineNum, error) {
      this.history.push({message: message, lineNumber: lineNum, error: error });
      window.console.log('%c' + message, 'color:' + color);
    };
  }


  function debugOnly(fun) {
    if(debug) return fun;
    else return noop;
  }
  return store;
});
