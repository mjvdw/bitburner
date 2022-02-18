/** @param {import(".").NS} ns **/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getTargets } from "./000-master-controller";
export function main(ns) {
    return __awaiter(this, void 0, void 0, function* () {
        let targets = getTargets(ns);
        // Print Headers
        let columnWidth = 22;
        let serverHeader = "SERVER";
        let moneyHeader = "MONEY";
        let securityHeader = "SECURITY";
        let statusHeader = "STATUS";
        ns.tprint(serverHeader +
            " ".repeat(columnWidth - serverHeader.length) +
            moneyHeader +
            " ".repeat(columnWidth - moneyHeader.length) +
            securityHeader +
            " ".repeat(columnWidth - moneyHeader.length) +
            statusHeader);
        ns.tprint("—".repeat(columnWidth * 4));
        // Print Content
        targets.forEach((t) => {
            let target = ns.getServer(t.hostname);
            prettyPrint(ns, target, columnWidth);
        });
    });
}
function prettyPrint(ns, target, columnWidth) {
    let hostname = target.hostname;
    let availableMoney = ns.nFormat(target.moneyAvailable, "($0.000a)");
    let maxMoney = ns.nFormat(target.moneyMax, "($0.000a)");
    let money = availableMoney + " / " + maxMoney;
    let currentSecurity = ns.nFormat(target.hackDifficulty, "0,0.00");
    let minSecurity = ns.nFormat(target.minDifficulty, "0,0.00");
    let security = currentSecurity + " / " + minSecurity;
    ns.tprint(hostname +
        " ".repeat(columnWidth - hostname.length) +
        money +
        " ".repeat(columnWidth - money.length) +
        security);
    // ns.tprint("-".repeat(columnWidth * 4));
}
//# sourceMappingURL=999-status.js.map