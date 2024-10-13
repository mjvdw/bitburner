import { NS } from "@ns";
import { unlockTarget } from "/library/utils.js";

/**
 * Simple entry point for the unlockTarget() utility function.
 * unlockTarget() works through all available ports and then 
 * attempts to NUKE the target server.
 * 
 * @param ns Netscript object provider by Bitburner.
 */
export async function main(ns: NS): Promise<void> {
    let target = ns.getServer(ns.args[0])
    unlockTarget(ns, target)
}