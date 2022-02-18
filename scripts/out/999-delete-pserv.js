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
        let success = ns.deleteServer(target);
        if (success) {
            ns.tprint("Deleted " + target);
        }
        else {
            ns.alert("Failed to delete " + target);
        }
    });
}
//# sourceMappingURL=999-delete-pserv.js.map