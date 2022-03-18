/** @param {import(".").NS} ns */


const ALL_PORT_SCRIPTS = [
    "BruteSSH.exe",
    "FTPCrack.exe",
    "relaySMTP.exe",
    "HTTPWorm.exe",
    "SQLInject.exe",
]

const SCRIPT_PREFIXES = {
    library: "/scripts/library/",
    tools: "/scripts/tools/",
    workers: "/scripts/workers/"
}

export const SCRIPTS = {
    // Library
    batchController: SCRIPT_PREFIXES.library + "batch-controller.js",
    batch: SCRIPT_PREFIXES.library + "batch.js",
    factionShare: SCRIPT_PREFIXES.library + "faction-share.js",
    grow: SCRIPT_PREFIXES.library + "grow.js",
    hack: SCRIPT_PREFIXES.library + "hack.js",
    utils: SCRIPT_PREFIXES.library + "utils.js",
    weaken: SCRIPT_PREFIXES.library + "weaken.js",
    // Tools
    exploit: SCRIPT_PREFIXES.tools + "utils.js",
    list: SCRIPT_PREFIXES.tools + "list.js",
    path: SCRIPT_PREFIXES.tools + "path.js",
    pserv: SCRIPT_PREFIXES.tools + "pserv.js",
    resetScripts: SCRIPT_PREFIXES.tools + "reset-scripts.js",
    share: SCRIPT_PREFIXES.tools + "share.js",
    stats: SCRIPT_PREFIXES.tools + "stats.js",
    stop: SCRIPT_PREFIXES.tools + "stop.js",
    sync: SCRIPT_PREFIXES.tools + "sync.js",
    test: SCRIPT_PREFIXES.tools + "test.js",
    unlock: SCRIPT_PREFIXES.tools + "unlock.js",
    // Workers
    capone: SCRIPT_PREFIXES.workers + "capone.js",
    icarusjr: SCRIPT_PREFIXES.workers + "icarus-jr.js",
    icarus: SCRIPT_PREFIXES.workers + "icarus.js",
    linus: SCRIPT_PREFIXES.workers + "linus.js"
}

const HACK_SCRIPTS = [SCRIPTS.batchController, SCRIPTS.batch, SCRIPTS.hack, SCRIPTS.grow, SCRIPTS.weaken]

const RAM_PORT = 1

const BATCH_SPEED = 500
const BATCH_FREQUENCY = 5 * BATCH_SPEED

export const CRIMES = [
    "shoplift",
    "rob store",
    "mug",
    "larceny",
    "drugs",
    "bond forge",
    "traffic illegal arms",
    "homicide",
    "grand auto",
    "kidnap",
    "assassin",
    "heist"
]

export const FACTIONS = [
    "CyberSec",
    "Tian Di Hui",
    "Netburners",
    "Sector-12",
    "Chongqing",
    "New Tokyo",
    "Ishima",
    "Aevum",
    "Volhaven",
    "NiteSec",
    "The Black Hand",
    "BitRunners",
    "ECorp",
    "MegaCorp",
    "KuaiGong International",
    "Four Sigma",
    "NWO",
    "Blade Industries",
    "OmniTek Incorporated",
    "Bachman & Associates",
    "Clarke Incorporated",
    "Fulcrum Secret Technologies",
    "Slum Snakes",
    "Tetrads",
    "Silhouette",
    "Speakers for the Dead",
    "The Dark Army",
    "The Syndicate",
    "The Covenant",
    "Illuminati"
]


/**
 * Get a list of all servers currently accessible (but not necessarily hackable).
 * Optionally can filter the output list by whether the
 * 
 * @param ns Netscript object provided by Bitburner.
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
                let scripts = ns.ls("home")
                let portsCanOpen = scripts.filter((scriptName: string) => ALL_PORT_SCRIPTS.includes(scriptName)).length
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
 * @param ns Netscript object provided by Bitburner.
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

        let i = usedIds.length == 0 ? 1 : Math.max(...usedIds) + 1
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
    let server = ns.purchaseServer(hostname, ram);

    // If the server is successfully created, copy all scripts to the new server.
    // If the server was not successfully created, alert the user.
    if (server) {
        const scripts = ns.ls("home", "scripts/");
        await ns.scp(scripts, hostname);
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
 * @param ns Netscript object provided by Bitburner.
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


/**
 * Get boolean indicating whether the given server is hacking the given target.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @param server The server hosting the hacking scripts.
 * @param target The target of the hacking scripts.
 * @returns Boolean indicating whether the given server is hacking the given target.
 */
export function isHackingTarget(ns: any, server: any, target: any): Promise<boolean> {
    let scriptName = SCRIPTS.batchController
    let isHackingTarget = ns.isRunning(scriptName, server.hostname, target.hostname)
    return isHackingTarget
}


/**
 * Kill only hacking related scripts. Used to avoid accidentally killing
 * important scripts (like the sync.js script and the master controller icarus.js).
 * 
 * @param ns Netscript object provided by Bitburner.
 * @param server The server to kill the hack scripts for.
 */
export function killHackScripts(ns: any, server: any) {

    let runningScripts = ns.ps(server.hostname)
    runningScripts.forEach((script: any) => {
        if (HACK_SCRIPTS.includes(script.filename)) {
            ns.kill(script.pid)
        }
    })
}


export function killAllScriptsWithExceptions(ns: any, host: string, exceptions: string[]) {

    let runningScripts = ns.ps(host)
    runningScripts.forEach((script: any) => {
        ns.tprint(!exceptions.includes(script.filename))

        ns.tprint(exceptions)
        ns.tprint(script.filename)

        if (!exceptions.includes(script.filename)) {
            ns.tprint("Killing " + script.filename + " on " + host)
            ns.kill(script.pid, host, script.args)
        }
    })
}


/**
 * Uses as many of the port unlock scripts as the user has on the "home" server
 * and then attempts to use NUKE.exe on the target server.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @param target The name of the target server to be unlocked.
 * @returns Boolean indicating whether unlock was successful.
 */
export function unlockTarget(ns: any, target: any): boolean {

    let scripts = ns.ls("home")

    // This is a bit fragile - it relies on the order of ALL_PORT_SCRIPTS
    // never changing. However, assuming the order doesn't change, this will
    // run whatever port unlock scripts the user has available.
    scripts.includes(ALL_PORT_SCRIPTS[0]) ? ns.brutessh(target.hostname) : null
    scripts.includes(ALL_PORT_SCRIPTS[1]) ? ns.ftpcrack(target.hostname) : null
    scripts.includes(ALL_PORT_SCRIPTS[2]) ? ns.relaysmtp(target.hostname) : null
    scripts.includes(ALL_PORT_SCRIPTS[3]) ? ns.httpworm(target.hostname) : null
    scripts.includes(ALL_PORT_SCRIPTS[4]) ? ns.sqlinject(target.hostname) : null

    // Once unlocking as many ports as possible, attempt to NUKE the target.
    try {
        ns.nuke(target.hostname)
        return true
    } catch {
        return false
    }
}


/**
 * Private function for updating the value of the port storing the amount of
 * RAM stored per server.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @param server The server in respect of which the reserved RAM is being updated.
 * @param ram The amount of RAM (positve or negative) being added to the current amount.
 * @returns Boolean indicating whether the update was successful.
 */
export function updateReservedRam(ns: any, server: any, ram: number): boolean {

    // Get Netscript port used for storing the current state of RAM for 
    // each server (home + purchased servers.)
    let port = ns.getPortHandle(RAM_PORT)

    // Get current state of RAM.
    let ramState: any = getReservedRamState(ns)

    // getReservedRamState() only "peeks" the data, so we have to manually
    // clear it once we've retrieved what we need.
    port.clear()

    // Increment the current state using the given parameters.
    let reservedRam = ramState[server.hostname]
    reservedRam = reservedRam == null ? ram : parseInt(reservedRam) + ram
    ramState[server.hostname] = reservedRam

    // Write new state to port.
    port.write(JSON.stringify(ramState))
    return true
}


/**
 * Private function for fetching and parsing the current reserved RAM state
 * from the reserved RAM Netscript port.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @returns An object with the current RAM state.
 */
export function getReservedRamState(ns: any): any {

    // Get Netscript port used for storing the current state of RAM for 
    // each server (home + purchased servers.)
    let port = ns.getPortHandle(RAM_PORT)

    // Get current state and read the reserved RAM for the given server.
    let ramState: any = {}

    // If the port is empty, populate it with inital data for this server, based
    // on the number of HACK_SCRIPTS running.
    // Otherwise, if the port has data, attempt to parse the current RAM state.
    if (port.empty()) {
        // TODO: Come up with initial state for reserved RAM. 
    } else {
        let originalState = port.peek()
        try {
            ramState = JSON.parse(originalState)
        }
        catch (error) {
            ns.tprint("Port data is not in a valid format. Data: " + originalState)
            port.clear()
        }
    }

    return ramState
}


/**
 * Retrieve the amount of RAM currently reserved on the given server.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @param server The server to get the current reserved RAM for.
 * @returns A number representing the amount of reserved RAM on that server.
 */
export function getReservedRamForServer(ns: any, server: any): number {
    let ramState = getReservedRamState(ns)
    let reservedRam = ramState[server.hostname]
    reservedRam = reservedRam == null ? 0 : parseInt(reservedRam)
    return reservedRam
}


/**
 * Reserve a given amount of RAM on a given server.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @param server The server on which RAM should be reserved.
 * @param ram The amount of RAM to reserve.
 * @returns The amount of reserved RAM remaining.
 */
export function reserveRam(ns: any, server: any, ram: number): number {
    updateReservedRam(ns, server, ram)
    return getReservedRamForServer(ns, server)
}


/**
 * Release a given amount of RAM on a given server.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @param server The server on which RAM should be released.
 * @param ram The amount of RAM to release.
 * @returns The amount of reserved RAM remaining.
 */
export function releaseRam(ns: any, server: any, ram: number): number {
    updateReservedRam(ns, server, -ram)
    return getReservedRamForServer(ns, server)
}


/**
 * Clear the reserved RAM port. Usually run this when restarting 
 * a batch hack session from scratch.
 * 
 * @param ns Netscript object provided by Bitburner.
 */
export function resetReservedRamForServer(ns: any, server: any) {
    let ramState = getReservedRamState(ns)
    releaseRam(ns, server, ramState[server.hostname])
}


/**
 * Get the times it will take the run the various components of a hacking
 * batch. Breaks the times out into hack, grow and weaken, but also provides
 * a total that can be used for calculating the optimal number of threads.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @param target The target being hacked, grown or weakened.
 * @returns An object containing the times it will take to hack, grow and weaken.
 */
export function getBatchTimes(ns: any, target: any): any {

    let offset = BATCH_SPEED   // Time between HWGW.
    let interval = BATCH_FREQUENCY   // Time between batches
    let weakenTime = ns.getWeakenTime(target.hostname)
    let growTime = ns.getGrowTime(target.hostname)
    let hackTime = ns.getHackTime(target.hostname)
    let total = weakenTime + (3 * offset)  // Weaken is always the longest.

    let times = {
        offset: offset,
        interval: interval,
        weaken: weakenTime,
        grow: growTime,
        hack: hackTime,
        total: total
    }

    return times
}


/**
 * Get the amount of RAM that will be used by a batch on a given server
 * using the given set up of threads.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @param server The server on which the batch would be running.
 * @param threads On object with data about the threads that will be used by each 
 * component of the batch.
 * @returns The amount of RAM that a single batch will use.
 */
export function getBatchRam(ns: any, server: any, threads: any): number {

    // Hack, grow and weaken all run in their own scripts.
    // All scripts have a base RAM of 1.6GB, and the HGW functions all use
    // 0.1GB of RAM.
    let hgwRam = 1.7
    let batchScriptRam = (1.7 * 4) + ns.getScriptRam(SCRIPTS.batch, server.hostname)
    let totalBatchRam = Math.round((batchScriptRam + (hgwRam * threads.total)) * 100) / 100

    return totalBatchRam
}


/**
 * Get the thread set up required to best use the HWGW batch method specified
 * in the Bitburner docs.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @param server The host server running the script.
 * @param target The target of the batch hack.
 * @param availableRam The amount of ram available on the host server before running batches.
 * @param times The times for each component of the batch.
 * @returns An object containing the threads needed to run a batch against the given target.
 */
export function getBatchThreads(ns: any, server: any, target: any, availableRam: number, times: any): any {

    let multiplier = 0.5
    let threads: any = {}

    let i = 0
    let scaled = false
    while (i < 1) {

        let hackMoney = ns.getServerMoneyAvailable(target.hostname) * multiplier
        let hackThreads = Math.trunc(ns.hackAnalyzeThreads(target.hostname, hackMoney))

        let growRatio = 1 / (1 - multiplier)

        let growThreads = Math.ceil(ns.growthAnalyze(target.hostname, growRatio))

        // These constants come from the docs based on the known effect
        // of HGW functions on the security of a server.
        let hackWeakenThreads = Math.ceil(hackThreads / 25)
        let growWeakenThreads = Math.ceil(growThreads / 12.5)

        // This object now represents the "ideal" thread setup, if the host server
        // had infinite RAM. Next step is to scale it back (if necessary) to achieve
        // a consistent rate of batch deployment.
        threads = {
            hack: hackThreads,
            grow: growThreads,
            hackWeaken: hackWeakenThreads,
            growWeaken: growWeakenThreads,
            total: hackThreads + growThreads + hackWeakenThreads + growWeakenThreads
        }

        // Get the RAM that would be used by deploying a batch with this thread setup.
        let batchRam = getBatchRam(ns, server, threads)

        // Get the number of batches that should be running at any one time.
        // Since we are aiming to run one per second, this is the same as the number of
        // seconds it takes to complete one batch.
        let numBatches = times.total / BATCH_FREQUENCY
        let totalBatchRam = batchRam * numBatches

        // Scale the multiplier up or down depending on whether the "ideal" thread amount
        // is lower or higher than the host server can handle.
        // TODO: Allow the server to scale up if it's not using it's full resources.
        let scaleRatio = availableRam / totalBatchRam

        if (!scaled) {
            multiplier *= scaleRatio
            multiplier >= 1 ? multiplier = 0.99 : multiplier
            scaled = true
        } else {
            i++
        }
    }

    return threads
}


/**
 * Helper to get the available RAM on a server at the time the function is called.
 * For some reason Bitburner doesn't already offer this function.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @param host The server the get available RAM for.
 * @returns The available RAM for the given server.
 */
export function getServerAvailableRam(ns: any, host: string): number {
    return ns.getServerMaxRam(host) - ns.getServerUsedRam(host)
}


/**
 * Establish whether the target server has the maximum money possible and the
 * minimum security. Used for the first stage in preparing a target to be 
 * hacked using the HWGW batch hacking method.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @param target The target being evaluated.
 * @returns A boolean indicating whether the target is ready to be batch hacked.
 */
export function isTargetPrepared(ns: any, target: any): boolean {

    let maxMoney = ns.getServerMoneyAvailable(target.hostname) == ns.getServerMaxMoney(target.hostname)
    let minSecurity = ns.getServerSecurityLevel(target.hostname) == ns.getServerMinSecurityLevel(target.hostname)

    let targetPrepared = maxMoney && minSecurity

    return targetPrepared
}


/**
 * Take the given data and print nicely as a table in the Bitburner console.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @param data Data to print in a table. Must be a regular array of objects.
 */
export function printTable(ns: any, data: object[]) {

    let keys = Object.keys(data[0])
    let colBuffer = 2  // Should always be an even number
    let table = ""

    let chars = {
        vSectRight: "├",
        vSectLeft: "┤",
        vBorder: "│",
        bottomRight: "┘",
        bottomLeft: "└",
        topLeft: "┌",
        topRight: "┐",
        crossSection: "┼",
        hSectBottom: "┴",
        hSectTop: "┬",
        hBorder: "─"
    }

    // Calculate column dimensions.
    let colWidths = keys.map((key: any) => {
        let valuesLength = data
            .map((row: any) => row[key])
            .map((value: any) => String(value).length)
        valuesLength.push(key.length)
        let width = Math.max(...valuesLength)
        return width + colBuffer
    })

    // Print header row.
    let hTop = ""
    let header = ""
    let hBottom = ""
    let bottom = ""
    for (let k in keys) {
        let frontSpaces = Number(k) == 0 ? 0 : Math.trunc((colWidths[k] - keys[k].length) / 2)
        let endSpaces = colWidths[k] - keys[k].length - frontSpaces
        header += (" ".repeat(frontSpaces) + keys[k].toUpperCase() + " ".repeat(endSpaces) + chars.vBorder)
        hTop += (chars.hBorder.repeat(colWidths[k]) + chars.hSectTop)
        hBottom += (chars.hBorder.repeat(colWidths[k]) + chars.crossSection)
        bottom += (chars.hBorder.repeat(colWidths[k]) + chars.hSectBottom)
    }

    hTop = "\n" + chars.topLeft + hTop.slice(0, -1) + chars.topRight
    hBottom = "\n" + chars.vSectRight + hBottom.slice(0, -1) + chars.vSectLeft
    header = "\n" + chars.vBorder + header.slice(0, -1) + chars.vBorder
    bottom = "\n" + chars.bottomLeft + bottom.slice(0, -1) + chars.bottomRight

    table += hTop
    table += header
    table += hBottom

    // Print content.
    data.forEach((row: any) => {
        let rowString = ""
        for (let k in keys) {
            let key = keys[k]
            let value = String(row[key])
            let frontSpaces = Number(k) == 0 ? 0 : Math.trunc((colWidths[k] - value.length) / 2)
            let endSpaces = colWidths[k] - value.length - frontSpaces
            rowString += (" ".repeat(frontSpaces) + value + " ".repeat(endSpaces) + chars.vBorder)
        }
        rowString = "\n" + chars.vBorder + rowString.slice(0, -1) + chars.vBorder
        table += rowString
    })

    // Print end row.
    table += bottom

    ns.tprint(table)

}


/**
 * Helper function to buy the next available upgrade for 
 * "home" server.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @returns Whether the upgrade is successful.
 */
export function upgradeHomeServer(ns: any): boolean {
    let ramCost = ns.getUpgradeHomeRamCost()
    let coresCost = ns.getUpgradeHomeCoresCost()
    let money = ns.getServerMoneyAvailable("home")

    let upgrade = ramCost <= coresCost ? "RAM" : "CORES"

    if (upgrade == "RAM" && money >= ramCost) {
        ns.upgradeHomeRam()
        ns.tprint("Upgraded RAM on home server!")
        return true
    } else if (upgrade == "CORES" && money >= coresCost) {
        ns.upgradeHomeCores()
        ns.tprint("Upgraded cores on home server!")
        return true
    }

    return false
}


/**
 * Automating buying and deleting of purchased servers so that resources
 * available to player are always optimal. Specifically, buy as many servers
 * as possible with the same RAM as "home". When "home" upgrades its RAM, 
 * wait until there is enough money to buy a new server with the same RAM, then
 * (if necessary) delete one purchased server and replace with a server with
 * more RAM. Repeat until all servers are matched.
 * 
 * @param ns Netscript object provided by Bitburner.
 */
export async function maintainPurchasedServers(ns: any) {

    // Start by buying servers that match the "home" server's RAM,
    // or is at the maximum.
    let money = ns.getServerMoneyAvailable("home")
    let ram = ns.getServerMaxRam("home") <= Math.pow(2, 20)
        ? ns.getServerMaxRam("home")
        : Math.pow(2, 20)
    let cost = ns.getPurchasedServerCost(ram)

    let servers = ns.getPurchasedServers()
    servers = servers.map((s: string) => ns.getServer(s))

    while (money > cost && servers.length < 25) {
        await buyServer(ns, ram)
        servers = ns.getPurchasedServers()
        money = ns.getServerMoneyAvailable("home")
        await ns.sleep(500)
    }

    // Determine whether any servers need upgrading.
    let upgradeServers = servers
        .filter((s: any) => s.maxRam < ram)
        .sort((a: any, b: any) => a.maxRam - b.maxRam)

    // Delete and repurchase servers that need upgrading.
    for (let u in upgradeServers) {
        let server = upgradeServers[u]
        if (money >= cost) {
            await ns.killall(server.hostname)
            let deleted = deleteServer(ns, server.hostname)
            if (deleted) { await buyServer(ns, ram, server.hostname) }
            money = ns.getServerMoneyAvailable("home")
        } else {
            break
        }
    }
}


/**
 * Get a list of all augmentations available in the game, for all factions.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @returns List of objects containing the name of the augmentations and
 * the name of the faction where the player can obtain that augmentation.
 */
export function getAllAugmentations(ns: any): any[] {

    let allAugmentations: any[] = []
    FACTIONS.forEach((faction: string) => {
        let augmentations = ns.getAugmentationsFromFaction(faction)
        augmentations.forEach((augmentation: string) => {
            allAugmentations.push({
                name: augmentation,
                faction: faction
            })
        })
    })

    return allAugmentations
}



export function getPathToServer(ns: any, host: string) {

}



export function directConnect(ns: any, host: string) {

}