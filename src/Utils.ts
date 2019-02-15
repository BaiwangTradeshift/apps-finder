export default class Utils {
    /**
     * get regexp search groups array
     * @param str
     * @param regex
     * @param index
     */
    static getMatchesGroups(str:string, regex:RegExp, index:number = 1) {
        let matches:string[] = [];
        let match;
        while (match = regex.exec(str)) {
            matches.push(match[index]);
        }
        return matches;
    }
}
