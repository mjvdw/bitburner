import { NS } from "@ns";
import { getServerAvailableRam, SCRIPTS } from "/library/utils.js";

/**
 * Use the maximum possible RAM across all servers to "share" with
 * factions, increasing the rate that faction rep is accumulated.
 * 
 * @param ns Netscript object provided by Bitburner.
 */
export async function main(ns: NS): Promise<void> {

    let flags = ns.flags([
        ["scale", 1],
        ["exclude", ""]
    ])

    let home = ["home"]
    let pservs = ns.getPurchasedServers()
    let exclude = flags["exclude"].split(",").map((e: string) => e.trim())
    let servers = home
        .concat(pservs)
        .filter((server: string) => !exclude.includes(server))

    servers.forEach((server: any) => {
        let availableRam = getServerAvailableRam(ns, server)
        let shareRam = 1.6 + 2.4 // 1.6GB base ram, 2.4GB for share function
        let threads = Math.trunc(availableRam / shareRam) * flags["scale"]

        ns.exec(SCRIPTS.factionShare, server, threads)
    })
}