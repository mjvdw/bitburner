/** @param {import(".").NS} ns */

// @ts-ignore
import { getServerAvailableRam } from "/scripts/utils.js";

/**
 * 
 * @param ns Netscript object provided by Bitburner.
 */
export async function main(ns: any) {

    let home = ["home"]
    let pservs = ns.getPurchasedServers()
    let servers = home.concat(pservs)

    servers.forEach((server: any) => {
        let availableRam = getServerAvailableRam(ns, server)
        let shareRam = 1.6 + 2.4 // 1.6GB base ram, 2.4GB for share function
        let threads = Math.trunc(availableRam / shareRam)

        ns.exec("/scripts/lib/faction-share.js", server, threads)
    })
}