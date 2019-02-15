import V4Finder from './V4Finder';
import V25Finder from './V25Finder';
import Projects from './Projects';
import {AppConfig} from './Finder';
import DataWriter from './DataWriter';
import * as dayjs from 'dayjs';
import * as path from "path";
import * as fs from 'fs';

class AppsFinder {
    constructor(){
        const configErrors = this.checkProjectConfig();
        if(configErrors.length === 0){
            this.findApps();
        } else {
            console.error(`Projects.ts config error: \n${configErrors.join('\n')}`);
            process.exit(-1)
        }
    }

    checkProjectConfig():string[] {
        let configErrors:string[] = [];

        if(!fs.existsSync(path.normalize(`${process.cwd()}/../Apps`) )){
            configErrors.push(`../Apps does not exits, isDefault app filed can not be set`);
        }

        Projects.forEach((project:any) => {
            const projectPath = path.normalize(`${process.cwd()}/..`) + `/${project.projectName}`;
            if(!fs.existsSync(projectPath)){
                configErrors.push(`../${project.projectName} does not exits!`);
            }
        });
        return configErrors;
    }

    findApps() {
        let appAppsConfig: AppConfig[] = [];

        Projects.forEach(project => {
            let finder = null;
            switch (project.type) {
                case 'v4':
                    finder = new V4Finder(project);
                    break;
                case 'v25':
                    finder = new V25Finder(project);
                    break;
                default:
                    throw new Error(`Not support app type: ${project.type}`);
            }
            appAppsConfig = appAppsConfig.concat(finder.getEntryApps(finder.getAllApps()))
        });

        DataWriter.writeAsExcel(`apps_summary_${dayjs().format('YYYY-MM-DD-HH:mm')}.xlsx`, appAppsConfig);
    }
}

new AppsFinder();
