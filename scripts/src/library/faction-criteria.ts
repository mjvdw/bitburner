class FactionCriteria {
    faction: string
    company: string
    server: string
    backdoorRequired: boolean
    minMoney: number
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
        this.company = params.company || ""
        this.server = params.server || ""
        this.backdoorRequired = params.backdoorRequired || false
        this.minMoney = params.minMoney || 0
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
        location: ["Chongqing", "New Tokyo", "Ishima"]
    }),

    // Netburners
    Netburners: new FactionCriteria({
        faction: "Netburners",
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
    }),

    // The Black Hand
    TheBlackHand: new FactionCriteria({
        faction: "The Black Hand",
        server: "I.I.I.I",
        backdoorRequired: true,
    }),

    // BitRunners
    BitRunners: new FactionCriteria({
        faction: "BitRunners",
        server: "run4theh111z",
        backdoorRequired: true,
    }),

    // ECorp
    ECorp: new FactionCriteria({
        faction: "ECorp",
        companyRep: 2e5
    }),

    // MegaCorp
    MegaCorp: new FactionCriteria({
        faction: "MegaCorp",
        companyRep: 2e5
    }),

    // KuaiGong International
    KuaiGongInternational: new FactionCriteria({
        faction: "KuaiGong International",
        companyRep: 2e5
    }),

    // Four Sigma
    FourSigma: new FactionCriteria({
        faction: "Four Sigma",
        companyRep: 2e5
    }),

    // NWO
    NWO: new FactionCriteria({
        faction: "NWO",
        companyRep: 2e5
    }),

    // Blade Industries
    BladeIndustries: new FactionCriteria({
        faction: "Blade Industries",
        companyRep: 2e5
    }),

    // OmniTek Incorporated
    OmniTekIncorporated: new FactionCriteria({
        faction: "OmniTek Incorporated",
        companyRep: 2e5
    }),

    // Bachman & Associates
    BachmanAssociates: new FactionCriteria({
        faction: "Bachman & Associates",
        companyRep: 2e5
    }),

    // Clarke Incorporated
    ClarkeIncorporated: new FactionCriteria({
        faction: "Clarke Incorporated",
        companyRep: 2e5
    }),

    // Fulcrum Secret Technologies
    FulcrumSecretTechnologies: new FactionCriteria({
        faction: "Fulcrum Secret Technologies",
        company: "Fulcrum Technologies",
        server: "fulcrumassets",
        backdoorRequired: true,
        companyRep: 2.5e5
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