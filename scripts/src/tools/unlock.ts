/** @param {import(".").NS} ns */

// @ts-ignore
import { unlockTarget } from "/scripts/library/utils.js";

/**
 * Simple entry point for the unlockTarget() utility function.
 * unlockTarget() works through all available ports and then 
 * attempts to NUKE the target server.
 * 
 * @param ns Netscript object provider by Bitburner.
 */
export async function main(ns: any) {
    let target = ns.getServer(ns.args[0])
    unlockTarget(ns, target)
}