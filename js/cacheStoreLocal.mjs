var CacheStoreLocal = {
    cacheData: {},
  
    get: (key) => {
      if (CacheStoreLocal.cacheData.hasOwnProperty(key) && CacheStoreLocal.cacheData[key].val) {
        return CacheStoreLocal.cacheData[key].val;
      }
      return false;
    },
  
    set: (key, value, expiry) => {
  
      CacheStoreLocal.clear(key); // Clear before we store it so we can clean up the timeout.
  
      var to = false;
      if (expiry && parseInt(expiry) > 0) {
        to = setTimeout(function() {
          CacheStoreLocal.clear(key);
        }, parseInt(expiry));
      }
  
      CacheStoreLocal.cacheData[key] = {
            expiry: expiry,
            val: value,
            timeout: to,
          };
    },
  
    clear: (key) => {
      if (CacheStoreLocal.cacheData.hasOwnProperty(key)) {
        if (CacheStoreLocal.cacheData[key].to) {
          clearTimeout(CacheStoreLocal.cacheData[key].to);
        }
  
        delete CacheStoreLocal.cacheData[key];
        return true;
      }
  
      return false;
    },
  };

  export default CacheStoreLocal;