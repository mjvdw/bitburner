import { NS } from "@ns";
import { SCRIPTS, killAllScriptsWithExceptions } from "/library/utils.js"

/**
 * "Reset" all servers by removing all scripts. Does not delete the "sync"
 * script, or this script.
 * 
 * @param ns Netscript object provided by Bitburner.
 */
export async function main(ns: NS): Promise<void> {

    await ns.prompt("Delete and redownload everything from all servers?")

    let home = ["home"]
    let pservs = ns.getPurchasedServers()
    let servers = home.concat(pservs)

    servers.forEach(server => {
        let scripts = ns.ls(server).filter((s: string) => s.startsWith("/scripts"))

        // Cannot delete scripts that are running.
        let killExceptions = [SCRIPTS.resetScripts, SCRIPTS.sync]
        killAllScriptsWithExceptions(ns, server, killExceptions)

        // Work through all scripts and delete them.
        scripts.forEach((script: string) => {
            if ((script != SCRIPTS.sync) && (script != SCRIPTS.resetScripts)) {
                ns.tprint("Removing " + script + " from " + server)
                ns.rm(script, server)
            }
        })
    })
}