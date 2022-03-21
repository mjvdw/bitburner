/** @param {import(".").NS} ns **/

import {
    directConnect
    // @ts-ignore
} from "/scripts/library/utils.js";

/**
 * Exploit!
 * 
 * @param ns Netscript object provider by Bitburner.
 */
export async function main(ns: any) {

    let target = ns.args[0]

    directConnect(ns, target)

}