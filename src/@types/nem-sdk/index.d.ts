declare module 'nem-sdk'{

export = nem_sdk;

  const nem_sdk: {
       default:{
        model: {
            address: {
                b32decode: any;
                b32encode: any;
                isValid: any;
            };
        };
        utils: {
            convert: {
                hex2a: any;
                ua2hex: any;
            };
        };
       };
  };

}