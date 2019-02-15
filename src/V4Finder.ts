import Finder, { AppConfig } from './Finder';
import * as glob from 'glob';
import * as path from "path";
import DefaultActiveApps from './DefaultActiveApps';

export default class V4Finder extends Finder{

    private getEntryFilePath():string {
        return path.normalize(`${process.cwd()}/..`) + `/${this.projectName}/${this.entryFile}`;
    }

    isAppTypeCorrect(manifest:any):boolean {
        return manifest.vendor_id && manifest.app_id;
    }

    getAllApps(): AppConfig[] {
        return glob.sync(`${this.getAppBaseDir()}/**/manifest.json`).filter((abPath:string) => {
            return this.isAppTypeCorrect(require(abPath));
        }).map((appConfigPath:string) => {
            const originalConfig = require(appConfigPath);
            const {vendor_id, app_id, user_installable, user_launchable, locales} = originalConfig;
            return {
                projectType: 'v4',
                projectName:this.projectName,
                // configFile:JSON.stringify(originalConfig),
                app_id,
                vendor_id,
                appName: locales && this.getAppLocale(locales).app_name,
                appDesc: locales && this.getAppLocale(locales).app_desc,
                groups: originalConfig.groups && originalConfig.groups.join(','),
                user_installable,
                user_launchable,
                isDefaultActive: DefaultActiveApps.getApps().includes(`${vendor_id}.${app_id}`)
            }
        });
    }

    getEntryApps(allApps: AppConfig[]): AppConfig[] {
        const entryPointsApps = require(this.getEntryFilePath()).tradeshift.entrypoints.map((appId:string) => appId.replace('Tradeshift.',''));
        return entryPointsApps.map((appId: string) => allApps.find((appConfig:AppConfig) => appConfig.app_id === appId));
    }
}
