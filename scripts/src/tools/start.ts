/** @param {import(".").NS} ns */

// @ts-ignore
import { SCRIPTS, killAllScriptsWithExceptions } from "/scripts/library/utils.js";

/**
 * Starts all needed workers with one command.
 * 
 * @param ns Netscript object provided by Bitburner.
 */
export async function main(ns: any) {

    // Reset all servers to blank state (ie, nothing running)
    let servers = ["home"].concat(ns.getPurchasedServers())
    servers.forEach((server: string) => killAllScriptsWithExceptions(ns, server, [SCRIPTS.start]))

    // Start up all workers.
    ns.exec(SCRIPTS.sync, "home")
    ns.exec(SCRIPTS.linus, "home")
    ns.exec(SCRIPTS.rouge, "home")
    ns.exec(SCRIPTS.icarus, "home")
}