import Finder, { AppConfig } from './Finder';
import * as glob from 'glob';
import * as fs from 'fs';
import Utils from './Utils';
import DefaultActiveApps from './DefaultActiveApps';

export default class V25Finder extends Finder{

    isAppTypeCorrect(index:any):boolean {
        return index.vendor_id && index.app_id;
    }

    getAllApps(): AppConfig[] {
        return glob.sync(`${this.getAppBaseDir()}/**/index.json`).filter((appConfigPath:string) => {
            return fs.statSync(appConfigPath).size > 0;
        }).filter((abPath:string) => {
            return this.isAppTypeCorrect(require(abPath));
        }).map((appConfigPath:string) => {
            const originalConfig = require(appConfigPath);
            const {vendor_id, app_id, user_installable, user_launchable, locales} = originalConfig;
            return {
                projectType: 'v25',
                projectName:this.projectName,
                // configFile:JSON.stringify(originalConfig),
                app_id,
                vendor_id,
                appNameEN: locales && this.getAppLocale(locales).appNameEN,
                appDescEN: locales && this.getAppLocale(locales).appDescEN,
                appNameCN: locales && this.getAppLocale(locales).appNameCN,
                appDescCN: locales && this.getAppLocale(locales).appDescCN,
                user_installable,
                user_launchable,
                isDefaultActive: DefaultActiveApps.getApps().includes(`${vendor_id}.${app_id}`)
            }
        });
        return [];
    }

    getEntryApps(allApps: AppConfig[]): AppConfig[] {

        let entryApps:string[] = [];

        const appNameReg = /\.releasing\("\/\w+\/(\w+)"(,|\))/g;

        glob.sync(`${this.getProjectBaseDir()}/**/${this.entryFile}`).forEach((filePath:string) => {
            entryApps = entryApps.concat(Utils.getMatchesGroups(fs.readFileSync(filePath, 'utf-8'), appNameReg, 1));
        });

        // @ts-ignore
        return entryApps.map((appId: string) => allApps.find((appConfig:AppConfig) => appConfig.app_id === appId));

    }
}
