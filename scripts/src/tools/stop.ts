/** @param {import(".").NS} ns */

//@ts-ignore
import { resetReservedRamForServer, SCRIPTS } from "./scripts/library/utils.js"

/**
 * Kill all scripts on all servers except the sync script on home and this script.
 * 
 * @param ns Netscript object provided by Bitburner.
 */
export async function main(ns: any) {

    let home = ["home"]
    let pservs = ns.getPurchasedServers()

    let servers = home.concat(pservs)

    let exempt = [SCRIPTS.sync, SCRIPTS.stop]

    servers.forEach((server: any) => {
        let scripts = ns.ps(server)

        scripts.forEach((script: any) => {
            if (!exempt.includes(script.filename)) {
                ns.kill(script.pid)
            }
        })

        resetReservedRamForServer(ns, server)
    })
}