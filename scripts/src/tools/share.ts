/** @param {import(".").NS} ns */

// @ts-ignore
import { getServerAvailableRam, SCRIPTS } from "/scripts/library/utils.js";

/**
 * Use the maximum possible RAM across all servers to "share" with
 * factions, increasing the rate that faction rep is accumulated.
 * 
 * @param ns Netscript object provided by Bitburner.
 */
export async function main(ns: any) {

    let scale = ns.args[0]

    let home = ["home"]
    let pservs = ns.getPurchasedServers()
    let servers = home.concat(pservs)

    servers.forEach((server: any) => {
        let availableRam = getServerAvailableRam(ns, server)
        let shareRam = 1.6 + 2.4 // 1.6GB base ram, 2.4GB for share function
        let threads = Math.trunc(availableRam / shareRam) * scale

        ns.exec(SCRIPTS.factionShare, server, threads)
    })
}