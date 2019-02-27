import * as path from 'path';

class BaseFinder {
    projectName: string;
    appBasePath: string;
    entryFile: string;
    // @ts-ignore
    constructor({projectName, appBasePath, entryFile}) {
        this.projectName = projectName;
        this.appBasePath = appBasePath;
        this.entryFile = entryFile;
    }

    getProjectBaseDir():string {
        return path.normalize(`${process.cwd()}/..`) + `/${this.projectName}`;
    }

    getAppBaseDir():string {
        return path.normalize(`${process.cwd()}/..`) + `/${this.projectName}/${this.appBasePath}`;
    }

}

export interface AppConfig {
    projectType: string;
    projectName: string;
    app_id: string;
    vendor_id: string;
    appNameEN: string;
    appDescEN: string;
    appNameCN: string;
    appDescCN: string;
    groups?: string;
    user_installable: boolean;
    user_launchable: boolean;
    configFile?: string;
    isDefaultActive: boolean;
}

export default abstract class Finder extends BaseFinder {

    abstract isAppTypeCorrect(appConfig: any):boolean;
    abstract getAllApps(): AppConfig[];
    abstract getEntryApps(allApps: AppConfig[]): AppConfig[];

    getAppLocale(localesConfig: any):any {
        const localeCN = localesConfig['zh-CN'] || localesConfig['zh-cn'] || {};
        const localeKeys = Object.keys(localesConfig);
        let localeEN = null;
        localeKeys.some(localeKey => {
            // because keys are en-gb or en-us
            if(localeKey.indexOf('en-') === 0) {
                localeEN = localesConfig[localeKey];
                return true;
            }
            return false;
        });
        if(localeEN === null){
            localeEN = localesConfig[localeKeys[0]];
        }

        return {
            appNameEN: localeEN.app_name,
            appDescEN: localeEN.app_desc,
            appNameCN: localeCN.app_name,
            appDescCN: localeCN.app_desc
        };
    }
}
