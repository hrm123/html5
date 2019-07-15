
const GeneratedClasses = {};

class OJM_Factory{
    static generateClass(className, jDataSampleForKeys){
        GeneratedClasses[className] = class {
            _jdata = {};

            constructor(jData){

                //get a name for Object
                const name = this.constructor.name;

                //create ID
                //const id = (!jData._id) ? math.random().toString() :  jData._id;
                //jData._id = id;

                // create
                //if(!db[name]) db[name] = {};
                //db[name][id] = jData;

                this._jdata = jData;

                

                
            }

        };


        // define acessors

        const configuration = {};
        Object.keys(jDataSampleForKeys).forEach((prop) => {
        configuration[prop] = {
            get() {
            return this["_jdata"][prop];
            },
            set(value) {
            this["_jdata"][prop] = value;
            }
        };
        });

        // set accessors
        Object.defineProperties(GeneratedClasses[className].prototype, configuration);
        console.log("generated dynamic class name - " + className);
    };

    static getInstance(className, jData){
        return new GeneratedClasses[className](jData);
    }
}
