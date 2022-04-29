
const util = require("util");
const process = require("process");
const { v4: uuidv4 } = require('uuid');

class Tools {

    /**Check if the given value is undefined
     * 
     * @param {*} value definition to check
     * @returns true or false
     */
    static isUndefined = (value) => {
        return typeof value === 'undefined';
    }

    static getIsoDateString = (useFormatted = false) => {
        if(useFormatted){
            return new Date().toISOString().
                    replace(/T/, ' ').
                    replace(/\..+/, '');
        }
        return new Date().toISOString();
    }

    static utilFormat = (data) => {
        return util.format(data);
    }

    static clearString = (s) => {
        s.replace(/[\b]/g, '').replace(/[\f]/g, '').replace(/[\n]/g, '').replace(/[\r]/g, '').replace(/[\t]/g, '').replace(/[\\]/g, '');
    }

    // Invisible in console.log
    static toRawType = (value) => {
        return Object.prototype.toString.call(value).slice(8,-1);
    }

    // Invisible in console.log
    static forEach = (array, iteratee) => {
        let index = -1;
        const length = array.length;
        while (++index < length) {
            iteratee(array[index], index);
        }
        return array;
    }

    // Invisible in console.log
    static cloneSymbol = (target) => { return Object(Symbol.prototype.valueOf.call(target)); }
    // Invisible in console.log
    static cloneReg = (target) => {
        const regexFlags = /\w*$/;
        const result = new target.constructor(targe.source, regexFlags.exec(target));
        result.lastIndex = target.lastIndex;
        return result;
    }
    // Invisible in console.log
    static cloneOtherType = (target)  => {
        //const targetConstructor = target.constructor;
        switch (this.ToRawType(target)) {
            case "Boolean":
            case "Number":
            case "String":
            case "Error":
            case "Date":
                return new target.constructor(target);
            case "RegExp":
                return this.CloneReg(target);
            case "Symbol":
                return this.CloneSymbol(target);
            case "Function":
                return target;
            default:
                return null;
        }
    }
    /** Deep Copy of object without keeping its references
     * 
     * @param {*} target 
     * @param {* | null} map 
     * @returns 
     */
    static deepCopy = (target, map = new WeakMap()) => {
        // clone primitive types
        if (typeof target != "object" || target == null) {
            return target;
        }
        const type = this.ToRawType(target);
        let cloneTarget = null;
    
        if (map.get(target)) {
            return map.get(target);
        }
        map.set(target, cloneTarget);
    
        if (type != "Set" && type != "Map" && type != "Array" && type != "Object") {
            return this.CloneOtherType(target)
        }
    
        // clone Set
        if (type == "Set") {
            cloneTarget = new Set();
            target.forEach(value => {
                cloneTarget.add(this.DeepCopy(value, map));
            });
            return cloneTarget;
        }
    
        // clone Map
        if (type == "Map") {
            cloneTarget = new Map();
            target.forEach((value, key) => {
                cloneTarget.set(key, this.DeepCopy(value, map));
            });
            return cloneTarget;
        }
    
        // clone Array
        if (type == "Array") {
            cloneTarget = new Array();
            this.ForEach(target, (value, index) => {
                cloneTarget[index] = this.DeepCopy(value, map);
            })
        }
    
        // clone normal Object
        if (type == "Object") {
            cloneTarget = new Object();
            this.ForEach(Object.keys(target), (key, index) => {
                cloneTarget[key] = this.DeepCopy(target[key], map);
            })
        }
    
        return cloneTarget;
    }
    /**
     * @returns Server uptime in seconds
     */
    static getServerUptimeInSeconds = () => {
        return ~~(process.uptime());
    }
    /**
     * @returns Current Date timestamp in seconds
     */
    static getCurrentTimestamp = () => {
        return ~~(new Date().getTime() / 1000);
    }
    /**
     * @param {Date} date 
     * @returns returns formated date to "hours-minutes-seconds" format
     */
    static formatTime = (date) => {
        return `${("0" + date.getHours()).substr(-2)}-${("0" + date.getMinutes()).substr(-2)}-${("0" + date.getSeconds()).substr(-2)}`;
    }

    /** Generate Unique ID used in the server by using uuid-v4
     * @param {string} prefix 
     * @returns Unique ID as string
     */
    static generateUniqueId = (prefix = "") => {
        return `${prefix}${uuidv4()}`;
    }

    /**
     * 
     * @param {Array} array 
     */
    static getRandomValueFromArray = (array) => {
        return JET.util.math.getRandomFromArray(array)
    }
}

module.exports = Tools;