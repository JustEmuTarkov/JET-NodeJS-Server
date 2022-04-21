const tools = require('./Tools.js');

class Logger {
  constructor(){
    this.ConsoleColor = {
      Front: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
      },
      Back: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
      },
      Reset: "\x1b[0m"
    }
    // this will be created once first log occurs
    this.LogFileStream = undefined;
  }

  /** Returns the Filename for Logs
   * @returns string - Logs file name
   */
  GetFileName = () => `${tools.getIsoDateString(true)}.log`;

  /** Returns the path to the Logs folder with / at the end
   * @param {boolean} useRelative 
   * @returns 
   */
  GetLogsFolderPath(useRelative = true) {
    if(useRelative){
      return "Local/Logs/";
    }
    return process.cwd() + "/Local/Logs/";
  }

  /**
   * 
   * @param {string} type ("Front", "Back")
   * @param {string} color ("black", "red", "green", "yellow", "blue", "magenta", "cyan", "white")
   * @returns 
   */
  GetConsoleColor(type = "Front", color = "white"){
    const ColorTag = this.ConsoleColor[type][color];
    if(ColorTag == undefined)
      return "";
    return ColorTag;
  }
  LogConsole(data){
    // allow to change this shit in 1 place and everywhere it will be changed
    console.log(data);
  }
  /** Write log in console and into the file
   * @param {string} type ("LogData", "[Error]") - will be written first in log
   * @param {any} data - object or string that will be written in logs
   * @param {string} colorAtFront ("black", "red", "green", "yellow", "blue", "magenta", "cyan", "white")
   * @param {string} colorAtBack ("black", "red", "green", "yellow", "blue", "magenta", "cyan", "white")
   */
  Log(type, data, colorAtFront, colorAtBack){
    const FrontColor = this.GetConsoleColor("Front", colorAtFront);
    const BackColor = this.GetConsoleColor("Back", colorAtBack);
    const Time = tools.getIsoDateString(true);

    const LogString = `${FrontColor}${BackColor}${type}${this.ConsoleColor.Reset}${Time}`;
    const FileString = `${type}${Time}`;

    try{
      if(this.LogFileStream == undefined){
        // somehow this shit is crashing...
        //this.LogFileStream = JET.Utils.FileIO.createFileWriteStream( this.GetLogsFolderPath() + this.GetFileName() );
      }
    } catch{} 
      if(typeof data == "string"){
        this.LogConsole(LogString + data);
        if(this.LogFileStream != undefined){
          this.LogFileStream.write(tools.utilFormat(FileString + data + "\n"));
        }
      } else {
        this.LogConsole(LogString);
        this.LogConsole(data);
        if(this.LogFileStream != undefined){
          this.LogFileStream.write(tools.utilFormat(FileString));
          this.LogFileStream.write(tools.utilFormat(data));
          this.LogFileStream.write(tools.utilFormat("\n"));
        }
      }
  }

  LogInfo(text) {
    this.Log("[INFO]", text, "white", "blue");
  }
  LogSuccess(text) {
    this.Log("[INFO]", text, "white", "green");
  }
  LogWarning(text) {
    this.Log("[INFO]", text, "white", "yellow");
  }
  LogError(text) {
    this.Log("[INFO]", text, "white", "red");
  }
  /**
   * 
   * @param {*} text 
   * @param {number} mode 0 -> only draw log, 1 -> draw log and start timer, 2 -> end timer (default: 0)
   * @returns 
   */
  LogDebug(text, mode = 0) {
    switch (mode){
      case 0: this.Log("[DEBUG]", text, "white"); return;
      case 1: this.Log("[DEBUG]", text, "white"); console.time(text); return;
      case 2: console.timeEnd(text); return;
    }    
  }
  LogRequest(text, data = "") {
    if(data == ""){
      this.Log("[INFO]", text, "cyan", "black");
    }
    this.Log("[INFO]", text, "cyan", "black");
  }
  throwError(message, whereOccured, AdditionalInfo = ""){
    throw message + "\r\n" + whereOccured + (AdditionalInfo != "" ? `\r\n${AdditionalInfo}` : "");
  }
}
module.exports = new Logger();