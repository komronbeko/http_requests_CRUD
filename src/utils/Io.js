const fs = require("fs").promises;

class Io{
    #dir;
    constructor(dir){
        this.#dir = dir;
    }


    // to read the data in JSON format
    async read(){
        const data = await fs.readFile(this.#dir, "utf8");
        return data ? JSON.parse(data) : [];
    }


    // to write the data in JSON format
    async write(data){
        await fs.writeFile(this.#dir, JSON.stringify(data, null, 2));
        return {success: true};
    }
}
module.exports = Io;