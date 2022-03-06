/** @param {import(".").NS} ns */

// @ts-ignore
import { getTargets, buyServer, isHackingTarget, killHackScripts } from "/scripts/utils.js";

/**
 * This is the "master" script for hacking servers.
 * It controls:
 * - Deciding which server to hack.
 * - Purchasing new client servers to increase hacking power.
 * - Starting batch controllers for each server.
 * 
 * @param ns Netscript object provider by Bitburner
 */
export async function main(ns: any) {

    while (true) {
        // Get a list of servers that can be hacked by user.
        let singleTarget = ns.args[0]
        let targets = singleTarget ? [ns.getServer(singleTarget)] : getTargets(ns, true)

        // Buy new servers with either the same RAM as home server 
        // or the maximum possible RAM for purchased servers.
        let money = ns.getServerMoneyAvailable("home")
        let ram = ns.getServerMaxRam("home")
        let servers = ns.getPurchasedServers()

        while (money > ns.getPurchasedServerCost(ram) && servers.length < 25) {
            await buyServer(ns = ns, ram = ram)
            servers = ns.getPurchasedServers()
            money = ns.getServerMoneyAvailable("home")
            await ns.sleep(500)
        }

        // Pair up servers and targets. One server per target, unless there are more
        // servers than targets, in which case loop back around from the top.
        servers.splice(0, 0, "home")
        servers = servers.map((server: string) => ns.getServer(server))
        let hackPairs = servers.map((server: any, index: number) => {
            let target: any
            if (targets[index]) { target = targets[index] }
            else { target = targets[index % targets.length] }
            return [server, target]
        })

        // Start batch controllers on each server, pointing at that server's target.
        // If the server is already hacking another target, check whether it's the correct
        // target, and if it isn't, kill all scripts on that server and start on the 
        // correct target.

        hackPairs.forEach((pair: any) => {
            let server = pair[0]
            let target = pair[1]

            if (!isHackingTarget(ns, server, target)) {
                killHackScripts(ns, server)
                ns.exec("/scripts/lib/batch-controller.js", server.hostname, 1, target.hostname)
            }
        })

        // Sleep for 60 seconds, then repeat the above.
        // Only necessary if not debugging.
        await ns.sleep(60000)
    }
}
