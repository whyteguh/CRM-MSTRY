import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  ArrowRight,
  TrendingUp, 
  Layers, 
  GitFork,
  Trash2, 
  Plus, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle, 
  Gauge,
  PlusCircle,
  HelpCircle,
  ChevronRight,
  Calculator,
  Percent,
  TrendingDown,
  Activity,
  Users,
  Database,
  Coins,
  AlertCircle,
  Crosshair,
  Sprout,
  RefreshCw,
  User,
  Briefcase,
  MapPin,
  GraduationCap,
  Heart,
  Clock,
  Globe,
  Zap,
  Target,
  X,
  Printer,
  Copy,
  UserCircle,
  Lightbulb
} from 'lucide-react';
import { PipelineDeal } from '../types';
import BainElementsTool from './BainElementsTool';
import CrmJourneyBuilderTool from './CrmJourneyBuilderTool';
import CrmSchemaDesignerTool from './CrmSchemaDesignerTool';

interface ToolsViewProps {
  onCalculateRun: () => void;
}

export default function ToolsView({ onCalculateRun }: ToolsViewProps) {
  // State for selected tool (null means showing the Grid Catalog)
  const [selectedToolId, setSelectedToolId] = useState<'bainElements' | 'journeyBuilder' | 'schemaDesigner' | 'pipeline' | 'clv' | 'leadScore' | 'dbReactivation' | 'hunterFarmer' | 'personaBuilder' | null>(null);

  // Trigger calculation tracker in parental workshop progress
  const notifyCalculation = () => {
    onCalculateRun();
  };

  // ----------------------------------------------------
  // TOOL 1: PIPELINE DEAL FORECAST STATE & MATH
  // ----------------------------------------------------
  const [deals, setDeals] = useState<PipelineDeal[]>([
    { id: 'deal-1', dealName: 'Enterprise Cloud Migration - PT Indofood', stage: 'proposal', value: 125000000, probability: 45 },
    { id: 'deal-2', dealName: 'Omnichannel CRM License - Globex Hub', stage: 'negotiation', value: 240000000, probability: 75 },
    { id: 'deal-3', dealName: 'Custom SLA Service Contract - Bukalapak', stage: 'qualification', value: 85000000, probability: 15 },
  ]);

  const [newDealName, setNewDealName] = useState('');
  const [newDealValue, setNewDealValue] = useState(150000000);
  const [newDealStage, setNewDealStage] = useState<'qualification' | 'proposal' | 'negotiation' | 'decision'>('qualification');

  const stageProbabilities = {
    qualification: 15,
    proposal: 45,
    negotiation: 75,
    decision: 90
  };

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealName.trim()) return;

    const deal: PipelineDeal = {
      id: `deal-${Date.now()}`,
      dealName: newDealName.trim(),
      stage: newDealStage,
      value: newDealValue,
      probability: stageProbabilities[newDealStage]
    };

    setDeals([...deals, deal]);
    setNewDealName('');
    setNewDealValue(150000000);
    notifyCalculation();
  };

  const handleRemoveDeal = (id: string) => {
    setDeals(deals.filter(d => d.id !== id));
    notifyCalculation();
  };

  const handleStageChange = (id: string, stage: 'qualification' | 'proposal' | 'negotiation' | 'decision') => {
    setDeals(deals.map(d => {
      if (d.id === id) {
        return {
          ...d,
          stage,
          probability: stageProbabilities[stage]
        };
      }
      return d;
    }));
    notifyCalculation();
  };

  const totalValue = deals.reduce((acc, d) => acc + d.value, 0);
  const expectedValue = deals.reduce((acc, d) => acc + (d.value * (d.probability / 100)), 0);

  // ----------------------------------------------------
  // TOOL 2: CLV LIFE CYCLE SIMULATOR STATE & MATH
  // ----------------------------------------------------
  const [purchaseValue, setPurchaseValue] = useState(1500000); // Rp 1.500.000 AOV
  const [frequency, setFrequency] = useState(12); // transactions/year
  const [lifespan, setLifespan] = useState(4); // years
  const [margin, setMargin] = useState(70); // gross profit margin %

  const annualRevenue = purchaseValue * frequency;
  const rawCLV = annualRevenue * lifespan;
  const marginCLV = rawCLV * (margin / 100);
  const maxCAC = marginCLV / 3; // Golden Ratio target

  // Track CLV parameter shifts
  useEffect(() => {
    if (purchaseValue && frequency && lifespan) {
      notifyCalculation();
    }
  }, [purchaseValue, frequency, lifespan, margin]);

  // ----------------------------------------------------
  // TOOL 3: BANT LEAD SCORES MATRIX STATE & MATH
  // ----------------------------------------------------
  const [budgetScore, setBudgetScore] = useState<number>(15);
  const [authorityScore, setAuthorityScore] = useState<number>(15);
  const [needScore, setNeedScore] = useState<number>(10);
  const [timelineScore, setTimelineScore] = useState<number>(10);

  const totalLeadScore = budgetScore + authorityScore + needScore + timelineScore;

  // Track Lead Score parameters changes
  useEffect(() => {
    notifyCalculation();
  }, [budgetScore, authorityScore, needScore, timelineScore]);

  const getLeadGrade = (score: number) => {
    if (score >= 85) return { label: 'HOT LEAD', color: 'bg-rose-500 text-white', action: 'Route immediately to Sales Representatives for custom outbound follow-up (SLA: < 15 mins)' };
    if (score >= 65) return { label: 'HIGH PRIORITY', color: 'bg-orange-500 text-white', action: 'Schedule strategic product demonstration sequence within 48 business hours' };
    if (score >= 35) return { label: 'WARM LEAD', color: 'bg-amber-500 text-slate-900', action: 'Trigger automated email marketing campaign & customized value-deck sequence' };
    return { label: 'COLD LEAD', color: 'bg-slate-500 text-white', action: 'Assign to general quarterly newsletter stream & general product updates segment' };
  };

  const leadGradeResult = getLeadGrade(totalLeadScore);

  // ----------------------------------------------------
  // TOOL 4: DATABASE REACTIVATION ROI CALCULATOR STATE & MATH
  // ----------------------------------------------------
  const [inactiveContacts, setInactiveContacts] = useState<number>(2500);
  const [dormantAov, setDormantAov] = useState<number>(150000);
  const [dormantCac, setDormantCac] = useState<number>(50000);
  const [dormantConversion, setDormantConversion] = useState<number>(2.0); // %
  const [actionInitiated, setActionInitiated] = useState<boolean>(false);

  // Trigger ROI calculation changes
  useEffect(() => {
    notifyCalculation();
  }, [inactiveContacts, dormantAov, dormantCac, dormantConversion]);

  const activatedDormantCustomers = Math.round(inactiveContacts * (dormantConversion / 100));
  const potentialLostRevenue = inactiveContacts * dormantAov * (dormantConversion / 100);
  const adSpendSaved = activatedDormantCustomers * dormantCac;

  const getDormantRealityCheckMessage = (revenue: number) => {
    if (revenue === 0) return "Please adjust parameters to calculate the commercial reactivation potential of your dormant asset.";
    if (revenue < 1000000) return "A humble cohort value. Ideal for launching low-risk reactivation test runs.";
    if (revenue < 10000000) return "Sufficient to offset immediate monthly platform licensing and general CRM system overheads!";
    if (revenue < 50000000) return "A substantial loss, equivalent to discarding viable quarterly advertisement budgets.";
    if (revenue < 100000000) return "Equivalent to wasting a major system integration or operational vehicle lease budget!";
    if (revenue < 1000000000) return "Extreme capital leakage! This sum is sufficient to self-fund system migrations or deep geographic expansion.";
    return "CRITICAL REVENUE PATHWAY: You are sitting on a massive data goldmine. Activate these records before competitors sweep this segment!";
  };

  const dormantRealityMessage = getDormantRealityCheckMessage(potentialLostRevenue);

  // ----------------------------------------------------
  // TOOL 5: HUNTER VS. FARMER ASSESSMENT MATRIX STATE & MATH
  // ----------------------------------------------------
  const hunterFarmerQuestions = [
    {
      id: 1,
      text: "Marketing & Budget Allocation",
      subtext: "How is your primary marketing capital and operational budget distributed?",
      options: [
        { label: "100% Acquisition Campaign Outlays", description: "Entirely dedicated to new client acquisition channels, paid social ads, and cold outreach.", score: -2 },
        { label: "Acquisition-Heavy Focus (70/30 Rule)", description: "70% allocated to net-new leads, while 30% goes to basic retargeting or newsletter campaigns.", score: -1 },
        { label: "Balanced Allocation (50/50 Rule)", description: "Equal distribution between acquiring fresh prospects and nurturing the current database.", score: 0 },
        { label: "Retention-Heavy Focus (30/70 Rule)", description: "70% goes into lifecycle automation, loyalty rewards, and 30% into replacement lead feeds.", score: 1 },
        { label: "100% Retention & Referral Incentives", description: "All capital goes into upgrading existing infrastructure, customer support, and referral circles.", score: 2 }
      ]
    },
    {
      id: 2,
      text: "Lead Follow-up & Reactivation Workflows",
      subtext: "How active is your team on older, dormant, or cold contact groups?",
      options: [
        { label: "Strictly Net-New Leads Focus", description: "Sales pursues raw premium incoming inquiries; older sign-ups are left un-contacted.", score: -2 },
        { label: "Occasional Bulk Broadcast Runs", description: "Older pools receive generic quarterly blast messages, but priority remains on fresh inbound signals.", score: -1 },
        { label: "Systematic Multi-Pathway Routines", description: "Both new acquisition funnels and scheduled database reactivation efforts run simultaneously.", score: 0 },
        { label: "High-Touch Account-Growth Focus", description: "Regular checks are made on all older accounts to spot expansion, renewals, or new cross-sell paths.", score: 1 },
        { label: "Comprehensive Lifecycle Nurture Sequences", description: "Dormant users receive trigger-based custom sequence check-ins alongside annual SLA alignment checks.", score: 2 }
      ]
    },
    {
      id: 3,
      text: "Sales Team Commission & Reward Models",
      subtext: "What primary behavior produces the highest financial rewards for representatives?",
      options: [
        { label: "New Logo Sign-On Bonuses Only", description: "Commission is only paid on winning net-new customer contracts. Renewals do not yield bonuses.", score: -2 },
        { label: "Acquisition Dominant Incentives", description: "Bonus structure favors raw initial sales; small fixed margins are given for re-sign contracts.", score: -1 },
        { label: "Uniform Growth Compensation Scale", description: "Equal commissions are earned from net-new sign-ons and substantial upgrades/expansions.", score: 0 },
        { label: "Account Expansion Reward Priority", description: "Compensation rewards account growth, renewals, and preventing contract cancellation.", score: 1 },
        { label: "Premium Retention & Quality Targets", description: "Team receives performance bonuses based on Client NPS ratings, SLA health indexes, and renewal rates.", score: 2 }
      ]
    },
    {
      id: 4,
      text: "Historical Customer Database Usage",
      subtext: "How deep is your technical segmentation and understanding of your historical client list?",
      options: [
        { label: "Billing & Invoicing Logging Only", description: "The list is basically flat. No tracking of individual order behaviors or recency parameters exists.", score: -2 },
        { label: "Basic Single-Segment Lists", description: "We run monthly email broadcasts, but do not slice contacts based on previous purchase types.", score: -1 },
        { label: "Active Cohort Stage Segmentation", description: "Contacts are divided by general purchase frequency, volume thresholds, and initial product categories.", score: 0 },
        { label: "Advanced RFM Scoring Automation", description: "System regularly checks Recency, Frequency, and Monetary scores to trigger custom win-back promos.", score: 1 },
        { label: "Predictive Lifecycle Alerts Suite", description: "Deep CRM analytics signal user drop-offs or upgrade windows before custom outreach begins.", score: 2 }
      ]
    },
    {
      id: 5,
      text: "Core Technology Stack Focus",
      subtext: "Which specific tool interfaces receive the highest attention and investment?",
      options: [
        { label: "Inbound Capture & Ad Automation Tools", description: "Heavy focus on social ad platforms, scraper crawlers, landing-page form designs, and click funnels.", score: -2 },
        { label: "Ad Engines with Simple Outreach Feeds", description: "Social ad accounts paired with a general-purpose, manual batch email platform.", score: -1 },
        { label: "Cross-Channel Broadcast Hubs", description: "Unified broadcast platforms integrating WhatsApp messages, newsletter pipelines, and landing page forms.", score: 0 },
        { label: "Customer Relationship Management (CRM) Suite", description: "Robust CRM instances containing customer history modules, automatic workflows, and loyalty segments.", score: 1 },
        { label: "Success Suites & Predictive Health Trackers", description: "Support desk trackers, service level agreements, custom client feedback logs, and health dials.", score: 2 }
      ]
    },
    {
      id: 6,
      text: "Primary Business Growth Philosophy",
      subtext: "What core metric is defended as the absolute key to scaling operations?",
      options: [
        { label: "Sustained Monthly Lead Velocity", description: "Focusing solely on traffic count, ad CTRs, and improving initial checkout conversion rate stats.", score: -2 },
        { label: "Cost-Per-Acquisition Optimization", description: "Scaling is built on lowering CPC or CPA rates while keeping purchase prices steady.", score: -1 },
        { label: "Average Order Value (AOV) Upgrades", description: "Increasing ticket sizes and upselling bundled products on checkout.", score: 0 },
        { label: "Account Purchase Frequency Escalation", description: "Nurturing repeat transaction habits and creating subscription loyalty circles.", score: 1 },
        { label: "NPS & Organic Referral Network Expansion", description: "Focus on maximizing lifetime contract retention and encouraging word-of-mouth client referrals.", score: 2 }
      ]
    },
    {
      id: 7,
      text: "Customer Support & Service Alignment",
      subtext: "How is customer support positioned inside your wider organizational strategy?",
      options: [
        { label: "Reactive Ad-Hoc Troubleshooting", description: "Support handles basic ticket fires as they pop up; focus is keeps sales reps hunting.", score: -2 },
        { label: "Isolated Ticket Response Units", description: "Support team handles emails within 24 hours, but operates independently of marketing sales funnels.", score: -1 },
        { label: "Service Desk with Feedback Loops", description: "Support shares regular feedback reviews with sales teams to highlight common service friction.", score: 0 },
        { label: "Proactive Success Management Program", description: "Dedicated success managers assist accounts to optimize usage before issues arise.", score: 1 },
        { label: "Strategic Value-Delivery Partnerships", description: "Success actions are integrated with product usage analysis to suggest expansions.", score: 2 }
      ]
    },
    {
      id: 8,
      text: "Customer Churn & Attrition Outlook",
      subtext: "How is contract expiration or dropping customer retention viewed by senior managers?",
      options: [
        { label: "Standard Operational Attrition Factor", description: "Churn is natural; we focus on finding fresh audiences to replace lost partners.", score: -2 },
        { label: "Acquisition Defends Losses", description: "We keep an eye on active counts, trusting the acquisition team's speed to outrun cancellations.", score: -1 },
        { label: "Active Save-Sequence Operations", description: "Churn is checked monthly; active save plays or discount vouchers are deployed upon cancellation requests.", score: 0 },
        { label: "Systematic Retention Risk Alerts", description: "Customer usage habits are audited continually to intervene before account cancellations are filed.", score: 1 },
        { label: "Absolute Client Retention Mandate", description: "Zero tolerances on cancellations. Focus is on delivering client value to secure renewals.", score: 2 }
      ]
    }
  ];

  const [hunterFarmerAnswers, setHunterFarmerAnswers] = useState<number[]>(Array(8).fill(-1));
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);

  // Trigger calculation updates when answers shift
  useEffect(() => {
    notifyCalculation();
  }, [hunterFarmerAnswers]);

  const answeredQuizCount = hunterFarmerAnswers.filter(a => a !== -1).length;
  const cumulativeQuizScore = hunterFarmerAnswers.reduce((sum, val, idx) => {
    if (val === -1) return sum;
    return sum + hunterFarmerQuestions[idx].options[val].score;
  }, 0);

  const maxPossibleQuizScore = answeredQuizCount * 2;
  const percentageFarmer = maxPossibleQuizScore === 0 ? 50 : Math.round(50 + (cumulativeQuizScore / maxPossibleQuizScore) * 50);
  const percentageHunter = 100 - percentageFarmer;

  const getHunterFarmerProfile = (hunterPct: number) => {
    if (hunterPct >= 75) {
      return {
        label: "PURE HUNTER (Acquisition Dominant)",
        colorClass: "from-blue-600 to-cyan-500",
        bgClass: "bg-blue-50 border-blue-200 text-blue-900",
        description: "Your business model prioritizes rapid front-end user acquisitions and high-velocity onboarding cycles. While checkout conversions and pay-per-click ad sequences are highly active, your historical consumer database list remains an undertreated goldmine. You are continuously paying high acquisition rates to find customers, rather than fully leveraging the ones you've already won.",
        steps: [
          "Establish automated email and SMS win-back campaigns targeted at accounts inactive for 90+ days.",
          "Amend sales representative incentives or commission guidelines to award an ongoing 5-10% bonus share strictly for client renewals, subscription extensions, or customer catalog upsells.",
          "Perform systematic RFM segmentation queries across all customer files to immediate distinguish top historic buyers from high-churn risks."
        ]
      };
    }
    if (hunterPct >= 55) {
      return {
        label: "ACQUISITION LEANING (Balanced Outbound)",
        colorClass: "from-cyan-500 to-indigo-500",
        bgClass: "bg-cyan-50 border-cyan-200 text-cyan-900",
        description: "Your operations feature structured efforts to expand and source fresh leads outwardly. You maintain a stable, well-executed ad pipeline but haven't automated secondary cross-selling flows yet. By adjusting small operational weights internally, you can unlock customer loyalty profits for near-zero net marginal costs.",
        steps: [
          "Deploy an automatic 3-step welcomed onboarding cascade for every fresh buyer to establish a clear product retention anchor from Day 1.",
          "Integrate customer support desk responses with sales pipelines so service feedback loops guide product managers immediately.",
          "Design high-leverage promotional custom bundles once a month centered heavily around historical buying profiles to maximize checkout frequency."
        ]
      };
    }
    if (hunterPct >= 45) {
      return {
        label: "BALANCED ARCHITECT (Synergistic Operations)",
        colorClass: "from-indigo-500 to-emerald-500",
        bgClass: "bg-indigo-50 border-indigo-200 text-indigo-950",
        description: "Incredible corporate balance! You defend customer lifetime metrics (LTV) with equal intensity as you discover and engage brand-new markets. Your acquisition cost ratios are likely highly optimized, and your customer segments show stable healthy interaction rates across all milestones.",
        steps: [
          "Systematize retention loops by integrating an automated, real-time RFM scoring matrix straight into your central user profile tools.",
          "Run a monthly 'Customer Council' panel with premium, high-value cohort accounts to co-create advanced premium upgrade workflows.",
          "Formally institutionalize commissions that reward team members equally for both high-end new logo hunting wins and long-term retention growth."
        ]
      };
    }
    if (hunterPct >= 25) {
      return {
        label: "RETENTION LEANING (Relationship Centric)",
        colorClass: "from-emerald-500 to-teal-500",
        bgClass: "bg-emerald-50 border-emerald-200 text-emerald-900",
        description: "Your expansion engine is heavily supported by happy back-end customers, deep industry trust, and organic recommendations. While this is proof of phenomenal product value and near-zero attrition, you risk slower overall market growth by neglecting outward-facing marketing funnels.",
        steps: [
          "Establish clear keyword optimization (SEO) and structured PPC ad trials on Google and LinkedIn to attract high-intent new prospective accounts.",
          "Create a high-incentive, automated Referral program to make your enthusiastic customer community an active channel to source verified pre-qualified warm leads.",
          "Build dedicated web landing pages to capture passive inbound business traffic that is currently dropping off unserved."
        ]
      };
    }
    return {
      label: "PURE FARMER (Customer Retention Heavy)",
      colorClass: "from-emerald-600 to-teal-600",
      bgClass: "bg-teal-50 border-teal-200 text-teal-900",
      description: "Your business models focus entirely on account protection, support SLA compliance, and deep client relationships. While your cancellations are effectively zero and client satisfaction ratings are elite, you operate inside an organizational glass ceiling. True scaling requires re-tooling your pipelines to bring in a steady inflow of brand-new opportunities.",
      steps: [
        "Design a structured 'Enterprise Dream 100' campaign, listing the absolute key ideal corporate accounts and building direct outreaches.",
        "Set aside a firm 15% budget margin to test paid channels (e.g. search advertising) focused on specific product-interest landing pages.",
        "Retrain account managers or hire a dedicated outbound representative to contact pre-qualified leads and widen your addressable market."
      ]
    };
  };

  // ----------------------------------------------------
  // TOOL 6: IDEAL CUSTOMER PROFILE & PERSONA BUILDER
  // ----------------------------------------------------
  interface PersonaData {
    businessName: string;
    businessDescription: string;
    customerName: string;
    demographics: {
      age: string;
      maritalStatus: string;
      location: string;
      education: string;
      other: string;
    };
    finances: {
      jobTitle: string;
      income: string;
      company: string;
      skill: string;
    };
    dailyLife: {
      morning: string;
      afternoon: string;
      night: string;
    };
    onlineBehaviors: string[];
    influences: string[];
    brandAffinities: string[];
    hopesDreams: string[];
    worriesFears: string[];
    makeLifeEasier: string[];
  }

  const indonesianNames = [
    "Budi Santoso", "Siti Aminah", "Andi Wijaya", "Rina Marlina", 
    "Eko Prasetyo", "Kartika Sari", "Ahmad Fauzi", "Dewi Lestari", 
    "Hendra Gunawan", "Maya Putri", "Reza Aditya", "Dian Sastro"
  ];

  const [personaIsEditing, setPersonaIsEditing] = useState<boolean>(true);
  const [personaGender, setPersonaGender] = useState<'male' | 'female'>('male');
  const [personaModalOpen, setPersonaModalOpen] = useState<boolean>(false);
  const [personaPrompt, setPersonaPrompt] = useState<string>('');
  const [personaCopySuccess, setPersonaCopySuccess] = useState<boolean>(false);

  const [personaData, setPersonaData] = useState<PersonaData>({
    businessName: 'Incentric Digital Group',
    businessDescription: 'Provides high-end omnichannel CRM software, loyalty programs, and automated client database reactivation suites for modern retail enterprises.',
    customerName: 'Hendra Wijaya',
    demographics: {
      age: '35 - 45 Years',
      maritalStatus: 'Married with children',
      location: 'Jakarta Selatan, Indonesia',
      education: 'Master of Business Administration (MBA)',
      other: 'Highly values enterprise security, direct data-backed guarantees, and robust service service-level agreements (SLAs).'
    },
    finances: {
      jobTitle: 'Chief Operating Officer (COO)',
      income: 'Rp 45.000.000 - Rp 75.000.000 / Month',
      company: 'PT Mega Retail Nusa (Enterprise Retail Group)',
      skill: 'Performance Marketing, Team Scaling, Enterprise Resource Planning (ERP), Data Analytics'
    },
    dailyLife: {
      morning: 'Reviews operational dashboards, holds high-level team alignment syncs, and reads regional market forecast reports.',
      afternoon: 'Approves marketing budget allocations, meets with CRM partners, and evaluates customer acquisition cost (CAC) metrics.',
      night: 'Reads technical automation blogs, reviews dashboard analytics on iPad, and plans executive next-quarter directives.'
    },
    onlineBehaviors: [
      'Actively reads LinkedIn operational articles & corporate case studies',
      'Subscribes to Tech in Asia, McKinsey Insights, and Harvard Business Review',
      'Monitors competitor commercial announcements via industry news portals'
    ],
    influences: [
      'Enterprise tech summits, retail transformation webinars, and peer recommendations',
      'Detailed case studies representing real Rp 10B+ revenue reactivation successes',
      'Consults trusted CTO advisors and independent systems integration experts'
    ],
    brandAffinities: ['Apple Ecosystem', 'Salesforce Enterprise', 'McKinsey Hub', 'Slack Pro'],
    hopesDreams: [
      'Reduce overall CRM customer churn by 18% in next two quarters',
      'Automate repeat transaction cohorts with loyalty programs to maximize LTV',
      'Convert loose marketing contacts into structured active opportunity pipelines'
    ],
    worriesFears: [
      'Customer data leaks damaging enterprise brand trust levels',
      'High cost of net-new customer acquisition (CAC) draining operational budget margins',
      'CRM integration software failures disrupting live point-of-sale systems'
    ],
    makeLifeEasier: [
      'A secure omnichannel dashboard integrating POS, WA, and loyalty triggers',
      'Pre-built database reactivation blueprints with instant ROI math output',
      'SLA-backed systems integration with 24/7 dedicated local corporate support'
    ]
  });

  const [personaListInputs, setPersonaListInputs] = useState({
    onlineBehaviors: '',
    influences: '',
    brandAffinities: '',
    hopesDreams: '',
    worriesFears: '',
    makeLifeEasier: ''
  });

  const handlePersonaInputChange = (category: string, field: string, value: string) => {
    if (category === 'root') {
      setPersonaData(prev => ({ ...prev, [field]: value }));
    } else {
      setPersonaData(prev => ({
        ...prev,
        [category]: {
          ...(prev[category as keyof PersonaData] as object),
          [field]: value
        }
      }));
    }
  };

  const handlePersonaListInputChange = (field: string, value: string) => {
    setPersonaListInputs(prev => ({ ...prev, [field]: value }));
  };

  const addPersonaListItem = (field: keyof typeof personaListInputs) => {
    const textVal = personaListInputs[field].trim();
    if (textVal !== '') {
      setPersonaData(prev => {
        const currentList = prev[field] as string[];
        return {
          ...prev,
          [field]: [...currentList, textVal]
        };
      });
      setPersonaListInputs(prev => ({ ...prev, [field]: '' }));
      notifyCalculation();
    }
  };

  const removePersonaListItem = (field: keyof typeof personaListInputs, indexToRemove: number) => {
    setPersonaData(prev => {
      const currentList = prev[field] as string[];
      return {
        ...prev,
        [field]: currentList.filter((_, idx) => idx !== indexToRemove)
      };
    });
    notifyCalculation();
  };

  const handlePersonaKeyPress = (e: React.KeyboardEvent, field: keyof typeof personaListInputs) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPersonaListItem(field);
    }
  };

  const handleRandomizePersonaName = () => {
    const randomName = indonesianNames[Math.floor(Math.random() * indonesianNames.length)];
    handlePersonaInputChange('root', 'customerName', randomName);
  };

  const handleGeneratePersonaPrompt = () => {
    const buildList = (arr: string[]) => arr.length > 0 ? arr.map(i => `  • ${i}`).join('\n') : '  • (Belum ada data)';
    
    const promptText = `Saya sedang menyusun strategi pemasaran untuk bisnis bernama "${personaData.businessName || 'Bisnis Saya'}".
Deskripsi Bisnis: ${personaData.businessDescription || 'Tidak ada penjelasan spesifik.'}

Tolong bantu saya menganalisa target pelanggan berdasarkan Customer Persona berikut:

[PROFIL PELANGGAN]
Nama: ${personaData.customerName || 'Pelanggan'} (${personaGender === 'male' ? 'Pria' : 'Wanita'}, ${personaData.demographics.age || '-'})
Status: ${personaData.demographics.maritalStatus || '-'}
Lokasi: ${personaData.demographics.location || '-'}
Pendidikan: ${personaData.demographics.education || '-'}

[PEKERJAAN & KEUANGAN]
Peran: ${personaData.finances.jobTitle || '-'} di ${personaData.finances.company || '-'}
Pendapatan: ${personaData.finances.income || '-'}
Keahlian: ${personaData.finances.skill || '-'}

[PSIKOGRAFIS]
Harapan & Impian:
${buildList(personaData.hopesDreams)}
Kekhawatiran:
${buildList(personaData.worriesFears)}
Solusi yang diharapkan:
${buildList(personaData.makeLifeEasier)}

[PERILAKU]
Perilaku Online:
${buildList(personaData.onlineBehaviors)}
Pengaruh/Influences:
${buildList(personaData.influences)}
Merek disukai: ${personaData.brandAffinities.length > 0 ? personaData.brandAffinities.join(', ') : '-'}

INSTRUKSI ANALISA:
Berikan analisa strategis, elegan, dan *actionable* mengenai:
1. Gaya Komunikasi: Pendekatan pesan yang paling beresonansi.
2. Strategi Konversi: Taktik memenangkan kepercayaan mereka.
3. Inovasi Solusi: Rekomendasi produk/layanan yang paling relevan.
4. Customer Experience: Titik sentuh (touchpoints) krusial untuk menciptakan loyalitas.`;

    setPersonaPrompt(promptText);
    setPersonaModalOpen(true);
    setPersonaCopySuccess(false);
  };

  const handleCopyPersonaPrompt = () => {
    navigator.clipboard.writeText(personaPrompt);
    setPersonaCopySuccess(true);
    setTimeout(() => setPersonaCopySuccess(false), 2000);
  };

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const alertCopyStatus = (toolName: string) => {
    setCopiedText(`Strategic ${toolName} prompt copied to clipboard! Paste it into your choice AI platform.`);
    setTimeout(() => setCopiedText(null), 3000);
  };

  const copyPipelineAiPrompt = () => {
    let dealStr = "";
    deals.forEach(d => {
      dealStr += `- Deal: **${d.dealName}** | Stage: ${d.stage} | Value: Rp ${d.value.toLocaleString('id-ID')} | Probability: ${d.probability}%\n`;
    });
    const prompt = `I am using a CRM Pipeline Strategic Forecast tool. Here is my current sales pipeline:

### Current Deals:
${dealStr || "No deals configured in the pipeline."}

* Total Pipeline Value: Rp ${totalValue.toLocaleString('id-ID')}
* Expected Weighted Value: Rp ${expectedValue.toLocaleString('id-ID')}

Act as an expert CRM Sales Director & Sales Enablement Strategist. Review my sales pipeline and help me:
1. Identify velocity risks and potential bottlenecks in the stages (Qualification, Proposal, Negotiation, Decision).
2. Recommend 3 concrete tactical actions or follow-up playbook procedures for our high-value deals to increase their win probability.
3. Design a CRM dashboard sequence layout or telemetry checklist we should build to track the momentum of these active deals.
4. Suggest a targeted sales training coaching topic for the sales team based on the weighted probabilities of this pipeline.`;
    navigator.clipboard.writeText(prompt).then(() => {
      alertCopyStatus("Pipeline Forecast");
    });
  };

  const copyClvAiPrompt = () => {
    const prompt = `I am using an Account Customer Lifetime Value (CLV) Life Cycle Simulator. Here are my current unit economics and customer parameters:

* Average Order Value (AOV) / Average Contract Value: Rp ${purchaseValue.toLocaleString('id-ID')}
* Annual Purchase Frequency: ${frequency} transactions/year
* Customer Lifespan: ${lifespan} years
* Gross Profit Margin: ${margin}%
* Annual Revenue per Account: Rp ${annualRevenue.toLocaleString('id-ID')}
* Raw Lifetime Value (LTV): Rp ${rawCLV.toLocaleString('id-ID')}
* Margin LTV (Gross Margin CLV): Rp ${marginCLV.toLocaleString('id-ID')}
* Maximum Recommended CAC (1:3 Golden Ratio): Rp ${maxCAC.toLocaleString('id-ID')}

Act as an expert Chief Marketing Officer and Unit Economics Advisor. Review my customer lifetime values and CAC targets, then:
1. Provide a comprehensive critique of this unit economic formula. Is the max CAC target of Rp ${maxCAC.toLocaleString('id-ID')} realistic or too aggressive for digital acquisition channels?
2. Propose 3 high-impact customer retention and loyalty programs to increase the Annual Purchase Frequency past ${frequency} times per year.
3. Suggest 2 cross-sell or up-sell strategies to raise our Average Order Value from Rp ${purchaseValue.toLocaleString('id-ID')} to a higher bracket.
4. Draft a checklist of onboarding campaigns or milestones (e.g. at Day 30, Day 90) designed to extend the customer lifespan from ${lifespan} years to 5+ years.`;
    navigator.clipboard.writeText(prompt).then(() => {
      alertCopyStatus("Customer Lifetime Value");
    });
  };

  const copyLeadScoreAiPrompt = () => {
    const prompt = `I am using a BANT (Budget, Authority, Need, Timeline) Lead Scoring Matrix tool. Here is the BANT configuration of my current prospect:

* Budget Score: ${budgetScore} / 30 pts
* Authority Score: ${authorityScore} / 30 pts
* Need Score: ${needScore} / 20 pts
* Timeline Score: ${timelineScore} / 20 pts
* Total Lead Score: ${totalLeadScore} / 100 pts

Act as an expert Inside Sales Director and CRM Lead Nurturing Consultant. Review this BANT lead state and:
1. Provide an objective evaluation of the prospect's priority. What is the sales readiness class (e.g. Hot, Warm, Cold) and follow-up timeline for a lead with a BANT score of ${totalLeadScore}/100?
2. Create 3 personalized qualifying questions or AE instructions to ask in the next call to unpack the gaps in the lowest scoring categories.
3. Outline a CRM nurturing cadence flow (email + phone triggers) tailored specifically for this prospect's scores.
4. Draft a direct, elegant LinkedIn outreach template or email template we can send to build further trust.`;
    navigator.clipboard.writeText(prompt).then(() => {
      alertCopyStatus("BANT Lead Score");
    });
  };

  const copyHunterFarmerAiPrompt = () => {
    const hunterPct = 100 - percentageFarmer;
    const farmerPct = percentageFarmer;
    const prompt = `I am using a CRM Hunter vs. Farmer Assessment Matrix to align my sales team roles. Here is the alignment breakdown for my assessment:

* Farmer Alignment Index: ${farmerPct}%
* Hunter Alignment Index: ${hunterPct}%
* Classification: ${farmerPct > 53 ? 'Farmer Heavy (Account Development & Care focus)' : hunterPct > 53 ? 'Hunter Heavy (Net-New Acquisition focus)' : 'Hybrid Balanced'}

Act as an expert Sales Force Architect and CRM Sales Consultant. Analyze this alignment profile and help me:
1. Define the ideal job description, daily workflow, and monthly goals for a salesperson with this ${farmerPct}% Farmer vs ${hunterPct}% Hunter profile.
2. Outline the exact CRM layout changes, pipeline boards, and automated reminders we must configure to empower this persona.
3. Propose a balanced commission and bonus compensation model that matches their natural strengths.
4. Suggest weekly progress coaching questions the sales manager can ask to keep them highly motivated.`;
    navigator.clipboard.writeText(prompt).then(() => {
      alertCopyStatus("Hunter vs. Farmer Assessment");
    });
  };

  const copyDbReactivationAiPrompt = () => {
    const prompt = `I am using a Dormant Database ROI Reactivation Calculator. Here is my current opportunity database:

* Inactive/Dormant Contacts Size: ${inactiveContacts.toLocaleString('id-ID')} entries
* Average Order Value (AOV): Rp ${dormantAov.toLocaleString('id-ID')}
* Standard Customer Acquisition Cost (CAC): Rp ${dormantCac.toLocaleString('id-ID')}
* Targeted Reactivation Conversion Rate: ${dormantConversion}%
* Potential Recovered Revenue: Rp ${potentialLostRevenue.toLocaleString('id-ID')}
* Estimated Reactivated Customers count: ${activatedDormantCustomers.toLocaleString('id-ID')} customers
* Campaign Realization: "${dormantRealityMessage}"

Act as an elite Retention Marketing Manager and CRM Customer Data Platform (CDP) Specialist. Review this reactivation model and:
1. Propose 3 detailed segment criteria (e.g. Last active 90-180 days, cart abandoners, previous high spenders) to split this inactive list into prioritized cohorts.
2. Outline a creative, highly personalized reactivation messaging sequence (e.g. Email (Subject + body outline) + Whatsapp trigger sequence) that feels helpful and non-spammy.
3. Suggest a reactivation incentive strategy (discount vs free gift vs exclusive early-access) that maintains profit margins.
4. Draft the CRM orchestration rules and webhooks we should set up to automatically trigger this campaign if a customer is inactive for too long.`;
    navigator.clipboard.writeText(prompt).then(() => {
      alertCopyStatus("Database Reactivation");
    });
  };

  const copyPersonaBuilderAiPrompt = () => {
    const prompt = `I have designed an Ideal Customer Profile (ICP) & Persona in my CRM system. Here are the core specifications of the business and the target buyer persona:

### Business Context:
* Business/Product Name: "${personaData.businessName}"
* Description: "${personaData.businessDescription}"

### Buyer Persona Identity:
* Persona Name: "${personaData.customerName}"
* Title: "${personaData.finances.jobTitle}" at "${personaData.finances.company}"
* Monthly Income bracket: ${personaData.finances.income}
* Demographics: Age: ${personaData.demographics.age} | Marital: ${personaData.demographics.maritalStatus} | Location: ${personaData.demographics.location}
* Financial Details: Primary Skill: ${personaData.finances.skill}

### Daily Life & Habits:
* Morning: ${personaData.dailyLife.morning}
* Afternoon: ${personaData.dailyLife.afternoon}
* Night: ${personaData.dailyLife.night}

### Primary Motives:
* Hopes & Dreams:
${personaData.hopesDreams.map(h => `- ${h}`).join('\n')}
* Worries & Fears:
${personaData.worriesFears.map(w => `- ${w}`).join('\n')}
* Brand Affinities: ${personaData.brandAffinities.join(', ')}

Act as an expert Product Marketing Director and senior CRM Strategy advisor. Analyze this persona profile and:
1. Formulate 3 distinct lead-generation campaign concepts tailored specifically to attract ${personaData.customerName} based on their hopes/fears.
2. Outline a 3-part CRM email sequence to build trust with this buyer. Include recommendations for high-impact Subject Lines that target their core worry of: "${personaData.worriesFears[0]}".
3. Propose the optimal CRM lifecycle stages (eg. Subscriber -> SQL -> AE Demo -> Champion) and touchpoint channels (LinkedIn, WhatsApp, Email, Call) to engage them throughout their decision journey.
4. Draft a custom 150-word elevator pitch speaking directly to this buyer that addresses their daily routines.`;

    navigator.clipboard.writeText(prompt).then(() => {
      alertCopyStatus("ICP & Persona Builder");
    });
  };

  const currentProfileResult = getHunterFarmerProfile(percentageHunter);

  const formatRp = (num: number) => {
    return 'Rp ' + Math.round(num).toLocaleString('id-ID');
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 text-left max-w-7xl mx-auto font-sans select-none">
      
      {/* ----------------------------------------------------
          CATALOG LEVEL VIEW (Always shown if selectedToolId is null)
         ---------------------------------------------------- */}
      {selectedToolId === null ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Section Header */}
          <div className="border-b border-slate-200/60 pb-6">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-600">
                <Calculator className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                CRM Architecture Suite
              </span>
            </div>
            <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              CRM Architectural Modeling Tools
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-3xl leading-relaxed">
              Interact with functional simulation formulas to analyze expected win-rates, model Customer Lifetime Value (LTV) limits, qualify prospect pipeline, and calculate reactivation ROI.
            </p>
          </div>

          {/* Interactive Tools Directory (The Grid Menu) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                Functional Tool Catalog (6 tools ready for deployment)
              </span>
              <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded-md">
                6 Interactive, 3 Roadmap
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1: Bain 30 Elements CRM Brainstormer */}
              <button
                type="button"
                onClick={() => {
                  setSelectedToolId('bainElements');
                  notifyCalculation();
                }}
                className="group p-6 rounded-2xl border border-slate-200 bg-white text-left transition-all hover:border-indigo-500 hover:shadow-md cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                     <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      <Layers className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-indigo-50 text-indigo-800 border-indigo-100">
                      Value Matrix
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                    Bain 30 Elements CRM Board
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed animate-fadeIn">
                    Peta interaktif 30 elemen nilai (Bain & Company) yang dirancang untuk analisis loyalitas, program benefit pelanggan, dan optimalisasi retensi CRM.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Interactive workspace</span>
                  <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                    Buka Workspace <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </button>

              {/* Card 2: CRM Customer Journey Builder */}
              <button
                type="button"
                onClick={() => {
                  setSelectedToolId('journeyBuilder');
                  notifyCalculation();
                }}
                className="group p-6 rounded-2xl border border-slate-200 bg-white text-left transition-all hover:border-indigo-500 hover:shadow-md cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      <GitFork className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-indigo-50 text-indigo-800 border-indigo-100">
                      Customer Flow
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                    CRM Journey Builder
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed hover:text-slate-600 transition-colors">
                    Visualisasikan alur pemicu, keputusan, tindakan, dan jeda pengiriman pesan berbasis interaksi pelanggan secara modular dan dinamis.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Drag & Drop Interactive Flow</span>
                  <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                    Buka Workspace <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </button>

              {/* Card 3: CRM Schema & RFM Designer */}
              <button
                type="button"
                onClick={() => {
                  setSelectedToolId('schemaDesigner');
                  notifyCalculation();
                }}
                className="group p-6 rounded-2xl border border-slate-200 bg-white text-left transition-all hover:border-indigo-500 hover:shadow-md cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      <Database className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-indigo-50 text-indigo-800 border-indigo-100">
                      Schema Designer
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                    CRM Schema & RFM Designer
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed hover:text-slate-600 transition-colors">
                    Rancang kolom database kustom, kustomisasikan logika skor parameter RFM, dan unduh template Sheet berselimut relasi rumus otomatis.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Excel / Google Sheets Formulator</span>
                  <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                    Buka Workspace <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </button>

              {/* Card 4: Database Reactivation ROI Calculator */}
              <button
                type="button"
                onClick={() => {
                  setSelectedToolId('dbReactivation');
                  notifyCalculation();
                }}
                className="group p-6 rounded-2xl border border-slate-200 bg-white text-left transition-all hover:border-cyan-500 hover:shadow-md cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-500 group-hover:text-white transition-colors">
                      <Database className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-rose-50 text-rose-800 border-rose-100">
                      Reactivation ROI
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-slate-900 text-base group-hover:text-rose-600 transition-colors">
                    Dormant Database ROI Calculator
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Quantify leaking dormant customer values, estimate reactivation target rates, and evaluate direct marketing yield vs new acquisition costs.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Dormant Pool: {inactiveContacts.toLocaleString('id-ID')} Leads</span>
                  <span className="text-rose-600 font-bold flex items-center gap-0.5">
                    Open Suite <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </button>

              {/* Card 5: Hunter vs. Farmer Assessment Matrix */}
              <button
                type="button"
                onClick={() => {
                  setSelectedToolId('hunterFarmer');
                  notifyCalculation();
                }}
                className="group p-6 rounded-2xl border border-slate-200 bg-white text-left transition-all hover:border-cyan-500 hover:shadow-md cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <Crosshair className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-blue-50 text-blue-800 border-blue-100">
                      Strategy Quiz
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                    Hunter vs. Farmer Assessment Matrix
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Evaluate operational balances between outbound marketing acquisitions and retention-based lifetime revenue loops with actionable playbooks.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Progress: {answeredQuizCount}/8 Questions</span>
                  <span className="text-blue-600 font-bold flex items-center gap-0.5">
                    Open Suite <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </button>

              {/* Card 6: ICP & Customer Persona Builder */}
              <button
                type="button"
                onClick={() => {
                  setSelectedToolId('personaBuilder');
                  notifyCalculation();
                }}
                className="group p-6 rounded-2xl border border-slate-200 bg-white text-left transition-all hover:border-cyan-500 hover:shadow-md cursor-pointer flex flex-col justify-between relative overflow-hidden animate-fadeIn"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      <UserCircle className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-indigo-50 text-indigo-800 border-indigo-100">
                      ICP Persona
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                    ICP & Customer Persona Builder
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Build and export precise Ideal Customer Profiles (ICPs) with standard industry metrics and generate copy-paste prompts for AI validation.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Representative: {personaData.customerName}</span>
                  <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                    Open Suite <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </button>

              {/* Layout Extensibility Placeholders (Scale-ready Design) */}
              <div className="p-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col justify-between opacity-70">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-slate-100 text-slate-400 rounded-xl">
                      <Percent className="h-5 w-5" />
                    </div>
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border bg-slate-100 text-slate-500">
                      Scaling Model
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-slate-700 text-sm">
                    Conversion Rate Optimization
                  </h4>
                  <p className="text-[11px] text-slate-450 text-slate-400 mt-1 leading-relaxed">
                    Simulate deal leakage across standard funnel transition gates to address sales process bottlenecks.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] font-mono text-slate-400 italic">
                  Database roadmap integration
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col justify-between opacity-70">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-slate-100 text-slate-400 rounded-xl">
                      <TrendingDown className="h-5 w-5" />
                    </div>
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border bg-slate-100 text-slate-500">
                      Scaling Model
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-slate-700 text-sm">
                    Churn Risk Cohort Analysis
                  </h4>
                  <p className="text-[11px] text-slate-450 text-slate-400 mt-1 leading-relaxed">
                    Model accounts relative to usage frequency drop-offs and contract SLA expiration trends to flag operational risk.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] font-mono text-slate-400 italic">
                  Database roadmap integration
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col justify-between opacity-70">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-slate-100 text-slate-400 rounded-xl">
                      <Activity className="h-5 w-5" />
                    </div>
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border bg-slate-100 text-slate-500">
                      Scaling Model
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-slate-700 text-sm">
                    Sales Velocity Calculator
                  </h4>
                  <p className="text-[11px] text-slate-450 text-slate-400 mt-1 leading-relaxed">
                    Verify overall pipeline output speed based on average sales cycles, active deal volumes, and win-rate counts.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] font-mono text-slate-400 italic">
                  Database roadmap integration
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* ----------------------------------------------------
            DEDICATED TOOL VIEW (Shown when a tool is selected)
           ---------------------------------------------------- */
        <div className="space-y-6 animate-fadeIn">
          
          {/* Back button and Tool Identification */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedToolId(null)}
                className="p-2 hover:bg-slate-200/60 active:bg-slate-300/60 rounded-xl text-slate-600 transition-colors cursor-pointer flex items-center justify-center border border-slate-200 bg-white"
                title="Back to Catalog"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold text-cyan-600 uppercase tracking-widest bg-cyan-50 px-2 py-0.5 rounded">
                    CRM Master Asset
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                    Interactive Formula Sandbox
                  </span>
                </div>
                <h2 className="font-display text-xl font-black text-slate-900 mt-0.5">
                  {selectedToolId === 'bainElements' && "Bain 30 Elements of Value CRM Brainstormer"}
                  {selectedToolId === 'journeyBuilder' && "CRM Journey Builder"}
                  {selectedToolId === 'schemaDesigner' && "CRM Schema & RFM Designer"}
                  {selectedToolId === 'pipeline' && "Pipeline Forecast Model"}
                  {selectedToolId === 'clv' && "Customer Lifetime Value Simulator"}
                  {selectedToolId === 'leadScore' && "BANT Lead Scoring Matrix"}
                  {selectedToolId === 'dbReactivation' && "Dormant Database ROI Calculator"}
                  {selectedToolId === 'hunterFarmer' && "Hunter vs. Farmer Assessment Matrix"}
                  {selectedToolId === 'personaBuilder' && "Ideal Customer Profile (ICP) & Persona Builder"}
                </h2>
              </div>
            </div>

            <button
              onClick={() => setSelectedToolId(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              Back to Catalog Directory Directory
            </button>
          </div>

          {/* ----------------------------------------------------
              WORK AREA FOR BAIN ELEMENTS TOOL
             ---------------------------------------------------- */}
          {selectedToolId === 'bainElements' && (
            <BainElementsTool onCalculateRun={notifyCalculation} />
          )}

          {/* ----------------------------------------------------
              WORK AREA FOR CRM JOURNEY BUILDER TOOL
             ---------------------------------------------------- */}
          {selectedToolId === 'journeyBuilder' && (
            <CrmJourneyBuilderTool onCalculateRun={notifyCalculation} />
          )}

          {/* ----------------------------------------------------
              WORK AREA FOR CRM SCHEMA & RFM DESIGNER TOOL
             ---------------------------------------------------- */}
          {selectedToolId === 'schemaDesigner' && (
            <CrmSchemaDesignerTool onCalculateRun={notifyCalculation} />
          )}

          {/* ----------------------------------------------------
              WORK AREA FOR PIPELINE TOOL
             ---------------------------------------------------- */}
          {selectedToolId === 'pipeline' && (
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Opportunities workspace list */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
                  <h3 className="font-display font-extrabold text-base text-slate-900 mb-6 flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <span>Opportunity Pipeline Management Workspace</span>
                    <button
                      type="button"
                      onClick={copyPipelineAiPrompt}
                      className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-white leading-none font-bold text-[10px] rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer animate-pulse shrink-0 uppercase tracking-wider"
                      title="Analyze this pipeline with AI"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Analyze with AI
                    </button>
                  </h3>

                  {/* Add deal inline component */}
                  <form onSubmit={handleAddDeal} className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Deal / Account Name</label>
                      <input
                        type="text"
                        required
                        value={newDealName}
                        onChange={(e) => setNewDealName(e.target.value)}
                        placeholder="e.g. PT Telekom Enterprise System Integration"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans"
                      />
                    </div>

                    <div className="w-44">
                      <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Estimated Deal Value (Rp)</label>
                      <input
                        type="number"
                        min="1000000"
                        max="1000000000"
                        step="1000000"
                        value={newDealValue}
                        onChange={(e) => setNewDealValue(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-850 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                      />
                    </div>

                    <div className="w-52 font-sans text-xs">
                      <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Initial Sales Stage</label>
                      <select
                        value={newDealStage}
                        onChange={(e) => setNewDealStage(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      >
                        <option value="qualification">Qualification (15%)</option>
                        <option value="proposal">Proposal Demo (45%)</option>
                        <option value="negotiation">Contract Negotiation (75%)</option>
                        <option value="decision">Verbal Agreement (90%)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 shrink-0 font-sans transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Opportunity
                    </button>
                  </form>

                  {/* Deals table */}
                  <div className="space-y-3">
                    <span className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Active Pipeline Matrix ({deals.length})</span>
                    {deals.length > 0 ? (
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                        {deals.map(d => (
                          <div key={d.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                            <div className="min-w-0">
                              <span className="block text-xs font-bold text-slate-850 truncate">{d.dealName}</span>
                              <span className="block text-[10px] font-mono text-slate-400 mt-0.5">Base Value: {formatRp(d.value)}</span>
                            </div>

                            <div className="flex items-center gap-4">
                              {/* Stage update dropdown */}
                              <div>
                                <select
                                  value={d.stage}
                                  onChange={(e) => handleStageChange(d.id, e.target.value as any)}
                                  className="bg-slate-100 hover:bg-slate-200/80 border border-transparent hover:border-slate-300 rounded px-2.5 py-1 text-[10px] font-bold text-slate-700 focus:outline-none cursor-pointer"
                                >
                                  <option value="qualification">Qualification (15%)</option>
                                  <option value="proposal">Proposal Demo (45%)</option>
                                  <option value="negotiation">Contract Negotiation (75%)</option>
                                  <option value="decision">Verbal Agreement (90%)</option>
                                </select>
                              </div>

                              {/* Math output */}
                              <div className="text-right w-36">
                                <span className="block text-xs font-bold text-slate-800 font-mono">{formatRp(d.value * (d.probability / 100))}</span>
                                <span className="block text-[9px] text-slate-400 font-mono tracking-wide uppercase">Weighted ({d.probability}%)</span>
                              </div>

                              <button
                                onClick={() => handleRemoveDeal(d.id)}
                                className="p-1 px-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                                title="Remove opportunity"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-205">
                        <AlertTriangle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                        <span className="block text-xs text-slate-600 font-medium">No opportunities listed in current modeling canvas</span>
                        <button 
                          type="button"
                          onClick={() => setDeals([{ id: 'mock', dealName: 'Sample Deal PT Incentric Digital', stage: 'proposal', value: 150000000, probability: 45 }])}
                          className="text-[10px] text-cyan-600 hover:underline mt-1 cursor-pointer font-bold font-sans"
                        >
                          Load sample demo data
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Calculations forecast sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-lg">
                  <h4 className="font-display text-xs font-bold tracking-widest text-cyan-400 mb-6 uppercase">Revenue Realization Math</h4>

                  <div className="space-y-6">
                    <div>
                      <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">Gross Pipeline Exposure</span>
                      <span className="text-2xl font-extrabold font-display text-white mt-1 block font-mono">{formatRp(totalValue)}</span>
                      <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                        The cumulative total gross value from all deals currently tracked in the workspace prior to probability weighting.
                      </p>
                    </div>

                    <div className="border-t border-slate-800 pt-6">
                      <span className="block text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Weighted Forecast Output</span>
                      <span className="text-2.5xl font-extrabold font-display text-cyan-300 mt-1 block font-mono">{formatRp(expectedValue)}</span>
                      <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                        Adjusted mathematical forecast, assigning win probability weights based strictly on current sales stages.
                      </p>
                    </div>

                    {deals.length > 0 && (
                      <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 text-slate-300 space-y-2 text-[11px] leading-relaxed">
                        <div className="flex gap-2">
                          <Sparkles className="h-4.5 w-4.5 shrink-0 text-cyan-400 mt-0.5" />
                          <span>
                            <strong>Strategic Insight:</strong> Your pipeline yields an average realization rating of <strong>{Math.round((expectedValue / (totalValue || 1)) * 105 - 5)}%</strong>. Systematically transitioning accounts from initial proposal demo reviews to contract negotiations drives predictable realization.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">Model Guidelines</h4>
                  <ul className="text-xs text-slate-500 space-y-2 list-disc list-inside">
                    <li>Probability is standard default CRM values</li>
                    <li>Qualification: 15% probability</li>
                    <li>Proposal Demo: 45% probability</li>
                    <li>Contract Negotiation: 75% probability</li>
                    <li>Verbal Agreement: 90% probability</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------
              WORK AREA FOR CLV Simulator TOOL
             ---------------------------------------------------- */}
          {selectedToolId === 'clv' && (
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Sliders Input Work Area */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-8">
                <h3 className="font-display font-extrabold text-base text-slate-900 border-b border-slate-100 pb-4 flex items-center justify-between gap-2">
                  <span>Account Lifecycle Simulator Inputs</span>
                  <button
                    type="button"
                    onClick={copyClvAiPrompt}
                    className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-white leading-none font-bold text-[10px] rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer animate-pulse shrink-0 uppercase tracking-wider"
                    title="Analyze customer lifetime value with AI"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Analyze with AI
                  </button>
                </h3>

                {/* Slider 1: Average Order value */}
                <div className="space-y-20">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">Average Contract Value (ACV) / Average Order Value (AOV)</span>
                      <span className="font-mono font-bold text-cyan-600 bg-cyan-50 px-2.5 py-0.5 rounded">{formatRp(purchaseValue)}</span>
                    </div>
                    <input
                      type="range"
                      min="100000"
                      max="50000000"
                      step="100000"
                      value={purchaseValue}
                      onChange={(e) => setPurchaseValue(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg cursor-pointer accent-cyan-600"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>Commodity standard ({formatRp(100000)})</span>
                      <span>High Premium Enterprise Ticket ({formatRp(50000000)})</span>
                    </div>
                  </div>

                  {/* Slider 2: Purchase frequency */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">Annual Retention Transaction Frequency</span>
                      <span className="font-mono font-bold text-cyan-600 bg-cyan-50 px-2.5 py-0.5 rounded">{frequency} purchases / year</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="52"
                      step="1"
                      value={frequency}
                      onChange={(e) => setFrequency(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg cursor-pointer accent-cyan-600"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>1 Transaction / Year</span>
                      <span>52 Transactions (High-touch Weekly Iterations)</span>
                    </div>
                  </div>

                  {/* Slider 3: Lifespan duration */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">Estimated Customer Lifespan Duration (Years)</span>
                      <span className="font-mono font-bold text-cyan-600 bg-cyan-50 px-2.5 py-0.5 rounded">{lifespan} Years</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={lifespan}
                      onChange={(e) => setLifespan(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg cursor-pointer accent-cyan-600"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>1 Year high-churn threat</span>
                      <span>20 Years highly retained contract partner</span>
                    </div>
                  </div>

                  {/* Slider 4: Profit Margin */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">Company Net Profit Margin Coefficient</span>
                      <span className="font-mono font-bold text-cyan-600 bg-cyan-50 px-2.5 py-0.5 rounded">{margin}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={margin}
                      onChange={(e) => setMargin(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg cursor-pointer accent-cyan-600"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>10% Low-Margin Operations</span>
                      <span>100% Zero-Marginal-Cost Consulting / Digital SaaS Code</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* LTV & CAC Golden calculations output workspace */}
              <div className="lg:col-span-4 bg-slate-900 rounded-2xl text-white p-6 shadow-xl space-y-6">
                <h4 className="font-display text-xs font-bold tracking-widest text-cyan-400 uppercase">Customer Lifetime Value Math</h4>
                
                <div className="space-y-6 font-sans">
                  <div>
                    <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">Annual Revenue Yield</span>
                    <span className="text-2xl font-extrabold font-display font-mono text-white mt-1 block">{formatRp(annualRevenue)} <span className="text-xs font-normal text-slate-400">/ yr</span></span>
                  </div>

                  <div className="border-t border-slate-800 pt-6">
                    <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">Gross Lifetime Revenue</span>
                    <span className="text-xl font-bold font-display font-mono text-slate-300 mt-1 block">{formatRp(rawCLV)}</span>
                  </div>

                  <div className="border-t border-slate-800 pt-6">
                    <span className="block text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Net Customer Lifetime Value (LTV)</span>
                    <span className="text-2.5xl font-extrabold font-display font-mono text-cyan-300 mt-1 block">{formatRp(marginCLV)}</span>
                    <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed font-mono">
                      Factored with your selected company margin coefficients of {margin}%
                    </p>
                  </div>

                  <div className="border-t border-slate-800 pt-6 bg-cyan-950/20 p-4 rounded-xl border border-cyan-900/30">
                    <span className="block text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Maximum Customer Acquisition Cost (CAC Target)
                    </span>
                    <span className="text-2xl font-extrabold font-display font-mono text-emerald-300 mt-1 block">{formatRp(maxCAC)}</span>
                    <p className="text-[9.5px] text-emerald-400/80 mt-2 leading-relaxed">
                      Calculated on the standard corporate golden ratio of <strong>3:1 LTV-to-CAC</strong>. Spending above this acquisition ceiling threatens aggregate growth viability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------
              WORK AREA FOR BANT LEAD SCORE MATRIX
             ---------------------------------------------------- */}
          {selectedToolId === 'leadScore' && (
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Questionnaire assessment workspace */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                <h3 className="font-display font-bold text-base text-slate-900 border-b border-slate-100 pb-4 flex items-center justify-between gap-2">
                  <span>Prospect Standard BANT Scoring Interface</span>
                  <button
                    type="button"
                    onClick={copyLeadScoreAiPrompt}
                    className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-white leading-none font-bold text-[10px] rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer animate-pulse shrink-0 uppercase tracking-wider"
                    title="Analyze BANT prospect scorecard with AI"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Analyze with AI
                  </button>
                </h3>

                <div className="space-y-6">
                  {/* Parameter 1: Budget */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs items-center">
                      <div>
                        <span className="font-bold text-slate-800 block">1. BUDGET ASSESSMENT (Max 30 pts)</span>
                        <span className="text-slate-400 text-[10.5px] block font-normal">Check the financial resource allocation levels currently present on the prospect side.</span>
                      </div>
                      <span className="font-mono bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded">{budgetScore} pt</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-sans">
                      <button
                        type="button"
                        onClick={() => setBudgetScore(0)}
                        className={`p-3 text-[10.5px] font-semibold border rounded-xl cursor-pointer text-left ${budgetScore === 0 ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <span className="block font-bold">Unallocated (0 pts)</span>
                        <span className="block text-[9.5px] opacity-80 font-normal mt-0.5">Prospect has zero budget mapped</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBudgetScore(15)}
                        className={`p-3 text-[10.5px] font-semibold border rounded-xl cursor-pointer text-left ${budgetScore === 15 ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <span className="block font-bold">Flexible/Partial (15 pts)</span>
                        <span className="block text-[9.5px] opacity-80 font-normal mt-0.5">Budget can be adjusted mid-cycle</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBudgetScore(30)}
                        className={`p-3 text-[10.5px] font-semibold border rounded-xl cursor-pointer text-left ${budgetScore === 30 ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <span className="block font-bold">Fully Approved (30 pts)</span>
                        <span className="block text-[9.5px] opacity-80 font-normal mt-0.5">Corporate board pre-approved SLA</span>
                      </button>
                    </div>
                  </div>

                  {/* Parameter 2: Authority */}
                  <div className="space-y-3 border-t border-slate-100 pt-5">
                    <div className="flex justify-between text-xs items-center">
                      <div>
                        <span className="font-bold text-slate-800 block">2. AUTHORITY LEVEL (Max 30 pts)</span>
                        <span className="text-slate-400 text-[10.5px] block font-normal">Check the direct corporate influence matrix of the primary contact person.</span>
                      </div>
                      <span className="font-mono bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded">{authorityScore} pt</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-sans">
                      <button
                        type="button"
                        onClick={() => setAuthorityScore(0)}
                        className={`p-3 text-[10.5px] font-semibold border rounded-xl cursor-pointer text-left ${authorityScore === 0 ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <span className="block font-bold">Individual Contributor (0 pts)</span>
                        <span className="block text-[9.5px] opacity-80 font-normal mt-0.5">User level, needs external approvals</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthorityScore(15)}
                        className={`p-3 text-[10.5px] font-semibold border rounded-xl cursor-pointer text-left ${authorityScore === 15 ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <span className="block font-bold">Key Evaluator / Mgr (15 pts)</span>
                        <span className="block text-[9.5px] opacity-80 font-normal mt-0.5">Influences internal budget loops</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthorityScore(30)}
                        className={`p-3 text-[10.5px] font-semibold border rounded-xl cursor-pointer text-left ${authorityScore === 30 ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <span className="block font-bold">CXO / Board Director (30 pts)</span>
                        <span className="block text-[9.5px] opacity-80 font-normal mt-0.5">Full signature release authority</span>
                      </button>
                    </div>
                  </div>

                  {/* Parameter 3: Need */}
                  <div className="space-y-3 border-t border-slate-100 pt-5">
                    <div className="flex justify-between text-xs items-center">
                      <div>
                        <span className="font-bold text-slate-800 block">3. NEED ACUTENESS (Max 20 pts)</span>
                        <span className="text-slate-400 text-[10.5px] block font-normal">Evaluate the urgency of operational challenges the prospect currently handles.</span>
                      </div>
                      <span className="font-mono bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded">{needScore} pt</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-sans">
                      <button
                        type="button"
                        onClick={() => setNeedScore(0)}
                        className={`p-3 text-[10.5px] font-semibold border rounded-xl cursor-pointer text-left ${needScore === 0 ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <span className="block font-bold">Exploratory / Info (0 pts)</span>
                        <span className="block text-[9.5px] opacity-80 font-normal mt-0.5">Casual research, basic benchmarking</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNeedScore(10)}
                        className={`p-3 text-[10.5px] font-semibold border rounded-xl cursor-pointer text-left ${needScore === 10 ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs animate-pulseFast' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <span className="block font-bold">Active Inefficiencies (10 pts)</span>
                        <span className="block text-[9.5px] opacity-80 font-normal mt-0.5">Standard manual workflows slowing growth</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNeedScore(20)}
                        className={`p-3 text-[10.5px] font-semibold border rounded-xl cursor-pointer text-left ${needScore === 20 ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <span className="block font-bold">Critical Bottleneck (20 pts)</span>
                        <span className="block text-[9.5px] opacity-80 font-normal mt-0.5">Existing software crashes, losing leads</span>
                      </button>
                    </div>
                  </div>

                  {/* Parameter 4: Timeline */}
                  <div className="space-y-3 border-t border-slate-100 pt-5">
                    <div className="flex justify-between text-xs items-center">
                      <div>
                        <span className="font-bold text-slate-800 block">4. TIMELINE REALIZATION (Max 20 pts)</span>
                        <span className="text-slate-400 text-[10.5px] block font-normal">Identify the expected window mapped from sign-off to full implementation.</span>
                      </div>
                      <span className="font-mono bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded">{timelineScore} pt</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-sans">
                      <button
                        type="button"
                        onClick={() => setTimelineScore(0)}
                        className={`p-3 text-[10.5px] font-semibold border rounded-xl cursor-pointer text-left ${timelineScore === 0 ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs shadow-black' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <span className="block font-bold">&gt; 6 - 12 Months (0 pts)</span>
                        <span className="block text-[9.5px] opacity-80 font-normal mt-0.5">Long research timeline, future plans</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimelineScore(10)}
                        className={`p-3 text-[10.5px] font-semibold border rounded-xl cursor-pointer text-left ${timelineScore === 10 ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <span className="block font-bold">Current Quarter (10 pts)</span>
                        <span className="block text-[9.5px] opacity-80 font-normal mt-0.5">Wants solutions deployed inside ~90 days</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimelineScore(20)}
                        className={`p-3 text-[10.5px] font-semibold border rounded-xl cursor-pointer text-left ${timelineScore === 20 ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <span className="block font-bold">Immediate &lt; 30 Days (20 pts)</span>
                        <span className="block text-[9.5px] opacity-80 font-normal mt-0.5">High emergency migration required</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* BANT scoring assessment parameters sidebar */}
              <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl text-white p-6 shadow-xl space-y-6 animate-fadeIn font-sans">
                <h4 className="font-display text-xs font-bold tracking-widest text-cyan-400 uppercase">Qualitative Scoring Core</h4>

                <div className="space-y-6">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between">
                    <div>
                      <span className="block text-[9px] font-mono text-slate-450 uppercase tracking-widest text-slate-500">Lead Scoring Index</span>
                      <span className="text-4xl font-extrabold font-display text-white mt-1.5 block font-mono">
                        {totalLeadScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-full ${leadGradeResult.color}`}>
                      {leadGradeResult.label}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-widest font-bold">System SLA Process Routing Directive</span>
                    <p className="text-xs font-bold text-cyan-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-850">
                      {leadGradeResult.action}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-450 block uppercase tracking-widest">BANT Score Distribution</span>
                    <div className="w-full bg-slate-850 h-3 rounded-full overflow-hidden border border-slate-805">
                      <div 
                        className="bg-gradient-to-r from-amber-450 via-orange-500 to-rose-500 h-full rounded-full transition-all duration-300 bg-cyan-400" 
                        style={{ width: `${totalLeadScore}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span>Cold (&lt;35)</span>
                      <span>Warm (&gt;35)</span>
                      <span>Hot (&gt;85)</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-850 rounded-xl text-[11px] text-slate-300 leading-relaxed border border-slate-800">
                    <span>
                      <strong>CRM Workshop Framework:</strong> Budget, Authority, Need, and Timeline coordinates filter operations. Assigning HOT leads immediately limits process leaks, leading to an average pipeline drop decrease of <strong>35%</strong>.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------
              WORK AREA FOR HUNTER VS FARMER ASSESSMENT TOOL
             ---------------------------------------------------- */}
          {selectedToolId === 'hunterFarmer' && (
            <div className="grid lg:grid-cols-12 gap-8 animate-fadeIn">
              {/* Left Side: Interactive Quiz Block */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                    <h3 className="font-display font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <span className="p-1.5 bg-blue-50 block rounded-lg text-blue-600">
                        <Crosshair className="h-4 w-4" />
                      </span>
                      Strategic Alignment Quiz
                      <button
                        type="button"
                        onClick={copyHunterFarmerAiPrompt}
                        className="flex items-center gap-1 px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-white leading-none font-bold text-[9px] rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer animate-pulse shrink-0 uppercase tracking-widest ml-1"
                        title="Analyze team alignment with AI"
                      >
                        <Sparkles className="h-3 w-3" />
                        Analyze with AI
                      </button>
                    </h3>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Question {currentQuizIndex + 1} of 8
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full h-1 bg-slate-100 rounded-full mb-6 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full transition-all duration-300" 
                      style={{ width: `${((currentQuizIndex + 1) / 8) * 100}%` }} 
                    />
                  </div>

                  {/* Question and Option list */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 leading-normal">
                        {hunterFarmerQuestions[currentQuizIndex].text}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-normal">
                        {hunterFarmerQuestions[currentQuizIndex].subtext}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {hunterFarmerQuestions[currentQuizIndex].options.map((opt, idx) => {
                        const isSelected = hunterFarmerAnswers[currentQuizIndex] === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              const newAnswers = [...hunterFarmerAnswers];
                              newAnswers[currentQuizIndex] = idx;
                              setHunterFarmerAnswers(newAnswers);
                              // Auto step to next question after small delay
                              if (currentQuizIndex < 7) {
                                setTimeout(() => {
                                  setCurrentQuizIndex(prev => prev + 1);
                                }, 300);
                              }
                            }}
                            className={`w-full p-4 rounded-xl border text-left transition-all relative flex items-start gap-3.5 cursor-pointer group ${
                              isSelected 
                                ? 'border-blue-500 bg-blue-50/45 ring-1 ring-blue-500 shadow-xs' 
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
                              isSelected 
                                ? 'border-blue-600 bg-blue-600 text-white' 
                                : 'border-slate-300 bg-white text-transparent group-hover:border-slate-400'
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            </span>
                            
                            <div className="space-y-0.5">
                              <p className={`text-xs font-bold transition-colors ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                                {opt.label}
                              </p>
                              <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                                {opt.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Back and Forth control bar */}
                <div className="flex justify-between items-center border-t border-slate-100 pt-5 mt-6">
                  <button
                    type="button"
                    disabled={currentQuizIndex === 0}
                    onClick={() => setCurrentQuizIndex(prev => prev - 1)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  
                  <div className="flex gap-1.5">
                    {hunterFarmerAnswers.map((ans, qIdx) => (
                      <button
                        key={qIdx}
                        type="button"
                        onClick={() => setCurrentQuizIndex(qIdx)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors cursor-pointer ${
                          currentQuizIndex === qIdx 
                            ? 'bg-blue-600 scale-125' 
                            : ans !== -1 
                              ? 'bg-emerald-500' 
                              : 'bg-slate-200 hover:bg-slate-300'
                        }`}
                        title={`Go to Question ${qIdx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={currentQuizIndex === 7 || hunterFarmerAnswers[currentQuizIndex] === -1}
                    onClick={() => setCurrentQuizIndex(prev => prev + 1)}
                    className="px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Next <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Side: Scorecard / Playbook */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Realtime / Final Scorecard Frame */}
                <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col justify-between h-full relative overflow-hidden">
                  
                  {/* Decorative background dials */}
                  <div className="absolute right-0 top-0 opacity-5">
                    <Gauge className="w-48 h-48" />
                  </div>

                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800/85 pb-3">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-400 flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-blue-400" />
                        Live Blueprint Stance
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        {answeredQuizCount}/8 Answered
                      </span>
                    </div>

                    {/* Dual Alignment Meter custom styled */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1 text-sky-450 text-sky-400">
                          <Crosshair className="w-3.5 h-3.5 text-sky-400" /> Hunter ({percentageHunter}%)
                        </span>
                        <span className="flex items-center gap-1 text-emerald-450 text-emerald-400">
                          Farmer ({percentageFarmer}%) <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                        </span>
                      </div>
                      <div className="relative h-6 bg-slate-950 rounded-full border border-slate-800 overflow-hidden shadow-inner">
                        <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-600 to-sky-400 transition-all duration-500" style={{ width: `${percentageHunter}%` }} />
                        <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-emerald-600 to-teal-400 transition-all duration-500" style={{ width: `${percentageFarmer}%` }} />
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-700 z-10" />
                        
                        <div className="absolute inset-0 flex items-center justify-between px-4 text-[10px] font-mono font-extrabold text-white z-25 pointer-events-none">
                          <span>{percentageHunter}%</span>
                          <span>{percentageFarmer}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Persona & Match results */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-4">
                      <div>
                        <span className="text-[8px] font-mono font-bold bg-slate-800 px-2.5 py-1 rounded text-slate-300 uppercase tracking-wider block w-fit">
                          Computed CRM Paradigm Archetype
                        </span>
                        <h4 className="text-sm font-black text-white mt-2 leading-tight">
                          {currentProfileResult.label}
                        </h4>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        {currentProfileResult.description}
                      </p>
                    </div>

                    {/* Playbook checklist - shown fully when completed, otherwise blurred / informative */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                          Strategic Initial Moves Playbook
                        </h5>
                        {answeredQuizCount < 8 && (
                          <span className="text-[9px] text-amber-400 font-mono italic">
                            Complete Quiz to Unlock Recommendations
                          </span>
                        )}
                      </div>

                      <div className={`space-y-3 transition-all duration-500 ${answeredQuizCount < 8 ? 'opacity-35 select-none blur-[1.5px]' : 'opacity-100'}`}>
                        {currentProfileResult.steps.map((st, sIdx) => {
                          return (
                            <div key={sIdx} className="flex gap-2.5 bg-slate-950/20 p-3 rounded-xl border border-slate-800/40 hover:border-slate-800 transition-colors">
                              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800/85 text-cyan-400 flex items-center justify-center font-mono font-extrabold text-[10px] shrink-0">
                                {sIdx + 1}
                              </span>
                              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                                {st}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions and Reset */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setHunterFarmerAnswers(Array(8).fill(-1));
                          setCurrentQuizIndex(0);
                          notifyCalculation();
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 active:bg-slate-755 text-slate-200 transition-colors py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700/80"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Reset Parameters
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}
          {selectedToolId === 'dbReactivation' && (
            <div className="grid lg:grid-cols-12 gap-8 animate-fadeIn">
              {/* Input Section */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                <h3 className="font-display font-extrabold text-base text-slate-900 border-b border-slate-100 pb-4 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <span className="p-1.5 bg-rose-50 rounded-lg text-rose-600">
                      <Database className="h-4 w-4" />
                    </span>
                    <span>Database Reactivation Inputs</span>
                  </span>
                  <button
                    type="button"
                    onClick={copyDbReactivationAiPrompt}
                    className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-white leading-none font-bold text-[10px] rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer animate-pulse shrink-0 uppercase tracking-wider"
                    title="Analyze reactivation targets with AI"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Analyze with AI
                  </button>
                </h3>

                {/* Dormant / Inactive Database Pool Size */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Inactive Contacts Database Size</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={inactiveContacts === 0 ? '' : inactiveContacts}
                      onChange={(e) => setInactiveContacts(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono text-base font-bold text-slate-850"
                    />
                    <Database className="absolute right-3.5 top-3 text-slate-400 w-4 h-4" />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Total unengaged contacts / emails / phone numbers currently dormant.
                  </p>
                </div>

                {/* Average Order Value (AOV) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Average Order Value (AOV)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-500 font-extrabold text-xs">Rp</span>
                    <input
                      type="number"
                      min="0"
                      value={dormantAov === 0 ? '' : dormantAov}
                      onChange={(e) => setDormantAov(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono text-base font-bold text-slate-850 opacity-90"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal text-right">
                    {formatRp(dormantAov)} / transaction conversion basis
                  </p>
                </div>

                {/* Customer Acquisition Cost (CAC) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Customer Acquisition Cost (CAC)</span>
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Optional</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-500 font-extrabold text-xs">Rp</span>
                    <input
                      type="number"
                      min="0"
                      value={dormantCac === 0 ? '' : dormantCac}
                      onChange={(e) => setDormantCac(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono text-base font-bold text-slate-850 opacity-90"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Average cost to acquire 1 new customer via active ads. By reactivating database records, you bypass this acquisition friction.
                  </p>
                </div>

                {/* Expected Reactivation Conversion Rate */}
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-705 text-slate-700">Expected Reactivation Target Rate</span>
                    <span className="font-mono bg-cyan-50 text-cyan-700 font-bold px-2 py-0.5 rounded">{dormantConversion}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="20"
                    step="0.1"
                    value={dormantConversion}
                    onChange={(e) => setDormantConversion(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg cursor-pointer accent-cyan-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Conservative (1%)</span>
                    <span>Realistic (2% - 5%)</span>
                    <span>Optimistic (20%)</span>
                  </div>
                </div>
              </div>

              {/* Result Cards Workspace */}
              <div className="lg:col-span-7 flex flex-col justify-center animate-fadeIn">
                <div className="bg-gradient-to-br from-rose-600 to-red-850 rounded-3xl p-8 sm:p-10 shadow-xl text-white relative overflow-hidden">
                  
                  {/* Decorative backgrounds */}
                  <div className="absolute -right-12 -top-12 opacity-10">
                    <Coins className="w-56 h-56" />
                  </div>

                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-2 text-rose-250 font-semibold tracking-wider text-xs uppercase font-mono">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
                      <span>Leaking Dormant Revenue Opportunity</span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-md break-all font-mono">
                        {formatRp(potentialLostRevenue)}
                      </p>
                      <p className="text-rose-100 text-sm opacity-90 leading-relaxed font-sans">
                        currently locked inside un-leveraged CRM data cohorts.
                      </p>
                    </div>

                    <div className="pt-5 border-t border-rose-500/50">
                      <p className="font-display font-bold text-sm uppercase tracking-wider text-rose-100">
                        Operational Alignment Insight
                      </p>
                      <p className="mt-2 text-rose-50 text-xs italic bg-red-950/40 p-4 rounded-xl border border-rose-505 border-rose-500/35 leading-relaxed">
                        "{dormantRealityMessage}"
                      </p>
                    </div>

                    {/* Secondary Metrics */}
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div className="bg-red-950/40 p-4 rounded-xl border border-red-500/20 backdrop-blur-xs">
                        <span className="text-rose-200 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1 font-mono">
                          <Users className="w-3.5 h-3.5 text-rose-300" /> Reactivated Leads
                        </span>
                        <p className="text-lg font-bold font-mono text-white mt-1">
                          {activatedDormantCustomers.toLocaleString('id-ID')} Customers
                        </p>
                      </div>

                      <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/20 backdrop-blur-xs">
                        <span className="text-emerald-305 text-emerald-300 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1 font-mono">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> CAC Savings Value
                        </span>
                        <p className="text-lg font-bold font-mono text-emerald-305 text-emerald-300 mt-1">
                          {formatRp(adSpendSaved)}
                        </p>
                      </div>
                    </div>

                    {/* Interactive Action Sequence */}
                    {actionInitiated ? (
                      <div className="mt-4 bg-rose-950/60 text-slate-100 p-4 rounded-xl border border-rose-455 border-rose-400/35 text-xs font-semibold text-center animate-fadeIn leading-relaxed">
                        ⚡ Core Action Blueprint Executed: Deploy automated personalized campaign flows to {inactiveContacts.toLocaleString('id-ID')} dormant contact coordinates. Starting with custom SMS, WA notifications, & targeted email blasts with AOV benchmarks.
                      </div>
                    ) : (
                      <button 
                        type="button"
                        onClick={() => {
                          setActionInitiated(true);
                          setTimeout(() => setActionInitiated(false), 8000);
                        }}
                        className="w-full mt-4 bg-white text-rose-800 hover:bg-slate-50 active:bg-slate-100 transition-all py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 group cursor-pointer text-xs uppercase tracking-wider"
                      >
                        Initiate Activation Sequence
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all duration-250" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------
              WORK AREA FOR IDEAL CUSTOMER PROFILE & PERSONA BUILDER
             ---------------------------------------------------- */}
          {selectedToolId === 'personaBuilder' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Profile Workspace Editor/Viewer Toggles */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 w-fit">
                  <button
                    type="button"
                    onClick={() => setPersonaIsEditing(true)}
                    className={`px-5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                      personaIsEditing 
                        ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-900/5' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" /> Direct Workspace Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPersonaIsEditing(false);
                      notifyCalculation();
                    }}
                    className={`px-5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                      !personaIsEditing 
                        ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-900/5' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> High-Contrast Document Output
                  </button>
                </div>

                <button
                  type="button"
                  onClick={copyPersonaBuilderAiPrompt}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer animate-pulse tracking-wider self-start sm:self-auto uppercase font-mono"
                  title="Salin prompt analisis persona ideal dengan AI"
                >
                  <Sparkles className="h-4 w-4" />
                  Analyze with AI
                </button>
              </div>

              {/* VIEW 1: EDITOR SCENARIO */}
              {personaIsEditing && (
                <div className="grid lg:grid-cols-12 gap-8 animate-fadeIn">
                  {/* Left Column: Contexts & Identity Identifiers */}
                  <div className="lg:col-span-6 space-y-6">
                    {/* Section 1: Enterprise Profile Segment Context */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-1">
                        <span className="p-1.5 bg-cyan-50 rounded-lg text-cyan-600 block shrink-0">
                          <Target className="h-4 w-4" />
                        </span>
                        <h3 className="font-display font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                          1. Enterprise Context & Value Proposition
                        </h3>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-705 text-slate-700 block">
                          Corporate Entity / Venture Name
                        </label>
                        <input
                          type="text"
                          value={personaData.businessName}
                          onChange={(e) => handlePersonaInputChange('root', 'businessName', e.target.value)}
                          placeholder="e.g. Acme Corp / Indofood"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-semibold text-slate-800 font-sans"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-705 text-slate-700 block">
                          Commercial Sector & Operational Mission
                        </label>
                        <textarea
                          rows={3}
                          value={personaData.businessDescription}
                          onChange={(e) => handlePersonaInputChange('root', 'businessDescription', e.target.value)}
                          placeholder="Provide a brief summary of what your business sells, delivers, or provides..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-sans font-medium text-slate-800 leading-relaxed resize-none"
                        />
                      </div>
                    </div>

                    {/* Section 2: Demographics & Identity Identifiers */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-blue-50 rounded-lg text-blue-600 block shrink-0">
                            <User className="h-4 w-4" />
                          </span>
                          <h3 className="font-display font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                            2. Demographics & Identity Profile
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={handleRandomizePersonaName}
                          className="text-[10px] font-mono font-bold text-slate-400 hover:text-cyan-600 transition-colors flex items-center gap-1 cursor-pointer bg-slate-50 px-2.5 py-1 rounded-md border border-slate-150"
                        >
                          <RefreshCw className="w-3 h-3" /> Random Name
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-705 text-slate-700 block">
                            Persona Subject Representative (Avatar)
                          </label>
                          <input
                            type="text"
                            value={personaData.customerName}
                            onChange={(e) => handlePersonaInputChange('root', 'customerName', e.target.value)}
                            placeholder="Add name..."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-semibold text-slate-800 font-sans"
                          />
                        </div>

                        <div className="space-y-2">
                          <span className="text-xs font-bold text-slate-705 text-slate-700 block">
                            Bios / Demographics Gender
                          </span>
                          <div className="flex bg-slate-50/70 p-1 rounded-xl border border-slate-200 h-10 items-center justify-between">
                            <button
                              type="button"
                              onClick={() => setPersonaGender('male')}
                              className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                                personaGender === 'male'
                                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              Male (Pria)
                            </button>
                            <button
                              type="button"
                              onClick={() => setPersonaGender('female')}
                              className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                                personaGender === 'female'
                                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              Female (Wanita)
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-705 text-slate-700 block">
                            Target Demographic Age Segment
                          </label>
                          <input
                            type="text"
                            value={personaData.demographics.age}
                            onChange={(e) => handlePersonaInputChange('demographics', 'age', e.target.value)}
                            placeholder="e.g. 25 - 34 Years Segment"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-sans font-semibold text-slate-800"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-705 text-slate-700 block">
                            Household Cohort / Marital Status
                          </label>
                          <input
                            type="text"
                            value={personaData.demographics.maritalStatus}
                            onChange={(e) => handlePersonaInputChange('demographics', 'maritalStatus', e.target.value)}
                            placeholder="e.g. Single / Married with toddlers"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-sans font-semibold text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-705 text-slate-700 block">
                            Geographical Base / Region Hub
                          </label>
                          <input
                            type="text"
                            value={personaData.demographics.location}
                            onChange={(e) => handlePersonaInputChange('demographics', 'location', e.target.value)}
                            placeholder="e.g. Jakarta, Suburban Surabaya"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-sans font-semibold text-slate-800"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-705 text-slate-700 block">
                            Maximum Educational Attainment
                          </label>
                          <input
                            type="text"
                            value={personaData.demographics.education}
                            onChange={(e) => handlePersonaInputChange('demographics', 'education', e.target.value)}
                            placeholder="e.g. Bachelor of Communications (S1)"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-sans font-semibold text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-705 text-slate-700 block">
                          Additional Profile Segment Details
                        </label>
                        <textarea
                          rows={2}
                          value={personaData.demographics.other}
                          onChange={(e) => handlePersonaInputChange('demographics', 'other', e.target.value)}
                          placeholder="Provide any additional demographic characteristics, shopping limits, or behavior triggers..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-sans font-medium text-slate-800 leading-relaxed resize-none"
                        />
                      </div>
                    </div>

                    {/* Section 3: Professional Firmographics & Financial Limits */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-1">
                        <span className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 block shrink-0">
                          <Briefcase className="h-4 w-4" />
                        </span>
                        <h3 className="font-display font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                          3. B2B / Firmographic Professional Position
                        </h3>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-705 text-slate-700 block">
                            Functional Executive Job Title
                          </label>
                          <input
                            type="text"
                            value={personaData.finances.jobTitle}
                            onChange={(e) => handlePersonaInputChange('finances', 'jobTitle', e.target.value)}
                            placeholder="e.g. Chief Marketing Officer / Digital Head"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-sans font-semibold text-slate-800"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-705 text-slate-700 block">
                            Purchasing Power / Monthly Income Index
                          </label>
                          <input
                            type="text"
                            value={personaData.finances.income}
                            onChange={(e) => handlePersonaInputChange('finances', 'income', e.target.value)}
                            placeholder="e.g. Rp 15.000.000 - Rp 30.000.000 / Month"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-sans font-semibold text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-705 text-slate-700 block">
                            Firmographic Sector / Employer Company
                          </label>
                          <input
                            type="text"
                            value={personaData.finances.company}
                            onChange={(e) => handlePersonaInputChange('finances', 'company', e.target.value)}
                            placeholder="e.g. Mid-Market SaaS Ventures / Retail Holding Group"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-sans font-semibold text-slate-800"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-705 text-slate-700 block">
                            Core Capabilities & Proficiencies
                          </label>
                          <input
                            type="text"
                            value={personaData.finances.skill}
                            onChange={(e) => handlePersonaInputChange('finances', 'skill', e.target.value)}
                            placeholder="e.g. Python Business Analytics, Performance Ads budget"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-sans font-semibold text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Operating Habits & Psychographic Coordinates */}
                  <div className="lg:col-span-6 space-y-6">
                    {/* Section 4: Routine Chronology (Daily Timeline) */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-1">
                        <span className="p-1.5 bg-blue-50 rounded-lg text-blue-600 block shrink-0">
                          <Clock className="h-4 w-4" />
                        </span>
                        <h3 className="font-display font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                          4. Daily Lifestyle Operating Timeline
                        </h3>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E63946] block bg-red-50 w-fit px-2 py-0.5 rounded">
                          Morning Block
                        </span>
                        <textarea
                          rows={2}
                          value={personaData.dailyLife.morning}
                          onChange={(e) => handlePersonaInputChange('dailyLife', 'morning', e.target.value)}
                          placeholder="e.g. Wakes up, reviews slack team KPI screens, drinks coffee..."
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-sans font-medium text-slate-800 leading-relaxed resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-orange-600 block bg-orange-50 w-fit px-2 py-0.5 rounded">
                          Afternoon Block
                        </span>
                        <textarea
                          rows={2}
                          value={personaData.dailyLife.afternoon}
                          onChange={(e) => handlePersonaInputChange('dailyLife', 'afternoon', e.target.value)}
                          placeholder="e.g. Holds regional operational partner reviews, reviews CPC dashboards..."
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-sans font-medium text-slate-800 leading-relaxed resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1D3557] block bg-indigo-50 w-fit px-2 py-0.5 rounded">
                          Night / Evening Block
                        </span>
                        <textarea
                          rows={2}
                          value={personaData.dailyLife.night}
                          onChange={(e) => handlePersonaInputChange('dailyLife', 'night', e.target.value)}
                          placeholder="e.g. Relaxes browsing Twitter threads or exploring SaaS product guides..."
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-sans font-medium text-slate-800 leading-relaxed resize-none"
                        />
                      </div>
                    </div>

                    {/* Section 5: List Items (Dynamic lists coordinates) */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                        <span className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 block shrink-0">
                          <Activity className="h-4 w-4" />
                        </span>
                        <h3 className="font-display font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                          5. Psychographics & Behavioral Datasets
                        </h3>
                      </div>

                      {/* Six Dynamic Inputs in a Clean Grid */}
                      <div className="space-y-5">
                        
                        {/* 1. Digital Consumption Patterns (Online behaviors) */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 block">
                            Digital Media Touchpoints & Channels
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={personaListInputs.onlineBehaviors}
                              onKeyDown={(e) => handlePersonaKeyPress(e, 'onlineBehaviors')}
                              onChange={(e) => handlePersonaListInputChange('onlineBehaviors', e.target.value)}
                              placeholder="Add entry (e.g. Generates inquiries via LinkedIn message loops)..."
                              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-medium text-slate-850"
                            />
                            <button
                              type="button"
                              onClick={() => addPersonaListItem('onlineBehaviors')}
                              className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                            >
                              Add
                            </button>
                          </div>
                          {personaData.onlineBehaviors.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {personaData.onlineBehaviors.map((item, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 bg-slate-100 border border-slate-150 text-[10px] font-medium text-slate-700 px-2 py-1 rounded-md">
                                  {item}
                                  <button type="button" onClick={() => removePersonaListItem('onlineBehaviors', idx)} className="hover:text-red-500 text-slate-400 shrink-0 cursor-pointer">
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 2. Source Nodes (Influences) */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-705 text-slate-700 block">
                            Primary Sources of Professional Influence
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={personaListInputs.influences}
                              onKeyDown={(e) => handlePersonaKeyPress(e, 'influences')}
                              onChange={(e) => handlePersonaListInputChange('influences', e.target.value)}
                              placeholder="Add entry (e.g. McKinsey Research newsletters, Trusted CEO groups)..."
                              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-medium text-slate-850"
                            />
                            <button
                              type="button"
                              onClick={() => addPersonaListItem('influences')}
                              className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                            >
                              Add
                            </button>
                          </div>
                          {personaData.influences.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {personaData.influences.map((item, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 bg-slate-100 border border-slate-150 text-[10px] font-medium text-slate-700 px-2 py-1 rounded-md">
                                  {item}
                                  <button type="button" onClick={() => removePersonaListItem('influences', idx)} className="hover:text-red-500 text-slate-400 shrink-0 cursor-pointer">
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 3. Brand Ecosystem Affinities */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-705 text-slate-700 block">
                            Ecosystem Brand Affinities
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={personaListInputs.brandAffinities}
                              onKeyDown={(e) => handlePersonaKeyPress(e, 'brandAffinities')}
                              onChange={(e) => handlePersonaListInputChange('brandAffinities', e.target.value)}
                              placeholder="Add brand (e.g. Apple Inc., Google Cloud Platform)..."
                              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-medium text-slate-850"
                            />
                            <button
                              type="button"
                              onClick={() => addPersonaListItem('brandAffinities')}
                              className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                            >
                              Add
                            </button>
                          </div>
                          {personaData.brandAffinities.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {personaData.brandAffinities.map((item, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 bg-slate-100 border border-slate-150 text-[10px] font-medium text-slate-700 px-2 py-1 rounded-md">
                                  {item}
                                  <button type="button" onClick={() => removePersonaListItem('brandAffinities', idx)} className="hover:text-red-500 text-slate-400 shrink-0 cursor-pointer">
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 4. Strategic Aspirations (Hopes dreams) */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-705 text-slate-700 block">
                            Strategic Aspirations & High Performance Goals
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={personaListInputs.hopesDreams}
                              onKeyDown={(e) => handlePersonaKeyPress(e, 'hopesDreams')}
                              onChange={(e) => handlePersonaListInputChange('hopesDreams', e.target.value)}
                              placeholder="Add entry (e.g. Streamline user reactivation conversions by 15%)..."
                              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-medium text-slate-850"
                            />
                            <button
                              type="button"
                              onClick={() => addPersonaListItem('hopesDreams')}
                              className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                            >
                              Add
                            </button>
                          </div>
                          {personaData.hopesDreams.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {personaData.hopesDreams.map((item, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 bg-slate-100 border border-slate-150 text-[10px] font-medium text-slate-700 px-2 py-1 rounded-md">
                                  {item}
                                  <button type="button" onClick={() => removePersonaListItem('hopesDreams', idx)} className="hover:text-red-500 text-slate-400 shrink-0 cursor-pointer">
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 5. Pain Points & Frictions (Worries fears) */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-705 text-slate-700 block">
                            Friction Points & Business Risks (Pain Points)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={personaListInputs.worriesFears}
                              onKeyDown={(e) => handlePersonaKeyPress(e, 'worriesFears')}
                              onChange={(e) => handlePersonaListInputChange('worriesFears', e.target.value)}
                              placeholder="Add entry (e.g. Unpredictable churn rates, data integration limits)..."
                              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-medium text-slate-850"
                            />
                            <button
                              type="button"
                              onClick={() => addPersonaListItem('worriesFears')}
                              className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                            >
                              Add
                            </button>
                          </div>
                          {personaData.worriesFears.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {personaData.worriesFears.map((item, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 bg-slate-100 border border-slate-150 text-[10px] font-medium text-slate-700 px-2 py-1 rounded-md">
                                  {item}
                                  <button type="button" onClick={() => removePersonaListItem('worriesFears', idx)} className="hover:text-red-500 text-slate-400 shrink-0 cursor-pointer">
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 6. Strategic Solution Vectors */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-705 text-slate-700 block">
                            Desired Solutions & Strategic Value Enablers
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={personaListInputs.makeLifeEasier}
                              onKeyDown={(e) => handlePersonaKeyPress(e, 'makeLifeEasier')}
                              onChange={(e) => handlePersonaListInputChange('makeLifeEasier', e.target.value)}
                              placeholder="Add entry (e.g. Full API-supported CRM analytics modules with local SLAs)..."
                              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-medium text-slate-850"
                            />
                            <button
                              type="button"
                              onClick={() => addPersonaListItem('makeLifeEasier')}
                              className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                            >
                              Add
                            </button>
                          </div>
                          {personaData.makeLifeEasier.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {personaData.makeLifeEasier.map((item, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 bg-slate-100 border border-slate-150 text-[10px] font-medium text-slate-700 px-2 py-1 rounded-md">
                                  {item}
                                  <button type="button" onClick={() => removePersonaListItem('makeLifeEasier', idx)} className="hover:text-red-500 text-slate-400 shrink-0 cursor-pointer">
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: PREMIUM HIGH-CONTRAST DOCUMENT OUTPUT */}
              {!personaIsEditing && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Action Bar for Preview Scene */}
                  <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 print:hidden">
                    <span className="text-[11px] font-mono font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Executive Blueprint Document Output
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleGeneratePersonaPrompt}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-850 active:bg-slate-950 text-white transition-all text-[11px] font-extrabold rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-305" /> Extract AI Analysis Prompt
                      </button>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all text-[11px] font-extrabold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print PDF / Save
                      </button>
                    </div>
                  </div>

                  {/* PREMIUM CANVAS BOX SHOWN TO BROWSER & PERFECT FOR PRINT */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-w-[1020px] mx-auto print:border-none print:shadow-none print:rounded-none">
                    
                    {/* Upper Banner Section with Identity Details */}
                    <div className="bg-slate-900 text-white p-8 sm:p-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-950">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-800 border-2 border-slate-700/80 flex items-center justify-center text-slate-400 shadow-inner">
                          <UserCircle className="w-12 h-12 sm:w-16 sm:h-16 text-slate-500" strokeWidth={1} />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono font-bold tracking-[0.25em] text-[#00E5FF] uppercase block">
                            Persona Subject Profile (Avatar)
                          </span>
                          <h2 className="text-2xl sm:text-3.5xl font-black font-display tracking-tight text-white leading-none">
                            {personaData.customerName || "Representative Subject Analyst"}
                          </h2>
                          <p className="text-slate-300 text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-1 font-sans">
                            <Briefcase className="w-3.5 h-3.5 text-cyan-405 text-cyan-420 text-cyan-400" />
                            {personaData.finances.jobTitle || "Functional Executive Strategic Lead"}
                          </p>
                        </div>
                      </div>

                      <div className="text-left md:text-right md:max-w-xs space-y-1 bg-slate-950/45 p-4 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-[#E3A008] uppercase block">
                          Aligned Business Focus
                        </span>
                        <h4 className="text-xs sm:text-sm font-extrabold text-white leading-normal font-sans">
                          {personaData.businessName || "Acme Venture Group"}
                        </h4>
                        <p className="text-[10px] text-slate-450 text-slate-400 italic font-sans leading-relaxed">
                          {personaData.businessDescription ? (
                            personaData.businessDescription.substring(0, 75) + "..."
                          ) : "Value Proposition audit sequence enabled."}
                        </p>
                      </div>
                    </div>

                    {/* 3-Column Document Layout Grid */}
                    <div className="grid md:grid-cols-12 border-t border-slate-100 font-sans text-slate-800">
                      
                      {/* COLUMN 1: DEMOGRAPHICS, ALIGNMENT & AFFINITIES PROFILE */}
                      <div className="md:col-span-4 bg-slate-50/50 p-6 sm:p-8 space-y-8 border-r border-slate-100">
                        
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest border-b border-slate-205 border-slate-200 pb-2">
                            Demographics Segment Info
                          </h4>

                          <div className="space-y-4">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-widest">Demographic Gender</span>
                              <span className="text-xs font-bold text-slate-800">{personaGender === 'male' ? 'Male (Pria)' : 'Female (Wanita)'}</span>
                            </div>

                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-widest">Target Segment Age Bracket</span>
                              <span className="text-xs font-bold text-slate-800">{personaData.demographics.age || "35 - 45 Segment Target"}</span>
                            </div>

                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-widest">Household / Civil Status</span>
                              <span className="text-xs font-bold text-slate-800">{personaData.demographics.maritalStatus || "Single Standard Core"}</span>
                            </div>

                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-widest">Geographical Region Hub</span>
                              <span className="text-xs font-bold text-slate-800">{personaData.demographics.location || "Jakarta Selatan Hub"}</span>
                            </div>

                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-widest">Maximum Educational Attainment</span>
                              <span className="text-xs font-bold text-slate-800">{personaData.demographics.education || "Bachelor Attainment (S1)"}</span>
                            </div>
                          </div>

                          {personaData.demographics.other && (
                            <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-inner">
                              <span className="text-[8px] font-mono font-black text-slate-405 text-slate-400 uppercase tracking-wider block mb-1">
                                Critical Subject Characteristic Notes
                              </span>
                              <p className="text-[10.5px] font-sans font-medium text-slate-600 leading-relaxed italic">
                                "{personaData.demographics.other}"
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Professional & Firmographic Details subgroup */}
                        <div className="space-y-6 pt-2">
                          <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
                            B2B Firmographic Professional Role
                          </h4>

                          <div className="space-y-4">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-widest">Venture Employer Sector</span>
                              <span className="text-xs font-bold text-slate-800">{personaData.finances.company || "Enterprise Retail Holding"}</span>
                            </div>

                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-widest">Direct Buying Power / Income</span>
                              <span className="text-xs font-bold text-[#E63946]">{personaData.finances.income || 'Rp 45M - Rp 70M'}</span>
                            </div>

                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-widest">Core Technical Competencies</span>
                              <span className="text-xs font-bold text-slate-800">{personaData.finances.skill || 'Performance Marketing, Analytics'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Brand affinities block */}
                        <div className="space-y-4 pt-2">
                          <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest border-b border-slate-205 border-slate-200 pb-2">
                            Ecosystem Brand Affinities
                          </h4>
                          {personaData.brandAffinities.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {personaData.brandAffinities.map((item, idx) => (
                                <span key={idx} className="bg-white border border-slate-200 text-[10px] font-bold text-slate-750 text-slate-700 px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-cyan-500 block shrink-0" /> {item}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">-</p>
                          )}
                        </div>

                      </div>

                      {/* COLUMN 2: DAILY LIFESTYLE ROUTINE timeline & ONLINE CHANNELS */}
                      <div className="md:col-span-4 p-6 sm:p-8 space-y-8 border-r border-slate-100">
                        
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest border-b border-slate-205 border-slate-200 pb-2">
                            Daily Operational Routine Timeline
                          </h4>

                          <div className="space-y-5">
                            <div className="relative pl-4 border-l border-slate-200 space-y-1">
                              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#E63946] border border-white" />
                              <span className="text-[9px] font-mono font-extrabold text-[#E63946] uppercase block">
                                Morning Routine block
                              </span>
                              <p className="text-[11px] text-slate-650 text-slate-600 leading-relaxed font-medium">
                                {personaData.dailyLife.morning || "Aligns company KPI dashboard checks."}
                              </p>
                            </div>

                            <div className="relative pl-4 border-l border-slate-200 space-y-1">
                              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-orange-500 border border-white" />
                              <span className="text-[9px] font-mono font-extrabold text-orange-600 uppercase block">
                                Afternoon Routine block
                              </span>
                              <p className="text-[11px] text-slate-650 text-slate-600 leading-relaxed font-semibold">
                                {personaData.dailyLife.afternoon || "Negotiates CRM license allocations."}
                              </p>
                            </div>

                            <div className="relative pl-4 border-l border-slate-200 space-y-1">
                              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#1D3557] border border-white" />
                              <span className="text-[9px] font-mono font-extrabold text-blue-800 uppercase block">
                                Night / Evening Routine block
                              </span>
                              <p className="text-[11px] text-slate-650 text-slate-600 leading-relaxed font-semibold">
                                {personaData.dailyLife.night || "Reads GTM performance marketing metrics."}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6 pt-2">
                          <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
                            Digital Media Touchpoints & Channels
                          </h4>

                          {personaData.onlineBehaviors.length > 0 ? (
                            <div className="space-y-3">
                              {personaData.onlineBehaviors.map((item, idx) => (
                                <div key={idx} className="flex gap-2.5 items-start">
                                  <span className="p-1.5 bg-blue-50 block rounded-md text-blue-600 font-mono font-extrabold text-[9px] leading-none shrink-0 border border-blue-105">
                                    <Globe className="w-3 h-3 text-blue-600" />
                                  </span>
                                  <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                                    {item}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">-</p>
                          )}
                        </div>

                        <div className="space-y-6 pt-2">
                          <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
                            Primary Sources of Influence
                          </h4>

                          {personaData.influences.length > 0 ? (
                            <div className="space-y-3">
                              {personaData.influences.map((item, idx) => (
                                <div key={idx} className="flex gap-2.5 items-start">
                                  <span className="p-1.5 bg-cyan-50 block rounded-md text-cyan-705 text-cyan-600 font-mono font-extrabold text-[9px] leading-none shrink-0 border border-cyan-105">
                                    <Zap className="w-3 h-3 text-cyan-600" />
                                  </span>
                                  <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                                    {item}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">-</p>
                          )}
                        </div>

                      </div>

                      {/* COLUMN 3: PSYCHOGRAPHIC FRICTION POINTS, MOTIVATIONS & VECTORS */}
                      <div className="md:col-span-4 p-6 sm:p-8 space-y-8">
                        
                        {/* Core Aspirations subgroup */}
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest border-b border-slate-205 border-slate-200 pb-2">
                            Strategic Aspirations / Core Dreams
                          </h4>

                          {personaData.hopesDreams.length > 0 ? (
                            <div className="space-y-3.5">
                              {personaData.hopesDreams.map((item, idx) => (
                                <div key={idx} className="flex gap-2.5 items-start">
                                  <span className="p-1 bg-[#1DD1A1]/10 rounded-full text-emerald-600 shrink-0 border border-emerald-500/15">
                                    <Heart className="w-3 h-3 text-emerald-600" />
                                  </span>
                                  <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                                    {item}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">-</p>
                          )}
                        </div>

                        {/* Worries fears subgroup */}
                        <div className="space-y-6 pt-2">
                          <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
                            Critical Pain Points & Pressures
                          </h4>

                          {personaData.worriesFears.length > 0 ? (
                            <div className="space-y-3.5">
                              {personaData.worriesFears.map((item, idx) => (
                                <div key={idx} className="flex gap-2.5 items-start">
                                  <span className="p-1 bg-red-50 rounded-full text-red-600 shrink-0 border border-red-500/15">
                                    <AlertTriangle className="w-3 h-3 text-red-600" />
                                  </span>
                                  <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                                    {item}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">-</p>
                          )}
                        </div>

                        {/* Enablers subgroup */}
                        <div className="space-y-6 pt-2">
                          <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
                            Solutions & Strategic Enablers
                          </h4>

                          {personaData.makeLifeEasier.length > 0 ? (
                            <div className="space-y-3.5">
                              {personaData.makeLifeEasier.map((item, idx) => (
                                <div key={idx} className="flex gap-2.5 items-start">
                                  <span className="p-1 bg-indigo-50 rounded-full text-indigo-605 text-indigo-600 shrink-0 border border-indigo-500/15">
                                    <Lightbulb className="w-3 h-3 text-indigo-600" />
                                  </span>
                                  <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                                    {item}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">-</p>
                          )}
                        </div>

                      </div>

                    </div>

                    {/* Footer alignment credit print note */}
                    <div className="bg-slate-50 border-t border-slate-100 px-8 py-5 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-slate-450 text-slate-400">
                      <span>Ideal Customer Profile Core Blueprint Framework Document</span>
                      <span className="font-bold">SYSTEM AUDIT STAMP: ICP-PERSONA-2026-X1</span>
                    </div>

                  </div>

                </div>
              )}

              {/* MODAL OVERLAY SCENE FOR AI PROMPT COPY */}
              {personaModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 print:hidden">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scaleIn">
                    
                    <div className="px-6 py-4.5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                      <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                        <Sparkles className="w-4 h-4 text-cyan-600" />
                        <span>Executive AI Audit Analysis Prompt</span>
                      </h3>
                      <button onClick={() => setPersonaModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-md hover:bg-slate-200/50 transition-colors">
                        <X className="w-4.5 h-4.5" />
                      </button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto flex-1 space-y-4">
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Copy the comprehensive GTM audit prompt below and paste it into any advanced AI models (such as Claude 3.5 Sonnet, ChatGPT-4o, or Gemini 1.5 Pro) to get a world-class strategic evaluation, custom positioning messaging, and pilot programs.
                      </p>
                      
                      <div className="relative">
                        <textarea 
                          id="ai-prompt-textarea"
                          readOnly
                          value={personaPrompt}
                          className="w-full h-80 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-350 text-slate-300 font-mono resize-none outline-none p-5 leading-relaxed shadow-inner"
                        />
                      </div>
                    </div>
                    
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3.5">
                      <button
                        type="button"
                        onClick={() => setPersonaModalOpen(false)}
                        className="px-4 py-2 text-xs font-bold text-slate-505 text-slate-600 hover:bg-slate-200/55 rounded-lg cursor-pointer transition-colors"
                      >
                        Dismiss
                      </button>
                      <button 
                        type="button"
                        onClick={handleCopyPersonaPrompt}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-lg transition-all text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        {personaCopySuccess ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{personaCopySuccess ? 'Copied with Success' : 'Copy Enterprise Prompt'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {copiedText && (
        <div className="fixed bottom-6 right-6 z-[200] bg-white text-slate-800 px-5 py-3.5 rounded-xl border border-slate-200 shadow-2xl flex items-center space-x-3 transition-all duration-300 transform translate-y-0 animate-bounce">
          <div className="p-2 rounded-lg border bg-emerald-50 text-emerald-600 border-emerald-100 flex items-center justify-center">
            <CheckCircle className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold block text-slate-900">AI Prompt Copied!</span>
            <span className="text-[11px] text-slate-500">{copiedText}</span>
          </div>
        </div>
      )}

    </div>
  );
}
