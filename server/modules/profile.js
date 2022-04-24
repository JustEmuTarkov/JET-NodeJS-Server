

class Profile {

    static getEditions(){
        return Object.keys(global.JET.database.profiles);
    }

}

module.exports = Profile;