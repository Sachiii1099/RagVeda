export type Language = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'gu' | 'kn' | 'ml' | 'bn';

export interface TranslationDict {
  // Brand & Header
  brandName: string;
  brandTagline: string;
  jurisdictionIndia: string;
  jurisdictionIntl: string;
  loadDemo: string;
  apiKeyBtn: string;
  exportPassport: string;

  // Hero
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  startAssessmentCta: string;
  exploreDemosCta: string;
  statInnovations: string;
  statLaws: string;
  statTkdlRefs: string;
  statNonHallucination: string;

  // Demo Cases Selector
  demoCasesTitle: string;
  demoCasesSubtitle: string;
  loadCaseBtn: string;
  selectCasePlaceholder: string;

  // Intake Section
  intakeTitle: string;
  intakeSubtitle: string;
  innovationTitleLabel: string;
  innovationTitlePlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  intendedUseLabel: string;
  intendedUsePlaceholder: string;
  commercialIntentLabel: string;
  commercialIntentYes: string;
  targetJurisdictionLabel: string;
  micListening: string;
  micClickToSpeak: string;
  micLanguageHint: string;
  transcribingAudio: string;
  generateFingerprintCta: string;
  analyzingLoading: string;

  // Clarifying Questions
  clarifyTitle: string;
  clarifySubtitle: string;
  whyWeAskBadge: string;
  confirmContinueBtn: string;

  // Fingerprint
  fingerprintTitle: string;
  fingerprintSubtitle: string;
  tabIngredients: string;
  tabProcess: string;
  tabNovelty: string;
  tabMarkets: string;
  biologicalResourceBadge: string;
  threatenedSpeciesBadge: string;
  traditionalMethodBadge: string;
  modifiedMethodBadge: string;
  proceedToAssessmentCta: string;

  // Dashboard Tabs & Cards
  dashTabOverview: string;
  dashTabIP: string;
  dashTabPriorArt: string;
  dashTabBiodiversity: string;
  dashTabRegulatory: string;
  dashTabDependency: string;
  dashTabWhatIf: string;
  dashTabPassport: string;

  // Classification Card
  classificationCardTitle: string;
  classificationConfidence: string;
  applicableStatute: string;
  reasonsTitle: string;

  // IP Opportunity Card
  ipOpportunitiesTitle: string;
  ipRiskHeader: string;
  statutoryBasisHeader: string;
  viewEvidenceBtn: string;

  // Prior Art Radar & Timeline
  radarTitle: string;
  radarSubtitle: string;
  timelineTitle: string;
  timelineSubtitle: string;
  classicalTreatises: string;

  // Biodiversity / ABS Card
  biodiversityTitle: string;
  biodiversitySubtitle: string;
  potentialABS: string;
  relevantAuthority: string;
  statutoryProvision: string;
  requiredFilings: string;
  statutoryWarningTitle: string;

  // Regulatory Navigator
  regulatoryTitle: string;
  regulatorySubtitle: string;
  licensingPathway: string;
  licensingForm: string;
  rule158BStatus: string;
  safetyEvidence: string;
  labellingRules: string;
  complianceReadiness: string;
  actionChecklist: string;

  // What-If Simulator
  whatIfTitle: string;
  whatIfSubtitle: string;
  scenarioTitleLabel: string;
  selectChangeLabel: string;
  optExtractionMethod: string;
  optCultivatedOrigin: string;
  optExportUS: string;
  runSimulationBtn: string;
  baselineVsScenario: string;

  // Evidence Drawer
  evidenceDrawerTitle: string;
  evidenceDrawerSubtitle: string;
  authorityLevel: string;
  quotedLawSnippet: string;
  verifiedOfficialCitation: string;
  closeDrawer: string;

  // Settings Modal
  settingsTitle: string;
  settingsSubtitle: string;
  sttApiKeyLabel: string;
  sttApiKeyPlaceholder: string;
  llmApiKeyLabel: string;
  llmApiKeyPlaceholder: string;
  saveSettingsBtn: string;

  // Footer & Disclaimers
  footerLegalDisclaimer: string;
}
