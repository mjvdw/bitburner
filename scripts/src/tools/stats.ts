/** @param {import(".").NS} ns */

import {
    getTargets,
    printTable,
    isTargetPrepared,
    getReservedRamForServer,
    getAllAugmentations,
    CRIMES
    // @ts-ignore
} from "/scripts/library/utils.js";


/**
 * Helper function to display useful statistics to the player.
 * 
 * @param ns Netscript object provided by Bitburner.
 */
export async function main(ns: any) {

    let data: object[] = []
    let option = ns.args[0]
    let options = {
        hacking: "hacking",
        servers: "servers",
        ramCost: "ram-cost",
        money: "money",
        crimes: "crimes",
        augmentations: "augmentations"
    }
    let args = ns.args.slice(1)

    switch (option) {
        case options.hacking:
            data = getHackingStats(ns)
            break
        case options.servers:
            data = getServerStats(ns)
            break
        case options.ramCost:
            data = getRamUpgradeCost(ns)
            break
        case options.money:
            data = getMoneyStats(ns)
            break
        case options.crimes:
            data = getAllCrimeStats(ns)
            break
        case options.augmentations:
            data = getAugmentationStats(ns, args)
            break
        default:
            ns.tprint("That's not a valid input. Please try again. Valid inputs incude:")
            for (let [key, value] of Object.entries(options)) {
                ns.tprint("- " + value)
            }
            break
    }

    if (data.length > 0) {
        printTable(ns, data)
    }
}


/**
 * Helper function to collate useful information about hacking servers.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @returns Data pre-formatted to print as a table.
 */
function getHackingStats(ns: any): object[] {
    let targets = getTargets(ns, true)

    let data = targets.map((target: any) => {

        // Server available money v max money
        let money = ns.nFormat(target.moneyAvailable, "0.00a")
            + "/"
            + ns.nFormat(target.moneyMax, "0.00a")
            + " ("
            + ns.nFormat(target.moneyAvailable / target.moneyMax, "0.00%")
            + ")"

        // Current state of "attack"
        let preparing = getServersPreparingTarget(ns, target)
        let hacking = getServersHackingTarget(ns, target)
        let rate = (ns.hackAnalyze(target.hostname) * ns.getServerMaxMoney(target.hostname)) / (ns.getWeakenTime(target.hostname) / 1000)

        return {
            server: target.hostname,
            money: money,
            security: (target.hackDifficulty).toFixed(2),
            time: ns.nFormat(ns.getWeakenTime(target.hostname) / 1000, "00:00:00"),
            "rate/thread": ns.nFormat(rate, "$0.00") + "/s",
            prep: "*".repeat(preparing.length),
            ready: isTargetPrepared(ns, target) ? "*" : "",
            hack: "*".repeat(hacking.length)
        }
    })

    return data
}


/**
 * Helper function to determine whether a given target is being
 * hacked (as opposed to prepared, or no action at all).
 * 
 * @param ns Netscript object provided by Bitburner.
 * @param target The target potentially being hacked.
 * @returns Boolean indicating whether the given target is being hacked.
 */
function getServersHackingTarget(ns: any, target: any): any[] {

    let serversHackingTarget: any[] = []
    let pservs = ns.getPurchasedServers()

    pservs.forEach((pserv: any) => {
        // Use ports instead of iterating through
    })

    return serversHackingTarget
}


/**
 * Helper function to determine whether a given target is being
 * prepared (as opposed to hacked, or no action at all).
 * 
 * @param ns Netscript object provided by Bitburner.
 * @param target The target potentially being prepared.
 * @returns Boolean indicating whether the given target is being prepared.
 */
function getServersPreparingTarget(ns: any, target: any): any[] {
    return []
}


/**
 * Helper function to generate useful data about the player's
 * purchased servers.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @returns Data pre-formatted to print as a table.
 */
function getServerStats(ns: any): object[] {

    let home = ["home"]
    let pservs = ns.getPurchasedServers()
    let servers = home.concat(pservs)

    servers = servers.map((s: string) => ns.getServer(s))

    let data = servers
        .sort((a: any, b: any) => a.hostname - b.hostname)
        .map((s: any) => {

            let reservedRam = ns.nFormat(getReservedRamForServer(ns, s) / s.maxRam, "0.00%")
            let usedRam = ns.nFormat(s.ramUsed / s.maxRam, "0.00%")

            return {
                server: s.hostname,
                maxram: s.maxRam,
                reserved: reservedRam,
                used: usedRam
            }
        })

    return data
}


/**
 * Helper function to generate stats about the users money.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @returns Data pre-formatted to print as a table.
 */
function getMoneyStats(ns: any): any[] {
    return [{
        money: ns.nFormat(ns.getServerMoneyAvailable("home"), "$0,0.00")
    }]
}


/**
 * Helper function to generate useful information about crimes.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @returns Data pre-formatted to print as a table.
 */
function getAllCrimeStats(ns: any): any[] {

    let crimes = CRIMES
    let bitnodeMultiplier = 0.256

    let data: any[] = []
    crimes.forEach((crime: string) => {
        let stats = ns.getCrimeStats(crime)
        let money = stats.money * bitnodeMultiplier
        let d = {
            name: stats.name,
            i: crimes.indexOf(crime) + 1,
            money: ns.nFormat(money, "$0.000a"),
            chance: ns.nFormat(ns.getCrimeChance(stats.name), "0.00%"),
            diff: ns.nFormat(stats.difficulty, "0.00"),
            "rate/sec": ns.nFormat((money / (stats.time / 1000)) * ns.getCrimeChance(stats.name), "$0.000a")
        }
        data.push(d)
    })

    return data
}


/**
 * The cost of each level of purchased server based on RAM.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @returns Data pre-formatted to print as a table.
 */
function getRamUpgradeCost(ns: any): any[] {

    let data: any[] = []

    for (let i = 1; i <= 20; i++) {
        let ram = Math.pow(2, i)
        let homeRam = ns.getServerMaxRam("home")
        let homeCost = homeRam == ram ? ns.getUpgradeHomeRamCost() : 0
        let pservCost = ns.getPurchasedServerCost(ram)

        data.push({
            ram: ns.nFormat(ram * 1e9, "0.00b"),
            "home cost": homeCost != 0 ? ns.nFormat(homeCost, "$0.000a") : "-",
            "pserv cost": ns.nFormat(pservCost, "$0.000a"),
            "discount": homeCost != 0 ? ns.nFormat((homeCost - pservCost) / homeCost, "0.00%") : "-"
        })
    }

    return data
}


/**
 * List of augmentations and their stats.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @returns Data pre-formatted to print as a table.
 */
function getAugmentationStats(ns: any, args: string[]): any[] {

    let data: any[] = []
    let type = args[0]
    let typeOptions: any = {
        agility: {
            exp: "agility_exp_mult",
            skill: "agility_mult"
        },
        bladeburner: {
            analysis: "bladeburner_analysis_mult",
            max: "bladeburner_max_stamina_mult",
            gain: "bladeburner_stamina_gain_mult",
            chance: "bladeburner_success_chance_mult"
        },
        charisma: {
            exp: "charisma_exp_mult",
            skill: "charisma_mult"
        },
        company: {
            rep: "company_rep_mult"
        },
        crime: {
            money: "crime_money_mult",
            success: "crime_success_mult"
        },
        defense: {
            exp: "defense_exp_mult",
            skill: "defense_mult"
        },
        dexterity: {
            exp: "dexterity_exp_mult",
            skill: "dexterity_mult"
        },
        faction: {
            rep: "faction_rep_mult"
        },
        hacking: {
            chance: "hacking_chance_mult",
            exp: "hacking_exp_mult",
            grow: "hacking_grow_mult",
            money: "hacking_money_mult",
            skill: "hacking_mult"
        },
        hacknet: {
            level: "hacknet_node_level_cost_mult",
            ram: "hacknet_node_ram_cost_mult",
            core: "hacknet_node_core_cost_mult",
            node: "hacknet_node_purchase_cost_mult",
            money: "hacknet_node_money_mult",

        },
        strength: {
            exp: "strength_exp_mult",
            skill: "strength_mult"
        },
        work: {
            money: "work_money_mult"
        }
    }

    // Test whether the user has given a correct option.
    if (!typeOptions[type]) {
        ns.tprint("Incorrect augmentation type. Valid options are:")
        for (let type in typeOptions) { ns.tprint("- " + type) }
        return []
    }

    let augmentations = getAllAugmentations(ns)
    let installedAugs = ns.getOwnedAugmentations(false)
    let purchasedAugs = ns.getOwnedAugmentations(true).filter((x: string) => !installedAugs.includes(x))

    for (let a in augmentations) {
        let augmentation = augmentations[a]
        let stats = ns.getAugmentationStats(augmentation.name)

        let purchased = purchasedAugs.includes(augmentation.name)
        let installed = installedAugs.includes(augmentation.name)

        let d: any = {
            augmentation: augmentation.name,
            ["**"]: (purchased ? "*" : "") + (installed ? "*" : ""),
            faction: augmentation.faction,
        }

        for (let stat in typeOptions[type]) {
            d[stat] = stats[typeOptions[type][stat]] || "-"
        }

        data.push(d)
    }

    let sort = args[1]
    data = data
        .filter((d: any) => {
            if (d[sort]) {
                return d[sort] != "-"
            }
            else {
                let keep = false
                Object.entries(d).forEach((element: any) => {
                    if ((["augmentation", "faction", "**"].indexOf(element[0]) == -1) && element[1] !== "-") {
                        keep = true
                    }
                })
                return keep
            }
        })
        .sort((a: any, b: any) => b[sort] - a[sort])

    return data
}