export const translations = {
  no: {
    nav: {
      information: "Informasjon",
      facilities: "Fasiliteter",
      prices: "Priser",
      distances: "Avstander",
    },
    info: {
      description: "Kjellerleilighet på 45 m2 som ligger like ved Bjerkreimselva. Leiligheten har to soverom, hver med en enkeltseng. Det er dusjrom og seperat toalett. Hybelkjøkken med kjøleskap og fryser. Utendørs sittegruppe",
    },
    facilities: {
      tv: "TV",
      kitchen: "Kjøkken",
      shower: "Dusj",
      wifi: "Wifi",
      towels: "Håndkle",
    },
    prices: {
      weekly: "Ukeleie",
      weekly_price: "4000 NOK",
      daily: "Døgnpris",
      daily_price: "800 NOK",
      cleaning: "Utvask",
      cleaning_price: "600 NOK",
      bedding: "Sengetøy & håndduker (per pers. per opphold)",
      bedding_price: "100 NOK",
    },
    distances: {
      store: "3 km til butikk",
      egersund: "22 km til Egersund",
      stavanger: "60 km til Stavanger",
    },
    parking: {
      title: "Parkering",
      description: "Gratis parkering for gjester",
    },
    transport: {
      title: "Transport",
      description: "Busstopp like ved huset/leiligheten.",
    },
  },
  gb: {
    nav: {
      information: "Information",
      facilities: "Facilities",
      prices: "Prices",
      distances: "Distances",
    },
    info: {
      description: "Basement apartment of 45 m2 located next to Bjerkreim River. The apartment has two bedrooms, each with a single bed. There is a shower room and separate toilet. Kitchenette with refrigerator and freezer. Outdoor seating area",
    },
    facilities: {
      tv: "TV",
      kitchen: "Kitchen",
      shower: "Shower",
      wifi: "Wifi",
      towels: "Towels",
    },
    prices: {
      weekly: "Weekly rent",
      weekly_price: "4000 NOK",
      daily: "Daily rate",
      daily_price: "800 NOK",
      cleaning: "Cleaning",
      cleaning_price: "600 NOK",
      bedding: "Bedding & towels (per person per stay)",
      bedding_price: "100 NOK",
    },
    distances: {
      store: "3 km to store",
      egersund: "22 km to Egersund",
      stavanger: "60 km to Stavanger",
    },
    parking: {
      title: "Parking",
      description: "Free parking for guests",
    },
    transport: {
      title: "Transport",
      description: "Bus stop right by the house/apartment.",
    },
  },
  de: {
    nav: {
      information: "Information",
      facilities: "Einrichtungen",
      prices: "Preise",
      distances: "Entfernungen",
    },
    info: {
      description: "45 m2 große Kellerwohnung am Bjerkreim-Fluss. Die Wohnung verfügt über zwei Schlafzimmer, jeweils mit einem Einzelbett. Es gibt ein Duschbad und eine separate Toilette. Küchenzeile mit Kühlschrank und Gefrierschrank. Sitzgelegenheiten im Freien",
    },
    facilities: {
      tv: "TV",
      kitchen: "Küche",
      shower: "Dusche",
      wifi: "WLAN",
      towels: "Handtücher",
    },
    prices: {
      weekly: "Wochenmiete",
      weekly_price: "4000 NOK",
      daily: "Tagespreis",
      daily_price: "800 NOK",
      cleaning: "Endreinigung",
      cleaning_price: "600 NOK",
      bedding: "Bettwäsche & Handtücher (pro Person pro Aufenthalt)",
      bedding_price: "100 NOK",
    },
    distances: {
      store: "3 km zum Geschäft",
      egersund: "22 km nach Egersund",
      stavanger: "60 km nach Stavanger",
    },
    parking: {
      title: "Parken",
      description: "Kostenlose Parkplätze für Gäste",
    },
    transport: {
      title: "Transport",
      description: "Bushaltestelle direkt am Haus/der Wohnung.",
    },
  },
};

export type Language = keyof typeof translations;
export type TranslationKeys = keyof typeof translations.no;