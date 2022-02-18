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
        let targets = [];
        let scanQueue = [];
        let scanned = [];
        let levelOneTargets = ns.scan();
        levelOneTargets.forEach((t) => {
            let server = ns.getServer(t);
            if (!server.purchasedByPlayer && t !== "home" && t !== "darkweb") {
                targets.push(t);
                scanQueue.push(t);
            }
        });
        let i = 0;
        while (scanQueue.length > 0 && i < 30) {
            let results = [];
            scanQueue.forEach((t) => {
                let result = ns.scan(t);
                result.forEach((server) => {
                    results.push(server);
                });
            });
            // Do something with results.
            let uniqueResults = [...new Set(results)];
            uniqueResults.forEach((r) => __awaiter(this, void 0, void 0, function* () {
                if (r in scanned === false) {
                    targets.push(r);
                    scanQueue.push(r);
                }
            }));
            i++;
        }
        let uniqueTargets = [...new Set(targets)];
        let targetServers = [];
        uniqueTargets.forEach((t) => {
            targetServers.push(ns.getServer(t));
        });
        targetServers.forEach((s) => {
            ns.tprint(s.hostname);
        });
    });
}
//# sourceMappingURL=999-get-all-servers.js.map