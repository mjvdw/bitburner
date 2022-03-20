class FactionCriteria {
    faction: string
    server: string
    backdoorRequired: boolean
    minMoney: number
    minHackingLevel: number
    location: string[]
    excludedFactions: string[]
    companyRep: number
    combatStats: number
    karma: number
    companyPosition: string
    peopleKilled: number
    ownedAugmentations: number

    constructor(params: any) {
        this.faction = params.faction
        this.server = params.server || ""
        this.backdoorRequired = params.backdoorRequired || false
        this.minMoney = params.minMoney || 0
        this.minHackingLevel = params.minHackingLevel || 0
        this.location = params.location || ""
        this.excludedFactions = params.excludedFactions || []
        this.companyRep = params.companyRep || 0
        this.combatStats = params.combatStats || 0
        this.karma = params.karma || 0
        this.companyPosition = params.companyPosition || ""
        this.peopleKilled = params.peopleKilled || 0
        this.ownedAugmentations = params.ownedAugmentations || 0
    }
}

export const criteria = {
    // CyberSec
    CyberSec: new FactionCriteria({
        faction: "CyberSec",
        server: "CSEC",
        backdoorRequired: true,
        minHackingLevel: 53
    }),

    // Tian Di Hui
    TianDiHui: new FactionCriteria({
        faction: "Tian Di Hui",
        minMoney: 1e6,
        minHackingLevel: 50,
        location: ["Chongqing", "New Tokyo", "Ishima"]
    }),

    // Netburners
    Netburners: new FactionCriteria({
        faction: "Netburners",
        minHackingLevel: 80
        /**
         * TODO: Add hacknet node criteria.
         */
    }),

    // Sector-12
    Sector12: new FactionCriteria({
        faction: "Sector-12"
    }),

    // Chongqing
    Chongqing: new FactionCriteria({
        faction: "Chongqing"
    }),

    // New Tokyo
    NewTokyo: new FactionCriteria({
        faction: "New Tokyo"
    }),

    // Ishima
    Ishima: new FactionCriteria({
        faction: "Ishima"
    }),

    // Aevum
    Aevum: new FactionCriteria({
        faction: "Aevum"
    }),

    // Volhaven
    Volhaven: new FactionCriteria({
        faction: "Volhaven"
    }),

    // NiteSec
    NiteSec: new FactionCriteria({
        faction: "NiteSec",
        server: "avmnite-02h",
        backdoorRequired: true,
        minHackingLevel: 203
    }),

    // The Black Hand
    TheBlackHand: new FactionCriteria({
        faction: "The Black Hand",
        server: "I.I.I.I",
        backdoorRequired: true,
        minHackingLevel: 342
    }),

    // BitRunners
    BitRunners: new FactionCriteria({
        faction: "BitRunners",
        server: "run4theh111z",
        backdoorRequired: true,
        minHackingLevel: 541
    }),

    // ECorp
    ECorp: new FactionCriteria({
        faction: "ECorp"
    }),

    // MegaCorp
    MegaCorp: new FactionCriteria({
        faction: "MegaCorp"
    }),

    // KuaiGong International
    KuaiGongInternational: new FactionCriteria({
        faction: "KuaiGong International"
    }),

    // Four Sigma
    FourSigma: new FactionCriteria({
        faction: "Four Sigma"
    }),

    // NWO
    NWO: new FactionCriteria({
        faction: "NWO"
    }),

    // Blade Industries
    BladeIndustries: new FactionCriteria({
        faction: "Blade Industries"
    }),

    // OmniTek Incorporated
    OmniTekIncorporated: new FactionCriteria({
        faction: "OmniTek Incorporated"
    }),

    // Bachman & Associates
    BachmanAssociates: new FactionCriteria({
        faction: "Bachman & Associates"
    }),

    // Clarke Incorporated
    ClarkeIncorporated: new FactionCriteria({
        faction: "Clarke Incorporated"
    }),

    // Fulcrum Secret Technologies
    FulcrumSecretTechnologies: new FactionCriteria({
        faction: "Fulcrum Secret Technologies"
    }),

    // Slum Snakes
    SlumSnakes: new FactionCriteria({
        faction: "Slum Snakes"
    }),

    // Tetrads
    Tetrads: new FactionCriteria({
        faction: "Tetrads"
    }),

    // Silhouette
    Silhouette: new FactionCriteria({
        faction: "Silhouette"
    }),

    // Speakers for the Dead
    SpeakersfortheDead: new FactionCriteria({
        faction: "Speakers for the Dead"
    }),

    // The Dark Army
    TheDarkArmy: new FactionCriteria({
        faction: "The Dark Army"
    }),

    // The Syndicate
    TheSyndicate: new FactionCriteria({
        faction: "The Syndicate"
    }),

    // The Covenant
    TheCovenant: new FactionCriteria({
        faction: "The Covenant"
    }),

    // Daedalus
    Daedalus: new FactionCriteria({
        faction: "Daedalus"
    }),

    // Illuminati
    Illuminati: new FactionCriteria({
        faction: "Illuminati"
    }),

    // Bladeburners
    Bladeburners: new FactionCriteria({
        faction: "Bladeburners"
    }),

    // Church of the Machine God
    ChurchoftheMachineGod: new FactionCriteria({
        faction: "Church of the Machine God"
    }),
}