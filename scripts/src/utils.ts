/** @param {import(".").NS} ns */


/**
 * Get a list of all servers currently accessible (but not necessarily hackable).
 * Optionally can filter the output list by whether the
 * 
 * @param ns Netscript object provider by Bitburner.
 * @param hackableOnly Whether to filter the list by servers that can be hacked by the current user.
 * @returns The list of all visible servers, of type Server.
 */
export function getTargets(ns: any, hackableOnly?: boolean): any[] {

    let targets: string[] = []
    let queue: string[] = []
    let excluded = ["home", "darkweb"]

    // Initial scan to set up first queue.
    queue = ns.scan("home")

    // Iterate through initial queue, adding new servers as it finds them.
    // Ignoring duplicates ensures that this is not an infinite loop.
    while (queue.length > 0) {
        let scanQueue = queue
        for (let s in scanQueue) {
            targets.push(scanQueue[s])
            queue = queue.filter(value => value !== scanQueue[s])
            let newServers = ns.scan(scanQueue[s])
            newServers.forEach((newServer: string) => {
                if (excluded.includes(newServer) == false && targets.includes(newServer) == false) {
                    queue.push(newServer)
                }
            })
        }
    }

    // Convert list of server names to list of Server objects.
    targets = targets.map(targetName => ns.getServer(targetName))

    // If hackableOnly is true, filter the server list by servers that the current
    // user is able to hack, based on the hack skill level and port open scripts owned.
    // Sort by max money available on server.
    if (hackableOnly) {
        targets = targets
            // Some servers don't have money. Remove those from the list.
            .filter((server: any) => server.moneyMax > 0)
            // Remove servers that require a higher hacking level than the user currently has.
            .filter((server: any) => ns.getHackingLevel() >= server.requiredHackingSkill)
            // Higher level servers require you to open ports. Filter servers with more ports than the user can open.
            .filter((server: any) => {
                let allPortScripts = [
                    "BruteSSH.exe",
                    "FTPCrack.exe",
                    "relaySMTP.exe",
                    "HTTPWorm.exe",
                    "SQLInject.exe",
                ]
                let scripts = ns.ls("home")
                let portsCanOpen = scripts.filter((scriptName: string) => allPortScripts.includes(scriptName)).length
                let portsRequired = server.numOpenPortsRequired
                return portsCanOpen >= portsRequired
            })
            // Sort so that servers with the most money come first in the list.
            .sort((a: any, b: any) => b.moneyMax - a.moneyMax)
    }

    return targets
}


/**
 * Buy a purchased server. If a hostname or RAM is specified, use these values,
 * otherwise function will automatically generate an appropriate name and RAM.
 * 
 * @param ns Netscript object provider by Bitburner.
 * @param ram Optional. The amount of RAM of the purchased server.
 * @param hostname Optional. The hostname of the purchased server.
 * @returns Boolean indicating whether the server was successfully created.
 */
export async function buyServer(ns: any, ram?: number, hostname?: string): Promise<boolean> {

    // Check whether RAM is a valid amount and the user has enough money.
    // If no RAM is specified, get the maximum RAM currently available to the user.
    let validRam = false
    let enoughMoney = false
    if (ram) {
        let i = Math.log(ram) / Math.log(2)
        validRam = i % 1 == 0
        enoughMoney = ns.getServerMoneyAvailable("home") >= ns.getPurchasedServerCost(ram)
    } else {
        let money = ns.getServerMoneyAvailable("home")
        let i = 20
        while (money < ns.getPurchasedServerCost(Math.pow(2, i))) { i-- }
        ram = Math.pow(2, i)
        validRam = true
        enoughMoney = true
    }

    // If RAM is invalid or user doesn't have enough money, present an alternative
    // RAM amount. Default is to go for the next valid amount lower than the amount
    // specified by the user. If RAM is valid and user has enough money, buy the server.
    if (!validRam) {
        let ramOptions = Array.from({ length: 21 }, (_, i) => Math.pow(2, i))
        ramOptions.push(ram)
        ramOptions = ramOptions.sort((a: any, b: any) => a - b)
        let ramIndex = ramOptions.indexOf(ram)
        let altRam = ramOptions[ramIndex - 1]
        ns.tprint("Unable to purchase server with " + ram + "GB. Invalid RAM amount. Did you mean " + altRam + "GB?")
        return false
    }

    if (!enoughMoney) {
        let money = ns.getServerMoneyAvailable("home")
        let i = 20  // 2^20 is maximum possible server RAM
        while (money < ns.getPurchasedServerCost(Math.pow(2, i))) { i-- }
        let maxAffordableRam = Math.pow(2, i)
        ns.tprint("Unable to purchase server. Not enough funds. The most RAM you can purchase is " + maxAffordableRam + "GB.")
        return false
    }

    // If no name is specified, automatically generate a name from the range
    // pserv-001, pserv-002, pserv-003, ..., pserv-025.
    if (!hostname) {
        let all_pservs = ns.getPurchasedServers()
        let pservs = all_pservs.filter((pserv: string) => pserv.startsWith("pserv-"))
        let usedIds = pservs.map((pserv: string) => parseInt(pserv.slice(6, 9)))

        let i = usedIds == [] ? 1 : Math.max(...usedIds) + 1
        let suffix = "000";

        if (i < 10) {
            suffix = "00" + i.toString();
        } else if (i < 100) {
            suffix = "0" + i.toString();
        } else {
            suffix = i.toString();
        }

        hostname = "pserv-" + suffix;
    }

    // If RAM is valid and there is enough money, attempt to buy the server.
    // Get the result for final error handling if something else goes wrong.
    // let server = ns.purchaseServer(hostname, ram);
    let server = true

    // If the server is successfully created, copy all scripts to the new server.
    // If the server was not successfully created, alert the user.
    if (server) {
        const scripts = ns.ls("home", "scripts/");
        // await ns.scp(scripts, hostname);
        ns.tprint("Purchased server called " + hostname + " with " + ram + "GB of RAM for " + ns.nFormat(ns.getPurchasedServerCost(ram), "$0.000a") + ".")
        return true
    } else {
        ns.tprint("Unable to purchase server. The RAM appears to be valid and you have enough money, so something else must have gone wrong.")
        return false
    }
}


/**
 * Deletes the purchased server with the hostname matching the hostname given
 * by the user. If there is no name given, or the name is incorrect, the function
 * returns false and alerts the user.
 * 
 * @param ns Netscript object provider by Bitburner.
 * @param hostname The hostname of the server to be deleted.
 * @returns Boolean indicated whether the server was successfully deleted.
 */
export function deleteServer(ns: any, hostname: string): boolean {

    // Check whether there is a hostname provided.
    if (!hostname) {
        ns.tprint("Please provide a name for the server to be deleted.")
        return false
    }

    // Attempt to delete the server.
    let deleted = ns.deleteServer(hostname)

    // Inform the user whether the action was successful.
    if (deleted) {
        ns.tprint("Deleted server '" + hostname + "'.")
        return true
    }
    else {
        ns.tprint("Unable to delete server '" + hostname + "'.")
        return false
    }
}