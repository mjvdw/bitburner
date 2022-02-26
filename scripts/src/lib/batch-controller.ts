/** @param {import(".").NS} ns */

// @ts-ignore
import { unlockTarget } from "/scripts/utils.js";

/**
 * The controller for starting each hack batch. While hacking, there
 * should be one batch-controller.js script running on each server.
 * This script will never be called directly, it should always be 
 * triggered by the master controller (icarus.js) script.
 * 
 * @param ns Netscript object provider by Bitburner
 */
export async function main(ns: any) {

    let target = ns.getServer(ns.args[0])
    let server = ns.getServer()

    // Unlock server. This means opening all ports available and then
    // attempting to NUKE the server. Only servers that can be unlocked
    // should make it through the master controller to this point, so 
    // this step should always succeed.
    unlockTarget(ns, target)
}