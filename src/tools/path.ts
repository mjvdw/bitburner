import { NS } from "@ns";

import {
    getPathToServer
} from "/library/utils.js";

/**
 * Helper function to get the direct path to a particular server. Useful for
 * navigating the tree without having to search manually.
 * 
 * @param ns Netscript object provider by Bitburner.
 * @returns Object with the results and a status (true if found, false if not)
 */
export async function main(ns: NS): Promise<void> {

    let startServer = ns.getHostname();
    let target = ns.args[0].toString();
    if (target === undefined) {
        ns.alert("Please provide target server");
        return;
    }
    let [results, isFound] = getPathToServer(ns, target, startServer, [], [], false);
    if (!isFound) {
        ns.alert("Server not found!");
    } else {
        ns.tprint(results.join(" --> "));
    }
}