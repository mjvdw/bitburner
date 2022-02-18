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
        let target = ns.args[0];
        let server = ns.getServer().hostname;
        let maxThreads = Math.trunc(ns.getServerMaxRam(server) / 4);
        let offset = 200;
        // Prepare server.
        unlockServer(ns, target);
        let serverReady = false;
        while (!serverReady) {
            let freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
            if (freeRam > 10) {
                startBatch(ns, server, target, maxThreads, true);
            }
            serverReady = getServerStatus(ns, target);
            if (!serverReady) {
                yield ns.sleep(1000);
            }
        }
        // Set up and run batches.
        while (true) {
            let freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
            if (freeRam >= 20) {
                startBatch(ns, server, target, maxThreads, false);
                yield ns.sleep(1000);
            }
            else {
                yield ns.sleep(2000);
            }
        }
    });
}
function getServerStatus(ns, target) {
    let maxMoney = ns.getServerMaxMoney(target);
    let currentMoney = ns.getServerMoneyAvailable(target);
    let moneyReady = maxMoney == currentMoney;
    let minSecurity = ns.getServerMinSecurityLevel(target);
    let currentSecurity = ns.getServerSecurityLevel(target);
    let securityReady = minSecurity == currentSecurity;
    if (moneyReady && securityReady) {
        return true;
    }
    else {
        return false;
    }
}
function unlockServer(ns, target) {
    try {
        ns.brutessh(target);
    }
    catch (error) {
        ns.print(error);
    }
    try {
        ns.ftpcrack(target);
    }
    catch (error) {
        ns.print(error);
    }
    try {
        ns.relaysmtp(target);
    }
    catch (error) {
        ns.print(error);
    }
    try {
        ns.httpworm(target);
    }
    catch (error) {
        ns.print(error);
    }
    try {
        ns.sqlinject(target);
    }
    catch (error) {
        ns.print(error);
    }
    ns.nuke(target);
}
function startBatch(ns, server, target, threads, preparingServer) {
    ns.exec("scripts/210-low-ram-batch.js", server, 1, target, threads, preparingServer);
}
//# sourceMappingURL=200-low-ram-batch-controller.js.map