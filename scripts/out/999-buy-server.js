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
        const name = ns.args[0];
        const ram = ns.args[1];
        let server = ns.purchaseServer(name, ram);
        if (server) {
            const scripts = ns.ls("home", "scripts/");
            yield ns.scp(scripts, name);
            ns.tprint("Purchased server called " + name + " with " + ram + "GB of RAM.");
        }
        else {
            ns.alert("Something went wrong purchasing this server.");
        }
    });
}
//# sourceMappingURL=999-buy-server.js.map