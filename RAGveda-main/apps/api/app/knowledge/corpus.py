from typing import List, Dict, Any

STATUTORY_SOURCES: List[Dict[str, Any]] = [
    # LEVEL 1 - INDIAN LEGISLATION
    {
        "id": "SRC_PATENTS_ACT_1970",
        "title": "The Patents Act, 1970 (Act No. 39 of 1970 as amended)",
        "publisher": "Parliament of India / Office of the Controller General of Patents, Designs & Trade Marks (CGPDTM)",
        "authority_level": 1,
        "source_type": "Primary Legislation",
        "url": "https://ipindia.gov.in/acts-patents.htm",
        "jurisdiction": "IN",
        "publication_date": "1970-09-19",
        "effective_date": "2005-01-01",
        "chunks": [
            {
                "id": "PAT_SEC_3P",
                "section": "Section 3(p)",
                "heading": "What are not inventions - Traditional Knowledge Exclusion",
                "page": 14,
                "text": "The following are not inventions within the meaning of this Act: (p) an invention which in effect, is traditional knowledge or which is an aggregation or duplication of known properties of traditionally known component or components.",
                "keywords": ["traditional knowledge", "patentability", "aggregation", "duplication", "exclusion", "ayurveda"]
            },
            {
                "id": "PAT_SEC_3E",
                "section": "Section 3(e)",
                "heading": "What are not inventions - Mere Admixture Exclusion",
                "page": 13,
                "text": "The following are not inventions within the meaning of this Act: (e) a substance obtained by a mere admixture resulting only in the aggregation of the properties of the components thereof or a process for producing such substance.",
                "keywords": ["admixture", "synergism", "aggregation", "formulation", "combination"]
            },
            {
                "id": "PAT_SEC_3D",
                "section": "Section 3(d)",
                "heading": "What are not inventions - Known Substance Derivative",
                "page": 13,
                "text": "The following are not inventions within the meaning of this Act: (d) the mere discovery of a new form of a known substance which does not result in the enhancement of the known efficacy of that substance or the mere discovery of any new property or new use for a known substance.",
                "keywords": ["enhanced efficacy", "new form", "bioavailability", "known substance"]
            },
            {
                "id": "PAT_SEC_10_4",
                "section": "Section 10(4)(ii)(D)",
                "heading": "Disclosure of Biological Material Source and NBA Approval Requirement",
                "page": 32,
                "text": "Every complete specification shall disclose the source and geographical origin of the biological material in the specification, when used in an invention. If the biological material is obtained from India, the applicant must obtain the approval of the National Biodiversity Authority before the grant of patent under Section 6 of the Biological Diversity Act.",
                "keywords": ["biological material", "origin disclosure", "nba approval", "geographical origin"]
            }
        ]
    },
    {
        "id": "SRC_BIODIVERSITY_ACT_2002_2023",
        "title": "The Biological Diversity Act, 2002 (as amended by Biological Diversity (Amendment) Act, 2023)",
        "publisher": "Ministry of Environment, Forest and Climate Change / National Biodiversity Authority (NBA)",
        "authority_level": 1,
        "source_type": "Primary Legislation",
        "url": "http://nbaindia.org/content/25/19/1/act.html",
        "jurisdiction": "IN",
        "publication_date": "2003-02-05",
        "effective_date": "2023-08-01",
        "chunks": [
            {
                "id": "BDA_SEC_3",
                "section": "Section 3",
                "heading": "Certain persons not to undertake biodiversity related activities without approval of NBA",
                "page": 4,
                "text": "No person who is not a citizen of India, or a body corporate, association or organization incorporated or registered in India having any non-Indian participation in its share capital or management, shall access any biological resource occurring in India or associated traditional knowledge for commercial utilization, bio-survey or bio-utilization without prior approval of the National Biodiversity Authority (Form I).",
                "keywords": ["foreign entity", "nba approval", "commercial utilization", "biological resource", "form I"]
            },
            {
                "id": "BDA_SEC_7",
                "section": "Section 7",
                "heading": "Prior intimation to State Biodiversity Board for access by Indian citizens/entities",
                "page": 6,
                "text": "No person who is a citizen of India or a body corporate, association or organization registered in India shall access any biological resource occurring in India for commercial utilization without prior intimation to the concerned State Biodiversity Board (SBB) in the prescribed format (Form I to SBB), except codified traditional practitioners and cultivators of medicinal plants.",
                "keywords": ["state biodiversity board", "sbb intimation", "indian entity", "commercial utilization", "cultivators"]
            },
            {
                "id": "BDA_SEC_6",
                "section": "Section 6",
                "heading": "Application for Intellectual Property Rights on Inventions based on Biological Resources",
                "page": 5,
                "text": "No person shall apply for any intellectual property right, by whatever name called, in or outside India for any invention based on any research or information on a biological resource obtained from India, without obtaining the previous approval of the National Biodiversity Authority (Form III). Such approval must be obtained prior to the grant of the patent.",
                "keywords": ["patent approval", "form III", "nba permission", "ipr filing"]
            },
            {
                "id": "BDA_AMEND_2023_EXEMPTIONS",
                "section": "Section 40 & 2023 Amendment",
                "heading": "Exemptions for Cultivated Medicinal Plants and AYUSH Practitioners",
                "page": 8,
                "text": "Under the Biological Diversity (Amendment) Act 2023, registered AYUSH practitioners, codified traditional knowledge holders, and entities utilizing cultivated medicinal plants (duly certified with Certificate of Origin) are exempted from prior intimation to State Biodiversity Boards for Access and Benefit Sharing (ABS) payments, provided wild harvesting is not conducted.",
                "keywords": ["cultivated plants", "certificate of origin", "abs exemption", "ayush practitioner"]
            }
        ]
    },
    {
        "id": "SRC_DRUGS_COSMETICS_ACT_1940",
        "title": "The Drugs and Cosmetics Act, 1940 & Rules, 1945 (Chapter IV-A: ASU Drugs)",
        "publisher": "Ministry of Health and Family Welfare / Ministry of AYUSH",
        "authority_level": 1,
        "source_type": "Primary Legislation & Statutory Rules",
        "url": "https://ayush.gov.in/acts-rules",
        "jurisdiction": "IN",
        "publication_date": "1940-04-10",
        "effective_date": "1945-12-21",
        "chunks": [
            {
                "id": "DCA_SEC_3A",
                "section": "Section 3(a)",
                "heading": "Definition of Ayurvedic, Siddha or Unani (ASU) Drug",
                "page": 3,
                "text": "Ayurvedic, Siddha or Unani (ASU) drug includes all medicines intended for internal or external use for or in the diagnosis, treatment, mitigation or prevention of disease or disorder in human beings or animals, manufactured exclusively in accordance with the formulae described in the authoritative books of Ayurvedic, Siddha and Unani systems specified in the First Schedule.",
                "keywords": ["classical ayurvedic drug", "first schedule", "authoritative books", "charaka", "sushruta"]
            },
            {
                "id": "DCA_RULE_158B",
                "section": "Rule 158-B",
                "heading": "Guidelines for Issue of Licence with Respect to Patent or Proprietary Ayurvedic Medicine",
                "page": 112,
                "text": "For Patent or Proprietary Ayurvedic Medicine (containing ingredients cited in the First Schedule texts but with modified ratios, non-classical combinations, or modern processing): (a) If all ingredients and indications are classical: textual references from authoritative books suffice. (b) If new indications or novel extraction methods are claimed: safety data and proof of effectiveness (published scientific literature or pilot clinical studies) are mandatory before licence grant (Form 25D).",
                "keywords": ["patent proprietary medicine", "rule 158b", "safety data", "form 25d", "proof of effectiveness"]
            },
            {
                "id": "DCA_RULE_161",
                "section": "Rule 161",
                "heading": "Labelling, Packing and Limit of Alcohol in ASU Drugs",
                "page": 118,
                "text": "Every container of Ayurvedic medicine shall list all ingredients with their official Sanskrit names and botanical/scientific equivalents, batch number, manufacturing licence number, date of manufacture, expiry date, and warning 'For Ayurvedic Treatment Only'. Misleading therapeutic claims not backed by classical texts or clinical proof are prohibited under Drugs and Magic Remedies Act.",
                "keywords": ["labelling", "botanical names", "batch number", "misleading claims"]
            }
        ]
    },
    {
        "id": "SRC_FSSAI_AYUSH_AAHAR_2022",
        "title": "Food Safety and Standards (Ayush Aahar) Regulations, 2022",
        "publisher": "Food Safety and Standards Authority of India (FSSAI) & Ministry of AYUSH",
        "authority_level": 1,
        "source_type": "Statutory Regulation",
        "url": "https://www.fssai.gov.in/ayush-aahar.php",
        "jurisdiction": "IN",
        "publication_date": "2022-05-05",
        "effective_date": "2022-05-05",
        "chunks": [
            {
                "id": "FSSAI_AA_REG_3",
                "section": "Regulation 3 & Schedule I",
                "heading": "Definition and Composition of Ayush Aahar",
                "page": 2,
                "text": "Ayush Aahar means food prepared in accordance with the recipes or culinary methods described in the authoritative books of Ayurveda listed in Schedule A, for dietary nutrition and wellness. Ayush Aahar products cannot make medicinal/therapeutic disease claims (e.g. cures diabetes or treats cancer). They must bear the Ayush Aahar logo and FSSAI license number.",
                "keywords": ["ayush aahar", "nutraceutical", "food supplement", "fssai license", "no therapeutic claims"]
            }
        ]
    },
    {
        "id": "SRC_TKDL_GUIDELINES",
        "title": "Traditional Knowledge Digital Library (TKDL) Prior Art Guidelines & Search Protocols",
        "publisher": "Council of Scientific and Industrial Research (CSIR) / Ministry of AYUSH",
        "authority_level": 2,
        "source_type": "Official Regulatory Manual",
        "url": "http://www.tkdl.res.in",
        "jurisdiction": "IN",
        "publication_date": "2001-10-01",
        "effective_date": "2022-08-01",
        "chunks": [
            {
                "id": "TKDL_SEARCH_STANDARD",
                "section": "TKDL Prior Art Protocol",
                "heading": "Criteria for Assessing Prior Art in Ayurvedic Formulations (IPC A61K 36/00)",
                "page": 5,
                "text": "TKDL translates and classifies slokas from 150+ classical texts (Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya, Sharangadhara Samhita, Ayurvedic Formulary of India). An invention lacks novelty under Section 3(p) if the ingredient composition, solvent extract, and therapeutic indication directly mirror classical codified formulations, unless unexpected synergism or novel active fraction isolation is proven.",
                "keywords": ["tkdl", "prior art", "charaka samhita", "afi", "novelty lack", "ipc A61k"]
            }
        ]
    },

    # LEVEL 3 - INTERNATIONAL ORGANIZATIONS & TREATIES
    {
        "id": "SRC_WIPO_PCT_TREATIES",
        "title": "WIPO Patent Cooperation Treaty (PCT) & Traditional Knowledge Intergovernmental Committee (IGC)",
        "publisher": "World Intellectual Property Organization (WIPO)",
        "authority_level": 3,
        "source_type": "International Treaty & Guidance",
        "url": "https://www.wipo.int/tk/en/",
        "jurisdiction": "INT",
        "publication_date": "2024-05-24",
        "effective_date": "2024-05-24",
        "chunks": [
            {
                "id": "WIPO_TK_TREATY_2024",
                "section": "Article 3",
                "heading": "Mandatory Disclosure of Genetic Resources and Associated Traditional Knowledge",
                "page": 4,
                "text": "Under the WIPO Treaty on Intellectual Property, Genetic Resources and Associated Traditional Knowledge (adopted May 2024), patent applicants globally must disclose the country of origin of genetic resources and indigenous/traditional knowledge utilized in patent claims. Failure to disclose triggers pre-grant and post-grant patent scrutiny across PCT member states.",
                "keywords": ["wipo treaty", "mandatory disclosure", "genetic resources", "pct", "international patent"]
            },
            {
                "id": "NAGOYA_PROTOCOL_ABS",
                "section": "Nagoya Protocol on Access and Benefit Sharing",
                "heading": "International ABS Obligations",
                "page": 7,
                "text": "Signatory countries require internationally recognized certificates of compliance (IRCC) verifying Prior Informed Consent (PIC) and Mutually Agreed Terms (MAT) before accessing foreign biological material for commercial development.",
                "keywords": ["nagoya protocol", "mat", "pic", "ircc", "international abs"]
            }
        ]
    },
    {
        "id": "SRC_USFDA_BOTANICAL_GUIDANCE",
        "title": "US FDA Guidance for Industry: Botanical Drug Development",
        "publisher": "United States Food and Drug Administration (CDER)",
        "authority_level": 2,
        "source_type": "Regulatory Guidance",
        "url": "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/botanical-drug-development-guidance-industry",
        "jurisdiction": "INT",
        "publication_date": "2016-12-01",
        "effective_date": "2016-12-01",
        "chunks": [
            {
                "id": "FDA_BOTANICAL_IND",
                "section": "Section IV - IND Applications for Botanicals",
                "heading": "Requirements for Exporting Ayurvedic Drugs as Botanical Drugs to the United States",
                "page": 12,
                "text": "Products marketed as Ayurvedic drugs in India cannot be marketed with disease treatment claims in the US without either an approved New Drug Application (NDA) under Botanical Drug guidelines or compliant Dietary Supplement notification under DSHEA (where no disease claims are permitted). Batch-to-batch chemical fingerprinting (HPLC/LC-MS) and botanical raw material authentication are required for IND approval.",
                "keywords": ["us fda", "botanical drug", "dietary supplement", "dshea", "export", "batch consistency"]
            }
        ]
    }
]

CLASSICAL_AYURVEDIC_REFERENCES: List[Dict[str, Any]] = [
    {
        "name": "Ashwagandhadi Lehya / Churna",
        "source": "Sharangadhara Samhita / Ayurvedic Formulary of India (AFI Vol. 1)",
        "ingredients": ["Ashwagandha", "Ghrita", "Sharkara", "Madhu"],
        "indications": "Balya, Rasayana, Kshaya, Vata-Roga (General debility, rejuvenator, neuro-tonic)",
        "similarity_triggers": ["ashwagandha", "withania somnifera", "vitality", "stress", "tonic"]
    },
    {
        "name": "Nimbadi Kwatha / Taila",
        "source": "Bhaishajya Ratnavali (Kustha Rogadhikara)",
        "ingredients": ["Neem", "Haridra", "Daruharidra", "Manjistha", "Tila Taila"],
        "indications": "Kandu, Twak-Dosha, Vrana-Shodhana (Skin disorders, anti-microbial, wound healing)",
        "similarity_triggers": ["neem", "azadirachta indica", "skin", "wound", "anti-bacterial"]
    },
    {
        "name": "Triphala Churna / Kwatha",
        "source": "Charaka Samhita (Sutrasthana Ch. 27)",
        "ingredients": ["Haritaki", "Bibhitaki", "Amalaki"],
        "indications": "Chakshushya, Deepana, Vibandha, Rasayana (Digestive regulator, antioxidant)",
        "similarity_triggers": ["triphala", "haritaki", "bibhitaki", "amalaki", "digestion"]
    },
    {
        "name": "Chandraprabha Vati",
        "source": "Sharangadhara Samhita (Madhyama Khanda Ch. 7)",
        "ingredients": ["Shilajit", "Guggulu", "Haridra", "Daruharidra", "Vacha", "Chavya"],
        "indications": "Prameha, Mutrakrichhra (Metabolic regulation, urinary tract support)",
        "similarity_triggers": ["shilajit", "guggulu", "metabolic", "diabetes", "urinary"]
    }
]

BOTANICAL_DIRECTORY: Dict[str, Dict[str, Any]] = {
    "ashwagandha": {
        "scientific_name": "Withania somnifera",
        "sanskrit_name": "Ashwagandha",
        "family": "Solanaceae",
        "parts_used": "Root",
        "classical_indication": "Rasayana, Balya",
        "is_threatened": False
    },
    "neem": {
        "scientific_name": "Azadirachta indica",
        "sanskrit_name": "Nimba",
        "family": "Meliaceae",
        "parts_used": "Leaves, Bark, Seed Oil",
        "classical_indication": "Krimighna, Kusthaghna",
        "is_threatened": False
    },
    "turmeric": {
        "scientific_name": "Curcuma longa",
        "sanskrit_name": "Haridra",
        "family": "Zingiberaceae",
        "parts_used": "Rhizome",
        "classical_indication": "Varnya, Lekhaniya, Vishaghna",
        "is_threatened": False
    },
    "haridra": {
        "scientific_name": "Curcuma longa",
        "sanskrit_name": "Haridra",
        "family": "Zingiberaceae",
        "parts_used": "Rhizome",
        "classical_indication": "Varnya, Lekhaniya",
        "is_threatened": False
    },
    "tulsi": {
        "scientific_name": "Ocimum sanctum",
        "sanskrit_name": "Surasa / Tulasi",
        "family": "Lamiaceae",
        "parts_used": "Leaves, Whole Plant",
        "classical_indication": "Kaphaghna, Vishaghna",
        "is_threatened": False
    },
    "red sanders": {
        "scientific_name": "Pterocarpus santalinus",
        "sanskrit_name": "Rakta Chandana",
        "family": "Fabaceae",
        "parts_used": "Heartwood",
        "classical_indication": "Pitta-shamaka, Rakta-prasadana",
        "is_threatened": True  # Endangered / strictly regulated under Biodiversity Act
    },
    "kutki": {
        "scientific_name": "Picrorhiza kurroa",
        "sanskrit_name": "Katuka",
        "family": "Plantaginaceae",
        "parts_used": "Rhizome",
        "classical_indication": "Yakrit-uttejaka, Jvarahara",
        "is_threatened": True  # High conservation concern in Himalayas
    },
    "guggulu": {
        "scientific_name": "Commiphora mukul",
        "sanskrit_name": "Guggulu",
        "family": "Burseraceae",
        "parts_used": "Exudate / Gum Resin",
        "classical_indication": "Medohara, Vedanasthapana",
        "is_threatened": True
    },
    "brahmi": {
        "scientific_name": "Bacopa monnieri",
        "sanskrit_name": "Brahmi",
        "family": "Plantaginaceae",
        "parts_used": "Whole Plant",
        "classical_indication": "Medhya, Smritiprada",
        "is_threatened": False
    },
    "shilajit": {
        "scientific_name": "Asphaltum punjabianum",
        "sanskrit_name": "Shilajatu",
        "family": "Mineral-organic pitch",
        "parts_used": "Purified Exudate (Shodhita)",
        "classical_indication": "Rasayana, Pramehaghna",
        "is_threatened": False
    }
}
