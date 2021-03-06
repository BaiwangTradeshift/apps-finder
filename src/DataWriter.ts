import { AppConfig } from './Finder';
import * as fs from 'fs';

const xlsx = require('node-xlsx').default;

export default class DataWriter {
    static writeAsExcel(fileName: string, configs: AppConfig[]) {
        const headers:string[] = ['projectType', 'projectName', 'vendor_id', 'app_id', 'appName en', 'appName cn', 'groups', 'user_installable', 'user_launchable', 'isDefaultActive', 'appDesc en', 'appDesc cn'];
        let data = configs.map((cfg: AppConfig) => [
            cfg.projectType,
            cfg.projectName,
            cfg.vendor_id,
            cfg.app_id,
            cfg.appNameEN,
            cfg.appNameCN,
            cfg.groups,
            cfg.user_installable,
            cfg.user_launchable,
            cfg.isDefaultActive,
            cfg.appDescEN,
            cfg.appDescCN
        ]);
        data.splice(0,0, headers);
        // @ts-ignore
        const buffer = xlsx.build([{name: "apps from code", data}]);
        const destPath = `${process.cwd()}/results/excel/${fileName}`;
        fs.writeFileSync(destPath,buffer);
        console.log(`Excel writer success! Please check ${destPath}`)
    }
}
