class Math {

    /** Clamp value between min and max
     * @param {number} value (number)
     * @param {number} min (number)
     * @param {number} max (number)
     * @returns (number) Clamped value
     */
    Clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    
    getRandomInt = (min = 0, max = 100) => {
        min = ~~(min);
        max = ~~(max);
        return (max > min) ? ~~(Math.random() * (max - min + 1) + min) : min;
    }
    
    /** Used to get percentage between two numbers
     * @param {number} num1 first number input
     * @param {number} num2 second number input
    */
    getPercentDiff = (num1, num2) => {
        let raw = (num1 / num2) * 100;
        let diff = raw;
        return diff;
    }
    
    /** Used to get percentage difference between two numbers
     * @param {number} num1 first number input (percentage)
     * @param {number} num2 second number input (value to get percentage of)
     */
    getPercentOf = (num1, num2) => {
        let percentAsDecimal = num1 / 100
        let percent = percentAsDecimal * num2;
        return percent;
    }
    
    /** true if lucky, false if unlucky
     * @param {number} percentage 
     * @returns boolean
     */
    getPercentRandomBool = (percentage) => {
        return ~~((Math.random() * 100) < percentage);
    }
    
    /** extension for getRandomInt(1, max)
     * @param {number} max 
     * @returns number
     */
    getRandomIntEx = (max) => this.getRandomInt(1, max);
    
    /**
     * @param {number} min 
     * @param {number} max 
     * @returns 
     */
    getRandomIntInc = (min, max) => {
        min = ~~(min);
        max = ~~(max);
        return ~~(Math.random() * (max - min + 1) + min);
    }

    valueBetween = (value, minInput, maxInput, minOutput, maxOutput) => {
        return (maxOutput - minOutput) * ((value - minInput) / (maxInput - minInput)) + minOutput
    }
    /**
     * @param {any[]} array 
     * @returns rolled value
     */
    getRandomFromArray = (array) => array[this.getRandomInt(0, array.length-1)];
}
module.exports = new Math();