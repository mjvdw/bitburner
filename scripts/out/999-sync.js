var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @param {import(".").NS} ns **/
export function main(ns) {
    return __awaiter(this, void 0, void 0, function* () {
        ns.disableLog("wget");
        while (true) {
            yield ns.wget("http://127.0.0.1:5000", "scripts.txt", "home");
            let scriptsList = yield ns.read("scripts.txt");
            let scripts = scriptsList.split(",");
            for (let s in scripts) {
                let saveLocation = "/scripts/" + scripts[s];
                let url = "http://127.0.0.1:5000/" + scripts[s];
                yield ns.wget(url, saveLocation, "home");
            }
            let pservs = ns.getPurchasedServers();
            for (let p in pservs) {
                const scripts = ns.ls("home", "scripts/");
                yield ns.scp(scripts, pservs[p]);
            }
            yield ns.sleep(500);
        }
    });
}
//# sourceMappingURL=999-sync.js.map