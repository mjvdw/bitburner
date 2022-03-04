/** @param {import(".").NS} ns */

// @ts-ignore
import { killHackScripts } from "/scripts/utils.js";


/**
 * Generic file for testing purposes only.
 * 
 * @param ns Netscript object provider by Bitburner.
 */
export async function main(ns: any) {

    buyServer(ns)

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

        usedIds = []

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
    // let server = ns.purchaseServer(hostname, ram);
    let server = true

    // If the server is successfully created, copy all scripts to the new server.
    // If the server was not successfully created, alert the user.
    if (server) {
        // const scripts = ns.ls("home", "scripts/");
        // await ns.scp(scripts, hostname);
        ns.tprint("Purchased server called " + hostname + " with " + ram + "GB of RAM for " + ns.nFormat(ns.getPurchasedServerCost(ram), "$0.000a") + ".")
        return true
    } else {
        ns.tprint("Unable to purchase server. The RAM appears to be valid and you have enough money, so something else must have gone wrong.")
        return false
    }
}