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
    appName: string;
    appDesc: string;
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
        let locale = null;
        const localeKeys = Object.keys(localesConfig);
        localeKeys.some(localeKey => {
            // because keys are en-gb or en-us
            if(localeKey.indexOf('en-') === 0) {
                locale = localesConfig[localeKey];
                return true;
            }
            return false;
        });
        if(locale === null){
            locale = localesConfig[localeKeys[0]];
        }
        return locale;
    }
}
