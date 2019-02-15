import * as path from "path";

export default class DefaultActiveApps {
    static apps: string[] = [];

    static getApps():string[] {
        if(DefaultActiveApps.apps.length === 0){
            this.apps = require(path.normalize(`${process.cwd()}/../App-Service/src/main/resources/default_apps.json`));
        }
        return this.apps;
    }
}
