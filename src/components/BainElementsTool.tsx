import React, { useState, useEffect } from 'react';
import { 
  Globe, Sparkles, Award, Zap, History, Users, 
  Heart, Gift, Clock, Palette, Shield, Activity, 
  Droplet, Eye, Key, Hourglass, Wand2, 
  TrendingUp, ShieldCheck, LayoutGrid, Puzzle, Share2, 
  ThumbsUp, CheckCircle, Tag, Star, Layers, Music, 
  BookOpen, Trash2, ArrowLeft, ArrowRight, FileText, 
  Copy, Printer, X, Sliders, ClipboardList, Info,
  PlusCircle, Kanban, ArrowLeftRight, Check, Triangle,
  Plus, AlertTriangle, RefreshCw
} from 'lucide-react';

interface CampaignItem {
  id: string;
  name: string;
  benefit: string;
  trigger: string;
  channel: string;
  priority: string;
  status: 'backlog' | 'progress' | 'live';
}

interface BainElementsToolProps {
  onCalculateRun: () => void;
}

// Core definitions of the 30 Elements of Value
const elementsDefinition: Record<string, {
  name: string;
  category: "Social Impact" | "Life Changing" | "Emotional" | "Functional";
  icon: string;
  theme: "indigo" | "violet" | "pink" | "emerald";
  description: string;
  crmTip: string;
}> = {
  self_transcendence: {
    name: "Self-Transcendence",
    category: "Social Impact",
    icon: "globe",
    theme: "indigo",
    description: "Provides help to other people or society more broadly through socially/environmentally conscious initiatives.",
    crmTip: "Cause-marketing campaigns, eco-donation matches, shared corporate responsibility programs."
  },
  provides_hope: {
    name: "Provides Hope",
    category: "Life Changing",
    icon: "sparkles",
    theme: "violet",
    description: "Generates optimism, positivity, and belief that a desired outcome is possible.",
    crmTip: "Long-term progression tracking, motivational guides, continuous life/business vision metrics."
  },
  self_actualization: {
    name: "Self-Actualization",
    category: "Life Changing",
    icon: "award",
    theme: "violet",
    description: "Enables realizing one's full potential and seeking personal development/growth.",
    crmTip: "Custom milestones, continuous level-ups, premium masterclass courses and badges."
  },
  motivation: {
    name: "Motivation",
    category: "Life Changing",
    icon: "zap",
    theme: "violet",
    description: "Energizes and propels customers to take active, consistent progress toward their goals.",
    crmTip: "Gamified streak campaigns, push notification motivators, progression dashboard trackers."
  },
  heirloom: {
    name: "Heirloom",
    category: "Life Changing",
    icon: "history",
    theme: "violet",
    description: "Passes down value, configurations, data assets, or physical status rings to future generations.",
    crmTip: "Legacy account setups, long-term multi-generational trust circles, secure data locker storage."
  },
  affiliation_belonging: {
    name: "Affiliation & Belonging",
    category: "Life Changing",
    icon: "users",
    theme: "violet",
    description: "Links users directly to an active group, brand tribe, or specialized community network.",
    crmTip: "VIP member closed channels, regional peer roundtable forums, elite group share credits."
  },
  reduces_anxiety: {
    name: "Reduces Anxiety",
    category: "Emotional",
    icon: "heart-pulse",
    theme: "pink",
    description: "Alleviates feelings of stress, urgency, tension, and anxiety.",
    crmTip: "Direct SLA guarantees, automated transaction monitoring logs, transparent status alert panels."
  },
  rewards_me: {
    name: "Rewards Me",
    category: "Emotional",
    icon: "gift",
    theme: "pink",
    description: "Provides a sense of individual achievement, status recognition, and direct reward bonuses.",
    crmTip: "Surprise custom gift boxes, milestone points boosts, birthday cashback credits."
  },
  nostalgia: {
    name: "Nostalgia",
    category: "Emotional",
    icon: "clock",
    theme: "pink",
    description: "Evokes pleasant, warm feelings of connection to good memories from the past.",
    crmTip: "Bespoke 'Year-in-Review' infographics, legacy feature skin options, retro classic campaigns."
  },
  design_aesthetics: {
    name: "Design & Aesthetics",
    category: "Emotional",
    icon: "palette",
    theme: "pink",
    description: "Features highly visual and beautiful layouts, product themes, or packaging elements.",
    crmTip: "Ultra custom dashboard setups, premium dark/light toggles, high-touch aesthetic packaging options."
  },
  badge_value: {
    name: "Badge Value",
    category: "Emotional",
    icon: "shield",
    theme: "pink",
    description: "Conveys high social status, prestige, or accomplishment by possessing the item/service.",
    crmTip: "Elite premium black card triggers, VIP tier name recognition, high-profile leaderboard tags."
  },
  wellness: {
    name: "Wellness",
    category: "Emotional",
    icon: "activity",
    theme: "pink",
    description: "Promotes general mental, physical, or sound financial well-being.",
    crmTip: "Healthy lifestyle tips digests, safety alerts, balanced daily workflow routines."
  },
  therapeutic_value: {
    name: "Therapeutic Value",
    category: "Emotional",
    icon: "droplet",
    theme: "pink",
    description: "Provides anxiety relief, calmness, reassurance, and peaceful comfort.",
    crmTip: "Ultra-quiet support windows, conversational calm chat interfaces, dynamic custom support SLA."
  },
  fun_entertainment: {
    name: "Fun & Entertainment",
    category: "Emotional",
    icon: "party-popper",
    theme: "pink",
    description: "Creates amusement, delight, interactive fun, and overall excitement.",
    crmTip: "Gamified scratchcards, interactive Easter eggs, mystery box distributions."
  },
  attractiveness: {
    name: "Attractiveness",
    category: "Emotional",
    icon: "eye",
    theme: "pink",
    description: "Enhances personal appeal, external style, look, or physical aesthetic styling.",
    crmTip: "Dynamic custom virtual profiles, personalized product recommendations, styling lookbooks."
  },
  provides_access: {
    name: "Provides Access",
    category: "Emotional",
    icon: "key",
    theme: "pink",
    description: "Provides exclusive access to limited resources, details, high-demand portals, or networks.",
    crmTip: "First-access lines, developer early beta groups, elite queue prioritization codes."
  },
  saves_time: {
    name: "Saves Time",
    category: "Functional",
    icon: "hourglass",
    theme: "emerald",
    description: "Enables operational tasks to be completed faster, freeing up client schedules.",
    crmTip: "Quick keyboard command loops, smart templates, instant single-tap purchase configurations."
  },
  simplifies: {
    name: "Simplifies",
    category: "Functional",
    icon: "wand-2",
    theme: "emerald",
    description: "Reduces process complexity and makes interfaces and workflows clear and direct.",
    crmTip: "Auto setups, unified command search bars, minimalist profile designs."
  },
  makes_money: {
    name: "Makes Money",
    category: "Functional",
    icon: "trending-up",
    theme: "emerald",
    description: "Helps generate, invest, save, or otherwise secure direct capital gains.",
    crmTip: "Incentivized high-return partner setups, cash kickback rules, ROI calculations dashboards."
  },
  reduces_risk: {
    name: "Reduces Risk",
    category: "Functional",
    icon: "shield-check",
    theme: "emerald",
    description: "Alleviates standard business/product uncertainties, threats, errors, or monetary loss.",
    crmTip: "Strict secure auth flows, standard client refund options, real-time diagnostic alerts."
  },
  organizes: {
    name: "Organizes",
    category: "Functional",
    icon: "layout-grid",
    theme: "emerald",
    description: "Enables clean, coherent, and structural categorizations of active assets.",
    crmTip: "Custom workspaces, folder categorizations, advanced tag search integrations."
  },
  integrates: {
    name: "Integrates",
    category: "Functional",
    icon: "puzzle",
    theme: "emerald",
    description: "Combines distinct software, platforms, or systems into a unified workflow.",
    crmTip: "Direct API webhooks configurations, automated syncing, platform integration extensions."
  },
  connects: {
    name: "Connects",
    category: "Functional",
    icon: "share-2",
    theme: "emerald",
    description: "Seamlessly bridges contact links, communications, and data pathways.",
    crmTip: "Client collaboration channels, centralized communications, interactive boards."
  },
  reduces_effort: {
    name: "Reduces Effort",
    category: "Functional",
    icon: "thumbs-up",
    theme: "emerald",
    description: "Decreases overall physical, cognitive, or manual labor required to operate.",
    crmTip: "Smart auto-fill integrations, conversational command scripts, quick-copy triggers."
  },
  avoids_hassles: {
    name: "Avoids Hassles",
    category: "Functional",
    icon: "check-circle",
    theme: "emerald",
    description: "Eliminates annoying operational tasks, difficulties, and platform friction.",
    crmTip: "Direct automated return triggers, flexible billing systems, continuous setup validation."
  },
  reduces_cost: {
    name: "Reduces Cost",
    category: "Functional",
    icon: "tag",
    theme: "emerald",
    description: "Lowers general overheads, operational expenditures, or individual setup fees.",
    crmTip: "Usage-based tier pricing, custom discount triggers, business saving calculators."
  },
  quality: {
    name: "Quality",
    category: "Functional",
    icon: "star",
    theme: "emerald",
    description: "Provides exceptional, reliable performance, operational excellence, and durability.",
    crmTip: "Uptime guarantee badges, SLA response notifications, dedicated server configurations."
  },
  variety: {
    name: "Variety",
    category: "Functional",
    icon: "layers",
    theme: "emerald",
    description: "Offers a wide diversity of customized parameters, components, and package selection paths.",
    crmTip: "Addon market interfaces, extensive library catalog integrations, multi-template profiles."
  },
  sensory_appeal: {
    name: "Sensory Appeal",
    category: "Functional",
    icon: "music",
    theme: "emerald",
    description: "Appeals directly to hearing, vision, feel, or sensory feedback components.",
    crmTip: "Elegant sound chimes, beautiful dark-mode contrasts, premium material packaging templates."
  },
  informs: {
    name: "Informs",
    category: "Functional",
    icon: "book-open",
    theme: "emerald",
    description: "Delivers valuable, vetted, highly trusted, and actionable knowledge metrics.",
    crmTip: "Weekly platform usage charts, direct learning portal integrations, market trend newsletters."
  }
};

// Industry templates presets
const industryTemplates: Record<string, Record<string, CampaignItem[]>> = {
  saas: {
    saves_time: [
      { id: "saas-st1", name: "Single-Click Workspace Setup", benefit: "Skip onboarding flow, launch template instantly", trigger: "Registration completion", channel: "In-app Modal", priority: "High", status: "live" }
    ],
    simplifies: [
      { id: "saas-simp1", name: "Interactive Smart Setup Wizard", benefit: "Guides the customer systematically avoiding layouts friction", trigger: "First login flow", channel: "Walkthrough Banner", priority: "High", status: "progress" }
    ],
    integrates: [
      { id: "saas-int1", name: "Zapier & Slack Integrations Dashboard", benefit: "Sync platform actions with notifications", trigger: "Integration setup trigger", channel: "Slack Dev Connect", priority: "Medium", status: "backlog" }
    ],
    quality: [
      { id: "saas-q1", name: "Live System Diagnostic Panel", benefit: "Provides complete visual assurance of uptime performance", trigger: "Admin dashboard visit", channel: "Header Ribbon Bar", priority: "Low", status: "live" }
    ],
    provides_access: [
      { id: "saas-acc1", name: "Exclusive Early Developer Beta Group", benefit: "Get direct beta privileges for new pipelines", trigger: "1 year tenant anniversary", channel: "Direct Executive Email", priority: "Medium", status: "progress" }
    ],
    motivation: [
      { id: "saas-mot1", name: "Weekly Workflow Usage Streaks", benefit: "Achieve performance streak levels for credits", trigger: "7-day continuous login logs", channel: "Dashboard Widget", priority: "High", status: "backlog" }
    ]
  },
  ecommerce: {
    reduces_cost: [
      { id: "ecom-rc1", name: "Automated Abandoned Basket Discount", benefit: "Recovers purchases with 15% incentive trigger", trigger: "Cart empty after 2 hours", channel: "WhatsApp Message Push", priority: "High", status: "live" }
    ],
    avoids_hassles: [
      { id: "ecom-ah1", name: "Self-Service Auto Return Labels", benefit: "Print pre-paid mailing receipts instantly", trigger: "Order dispute filed", channel: "Customer account desk", priority: "High", status: "live" }
    ],
    rewards_me: [
      { id: "ecom-rew1", name: "VIP Elite Birthday Gift Box", benefit: "Receive free signature sample with order", trigger: "Birthday calendar event", channel: "Customer Email Flow", priority: "Medium", status: "progress" }
    ],
    sensory_appeal: [
      { id: "ecom-sa1", name: "Sustainable Textured Box Wrapping", benefit: "Evoke elegance during delivery opening", trigger: "Cart checkout total > $150", channel: "Cart Checkout Add-on UI", priority: "Low", status: "backlog" }
    ],
    self_transcendence: [
      { id: "ecom-st1", name: "1-Click Charcoal Seed Donation", benefit: "We plant tree seed with purchase", trigger: "Every verified cart receipt", channel: "Success Notification Page", priority: "Medium", status: "progress" }
    ]
  },
  wealth: {
    makes_money: [
      { id: "wealth-mm1", name: "Automated High-Yield Sweep Action", benefit: "Sweep idle checks into interest balances", trigger: "Idle balance detected", channel: "App Account Alert", priority: "High", status: "live" }
    ],
    reduces_risk: [
      { id: "wealth-rr1", name: "Real-time Volatility Portfolio Shield", benefit: "Trigger portfolio warning shield", trigger: "Market volatility swings", channel: "Mobile App Modal Alert", priority: "High", status: "progress" }
    ],
    informs: [
      { id: "wealth-inf1", name: "Weekly Market Insights Newsletter", benefit: "Receive curated analysis directly from researchers", trigger: "Every Sunday 8am", channel: "Subscribers Digest", priority: "Medium", status: "live" }
    ],
    reduces_anxiety: [
      { id: "wealth-ra1", name: "Immediate Security Advisory Alert", benefit: "Alert client instantly when password changes", trigger: "Unfamiliar login patterns", channel: "Urgent SMS System", priority: "High", status: "progress" }
    ],
    self_actualization: [
      { id: "wealth-sa1", name: "Customized Financial Freedom Goals", benefit: "Visualize path to retirement target milestone", trigger: "Balance threshold matched", channel: "Visual Timeline Banner", priority: "Low", status: "backlog" }
    ]
  }
};

// Lucide Icon mapper helper
const IconComponent = ({ name, className }: { name: string, className?: string }) => {
  switch (name) {
    case 'globe': return <Globe className={className} />;
    case 'sparkles': return <Sparkles className={className} />;
    case 'award': return <Award className={className} />;
    case 'zap': return <Zap className={className} />;
    case 'history': return <History className={className} />;
    case 'users': return <Users className={className} />;
    case 'heart-pulse': return <Heart className={className} />;
    case 'gift': return <Gift className={className} />;
    case 'clock': return <Clock className={className} />;
    case 'palette': return <Palette className={className} />;
    case 'shield': return <Shield className={className} />;
    case 'activity': return <Activity className={className} />;
    case 'droplet': return <Droplet className={className} />;
    case 'eye': return <Eye className={className} />;
    case 'key': return <Key className={className} />;
    case 'hourglass': return <Hourglass className={className} />;
    case 'wand-2': return <Wand2 className={className} />;
    case 'trending-up': return <TrendingUp className={className} />;
    case 'shield-check': return <ShieldCheck className={className} />;
    case 'layout-grid': return <LayoutGrid className={className} />;
    case 'puzzle': return <Puzzle className={className} />;
    case 'share-2': return <Share2 className={className} />;
    case 'thumbs-up': return <ThumbsUp className={className} />;
    case 'check-circle': return <CheckCircle className={className} />;
    case 'tag': return <Tag className={className} />;
    case 'star': return <Star className={className} />;
    case 'layers': return <Layers className={className} />;
    case 'music': return <Music className={className} />;
    case 'book-open': return <BookOpen className={className} />;
    default: return <Globe className={className} />;
  }
};

export default function BainElementsTool({ onCalculateRun }: BainElementsToolProps) {
  // Setup campaigns state map (initially empty arrays for all 30 elements)
  const [campaignsData, setCampaignsData] = useState<Record<string, CampaignItem[]>>(() => {
    const fresh: Record<string, CampaignItem[]> = {};
    Object.keys(elementsDefinition).forEach(key => {
      fresh[key] = [];
    });
    return fresh;
  });

  const [activeElementId, setActiveElementId] = useState<string>("self_transcendence");
  const [bainMode, setBainMode] = useState<'simple' | 'advanced'>('simple');
  const [simpleInputName, setSimpleInputName] = useState<string>('');

  // Advanced Mode Inputs
  const [advName, setAdvName] = useState<string>('');
  const [advBenefit, setAdvBenefit] = useState<string>('');
  const [advTrigger, setAdvTrigger] = useState<string>('');
  const [advChannel, setAdvChannel] = useState<string>('');
  const [advStage, setAdvStage] = useState<'backlog' | 'progress' | 'live'>('backlog');

  // Drag and drop helper state
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  // Summary Modal & Alert States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastAlert, setToastAlert] = useState<{ title: string; message: string; show: boolean; mode: 'success' | 'warn' | 'info' }>({
    title: '',
    message: '',
    show: false,
    mode: 'success'
  });

  // Pre-load SaaS template on initial load
  useEffect(() => {
    loadTemplate('saas');
  }, []);

  const triggerAlert = (title: string, message: string, mode: 'success' | 'warn' | 'info' = 'success') => {
    setToastAlert({ title, message, show: true, mode });
    setTimeout(() => {
      setToastAlert(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  const loadTemplate = (key: 'saas' | 'ecommerce' | 'wealth') => {
    const template = industryTemplates[key];
    if (template) {
      const fresh: Record<string, CampaignItem[]> = {};
      Object.keys(elementsDefinition).forEach(k => {
        fresh[k] = template[k] ? [...template[k]] : [];
      });
      setCampaignsData(fresh);
      onCalculateRun();
      triggerAlert(`${key.toUpperCase()} Template Active`, "Pre-configured industry matrices synced successfully.", "info");
    }
  };

  const resetBoard = () => {
    const fresh: Record<string, CampaignItem[]> = {};
    Object.keys(elementsDefinition).forEach(k => {
      fresh[k] = [];
    });
    setCampaignsData(fresh);
    onCalculateRun();
    triggerAlert("Framework Reset", "All campaigns databases successfully cleared.", "warn");
  };

  const selectElement = (id: string) => {
    setActiveElementId(id);
  };

  const addSimpleCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simpleInputName.trim()) {
      triggerAlert("Attention", "Please specify a campaign or initiative name.", "warn");
      return;
    }

    const item: CampaignItem = {
      id: "c-" + Date.now() + Math.random().toString(36).substr(2, 4),
      name: simpleInputName.trim(),
      benefit: "N/A",
      trigger: "N/A",
      channel: "CRM Engine",
      priority: "Medium",
      status: "backlog"
    };

    setCampaignsData(prev => ({
      ...prev,
      [activeElementId]: [...(prev[activeElementId] || []), item]
    }));

    setSimpleInputName('');
    onCalculateRun();
    triggerAlert("Added to Backlog", `Campaign "${item.name}" added.`, "success");
  };

  const addAdvancedCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advName.trim()) {
      triggerAlert("Attention", "Please specify a campaign or initiative name.", "warn");
      return;
    }

    const item: CampaignItem = {
      id: "c-" + Date.now() + Math.random().toString(36).substr(2, 4),
      name: advName.trim(),
      benefit: advBenefit.trim() || "N/A",
      trigger: advTrigger.trim() || "N/A",
      channel: advChannel.trim() || "N/A",
      priority: "High",
      status: advStage
    };

    setCampaignsData(prev => ({
      ...prev,
      [activeElementId]: [...(prev[activeElementId] || []), item]
    }));

    // Reset Form
    setAdvName('');
    setAdvBenefit('');
    setAdvTrigger('');
    setAdvChannel('');
    setAdvStage('backlog');

    onCalculateRun();
    triggerAlert("Blueprint Saved", "Advanced initiative successfully added.", "success");
  };

  const deleteCampaign = (itemId: string) => {
    setCampaignsData(prev => {
      const currentList = prev[activeElementId] || [];
      const updatedList = currentList.filter(item => item.id !== itemId);
      return {
        ...prev,
        [activeElementId]: updatedList
      };
    });
    onCalculateRun();
    triggerAlert("Campaign Deleted", "Campaign successfully removed.", "warn");
  };

  const moveCampaignStatus = (itemId: string, status: 'backlog' | 'progress' | 'live') => {
    setCampaignsData(prev => {
      const currentList = prev[activeElementId] || [];
      const updatedList = currentList.map(item => {
        if (item.id === itemId) {
          return { ...item, status };
        }
        return item;
      });
      return {
        ...prev,
        [activeElementId]: updatedList
      };
    });
    onCalculateRun();
  };

  // Drag-and-drop actions
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setHoveredColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (hoveredColumn !== columnId) {
      setHoveredColumn(columnId);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: 'backlog' | 'progress' | 'live') => {
    e.preventDefault();
    if (draggedItemId) {
      moveCampaignStatus(draggedItemId, targetStatus);
      triggerAlert("Moved Status", `Changed stage to ${targetStatus === 'backlog' ? 'Ideas' : targetStatus === 'progress' ? 'Development' : 'Live'}.`, "success");
    }
    setDraggedItemId(null);
    setHoveredColumn(null);
  };

  // Markdown copier
  const copyStrategyMarkdown = () => {
    let markdown = `# Bain 30 Elements of Value CRM Roadmap\n*Generated on ${new Date().toLocaleDateString('id-ID')}*\n\n`;

    Object.keys(elementsDefinition).forEach(key => {
      const element = elementsDefinition[key];
      const campaigns = campaignsData[key] || [];

      if (campaigns.length > 0) {
        markdown += `## ${element.name} (${element.category})\n`;
        markdown += `*   **Value Statement:** ${element.description}\n`;
        markdown += `*   **CRM Recommendation:** ${element.crmTip}\n\n`;
        
        markdown += `| Initiative Name | Status | Customer Benefit | Trigger Event | Channel |\n`;
        markdown += `| :--- | :--- | :--- | :--- | :--- |\n`;
        campaigns.forEach(c => {
          markdown += `| ${c.name} | ${c.status === 'live' ? 'Live' : c.status === 'progress' ? 'In Dev' : 'Backlog'} | ${c.benefit} | ${c.trigger} | ${c.channel} |\n`;
        });
        markdown += `\n`;
      }
    });

    navigator.clipboard.writeText(markdown).then(() => {
      triggerAlert("Markdown Copied!", "Directly paste into your marketing specs.", "success");
    }).catch(() => {
      triggerAlert("Error", "Could not copy strategy automatically.", "warn");
    });
  };

  const copyAiAnalysisPrompt = () => {
    let elementDetails = "";
    Object.keys(elementsDefinition).forEach(key => {
      const element = elementsDefinition[key];
      const campaigns = campaignsData[key] || [];
      if (campaigns.length > 0) {
        elementDetails += `- **${element.name}** (${element.category}): ${element.description}\n`;
        campaigns.forEach(c => {
          elementDetails += `  * Initiative: ${c.name} (Status: ${c.status === 'live' ? 'Live' : c.status === 'progress' ? 'In Development' : 'Backlog'}, Benefit: ${c.benefit}, Trigger: ${c.trigger}, Channel: ${c.channel})\n`;
        });
      }
    });

    const promptText = `I have completed a Bain 30 Elements of Value CRM Alignment brainstorm. Here is the configuration I designed:

${elementDetails || "No elements or campaigns configured yet."}

Please act as a senior CRM strategist and CRM marketing specialist. Analyze my roadmap and help me:
1. Provide a detailed strategic analysis and validation of our selected value elements.
2. Draft 3 persuasive copywriting examples for dynamic CRM emails or push-notification sequences matching the trigger events configured above.
3. Suggest a phased, highly tactical execution plan (Quick Wins, Medium term, Long term) for these initiatives.
4. Recommend key performance indicators (KPIs) to measure of our selected high-priority value elements.`;

    navigator.clipboard.writeText(promptText).then(() => {
      triggerAlert("AI Prompt Copied!", "Paste it into your chosen AI platform (ChatGPT, Claude, Gemini, etc.) to get an instant analysis!", "success");
    }).catch(() => {
      triggerAlert("Error", "Could not copy AI analysis prompt.", "warn");
    });
  };

  const activeElement = elementsDefinition[activeElementId];
  const activeCampaigns = campaignsData[activeElementId] || [];

  // Categorize campaigns for visual markers
  const getThemeColors = (theme: "indigo" | "violet" | "pink" | "emerald") => {
    switch (theme) {
      case 'indigo': return { bg: 'bg-indigo-50 hover:bg-indigo-100/70 border-indigo-200 text-indigo-900', selected: 'ring-2 ring-indigo-500 bg-indigo-600 border-indigo-600 text-white shadow-md' };
      case 'violet': return { bg: 'bg-violet-50 hover:bg-violet-100/70 border-violet-200 text-violet-900', selected: 'ring-2 ring-violet-500 bg-violet-600 border-violet-600 text-white shadow-md' };
      case 'pink': return { bg: 'bg-pink-50 hover:bg-pink-100/70 border-pink-200 text-pink-900', selected: 'ring-2 ring-pink-500 bg-pink-600 border-pink-600 text-white shadow-md' };
      case 'emerald': return { bg: 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200 text-emerald-900', selected: 'ring-2 ring-emerald-500 bg-emerald-600 border-emerald-600 text-white shadow-md' };
    }
  };

  const getThemeClass = (theme: "indigo" | "violet" | "pink" | "emerald") => {
    switch (theme) {
      case 'indigo': return 'bg-indigo-600 text-white border-indigo-500';
      case 'violet': return 'bg-violet-600 text-white border-violet-500';
      case 'pink': return 'bg-pink-600 text-white border-pink-500';
      case 'emerald': return 'bg-emerald-600 text-white border-emerald-500';
    }
  };

  const renderPyramidBlock = (id: string, name: string) => {
    const config = elementsDefinition[id];
    if (!config) return null;
    const isSelected = activeElementId === id;
    const count = (campaignsData[id] || []).length;
    const styles = getThemeColors(config.theme);

    return (
      <button
        key={id}
        type="button"
        onClick={() => selectElement(id)}
        className={`element-node flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 border text-center shadow-xs cursor-pointer select-none text-xs min-h-[54px] max-h-[64px] relative group ${isSelected ? styles.selected : styles.bg}`}
      >
        <span className="mb-0.5"><IconComponent name={config.icon} className={`h-4 w-4 shrink-0 duration-200 ${isSelected ? 'text-white' : 'opacity-80'}`} /></span>
        <span className="text-[9px] sm:text-[9.5px] font-extrabold tracking-tight leading-none block truncate max-w-full">{name}</span>
        
        {/* Count Indicator Circle inside the block button */}
        {count > 0 && (
          <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8.5px] font-bold border ${isSelected ? 'bg-white text-indigo-900 border-indigo-500' : 'bg-slate-900 text-white border-slate-700'}`}>
            {count}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left select-none relative font-sans">
      
      {/* Dynamic Alert Banner Notifications */}
      {toastAlert.show && (
        <div className="fixed bottom-6 right-6 z-[120] bg-white text-slate-850 px-5 py-3.5 rounded-xl border border-slate-200 shadow-2xl flex items-center space-x-3 transition-all duration-300 transform translate-y-0">
          <div className={`p-2 rounded-lg border ${toastAlert.mode === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : toastAlert.mode === 'warn' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
            {toastAlert.mode === 'success' ? <Check className="h-4 w-4" /> : <Info className="h-4 w-4" />}
          </div>
          <div>
            <span className="text-xs font-bold block text-slate-900">{toastAlert.title}</span>
            <span className="text-[11px] text-slate-500">{toastAlert.message}</span>
          </div>
        </div>
      )}

      {/* Control Actions & Template selectors Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 p-4 border border-slate-200/60 rounded-2xl shadow-xs">
        {/* Simple vs Advanced mode toggler pill */}
        <div className="flex items-center space-x-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200 text-xs self-start shrink-0">
          <button
            type="button"
            onClick={() => setBainMode('simple')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${bainMode === 'simple' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Sliders className="h-3.5 w-3.5" />
            Simple Matrix
          </button>
          <button
            type="button"
            onClick={() => setBainMode('advanced')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${bainMode === 'advanced' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <ClipboardList className="h-3.5 w-3.5" />
            Advanced Workdesk
          </button>
        </div>

        {/* Templates Selector pills and resets */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mr-1">Industry Presets:</span>
          <button
            type="button"
            onClick={() => loadTemplate('saas')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-semibold cursor-pointer transition-colors"
          >
            SaaS Core
          </button>
          <button
            type="button"
            onClick={() => loadTemplate('ecommerce')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-semibold cursor-pointer transition-colors"
          >
            E-Commerce
          </button>
          <button
            type="button"
            onClick={() => loadTemplate('wealth')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-semibold cursor-pointer transition-colors"
          >
            Wealth / FinTech
          </button>

          <button
            type="button"
            onClick={resetBoard}
            className="p-2 border border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-xl transition-all ml-1 cursor-pointer"
            title="Wipe Matrix Clean"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={copyAiAnalysisPrompt}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-white font-extrabold px-4 py-2 rounded-xl transition shadow-md shadow-amber-500/10 cursor-pointer ml-1 animate-pulse"
            title="Salin prompt analisis AI berbasis data konfigurasi saat ini"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Analyze with AI
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-4 py-2 rounded-xl transition shadow-md shadow-indigo-600/10 cursor-pointer ml-1"
          >
            <FileText className="h-3.5 w-3.5" />
            Export Blueprint
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Pyramid Frame (Left) & Configuration workspace (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Geometric Interactive value Pyramid */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-white border border-slate-200 rounded-3xl p-5 lg:p-6 shadow-xs select-none">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md">Bain Strategy Matrix</span>
                <h3 className="text-lg lg:text-xl font-black text-slate-900 mt-2 tracking-tight">The 30 Elements of Value Pyramid</h3>
              </div>
              <span className="bg-indigo-50/70 text-indigo-600 text-[11px] px-2.5 py-1 rounded-full font-bold border border-indigo-100/50 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
                Active Blueprint Workdesk
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Pilih salah satu blok pembangun nilai di bawah untuk meninjau kecocokan CRM, merumuskan inisiatif kampanye, dan memetakan prioritas implementasinya.
            </p>
          </div>

          {/* Geometric Pyramid Container */}
          <div className="space-y-3.5 py-4 w-full flex flex-col items-center overflow-x-auto">
            
            {/* TIER 4: SOCIAL IMPACT (PEAK) */}
            <div className="w-full min-w-[320px] max-w-sm bg-indigo-50/30 border border-indigo-200/60 rounded-2xl p-2.5 flex flex-col items-center">
              <span className="text-[8.5px] font-bold text-indigo-500 tracking-wider uppercase mb-2">Social Impact (Peak Element)</span>
              <div className="flex justify-center w-full">
                <div className="w-36">
                  {renderPyramidBlock("self_transcendence", "Self-Transcendence")}
                </div>
              </div>
            </div>

            {/* TIER 3: LIFE CHANGING */}
            <div className="w-full min-w-[320px] max-w-lg bg-violet-50/20 border border-violet-200/50 rounded-2xl p-2.5 flex flex-col items-center">
              <span className="text-[8.5px] font-bold text-violet-500 tracking-wider uppercase mb-2">Life Changing (5 Elements)</span>
              <div className="grid grid-cols-5 gap-2 w-full">
                {renderPyramidBlock("provides_hope", "Hope")}
                {renderPyramidBlock("self_actualization", "Actualize")}
                {renderPyramidBlock("motivation", "Motivation")}
                {renderPyramidBlock("heirloom", "Heirloom")}
                {renderPyramidBlock("affiliation_belonging", "Belonging")}
              </div>
            </div>

            {/* TIER 2: EMOTIONAL */}
            <div className="w-full min-w-[320px] max-w-xl bg-pink-50/20 border border-pink-200/50 rounded-2xl p-2.5 flex flex-col items-center">
              <span className="text-[8.5px] font-bold text-pink-500 tracking-wider uppercase mb-2">Emotional (10 Elements)</span>
              
              <div className="flex flex-col gap-2 w-full">
                <div className="grid grid-cols-5 gap-2">
                  {renderPyramidBlock("reduces_anxiety", "Anxiety")}
                  {renderPyramidBlock("rewards_me", "Rewards")}
                  {renderPyramidBlock("nostalgia", "Nostalgia")}
                  {renderPyramidBlock("design_aesthetics", "Aesthetics")}
                  {renderPyramidBlock("badge_value", "Badge")}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {renderPyramidBlock("wellness", "Wellness")}
                  {renderPyramidBlock("therapeutic_value", "Therapy")}
                  {renderPyramidBlock("fun_entertainment", "Fun")}
                  {renderPyramidBlock("attractiveness", "Appeal")}
                  {renderPyramidBlock("provides_access", "Access")}
                </div>
              </div>
            </div>

            {/* TIER 1: FUNCTIONAL (FOUNDATION) */}
            <div className="w-full min-w-[320px] bg-emerald-50/20 border border-emerald-200/50 rounded-2xl p-2.5 flex flex-col items-center">
              <span className="text-[8.5px] font-bold text-emerald-500 tracking-wider uppercase mb-2">Functional Base (14 Elements)</span>
              <div className="flex flex-col gap-2 w-full">
                <div className="grid grid-cols-7 gap-1.5">
                  {renderPyramidBlock("saves_time", "Saves Time")}
                  {renderPyramidBlock("simplifies", "Simplifies")}
                  {renderPyramidBlock("makes_money", "Makes $$")}
                  {renderPyramidBlock("reduces_risk", "Risk")}
                  {renderPyramidBlock("organizes", "Organizes")}
                  {renderPyramidBlock("integrates", "Integrates")}
                  {renderPyramidBlock("connects", "Connects")}
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {renderPyramidBlock("reduces_effort", "Effort")}
                  {renderPyramidBlock("avoids_hassles", "Hassles")}
                  {renderPyramidBlock("reduces_cost", "Cost")}
                  {renderPyramidBlock("quality", "Quality")}
                  {renderPyramidBlock("variety", "Variety")}
                  {renderPyramidBlock("sensory_appeal", "Sensory")}
                  {renderPyramidBlock("informs", "Informs")}
                </div>
              </div>
            </div>

          </div>

          {/* Strategic Legend Area */}
          <div className="border-t border-slate-100 pt-4 flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><IconComponent name="trending-up" className="h-3.5 w-3.5 text-indigo-500" /> Margin Premium Peak</span>
            <span className="flex items-center gap-1.5"><IconComponent name="layout-grid" className="h-3.5 w-3.5 text-emerald-500" /> Functional Foundation</span>
          </div>
        </div>

        {/* Right Column: Workdesk Panels & Forms */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          
          {/* Active Element Inspector & Brainstorm Campaign Form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 lg:p-6 shadow-xs relative">
            
            {/* Header Inspector Block */}
            <div className="flex items-center space-x-3.5 pb-4 border-b border-rose-50/10 border-slate-100 mb-4 text-left">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0 transition-all duration-300 ${getThemeClass(activeElement.theme)}`}>
                <IconComponent name={activeElement.icon} className="h-5.5 w-5.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest">{activeElement.category} Level</span>
                  <span className="bg-indigo-50 text-indigo-600 text-[8.5px] font-bold px-2 py-0.5 rounded border border-indigo-100/60 uppercase tracking-wider">Selected</span>
                </div>
                <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate">{activeElement.name}</h4>
              </div>
            </div>

            {/* Value description */}
            <div className="space-y-3 mb-5 text-left">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {activeElement.description}
              </p>
              <div className="bg-indigo-50/40 p-3 rounded-xl border border-indigo-100/45 text-xs text-indigo-950 flex items-start gap-2 max-w-full">
                <span className="p-0.5 bg-indigo-100 text-indigo-600 rounded shrink-0.5"><Info className="h-3.5 w-3.5" /></span>
                <p className="italic leading-relaxed flex-1">
                  <strong>CRM Alignment Tip:</strong> {activeElement.crmTip}
                </p>
              </div>
            </div>

            {/* Campaign form switcher based on simple vs advanced */}
            {bainMode === 'simple' ? (
              <form onSubmit={addSimpleCampaign} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 text-left">
                <h5 className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                  <PlusCircle className="h-4 w-4" />
                  Quick Brainstorm Campaign
                </h5>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={simpleInputName}
                    onChange={(e) => setSimpleInputName(e.target.value)}
                    placeholder="e.g. Eco-Donation Matches program"
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-605 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-4 py-2 rounded-lg text-xs transition flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus className="h-4.5 w-4.5" />
                    Add
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={addAdvancedCampaign} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4 text-left">
                <h5 className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                  <PlusCircle className="h-4 w-4" />
                  Deploy Advanced Campaign Blueprint
                </h5>

                <div className="space-y-1">
                  <label className="block text-[9.5px] font-extrabold text-slate-450 text-slate-550 text-slate-500 uppercase tracking-wider">Campaign Name</label>
                  <input
                    type="text"
                    required
                    value={advName}
                    onChange={(e) => setAdvName(e.target.value)}
                    placeholder="e.g. Green Purchase Eco-Contribution Program"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider">Customer Benefit</label>
                    <input
                      type="text"
                      value={advBenefit}
                      onChange={(e) => setAdvBenefit(e.target.value)}
                      placeholder="e.g. 1% matching donations"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider">Data Trigger event</label>
                    <input
                      type="text"
                      value={advTrigger}
                      onChange={(e) => setAdvTrigger(e.target.value)}
                      placeholder="e.g. purchase invoice event"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 font-sans text-xs">
                  <div className="space-y-1">
                    <label className="block text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider">CRM Channel</label>
                    <input
                      type="text"
                      value={advChannel}
                      onChange={(e) => setAdvChannel(e.target.value)}
                      placeholder="e.g. Checkout Receipt screen"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider">Strategic Stage</label>
                    <select
                      value={advStage}
                      onChange={(e) => setAdvStage(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                    >
                      <option value="backlog">Backlog / Backburner</option>
                      <option value="progress">In Development</option>
                      <option value="live">Live / Active</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Save Blueprint specs
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* simple Kanban Board (Simple Mode toggle) */}
          {bainMode === 'simple' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 lg:p-6 shadow-xs flex-1 flex flex-col min-h-[420px] transition-all">
              <div className="border-b border-slate-100 pb-3 mb-4 text-left">
                <h4 className="text-xs font-black text-indigo-650 text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Kanban className="h-4.5 w-4.5" />
                  Interactive Kanban Board
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Drag & drop cards or tap step controls to priority schedule campaigns</p>
              </div>

              {/* Kanban Columns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 flex-1 h-full min-h-[350px]">
                
                {/* BACKLOG COLUMN */}
                <div
                  onDragOver={(e) => handleDragOver(e, 'backlog')}
                  onDrop={(e) => handleDrop(e, 'backlog')}
                  className={`bg-slate-50/70 border p-3 rounded-2xl flex flex-col min-h-[220px] transition-colors duration-200 ${hoveredColumn === 'backlog' ? 'bg-indigo-500/5 border-indigo-300' : 'border-slate-200/80'}`}
                >
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-1 shrink-0">
                    <span className="text-[10px] font-black text-amber-600 block">💡 Backlog</span>
                    <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {activeCampaigns.filter(c => c.status === 'backlog').length}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1 flex flex-col gap-1 overflow-y-auto max-h-[280px]">
                    {activeCampaigns.filter(c => c.status === 'backlog').map(item => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        onDragEnd={handleDragEnd}
                        className="bg-white border border-slate-200 hover:border-slate-300 p-3 rounded-xl shadow-xs transition duration-200 cursor-grab active:cursor-grabbing flex flex-col justify-between"
                      >
                        <span className="text-[11px] font-bold text-slate-800 tracking-tight leading-snug break-words">{item.name}</span>
                        
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveCampaignStatus(item.id, 'progress')}
                            className="bg-slate-100 hover:bg-sky-50 text-[10px] hover:text-sky-600 p-1 rounded font-bold transition flex items-center gap-0.5 cursor-pointer text-slate-500"
                            title="Move to Development"
                          >
                            <span>Proses</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => deleteCampaign(item.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5 hover:text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {activeCampaigns.filter(c => c.status === 'backlog').length === 0 && (
                      <span className="text-[10px] text-slate-400 italic block py-4 text-center select-none font-medium">Bebas antrean</span>
                    )}
                  </div>
                </div>

                {/* DEVELOPMENT COLUMN */}
                <div
                  onDragOver={(e) => handleDragOver(e, 'progress')}
                  onDrop={(e) => handleDrop(e, 'progress')}
                  className={`bg-slate-50/70 border p-3 rounded-2xl flex flex-col min-h-[220px] transition-colors duration-200 ${hoveredColumn === 'progress' ? 'bg-indigo-500/5 border-indigo-300' : 'border-slate-200/80'}`}
                >
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-1 shrink-0">
                    <span className="text-[10px] font-black text-sky-600 block">🛠️ In Dev</span>
                    <span className="bg-sky-100 text-sky-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {activeCampaigns.filter(c => c.status === 'progress').length}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1 flex flex-col gap-1 overflow-y-auto max-h-[280px]">
                    {activeCampaigns.filter(c => c.status === 'progress').map(item => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        onDragEnd={handleDragEnd}
                        className="bg-white border border-slate-200 hover:border-slate-300 p-3 rounded-xl shadow-xs transition duration-200 cursor-grab active:cursor-grabbing flex flex-col justify-between"
                      >
                        <span className="text-[11px] font-bold text-slate-800 tracking-tight leading-snug break-words">{item.name}</span>
                        
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveCampaignStatus(item.id, 'backlog')}
                            className="text-slate-400 hover:text-amber-600 p-1 text-[10px] rounded font-semibold flex items-center cursor-pointer gap-0.5"
                            title="Return to Backlog"
                          >
                            <ArrowLeft className="h-3 w-3" />
                            <span>Ide</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => moveCampaignStatus(item.id, 'live')}
                            className="bg-slate-100 hover:bg-emerald-50 text-[10px] hover:text-emerald-600 p-1 rounded font-bold transition flex items-center gap-0.5 cursor-pointer text-slate-500"
                            title="Publish Live"
                          >
                            <span>Live</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {activeCampaigns.filter(c => c.status === 'progress').length === 0 && (
                      <span className="text-[10px] text-slate-400 italic block py-4 text-center select-none font-medium">Belum direncanakan</span>
                    )}
                  </div>
                </div>

                {/* LIVE / ACTIVE COLUMN */}
                <div
                  onDragOver={(e) => handleDragOver(e, 'live')}
                  onDrop={(e) => handleDrop(e, 'live')}
                  className={`bg-slate-50/70 border p-3 rounded-2xl flex flex-col min-h-[220px] transition-colors duration-200 ${hoveredColumn === 'live' ? 'bg-indigo-500/5 border-indigo-300' : 'border-slate-200/80'}`}
                >
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-1 shrink-0">
                    <span className="text-[10px] font-black text-emerald-600 block">🚀 Active / Live</span>
                    <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {activeCampaigns.filter(c => c.status === 'live').length}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1 flex flex-col gap-1 overflow-y-auto max-h-[280px]">
                    {activeCampaigns.filter(c => c.status === 'live').map(item => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        onDragEnd={handleDragEnd}
                        className="bg-white border border-slate-200 hover:border-slate-300 p-3 rounded-xl shadow-xs transition duration-200 cursor-grab active:cursor-grabbing flex flex-col justify-between"
                      >
                        <span className="text-[11px] font-bold text-slate-800 tracking-tight leading-snug break-words">{item.name}</span>
                        
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveCampaignStatus(item.id, 'progress')}
                            className="text-slate-400 hover:text-sky-600 p-1 text-[10px] rounded font-semibold flex items-center cursor-pointer gap-0.5"
                            title="Move back to Development"
                          >
                            <ArrowLeft className="h-3 w-3" />
                            <span>Proses</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {activeCampaigns.filter(c => c.status === 'live').length === 0 && (
                      <span className="text-[10px] text-slate-400 italic block py-4 text-center select-none font-medium">Belum ada aktif</span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Advanced detailed list (Advanced Mode toggle) */}
          {bainMode === 'advanced' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 lg:p-6 shadow-xs flex-1 flex flex-col min-h-[420px] transition-all">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <div className="text-left animate-fadeIn">
                  <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 animate-pulseFast">
                    <ClipboardList className="h-4.5 w-4.5" />
                    Advanced Workdesk Specifications
                  </h4>
                  <p className="text-[11px] text-slate-450 mt-0.5">Specifications detail list for elements mapped strategy</p>
                </div>
                <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-bold border border-slate-200">
                  {activeCampaigns.length} Campaign(s)
                </span>
              </div>

              {/* Empty State */}
              {activeCampaigns.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-55 bg-slate-50/50 border border-dashed border-slate-200/80 rounded-2xl">
                  <span className="text-indigo-400 mb-2 bg-indigo-50 p-2.5 rounded-full border border-indigo-100"><ClipboardList className="h-6 w-6" /></span>
                  <h5 className="text-xs font-bold text-slate-700 mb-1">No blueprints drafted under this block</h5>
                  <p className="text-[10.5px] text-slate-400 max-w-xs leading-normal">Pilih blok lain atau ciptakan draf spesifikasi kampanye di panel formulir atas.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {activeCampaigns.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col hover:border-slate-300 transition-all text-left">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-grow">
                          <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded-full border inline-block ${
                            item.status === 'live' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : item.status === 'progress' 
                                ? 'bg-sky-50 text-sky-700 border-sky-100' 
                                : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {item.status === 'live' ? 'Live' : item.status === 'progress' ? 'In Development' : 'Backlog'}
                          </span>
                          <h5 className="text-xs font-extrabold text-slate-900 mt-1.5 leading-snug break-words">{item.name}</h5>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteCampaign(item.id)}
                          className="text-slate-400 hover:text-red-500 p-1 hover:bg-slate-50 rounded-lg transition"
                          title="Wipe spec"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-slate-100 text-[10px] text-slate-500">
                        <div>
                          <span className="font-bold text-slate-400 block uppercase tracking-wider text-[8px]">Client Benefit</span>
                          <span className="text-slate-700 font-semibold line-clamp-1">{item.benefit}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-400 block uppercase tracking-wider text-[8px]">Trigger event</span>
                          <span className="text-slate-700 font-semibold line-clamp-1">{item.trigger}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-400 block uppercase tracking-wider text-[8px]">CRM Channel</span>
                          <span className="text-indigo-600 font-bold line-clamp-1">{item.channel}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Export overlay modal strategy canvas */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-[130] p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-3xl border border-slate-205 shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-fadeIn">
            
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                  <Triangle className="h-5 w-5" />
                </span>
                <div className="text-left">
                  <h3 className="text-base font-black text-slate-900 tracking-tight">CRM Value Elements Roadmap</h3>
                  <p className="text-[11px] text-slate-450 font-medium h-3 opacity-90 text-slate-400">Comprehensive customer experience alignment blueprint</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-650 p-1.5 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scroll body */}
            <div className="p-6 overflow-y-auto space-y-6 text-left flex-1 bg-slate-100/40 font-sans">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-5">
                  <div className="text-left">
                    <h2 className="text-base lg:text-lg font-black text-indigo-900 tracking-wide uppercase">Bain 30 Elements of Value CRM Alignment Blueprint</h2>
                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">Structured Core Roadmapping specifications</p>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 border border-indigo-100 font-bold px-3 py-1 rounded-full mt-2 sm:mt-0">
                    Generated: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>

                {/* Categories Breakdown Blocks */}
                <div className="space-y-4">
                  {(["Social Impact", "Life Changing", "Emotional", "Functional"] as const).map(catName => {
                    const keys = Object.keys(elementsDefinition).filter(k => elementsDefinition[k].category === catName);
                    
                    // Accumulate all campaigns matching this level
                    const categorizedCampaigns: Array<{ element: string; theme: string } & CampaignItem> = [];
                    keys.forEach(k => {
                      const list = campaignsData[k] || [];
                      list.forEach(c => {
                        categorizedCampaigns.push({ element: elementsDefinition[k].name, theme: elementsDefinition[k].theme, ...c });
                      });
                    });

                    // Theme divider class
                    const themeClasses = {
                      "Social Impact": "border-indigo-400 bg-indigo-50/20",
                      "Life Changing": "border-violet-400 bg-violet-50/20",
                      "Emotional": "border-pink-400 bg-pink-50/20",
                      "Functional": "border-emerald-400 bg-emerald-50/20"
                    };

                    return (
                      <div key={catName} className={`border-l-4 p-4 rounded-r-xl border border-slate-200/65 ${themeClasses[catName]}`}>
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3">{catName} Level</h4>
                        
                        {categorizedCampaigns.length === 0 ? (
                          <p className="text-slate-400 text-xs italic">No draf campaigns formulated for this level yet.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="border-b border-slate-200 font-bold text-slate-500 uppercase text-[9px] tracking-wider">
                                  <th className="pb-2 pr-2">Value Element</th>
                                  <th className="pb-2 pr-2">Campaign Initiative</th>
                                  <th className="pb-2 pr-2">Strategic Status</th>
                                  <th className="pb-2 pr-2">Benefit</th>
                                  <th className="pb-2">Channel</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-700">
                                {categorizedCampaigns.map(c => (
                                  <tr key={c.id}>
                                    <td className="py-2.5 font-bold text-slate-900 pr-2">{c.element}</td>
                                    <td className="py-2.5 text-slate-800 pr-2 font-medium">{c.name}</td>
                                    <td className="py-2.5 pr-2">
                                      <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold border ${
                                        c.status === 'live' 
                                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                          : c.status === 'progress' 
                                            ? 'bg-sky-50 text-sky-700 border-sky-105' 
                                            : 'bg-amber-50 text-amber-750 text-amber-700 border-amber-100'
                                      }`}>
                                        {c.status === 'live' ? 'Live' : c.status === 'progress' ? 'Dev' : 'Backlog'}
                                      </span>
                                    </td>
                                    <td className="py-2.5 text-slate-500 pr-2 truncate max-w-[140px]">{c.benefit}</td>
                                    <td className="py-2.5 text-indigo-650 font-bold text-xs">{c.channel}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={copyStrategyMarkdown}
                className="flex items-center gap-1.5 text-slate-600 hover:text-slate-800 font-bold border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl transition cursor-pointer text-xs"
              >
                <Copy className="h-4 w-4" />
                Copy Markdown
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 bg-indigo-650 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer text-xs"
              >
                <Printer className="h-4 w-4" />
                Print PDF Strategy Blueprint
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
