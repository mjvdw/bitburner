import { NS } from "@ns";

import {
    directConnect
} from "/library/utils.js";

/**
 * Exploit!
 * 
 * @param ns Netscript object provider by Bitburner.
 */
export async function main(ns: NS): Promise<void> {

    let target = ns.args[0]

    directConnect(ns, target)

}