export interface Agent {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    description: string;
    categories: Array<'writing' | 'coding' | 'sales' | 'customer-support' | 'data-analysis' | 'research' | 'marketing' | 'productivity' | 'email' | 'transcription' | 'document-analysis' | 'scheduling' | 'seo' | 'social-media' | 'accounting' | 'home-improvement' | 'image-generation' | 'video-generation' | 'voice-audio' | 'automation'>;
    website: string;
    pricing: string;
    paymentOptions: {
        isPaid: boolean;
        hasFreeTrialPeriod: boolean;
        hasFreeStarterPlan: boolean;
    };
    logo?: string;
    screenshots?: string[];
    videos?: Array<{
        type: 'video';
        url: string;
        alt: string;
        videoUid: string;
    }>;
    features: string[];
    useCases: string[];
    addedDate: string;
}

export const agents: Agent[] = [
    {
        id: "1",
        name: "Claude",
        slug: "claude",
        tagline: "Claude is AI for all of us",
        description: "Claude is Anthropic's family of large language models designed to be helpful, harmless, and honest. Built using Constitutional AI, Claude combines best-in-class jailbreak resistance and misuse prevention while providing superior performance for complex analysis, coding, and writing tasks.",
        categories: ["writing", "coding", "research"],
        website: "https://www.anthropic.com/claude",
        pricing: "Free Plan available, Pro: $20/month ($17/month annual), Max: $100-200/month, Team: Contact for pricing, Enterprise: $60/seat minimum (70+ users)",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/claude-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "Claude Demo",
            videoUid: "ae0e79df9857061990dcbd1887e66dc7"
        }],
        features: ["Constitutional AI safety", "Advanced reasoning", "Computer use capability", "Web search with citations", "200K token context"],
        useCases: ["Complex reasoning", "Software development", "Content creation", "Enterprise workflows"],
        addedDate: "2024-01-15"
    },
    {
        id: "2",
        name: "GitHub Copilot",
        slug: "github-copilot",
        tagline: "Your AI pair programmer",
        description: "GitHub Copilot transforms the developer experience by providing contextualized assistance throughout the software development lifecycle, from code completions to chat assistance in the IDE.",
        categories: ["coding"],
        website: "https://github.com/features/copilot",
        pricing: "Copilot Free: $0/month (limited features), Copilot Pro: $10/month, Copilot Pro+: $39/month, Copilot Business: $19/user/month, Copilot Enterprise: $39/user/month",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/github-copilot-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "GitHub Copilot Demo",
            videoUid: "ee005f82d38ca8467f23fb899679f2c2"
        }],
        features: ["Multi-model AI access", "Copilot Chat", "Coding Agent", "Code completions", "Enterprise integration"],
        useCases: ["Code generation", "Code explanation", "Debugging", "Learning new patterns"],
        addedDate: "2024-01-10"
    },
    {
        id: "3",
        name: "Copy.ai",
        slug: "copy-ai",
        tagline: "The AI your marketing deserves",
        description: "Copy.ai is the first Go-to-Market AI Platform that automates GTM processes through AI-powered workflows, designed for sales and marketing teams to create and optimize content across the customer journey.",
        categories: ["writing", "marketing"],
        website: "https://www.copy.ai",
        pricing: "Free: 2,000 words/month, Starter: $49/month ($36 annual), Advanced: $249/month ($186 annual), Enterprise: Custom pricing",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/copy-ai-logo.png",
        screenshots: [
            "/images/screenshots/copyai1.PNG", "/images/screenshots/copyai2.PNG"],
        features: ["GTM workflows", "Brand Voice & Infobase", "Multi-channel content", "Data integration", "AI workflow builder"],
        useCases: ["Sales outreach automation", "Marketing campaign creation", "Content marketing", "Lead generation"],
        addedDate: "2024-01-20"
    },
    {
        id: "4",
        name: "Jasper",
        slug: "jasper",
        tagline: "Jasper is purpose-built AI that helps enterprise marketers",
        description: "Jasper is a generative AI platform built specifically for marketing teams, offering advanced brand control, marketing intelligence, and an intuitive AI toolkit for enterprise-scale content creation.",
        categories: ["marketing"],
        website: "https://www.jasper.ai",
        pricing: "Creator: $49/month ($39 annual), Pro: $69/month ($59 annual), Business: Custom pricing (10+ seats)",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/jasper-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "Jasper Overview",
            videoUid: "37350cfef8c89a8d789bb55ffff47872"
        }],
        features: ["Brand voice training", "Marketing intelligence layer", "Jasper Art", "Chrome extension", "50+ templates"],
        useCases: ["Enterprise content marketing", "Multi-brand campaigns", "Social media management", "Performance marketing"],
        addedDate: "2024-01-18"
    },
    {
        id: "5",
        name: "Intercom Resolution Bot",
        slug: "intercom-resolution-bot",
        tagline: "The highest-performing AI agent in customer service",
        description: "Fin AI Agent is an advanced AI-powered customer service agent that provides human-quality, personalized support with the highest resolution rates and industry-low hallucinations.",
        categories: ["customer-support"],
        website: "https://www.intercom.com/",
        pricing: "Base plans: $29-139/seat/month, Fin AI Agent: $0.99 per resolved conversation, Fin AI Copilot: $35/seat/month",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/intercom-resolution-bot-logo.png",
        videos: [{
            type: "video",
            url: "",
            alt: "Intercom Demo",
            videoUid: "1f2e90cf1ed0bad6563fc0583bc477d7"
        }],
        features: ["Multi-source answers", "Fin AI Engine™", "45+ languages", "Custom training", "Omnichannel support"],
        useCases: ["Frontline support automation", "24/7 customer service", "Multilingual support", "Complex query resolution"],
        addedDate: "2024-01-12"
    },
    {
        id: "6",
        name: "Superhuman",
        slug: "superhuman",
        tagline: "The most productive email app ever made",
        description: "Superhuman is an AI-powered email client that helps professionals save 4 hours per week through intelligent features and speed-focused design.",
        categories: ["email", "productivity", "scheduling"],
        website: "https://superhuman.com",
        pricing: "Starter: $30/month ($25 annual), Business: $40/month ($33 annual), Enterprise: Custom pricing",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/superhuman-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "Superhuman Demo",
            videoUid: "a7b9d9fea27cd6fd5bc08605d5b832dd"
        }],
        features: ["Superhuman AI", "Auto labels/archive", "AI summarization", "Ask AI", "Split inbox"],
        useCases: ["High-volume email management", "Collaborative workflows", "Inbox zero achievement", "Speed-focused processing"],
        addedDate: "2024-01-25"
    },
    {
        id: "7",
        name: "Lavender",
        slug: "lavender",
        tagline: "Lavender helps thousands of sellers write better emails faster",
        description: "Lavender is an AI-powered email coaching platform that analyzes emails in real-time, provides personalized feedback, and helps sales professionals write more effective emails.",
        categories: ["sales", "email"],
        website: "https://www.lavender.ai",
        pricing: "Basic: Free (5 analyses/month), Individual Pro: $29/month, Teams: $49/month per user",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/lavender-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "Lavender Overview",
            videoUid: "67d4367457601c7ff281f2a9772f2715"
        }],
        features: ["AI email coach", "Personalization assistant", "Team analytics", "Mobile preview", "Integration suite"],
        useCases: ["Cold email optimization", "Sales team training", "Email performance analytics", "Personalization at scale"],
        addedDate: "2024-01-25"
    },
    {
        id: "8",
        name: "Notta",
        slug: "notta",
        tagline: "AI-Powered Notetaker for Smarter Workflows",
        description: "Notta is an intelligent AI transcription and note-taking assistant that transforms speech into text with 98.86% accuracy.",
        categories: ["transcription"],
        website: "https://www.notta.ai/en?_gl=1*cwl356*_up*MQ..*_gs*MQ..&gclid=Cj0KCQjw9O_BBhCUARIsAHQMjS6LaroTvrmHL4JAy6pckj2Jo_c3AsluuAh1cKsVTtNsqj4slUEFVXoaAmxxEALw_wcB&gbraid=0AAAAABSsTG05-US8R5ISN0C6LZyWO5BDq",
        pricing: "Free: 120 minutes/month, Pro: $14.99/month ($8.17 annual), Business: $27.99/month per seat, Enterprise: Custom pricing",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/notta-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "Notta Overview",
            videoUid: "2e62104b024a770a3d1ffd4e5279d503"
        }],
        features: ["Real-time transcription", "AI summarization", "Multi-language translation", "Smart integration", "AI-enhanced audio"],
        useCases: ["Sales calls", "Content creation", "Healthcare documentation", "Student research", "Remote teams"],
        addedDate: "2024-01-25"
    },
    {
        id: "9",
        name: "Scholarcy",
        slug: "scholarcy",
        tagline: "Summarize anything, understand complex research, and organise your knowledge with Scholarcy",
        description: "AI-powered online tool that summarizes research articles, reports, and book chapters into bite-sized sections with key information extraction.",
        categories: ["document-analysis", "research"],
        website: "https://www.scholarcy.com",
        pricing: "Free: Limited to 10 summaries, Monthly: $9.99/month, Annual: $90/year ($7.50/month), API: $225-1,500/month",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/scholarcy-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "Scholarcy Overview",
            videoUid: "7e6276339910856a735eca3b77ea44f4"
        }],
        features: ["AI summarization", "Summary flashcards", "Reference extraction", "Figure/table extraction", "Browser extension"],
        useCases: ["Literature reviews", "Exam preparation", "Research organization", "Policy research"],
        addedDate: "2024-01-25"
    },
    {
        id: "10",
        name: "Motion",
        slug: "motion",
        tagline: "Use AI to plan your work, automatically. Be 137% more productive",
        description: "Motion is an all-in-one AI-powered platform that combines calendar, task management, project management, and meeting scheduling into one unified app.",
        categories: ["scheduling", "productivity"],
        website: "https://usemotion.com",
        pricing: "Individual: $29/month annual ($49 monthly), Team: $19/user/month annual ($29 monthly), Business/Enterprise: Custom pricing",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/motion-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "Motion Overview",
            videoUid: "6737da00d85052fbb964c53a75cf435a"
        }],
        features: ["AI intelligent calendar", "Auto-task prioritization", "Dynamic rescheduling", "Meeting scheduler", "Project management"],
        useCases: ["Executive planning", "Team project management", "Task prioritization", "Integrated workflow management"],
        addedDate: "2024-01-25"
    },
    {
        id: "11",
        name: "Clara",
        slug: "clara",
        tagline: "Clara is your partner in doing great work — a virtual employee that schedules your meetings",
        description: "Clara is an AI-powered virtual assistant that handles scheduling via email, acting like a human executive assistant.",
        categories: ["scheduling"],
        website: "https://claralabs.com",
        pricing: "Essential: $99/month, Professional: $199/month, Executive: $399/month, Enterprise: Custom pricing",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/clara-logo.svg",
        features: ["Natural language email processing", "Multi-party coordination", "24/7 availability", "Calendar integration", "Intelligent learning"],
        useCases: ["Executive scheduling", "Sales meeting coordination", "Consultant scheduling", "Email-based scheduling"],
        addedDate: "2024-01-25"
    },
    {
        id: "12",
        name: "Bito AI",
        slug: "bito-ai",
        tagline: "AI that understands your code",
        description: "Bito is a revolutionary productivity tool for software developers that provides AI-powered assistance through IDE and CLI integration, using advanced models to accelerate developer impact.",
        categories: ["coding"],
        website: "https://bito.ai",
        pricing: "Free: $0/month (75 AI chat requests/day), 10X Developer: $15/month, Team: Custom pricing",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/bito-ai-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "Bito Overview",
            videoUid: "d58597c92c587d6a242b669f28203b61"
        }],
        features: ["AI Code Review Agent", "Multi-platform integration", "Codebase understanding", "Chain of Thought reasoning", "Security analysis"],
        useCases: ["Automated code reviews", "Code generation", "Code explanation", "Security scanning"],
        addedDate: "2024-01-25"
    },
    {
        id: "13",
        name: "CodeRabbit",
        slug: "coderabbit",
        tagline: "Most advanced AI code reviews that catches 95%+ bugs",
        description: "CodeRabbit is an AI-powered code reviewer that delivers context-aware feedback on pull requests within minutes, reducing manual review effort while maintaining enterprise security standards.",
        categories: ["coding"],
        website: "https://coderabbit.ai",
        pricing: "Free: $0/month (public repos only), Lite: $15/month per developer, Pro: $27/month per developer",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/coderabbit-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "CodeRabbit Overview",
            videoUid: "10912784825fd43d9de756a3abbc87be"
        }],
        features: ["Agentic chat system", "Advanced context analysis", "Sandboxed review environment", "Multi-platform integration", "Learning system"],
        useCases: ["Automated PR reviews", "Security vulnerability detection", "Code quality enforcement", "Team knowledge sharing"],
        addedDate: "2024-01-25"
    },
    {
        id: "14",
        name: "Anodot",
        slug: "anodot",
        tagline: "Anodot detects and groups anomalies across silos to help you find and fix business incidents in real-time",
        description: "AI-powered autonomous business monitoring platform that analyzes 100% of business data in real-time to detect anomalies and prevent revenue-impacting incidents.",
        categories: ["data-analysis"],
        website: "https://www.anodot.com",
        pricing: "Contact-based (average $48,000 annually)",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/anodot-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "Anodot Overview",
            videoUid: "b592ad63b7e742b605652ae3ee933044"
        }],
        features: ["Autonomous anomaly detection", "Root cause analysis", "Real-time monitoring", "Autonomous forecasting", "Alert management"],
        useCases: ["FinTech monitoring", "AdTech optimization", "Telecommunications", "eCommerce analytics", "Gaming analytics"],
        addedDate: "2024-01-25"
    },
    {
        id: "15",
        name: "Instantly.ai",
        slug: "instantly-ai",
        tagline: "Contact and close your perfect buyers with our AI-powered workflows",
        description: "Instantly is a comprehensive cold email outreach platform that combines automated outreach, deliverability optimization, B2B lead database, and AI-powered CRM capabilities.",
        categories: ["sales", "email"],
        website: "https://instantly.ai",
        pricing: "Growth: $37/month, Hypergrowth: $78/month, Light Speed: $358/month, Enterprise: Custom pricing",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/instantly-ai-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "Instantly Overview",
            videoUid: "6d299a6d973724b51dbe3f203f497e04"
        }],
        features: ["Unlimited email warmup", "AI email writer", "Lead finder database", "Multi-inbox management", "Advanced analytics"],
        useCases: ["Cold email outreach", "Lead generation", "Sales pipeline management", "Deliverability optimization"],
        addedDate: "2024-01-25"
    },
    {
        id: "16",
        name: "Clay",
        slug: "clay",
        tagline: "Access 100+ premium data sources and AI research agents in one platform",
        description: "Clay is a go-to-market platform that consolidates 100+ data providers and AI research agents to help businesses build targeted prospect lists, enrich data, and automate personalized outreach.",
        categories: ["sales"],
        website: "https://clay.com",
        pricing: "Free: $0/month (100 credits), Starter: $134/month annual, Explorer: $314/month annual, Pro: $720/month annual, Enterprise: Custom pricing",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/clay-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "Clay Overview",
            videoUid: "aff8f34dbce64be28c7ee6297fd2a2c5"
        }],
        features: ["100+ data provider access", "AI research agents", "Workflow automation", "Real-time web scraping", "CRM integration"],
        useCases: ["Lead enrichment", "Intent-based outbound", "CRM data hygiene", "Market research"],
        addedDate: "2024-01-25"
    },
    {
        id: "17",
        name: "Forethought",
        slug: "forethought",
        tagline: "The only multi-agentic system for all of customer support",
        description: "Forethought delivers a comprehensive AI-powered platform with autonomous agents that fully resolve issues, assist human agents, and surface actionable insights.",
        categories: ["customer-support"],
        website: "https://forethought.ai",
        pricing: "Quote-based (Basic, Professional, Enterprise tiers)",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/forethought-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "Forethought Overview",
            videoUid: "98c2d0caa714d3d0aa958199a591b95d"
        }],
        features: ["Autoflows agentic reasoning", "Multi-agent system", "Pre-trained on historical data", "Omnichannel automation", "AI insights"],
        useCases: ["Autonomous issue resolution", "Intelligent ticket routing", "Agent productivity", "Performance optimization"],
        addedDate: "2024-01-25"
    },
    {
        id: "18",
        name: "Clearscope",
        slug: "clearscope",
        tagline: "The best-in-class SEO content optimization platform that drives search traffic",
        description: "Clearscope is an SEO content optimization platform that uses AI to analyze top-ranking pages and provide keyword recommendations for better search performance.",
        categories: ["seo"],
        website: "https://clearscope.io",
        pricing: "Essentials: $189/month, Business: $399/month, Enterprise: Custom pricing",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/clearscope-logo.svg",
        screenshots: ["/images/screenshots/clearscope1.png", "/images/screenshots/clearscope2.png", "/images/screenshots/clearscope3.png", "/images/screenshots/clearscope4.png"],
        features: ["Content reports", "Real-time grading", "AI-generated outlines", "Content inventory", "Google Docs/WordPress integration"],
        useCases: ["Content optimization", "Keyword research", "Content briefs", "Portfolio monitoring"],
        addedDate: "2024-01-25"
    },
    {
        id: "19",
        name: "Schema App",
        slug: "schema-app",
        tagline: "An end-to-end Schema Markup solution that helps enterprise SEO teams develop a Knowledge Graph",
        description: "Schema App is an enterprise structured data platform that helps SEO teams implement and manage schema markup at scale.",
        categories: ["seo"],
        website: "https://schemaapp.com",
        pricing: "Enterprise: Custom pricing, WordPress Plugin: $30-60/month, Shopify Plugin: $19.99-39.99/month",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/schema-app-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "Schema App Overview",
            videoUid: "fb9d468505d609e9e15f66b12fbd6ee2"
        }],
        features: ["Schema App Highlighter", "Schema App Editor", "Dynamic markup updates", "Performance analytics", "Entity linking"],
        useCases: ["Enterprise structured data", "Knowledge graph development", "Rich results optimization", "Multi-site management"],
        addedDate: "2024-01-25"
    },
    {
        id: "20",
        name: "PostHero",
        slug: "posthero",
        tagline: "AI LinkedIn content from 10,000+ viral posts",
        description: "PostHero is trained on 10,000+ viral LinkedIn posts, converting voice notes into polished content and helping users post high-quality content daily.",
        categories: ["social-media"],
        website: "https://posthero.ai",
        pricing: "$19-199/month",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/posthero-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "PostHero Overview",
            videoUid: "4d2428371787d51cc6af933b56850caf"
        }],
        features: ["Voice to post", "Viral post training", "Content scheduling", "LinkedIn optimization"],
        useCases: ["LinkedIn content", "Personal branding", "Content creation", "Social media management"],
        addedDate: "2024-01-25"
    },
    {
        id: "21",
        name: "Flick",
        slug: "flick",
        tagline: "Instagram hashtag research for 30%+ reach",
        description: "Flick specializes in Instagram hashtag research with comprehensive competition analysis, helping users achieve 30%+ reach increases while avoiding shadowbanning.",
        categories: ["social-media"],
        website: "https://flick.social",
        pricing: "£11-55/month",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/flick-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "Flick Overview",
            videoUid: "26534b2840c707664d90f786166d7110"
        }],
        features: ["Hashtag research", "Competition analysis", "Banned hashtag checker", "Analytics"],
        useCases: ["Instagram growth", "Hashtag optimization", "Content planning", "Reach improvement"],
        addedDate: "2024-01-25"
    },
    {
        id: "22",
        name: "Truewind",
        slug: "truewind",
        tagline: "AI-Powered Accounting and Financial Planning for Startups",
        description: "Truewind is a 'digital staff accountant' that combines generative AI with concierge service to automate accounting workflows and financial reporting.",
        categories: ["accounting"],
        website: "https://www.truewind.ai",
        pricing: "Custom pricing only (quote-based)",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/truewind-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "Truewind Overview",
            videoUid: "ce57756b4eb1df3aec86120ba0695527"
        }],
        features: ["Autonomous transaction classification", "Intelligent document management", "Automated month-end close", "AI prepaid tracking", "Real-time reconciliation"],
        useCases: ["Startup bookkeeping", "Accounting firm automation", "Fast-growing companies", "CFO support", "Investor relations"],
        addedDate: "2024-01-25"
    },
    {
        id: "23",
        name: "Hyperbound",
        slug: "hyperbound",
        tagline: "AI Sales Roleplay Platform to Identify & Close Your Sales Team's Skill Gaps",
        description: "Hyperbound is a simulated AI sales roleplay platform that creates interactive AI buyers for sales training without risking real prospects.",
        categories: ["sales"],
        website: "https://hyperbound.ai",
        pricing: "Custom pricing (contact sales)",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/hyperbound-logo.svg",
        screenshots: ["/images/screenshots/hyperbound1.PNG"],
        features: ["Realistic AI buyer simulation", "Custom ICP bot builder", "Real-time analytics", "Multi-scenario training", "Conversation intelligence"],
        useCases: ["Sales development training", "Rep onboarding", "Skill gap identification", "Candidate screening", "Enterprise sales practice"],
        addedDate: "2024-01-25"
    },

    {
        id: "25",
        name: "ClickUp Brain",
        slug: "clickup-brain",
        tagline: "The world's first neural network connecting projects, docs, people, and all of your company's knowledge with AI",
        description: "ClickUp Brain is an AI add-on to ClickUp that connects all work data for intelligent assistance across the platform.",
        categories: ["productivity"],
        website: "https://clickup.com/ai",
        pricing: "ClickUp Brain: $5/user/month (add-on to paid plans), Requires base plan: $10-19/user/month, Combined: Starting at $15/user/month",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/clickup-brain-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "ClickUp Overview",
            videoUid: "d7cbfe0aa207c55ddccd0ed058f42665"
        }],
        features: ["AI knowledge manager", "AI project manager", "AI writer", "Autopilot agents", "Connected search"],
        useCases: ["AI-powered project management", "Knowledge connection", "Workflow automation", "Contextual assistance"],
        addedDate: "2024-01-25"
    },
    {
        id: "26",
        name: "MailMaestro",
        slug: "mailmaestro",
        tagline: "Your AI email copilot that helps you manage emails faster and securely",
        description: "MailMaestro is an AI email assistant that helps write better emails faster with AI-powered composition, summarization, and response generation.",
        categories: ["email"],
        website: "https://maestrolabs.com",
        pricing: "Pro: $15/month ($144/year), Enterprise: Custom pricing",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/mailmaestro-logo.svg",
        screenshots: ["/images/screenshots/maestro2.png", "/images/screenshots/maestro3.png", "/images/screenshots/maestro4.png", "/images/screenshots/maestro5.png"],
        features: ["AI email composition", "Thread summarization", "One-click replies", "Magic templates", "Improve with AI"],
        useCases: ["Native Outlook/Gmail integration", "Multilingual communication", "HR/Finance automation", "Enterprise email"],
        addedDate: "2024-01-25"
    },
    {
        id: "27",
        name: "SentiSum",
        slug: "sentisum",
        tagline: "Extract granular customer insights from every support conversation",
        description: "SentiSum is an AI-powered customer experience analytics platform that automatically tags and categorizes customer feedback across all channels using custom AI models.",
        categories: ["customer-support"],
        website: "https://www.sentisum.com",
        pricing: "Starting at: $1,000/month, Pro: ~$3,000/month, Enterprise: Custom from $3,000/month",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/sentisum-logo.svg",
        screenshots: ["/images/screenshots/sentisum1.png", "/images/screenshots/sentisum2.png", "/images/screenshots/sentisum3.png", "/images/screenshots/sentisum4.png", "/images/screenshots/sentisum5.png", "/images/screenshots/sentisum6.png"],

        features: ["Custom AI models", "Multi-channel analysis", "Real-time sentiment tracking", "Automatic ticket routing", "Granular insights"],
        useCases: ["Customer sentiment analysis", "Support ticket categorization", "Trend identification", "Performance optimization"],
        addedDate: "2024-01-25"
    },
    {
        id: "28",
        name: "SmartWriter",
        slug: "smartwriter",
        tagline: "Generate personalised emails that get you 8x more replies with 1-Click",
        description: "SmartWriter achieves 200% increased reply rates through AI that researches prospects from LinkedIn, websites, and news, generating personalized outreach 40x faster than manual methods.",
        categories: ["sales", "email"],
        website: "https://www.smartwriter.ai",
        pricing: "Basic: $49/month (400 leads), Popular: $149/month (1,200 leads), Pro: $359/month (3,500 leads)",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/smartwriter-logo.svg",
        screenshots: ["/images/screenshots/smartwriter1.png", "/images/screenshots/smartwriter2.png", "/images/screenshots/smartwriter3.png"],

        features: ["Hyper-personalized cold emails", "LinkedIn Chrome extension", "Automated icebreakers", "Backlink outreach", "Google Sheets integration"],
        useCases: ["B2B sales prospecting", "Link building", "LinkedIn outreach", "Large-scale personalized campaigns"],
        addedDate: "2024-01-25"
    },
    {
        id: "29",
        name: "Alli AI",
        slug: "alli-ai",
        tagline: "Technical SEO automation with instant implementation",
        description: "Alli AI specializes in technical SEO automation, fixing issues like canonical tags and meta descriptions with one-click bulk implementation, achieving top-three rankings within seven days.",
        categories: ["seo"],
        website: "https://alliai.com",
        pricing: "Small Biz: $169/month, Consultant: $399/month, Agency: $699/month, Enterprise: $1,249/month",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/alli-ai-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "Alli AI Overview",
            videoUid: "91a7f2b66c6a73ddde311851a5db70ec"
        }],
        features: ["One-click fixes", "Bulk implementation", "Technical SEO automation", "Instant deployment"],
        useCases: ["Technical SEO", "Site optimization", "SEO fixes", "Ranking improvement"],
        addedDate: "2024-01-25"
    },
    {
        id: "30",
        name: "Qodo Merge",
        slug: "qodo-merge",
        tagline: "AI-assisted open-source tool for seamless pull request analysis and feedback",
        description: "Qodo Merge is an AI-powered code review agent that automates pull request workflows, generates PR descriptions, and provides intelligent code analysis to improve code quality.",
        categories: ["coding"],
        website: "https://www.qodo.ai/",
        pricing: "Free open-source or $15/month hosted",
        paymentOptions: {
            isPaid: false,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/qodo-merge-logo.svg",
        features: ["Multi-tool orchestration", "Auto-approval", "All languages", "Self-hosted option"],
        useCases: ["Code review", "PR automation", "Quality assurance", "Team workflows"],
        addedDate: "2024-01-25"
    },
    {
        id: "32",
        name: "ZoomInfo SalesOS",
        slug: "zoominfo-salesos",
        tagline: "Enterprise lead intelligence with 104M company profiles",
        description: "ZoomInfo SalesOS provides enterprise-grade lead intelligence with AI Copilot creating buying groups from intent data, driving 1900% revenue increases and 2.5x larger deals.",
        categories: ["sales"],
        website: "https://www.zoominfo.com",
        pricing: "$15,000-30,000+/year",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/zoominfo-salesos-logo.svg",
        videos: [{
            type: "video",
            url: "", // Fallback URL if needed
            alt: "ZoomInfo SalesOS Demo",
            videoUid: "8035831391ca6c586346f06e4b2bcd9a"
        }],
        features: ["104M company profiles", "Intent data", "AI Copilot", "Buying group creation"],
        useCases: ["Lead intelligence", "Account targeting", "Sales intelligence", "Enterprise sales"],
        addedDate: "2024-01-25"
    },
    {
        id: "33",
        name: "Clockwise",
        slug: "clockwise",
        tagline: "Clockwise optimizes your team's calendars to create more time in everyone's day",
        description: "Clockwise automatically moves meetings to create 2-4 hour uninterrupted focus blocks, transforming team meeting culture by optimizing schedules across entire organizations.",
        categories: ["scheduling"],
        website: "https://www.getclockwise.com",
        pricing: "Free: $0 (75 Schedule Assists/week), Pro: $6.75/user/month annual, Business: Custom pricing, Enterprise: Custom pricing",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/clockwise-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "Clockwise Overview",
            videoUid: "ec8fb4c7d3c5fad06f6bfe1abc3931d5"
        }],
        features: ["AI scheduler", "Focus time optimization", "Smart meeting management", "Team calendar sync", "GPT-powered NLP"],
        useCases: ["Team schedule optimization", "Focus time creation", "Meeting culture improvement", "Calendar coordination"],
        addedDate: "2024-01-25"
    },
    {
        id: "34",
        name: "Writesonic",
        slug: "writesonic",
        tagline: "Content creation, supercharged with Writesonic AI",
        description: "AI-powered content creation platform that generates factually accurate, SEO-optimized content using advanced AI models with real-time web research capabilities.",
        categories: ["writing"],
        website: "https://writesonic.com",
        pricing: "Free tier, from $19/month",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/writesonic-logo.svg",
        videos: [{
            type: "video",
            url: "",
            alt: "Writesonic Overview",
            videoUid: "7b4b60148870ff0e860d0c6b2340cffa"
        }],
        features: ["AI Article Writer 6.0", "Chatsonic", "90+ content templates", "SEO optimization suite", "Brand voice creator"],
        useCases: ["Content marketing", "Digital agencies", "eCommerce", "Small businesses", "Freelance writers"],
        addedDate: "2024-01-25"
    },
    {
        id: "35",
        name: "Fixy",
        slug: "fixy",
        tagline: "Your AI handyman — fix it yourself or know when to call a pro",
        description: "Fixy is an AI-powered home repair assistant that helps homeowners diagnose problems, provides step-by-step DIY guidance, and honestly tells you when to call a professional. Upload photos of issues, get personalized fixes based on your skill level, and save hundreds on unnecessary service calls.",
        categories: ["home-improvement", "productivity"],
        website: "https://apps.apple.com/us/app/fixy-ai-handyman/id6747599349",
        pricing: "Free to download",
        paymentOptions: {
            isPaid: false,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/fixy-logo.svg",
        features: ["Photo-based diagnosis", "Step-by-step DIY guides", "Skill-level personalization", "Safety warnings", "Pro vs DIY recommendations", "Tool suggestions"],
        useCases: ["Home repair diagnosis", "DIY guidance", "Cost saving on repairs", "Learning home maintenance"],
        addedDate: "2026-02-18"
    },
    {
        id: "36",
        name: "Cursor",
        slug: "cursor",
        tagline: "The AI code editor built for productivity",
        description: "Cursor is an AI-powered code editor built on VS Code that deeply understands your codebase. It offers intelligent completions, multi-file editing, and agentic coding capabilities that make it the go-to IDE for AI-assisted development in 2025-2026.",
        categories: ["coding"],
        website: "https://cursor.com",
        pricing: "Hobby: Free (50 premium requests/month), Pro: $20/month ($16 annual), Business: $40/user/month, Ultra: Usage-based",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/cursor-logo.png",
        features: ["Codebase-aware AI chat", "Multi-file editing", "Agentic coding mode", "Tab completions", "Multi-model support (GPT-4, Claude, etc.)"],
        useCases: ["Full-stack development", "Code refactoring", "Rapid prototyping", "AI-assisted debugging"],
        addedDate: "2026-02-20"
    },
    {
        id: "37",
        name: "Perplexity AI",
        slug: "perplexity-ai",
        tagline: "Ask anything. Get answers with cited sources.",
        description: "Perplexity AI is an AI-powered answer engine that combines real-time web search with large language models to deliver accurate, cited answers. With Pro Search, the Comet browser, and enterprise plans, it has become a primary research tool for millions.",
        categories: ["research", "productivity"],
        website: "https://www.perplexity.ai",
        pricing: "Free: $0, Pro: $20/month, Max: $200/month, Enterprise: $40-325/seat/month",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/perplexity-ai-logo.png",
        features: ["Pro Search with follow-ups", "Real-time web citations", "File & image analysis", "Comet browser", "API access"],
        useCases: ["Academic research", "Market analysis", "Fact-checking", "Daily knowledge work"],
        addedDate: "2026-02-20"
    },
    {
        id: "38",
        name: "Bolt",
        slug: "bolt",
        tagline: "Create stunning apps & websites by chatting with AI",
        description: "Bolt.new is an AI-powered full-stack app builder by StackBlitz that lets users create, edit, and deploy web applications entirely through natural language prompts in the browser — no local setup required.",
        categories: ["coding"],
        website: "https://bolt.new",
        pricing: "Free: $0 (limited), Pro: $25/month (10M tokens), Teams: $30/user/month, Enterprise: Custom",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/bolt-logo.png",
        features: ["In-browser full-stack dev", "Natural language to app", "One-click deploy", "Real-time preview", "Multi-model support"],
        useCases: ["Rapid prototyping", "MVP creation", "Landing pages", "Internal tools"],
        addedDate: "2026-02-20"
    },
    {
        id: "39",
        name: "v0",
        slug: "v0",
        tagline: "Your collaborative AI assistant to design, iterate, and scale full-stack apps",
        description: "v0 by Vercel is an AI-powered UI generation tool that creates production-ready React components and full-stack applications from text and image prompts. Tightly integrated with the Vercel ecosystem, it's become the go-to for frontend developers.",
        categories: ["coding"],
        website: "https://v0.dev",
        pricing: "Free: $5 in credits, Premium: $20/month, Team: $30/user/month",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/v0-logo.png",
        features: ["Text/image to UI", "React/Next.js code generation", "Vercel deployment integration", "Iterative design refinement", "Shadcn/Tailwind output"],
        useCases: ["UI prototyping", "Component generation", "Design-to-code", "Full-stack web apps"],
        addedDate: "2026-02-20"
    },
    {
        id: "40",
        name: "Devin",
        slug: "devin",
        tagline: "The first AI software engineer",
        description: "Devin by Cognition AI is an autonomous AI software engineer that can plan, code, debug, and deploy software end-to-end. It operates in its own sandboxed environment with a shell, browser, and code editor, handling complex multi-step engineering tasks.",
        categories: ["coding"],
        website: "https://devin.ai",
        pricing: "Core: $20/month (pay-per-use ACUs), Team: $500/month, Enterprise: Custom",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/devin-logo.png",
        features: ["Autonomous coding agent", "Sandboxed dev environment", "Jira/Linear integration", "Pull request automation", "Multi-step planning & execution"],
        useCases: ["Automated bug fixes", "Code migrations", "Feature development", "Repository maintenance"],
        addedDate: "2026-02-20"
    },
    {
        id: "41",
        name: "Midjourney",
        slug: "midjourney",
        tagline: "An independent research lab exploring new mediums of thought",
        description: "Midjourney is an AI image generation tool that creates stunning, artistic images from text prompts. Known for its distinctive aesthetic quality and photorealistic capabilities, it remains one of the most popular AI art tools worldwide.",
        categories: ["image-generation"],
        website: "https://www.midjourney.com",
        pricing: "Basic: $10/month ($8 annual), Standard: $30/month ($24 annual), Pro: $60/month ($48 annual), Mega: $120/month ($96 annual)",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/midjourney-logo.png",
        features: ["Text-to-image generation", "Image-to-image editing", "Style tuning", "High-resolution upscaling", "Web & Discord interface"],
        useCases: ["Digital art creation", "Marketing visuals", "Concept art", "Brand imagery"],
        addedDate: "2026-02-20"
    },
    {
        id: "42",
        name: "Runway",
        slug: "runway",
        tagline: "Advancing creativity with artificial intelligence",
        description: "Runway is an AI-powered creative suite specializing in video generation and editing. With its Gen-4 model, it produces high-quality AI video from text and images, and offers a full suite of creative tools for filmmakers and content creators.",
        categories: ["video-generation"],
        website: "https://runwayml.com",
        pricing: "Basic: Free (limited credits), Standard: $12/month (annual), Pro: $28/month (annual), Unlimited: $76/month (annual), Enterprise: Custom",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/runway-logo.png",
        features: ["Gen-4 text/image-to-video", "AI video editing suite", "Motion brush", "Act-Two character animation", "API access"],
        useCases: ["Video production", "Social media content", "Film pre-visualization", "Marketing videos"],
        addedDate: "2026-02-20"
    },
    {
        id: "43",
        name: "ElevenLabs",
        slug: "elevenlabs",
        tagline: "The most realistic AI voice platform",
        description: "ElevenLabs is the leading AI voice and audio platform offering ultra-realistic text-to-speech, voice cloning, dubbing, and an AI audio agent builder. Used by creators, developers, and enterprises for high-quality synthetic speech in 32+ languages.",
        categories: ["voice-audio"],
        website: "https://elevenlabs.io",
        pricing: "Free: $0 (10K characters/month), Starter: $5/month, Creator: $22/month, Pro: $99/month, Scale: $330/month, Enterprise: Custom",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/elevenlabs-logo.png",
        features: ["Ultra-realistic TTS", "Voice cloning", "32+ language support", "AI dubbing", "Conversational AI agents"],
        useCases: ["Content narration", "Podcast production", "Game character voices", "Accessibility", "Customer support voice bots"],
        addedDate: "2026-02-20"
    },
    {
        id: "44",
        name: "Notion AI",
        slug: "notion-ai",
        tagline: "One workspace. Every team. AI-powered.",
        description: "Notion AI is an integrated AI assistant within the Notion productivity platform that helps teams write, summarize, brainstorm, and search across their workspace. Baked into Business and Enterprise plans, it connects to all your docs, projects, and wikis.",
        categories: ["writing", "productivity"],
        website: "https://www.notion.com/product/ai",
        pricing: "Free Notion: Limited AI, Plus: $12/user/month, Business: $18/user/month (AI included), Enterprise: Custom, AI Add-on: $8-10/user/month on lower tiers",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/notion-ai-logo.png",
        features: ["AI writing assistant", "Q&A across workspace", "AI autofill for databases", "Meeting summaries", "Connected search"],
        useCases: ["Team knowledge management", "Document drafting", "Meeting notes", "Project planning"],
        addedDate: "2026-02-20"
    },
    {
        id: "45",
        name: "Replit Agent",
        slug: "replit-agent",
        tagline: "Build apps with AI, deploy instantly",
        description: "Replit Agent is an autonomous AI coding assistant within the Replit cloud IDE that can build, debug, and deploy full applications from natural language instructions. With Agent 3, it handles complex multi-step development tasks end-to-end.",
        categories: ["coding"],
        website: "https://replit.com",
        pricing: "Free: Limited daily Agent credits, Core: $20/month ($25 monthly credits), Teams: $35/user/month",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/replit-agent-logo.png",
        features: ["Autonomous app building", "50+ language support", "Instant cloud deployment", "Real-time collaboration", "Ghostwriter code completion"],
        useCases: ["Rapid prototyping", "Learning to code", "Hackathon projects", "Internal tool building"],
        addedDate: "2026-02-20"
    },
    {
        id: "46",
        name: "Lovable",
        slug: "lovable",
        tagline: "The last piece of software you'll ever need to build software",
        description: "Lovable (formerly GPT Engineer) is an AI-powered full-stack app builder that generates production-ready applications from natural language. It produces clean, maintainable code with Supabase integration, GitHub sync, and one-click deployment.",
        categories: ["coding"],
        website: "https://lovable.dev",
        pricing: "Free: Limited, Starter: $25/month (100 credits), Launch: $50/month (250 credits), Scale: $100/month (500+ credits), Teams: Custom",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/lovable-logo.png",
        features: ["Natural language to full-stack app", "Supabase backend integration", "GitHub sync", "One-click deploy", "Visual editing"],
        useCases: ["SaaS MVP building", "Internal tools", "Landing pages", "Startup prototyping"],
        addedDate: "2026-02-20"
    },
    {
        id: "47",
        name: "Aident AI",
        slug: "aident-ai",
        tagline: "Turn plain-English SOPs into reliable AI automations",
        description: "Aident AI is an intelligent automation builder that lets you create workflow automations by describing your process in natural language. No nodes, no code — just plain English instructions that become reliable, approval-ready automations spanning hundreds of tools. It positions itself as a smarter alternative to Zapier, Make, and n8n with AI-native workflow design.",
        categories: ["productivity"],
        website: "https://aident.ai",
        pricing: "Free: 300 credits/month, Basic: $6/month (2,000 credits), Pro: $18/month (6,000 credits), Max: $60/month (20,000 credits)",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/aident-ai-logo.png",
        features: ["Natural language automation builder", "Playbook editor for SOPs", "120+ app integrations", "Approval-ready workflows", "AI co-pilot for drafting automations", "Template library"],
        useCases: ["Marketing automation", "Competitor monitoring", "Business process automation", "Data pipeline orchestration"],
        addedDate: "2026-02-20"
    },
    {
        id: "48",
        name: "Dvina",
        slug: "dvina",
        tagline: "World's most connected private & reliable AI platform",
        description: "Dvina is a governed multi-agent AI platform that connects 120+ apps and live databases to handle complex business workflows. It enables teams across sales, finance, IT, HR, and operations to pull reports, update CRMs, check incidents, and orchestrate multi-step tasks through a unified AI interface while keeping data private and secure.",
        categories: ["productivity", "data-analysis"],
        website: "https://dvina.ai",
        pricing: "Free tier available, paid plans for teams",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/dvina-logo.png",
        features: ["120+ app integrations", "Live database connections", "Multi-agent orchestration", "Enterprise governance", "Real-time large file processing", "Private data handling"],
        useCases: ["Cross-app business reporting", "CRM and sales ops automation", "IT incident management", "Financial reconciliation"],
        addedDate: "2026-02-20"
    },
    {
        id: "49",
        name: "Simple Phones",
        slug: "simple-phones",
        tagline: "Never miss a call from a customer",
        description: "Simple Phones is an AI-powered phone agent that answers inbound calls and makes outbound calls on your behalf. Forward your missed calls or get a new number, and the AI agent handles customer inquiries, follows up with leads, and even makes cold calls. The agent improves over time and can be customized for your specific business needs.",
        categories: ["sales", "customer-support"],
        website: "https://www.simplephones.ai",
        pricing: "Starting at $97/month for 100 calls, no commitment",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/simple-phones-logo.png",
        features: ["AI inbound call answering", "Outbound calling and cold calls", "Call logging and transcripts", "Customizable AI voice agent", "Continuous agent improvement", "Dashboard with chat testing"],
        useCases: ["Missed call recovery", "Lead follow-up automation", "Customer support phone handling", "Cold calling at scale"],
        addedDate: "2026-02-20"
    },
    {
        id: "50",
        name: "Aident AI",
        slug: "aident-ai",
        tagline: "Turn ideas into AI agents instantly",
        description: "Aident AI is an agentic automation platform that turns natural language into executable workflows. Describe what you want in plain English and Aident turns it into a Playbook — a compiled set of scripts and prompts that run reliably. Connect 250+ tools including Gmail, Google Sheets, LinkedIn, Slack, and more. Keep updating automations through chat as your process changes, with built-in approval flows and version tracking.",
        categories: ["productivity", "marketing"],
        website: "https://aident.ai",
        pricing: "Free plan (300 credits/mo), Basic: $6/mo, Pro: $18/mo, Max: $60/mo (billed annually, 50% launch discount)",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/aident-ai-logo.png",
        features: ["Natural language to automation", "250+ tool integrations", "AI-powered Playbooks", "Built-in approval workflows", "Version tracking and change history", "Code interpreter support"],
        useCases: ["Marketing automation and competitor tracking", "Sales lead enrichment", "Business process automation", "Automated reporting and analytics"],
        addedDate: "2026-02-21"
    },
    {
        id: "51",
        name: "Warp",
        slug: "warp",
        tagline: "The agentic development environment",
        description: "Warp is a modern terminal reimagined for the age of AI agents. Run a team of coding agents — including Warp's own SOTA agent, Claude Code, Codex, and Gemini CLI — all from the terminal. Warp Code ranks #1 on Terminal-bench (52%) and top three on SWE-bench Verified (75.8%). Features include codebase indexing, cloud-hosted agents, multi-agent workflows, and a beautifully designed terminal with modern editing, completions, and collaboration features.",
        categories: ["coding"],
        website: "https://www.warp.dev",
        pricing: "Free plan available, Build: $18/mo, Max: $180/mo, Business: $45/user/mo, Enterprise: Custom",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/warp-logo.png",
        features: ["#1 Terminal-bench coding agent", "Multi-agent orchestration", "Codebase indexing and context", "Cloud-hosted agents", "Modern terminal UI", "Bring your own LLM", "SAML SSO and Zero Data Retention"],
        useCases: ["AI-assisted coding and debugging", "Multi-agent development workflows", "Team terminal collaboration", "Production deployment from terminal"],
        addedDate: "2026-02-21"
    },
    {
        id: "52",
        name: "Friendware",
        slug: "friendware",
        tagline: "Mind-reading AI for macOS",
        description: "Friendware is a proactive AI assistant that lives system-wide on macOS. It understands what's on your screen, predicts your intent, and helps you act instantly — just press Tab. Unlike traditional AI tools that require copy-pasting and context-switching, Friendware injects inline AI suggestions directly into any text field across any app, from emails to documents to code editors. It's the first AI designed to be with you while you work rather than in a separate window.",
        categories: ["productivity", "writing"],
        website: "https://www.friendware.ai",
        pricing: "Founding Member lifetime access (limited cohort), pricing details on website",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/friendware-logo.png",
        features: ["System-wide Tab-to-complete", "Screen context awareness", "Intent prediction", "Inline AI suggestions in any text field", "No context-switching required", "macOS native integration"],
        useCases: ["Faster email and document writing", "In-context code completions", "System-wide AI assistance", "Reducing copy-paste workflows"],
        addedDate: "2026-02-21"
    },
    {
        id: "53",
        name: "CogniMemo",
        slug: "cognimemo",
        tagline: "Universal AI memory infrastructure",
        description: "CogniMemo is a universal, AI-powered memory infrastructure that gives any AI real long-term memory. It automatically captures important information from conversations, files, and actions, then structures it into meaningful, user-owned memory accessible across any model or product by consent. Works with any LLM including OpenAI, Anthropic, Gemini, Mistral, and local models like Ollama. Integrates with Pinecone, Weaviate, PostgreSQL, Redis, and work tools like Notion, Slack, and Google Drive.",
        categories: ["productivity", "research"],
        website: "https://cognimemo.com",
        pricing: "Free tier available, paid plans on website",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/cognimemo-logo.svg",
        features: ["Universal AI memory layer", "Auto-capture from conversations and files", "Permission-based memory access", "Works with any LLM", "REST API and SDK integration", "LangChain-compatible adapters", "Entity and pattern extraction", "Cross-tool memory persistence"],
        useCases: ["Adding long-term memory to AI assistants", "Cross-app context persistence", "Building smarter AI agents", "Enterprise memory backbone for copilots"],
        addedDate: "2026-02-22"
    },
    {
        id: "54",
        name: "CalendarJet",
        slug: "calendarjet",
        tagline: "AI scheduling with branded booking pages on your own domain",
        description: "CalendarJet is an AI-powered scheduling platform that gives you custom domain booking pages (book.yourbrand.com) at a fraction of the cost of competitors like Calendly. Features AI scheduling via voice and natural language commands, fully white-labeled branding, multi-calendar sync to prevent conflicts and double bookings, and integrations with Google Calendar, Zoom, and Stripe for payments.",
        categories: ["scheduling", "productivity"],
        website: "https://www.calendarjet.com",
        pricing: "Lifetime deal: $27 (normally $497), one-time payment",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/calendarjet-logo.ico",
        features: ["Custom domain booking pages", "Full white-label branding", "AI voice scheduling", "Multi-calendar sync", "Stripe payment integration", "Google Calendar and Zoom integration", "Advanced analytics", "Full API access"],
        useCases: ["Branded client booking experience", "AI-powered appointment scheduling", "Team scheduling without recurring fees", "White-label scheduling for agencies"],
        addedDate: "2026-02-22"
    },
    {
        id: "55",
        name: "Gumloop",
        slug: "gumloop",
        tagline: "The AI automation platform built for everyone",
        description: "Gumloop is a no-code AI automation platform backed by Y Combinator that lets you build and host AI-powered business automations with a drag-and-drop interface. Connect 130+ integrations, leverage AI nodes with any LLM, and deploy workflows for marketing, sales, operations, engineering, and support. Features include visual canvas builder, MCP nodes, custom nodes, webhooks, and enterprise-grade security with SOC 2 Type 2 and GDPR compliance.",
        categories: ["productivity", "marketing", "sales"],
        website: "https://www.gumloop.com",
        pricing: "Free plan available, Solo: $37/mo, Team: $244/mo, Enterprise: Custom",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/gumloop-logo.ico",
        features: ["Drag-and-drop visual builder", "130+ integrations", "AI nodes with any LLM", "MCP and custom nodes", "Webhooks and triggers", "SOC 2 Type 2 compliant", "Bring your own API key", "Team workspaces and analytics"],
        useCases: ["Marketing automation workflows", "Sales lead enrichment and outreach", "Operations process automation", "Engineering CI/CD and monitoring", "Customer support automation"],
        addedDate: "2026-02-22"
    },
    {
        id: "56",
        name: "Deepgram",
        slug: "deepgram",
        tagline: "Voice AI platform for developers",
        description: "Deepgram is a voice AI platform that provides a unified Voice Agent API for building enterprise-ready conversational AI agents. It combines speech-to-text, LLM orchestration, and text-to-speech in a single API — no stitching together multiple services. Features include built-in barge-in detection, turn-taking prediction, function calling, and BYO LLM/TTS support. Deploy fully managed, dedicated single-tenant, in VPC, or self-hosted with HIPAA, GDPR, and regional data residency compliance.",
        categories: ["customer-support", "productivity"],
        website: "https://deepgram.com",
        pricing: "Pay-as-you-go, Voice Agent API at $4.50/hr, $200 free credits on signup, Scale: $330/mo, Business: $1,320/mo",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/deepgram-logo.jpg",
        features: ["Unified Voice Agent API", "Real-time speech-to-text and text-to-speech", "Built-in barge-in and turn-taking", "BYO LLM and TTS support", "Function calling mid-conversation", "HIPAA and GDPR compliance", "Self-hosted deployment option", "Multi-language support"],
        useCases: ["Building voice AI customer support agents", "Real-time conversational AI for call centers", "Voice-enabled enterprise applications", "Telephony and IVR automation"],
        addedDate: "2026-02-23"
    },
    {
        id: "57",
        name: "Amazon Nova Act",
        slug: "nova-act",
        tagline: "Reliable AI agents for UI workflow automation",
        description: "Amazon Nova Act is an AWS service that helps developers build, deploy, and manage fleets of reliable AI agents for automating production UI workflows. Its frontier custom computer use model is optimized for automating critical and complex browser-based workflows, breaking them down into shorter actions for higher accuracy and robustness. Achieves breakthrough 90% reliability for browser-based UI automation workflows and integrates seamlessly into existing development lifecycles.",
        categories: ["productivity", "productivity"],
        website: "https://aws.amazon.com/nova/act/",
        pricing: "AWS pay-as-you-go pricing",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/nova-act-logo.png",
        features: ["Browser-based UI automation", "90% workflow reliability", "Fleet management for agent deployments", "Computer use model optimized for UI tasks", "Human oversight and observability", "Seamless AWS integration", "Production-grade scaling", "Multi-step workflow decomposition"],
        useCases: ["Automating repetitive browser workflows", "Cross-tool data entry and updates", "QA and testing automation", "Enterprise process automation at scale"],
        addedDate: "2026-02-23"
    },
    {
        id: "58",
        name: "Caretta",
        slug: "caretta",
        tagline: "Realtime AI for sales calls",
        description: "Caretta is a YC-backed sales intelligence agent that joins reps in live calls, helping them handle information requests, questions, and objections in real time. It lives in Slack to join the team conversation and gets smarter automatically — every call expands its knowledge base and objection library, turning conversations into compounding organizational advantage. Built specifically for revenue teams who need instant access to product knowledge during high-stakes sales conversations.",
        categories: ["sales"],
        website: "https://www.caretta.so",
        pricing: "Contact for pricing",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/caretta-logo.png",
        features: ["Real-time live call assistance", "Objection handling suggestions", "Automatic knowledge base expansion", "Slack integration", "Sales intelligence from every call", "Compounding organizational knowledge", "Information request handling", "Team-wide learning from conversations"],
        useCases: ["Live sales call support and coaching", "Real-time objection handling", "Sales team knowledge sharing", "Onboarding new sales reps faster"],
        addedDate: "2026-02-23"
    },
    {
        id: "59",
        name: "Typewise",
        slug: "typewise",
        tagline: "AI customer service platform with multi-agent orchestration",
        description: "Typewise is an enterprise AI customer service platform that uses multi-agent orchestration to autonomously resolve customer requests across email, chat, WhatsApp, voice, and social channels. Its AI supervisor coordinates domain-specialist agents for support, sales, and commerce workflows including returns, billing, quotes, and renewals. Agents read and write across CRM, ERP, billing, ITSM, and commerce systems. Business teams define workflows in plain language — no coding required — and built-in simulation, evaluation, and approval workflows ensure safe production deployments. Trusted by enterprise teams with 10M+ tickets solved and 200+ deep integrations.",
        categories: ["customer-support", "productivity", "sales"],
        website: "https://www.typewise.app",
        pricing: "Starting from $1 per resolution, success-based pricing",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/typewise-logo.jpg",
        features: ["Multi-agent orchestration", "Natural language workflow builder", "Omnichannel support (email, chat, WhatsApp, voice, social)", "200+ deep integrations (CRM, ERP, billing, ITSM)", "Hybrid intelligence with human handoff", "Automated evaluations and simulation", "MCP-native architecture", "Enterprise-grade security and audit trails"],
        useCases: ["Automating enterprise customer service at scale", "Multi-channel support orchestration", "Sales and commerce workflow automation", "Reducing average handling time for support teams"],
        addedDate: "2026-02-24"
    },
    {
        id: "60",
        name: "FlowLens",
        slug: "flowlens",
        tagline: "AI-native bug reports built for coding agents",
        description: "FlowLens makes sharing web-app bugs with AI coding agents effortless. Record your browser session with one click to capture video, network activity, console logs, DOM events, and user interactions — all synchronized and AI-ready. Share a single link that both developers and AI agents understand. Via its MCP server, coding agents like Claude Code, Cursor, GitHub Copilot, and Windsurf get full browser context to debug autonomously — no copy-pasting console errors or writing long prompts. Built with privacy first: automatic PII redaction happens locally, all recordings are encrypted, and you control what gets shared.",
        categories: ["coding", "productivity"],
        website: "https://magentic.ai/flowlens/",
        pricing: "Free to start",
        paymentOptions: {
            isPaid: false,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/flowlens-logo.ico",
        features: ["One-click browser session recording", "Synchronized video + network + console + DOM capture", "MCP server for AI agent integration", "Works with Claude Code, Cursor, Copilot, Windsurf", "Automatic PII redaction", "Single shareable bug link", "Storage state and navigation event capture", "1-minute setup Chrome extension"],
        useCases: ["Sharing reproducible bugs with AI coding agents", "Autonomous AI debugging with full browser context", "QA and developer collaboration on web app issues", "Reducing back-and-forth in bug triage"],
        addedDate: "2026-02-24"
    },
    {
        id: "61",
        name: "Gamma",
        slug: "gamma",
        tagline: "AI-powered presentations, documents, and websites in seconds",
        description: "Gamma is an AI presentation and document creation platform that generates polished slide decks, docs, and web pages from a simple prompt or pasted text. With over 250 million creations, it replaces traditional tools like Google Slides and PowerPoint with a modern, AI-native workflow. Import existing files, URLs, or start from scratch — Gamma handles layout, design, and formatting automatically. Features smart templates, drag-and-drop blocks, one-click restyling, and built-in analytics. Used by startups and enterprises alike for pitch decks, internal docs, landing pages, and more.",
        categories: ["productivity", "writing"],
        website: "https://gamma.app",
        pricing: "Free plan available, Plus from $10/mo, Pro from $20/mo",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/gamma-logo.jpg",
        features: ["AI presentation generation from prompts", "Document and webpage creation", "Smart templates and drag-and-drop blocks", "Import from PowerPoint, PDF, or URL", "One-click restyling and themes", "Built-in analytics and engagement tracking", "Collaborative editing", "Export to PDF and PowerPoint"],
        useCases: ["Creating pitch decks and sales presentations", "Internal documentation and reports", "Landing pages and marketing sites", "Converting notes into polished presentations"],
        addedDate: "2026-02-25"
    },
    {
        id: "62",
        name: "Wayfound",
        slug: "wayfound",
        tagline: "Guardian AI agent for enterprise agent supervision and compliance",
        description: "Wayfound is the world's first independent AI agent supervision platform, designed so business users can monitor, evaluate, and optimize all their AI agents from a single dashboard. Its AI Supervisor reads 100% of agent transcripts in real time, generating scorecards, recommendations, alerts, and compliance reports. Works with any AI agent or agentic workflow — including Salesforce Agentforce — with flexible integration via API or MCP server. Enables supervised self-healing, where agents automatically improve based on real-time feedback loops. Trusted by enterprises for brand safety, regulatory compliance, and continuous agent performance optimization.",
        categories: ["productivity", "customer-support"],
        website: "https://www.wayfound.ai",
        pricing: "Starting at $179/mo for 1 agent, Enterprise from $749/mo for 5 agents",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/wayfound-logo.png",
        features: ["Real-time AI agent supervision", "100% transcript monitoring", "Agent scorecards and performance analytics", "Compliance and brand safety enforcement", "Supervised self-healing agents", "Salesforce Agentforce integration", "MCP server support", "Multi-agent workflow supervision", "Proactive alerts and recommendations"],
        useCases: ["Monitoring enterprise AI chatbot performance", "Ensuring AI agent regulatory compliance", "Optimizing multi-agent workflow outcomes", "Reducing risk in production AI deployments"],
        addedDate: "2026-02-25"
    },
    {
        id: "63",
        name: "BrowserBook",
        slug: "browserbook",
        tagline: "AI-powered IDE for building fast, reliable browser automations",
        description: "BrowserBook is an AI-powered browser automation IDE built on Playwright that combines a Jupyter-style notebook with a context-aware AI coding assistant and an inline browser. Write, test, and debug deterministic browser automations in a single environment — 10x cheaper than browser agents while being more reliable. Features managed authentication, API-triggered execution, global proxies for bot detection bypass, and HIPAA-compliant infrastructure. From healthcare data pipelines to QA testing and web scraping, BrowserBook delivers speed, stability, and enterprise-grade security for any browser automation workflow.",
        categories: ["coding", "automation", "productivity"],
        website: "https://www.browserbook.com",
        pricing: "Free plan, Developer $29/mo, Team $99/mo, Enterprise custom",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/browserbook-logo.png",
        features: ["Jupyter-style notebook IDE", "Context-aware AI coding assistant", "Inline browser for live testing", "Built on Playwright", "Managed authentication framework", "API-triggered workflow execution", "Global proxies for bot detection bypass", "HIPAA compliant with SOC 2 in progress", "Team workspaces and collaboration"],
        useCases: ["Browser-based QA and testing automation", "Web scraping and data extraction", "Healthcare data pipeline automation", "RPA and repetitive task automation"],
        addedDate: "2026-02-25"
    },
    {
        id: "64",
        name: "Sybill",
        slug: "sybill",
        tagline: "AI sales assistant that automates CRM updates, follow-ups, and deal intelligence",
        description: "Sybill is an AI sales assistant that acts as a sales coordinator, personal assistant, and deal strategist for revenue teams. It captures and connects every call, email, Slack message, and CRM update to build a complete picture of every deal. Reps can ask ChatGPT-like questions across all their deals and conversations, while Sybill handles busywork like email follow-ups, CRM autofill, pre-meeting briefs, and task automation. For sales managers, it provides real-time deal inspection, pipeline reviews, win/loss analysis, and personalized coaching briefs — all without binging call recordings.",
        categories: ["sales", "productivity"],
        website: "https://www.sybill.ai",
        pricing: "Free Starter plan, Essentials $30/user/mo, Business $90/user/mo",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/sybill-logo.svg",
        features: ["AI-powered CRM autofill", "Automated email follow-ups in your voice", "AI meeting notetaking", "Pre-meeting deal prep briefs", "Ask Sybill natural language queries", "Deal inspection and pipeline reviews", "Win/loss analysis", "Sales collateral generation", "Task automation", "Salesforce, HubSpot, Zoho, and Dynamics 365 integration"],
        useCases: ["Automating post-call CRM updates and follow-ups", "Preparing reps for customer meetings with AI briefs", "Coaching sales teams with data-driven insights", "Inspecting deal health and pipeline risks"],
        addedDate: "2026-02-26"
    },
    {
        id: "65",
        name: "Letter AI",
        slug: "letter-ai",
        tagline: "AI-native revenue enablement platform for content, training, coaching, and buyer engagement",
        description: "Letter AI is an AI-native revenue enablement platform that gives sales teams superpowers across content management, training, coaching, and buyer engagement. Its Letter Compass feature delivers account-specific enablement to every seller so they stay prepared for calls and move deals faster. Build interactive training, video-based learning, and certification pathways in minutes using existing docs. The AI agent provides personalized responses with deep expertise in your company and products. Recently launched a $40M Series B and Letter Compass for deal-specific AI coaching. Trusted by enterprises like Lenovo, Domo, and InvoiceCloud.",
        categories: ["sales", "productivity"],
        website: "https://www.letter.ai",
        pricing: "Contact for pricing (enterprise-focused)",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/letter-ai-logo.png",
        features: ["Letter Compass deal-specific coaching", "AI-powered sales training and certification", "Content creation and management with AI", "AI sales agent with company knowledge", "End-to-end RFP automation", "Mock persona practice for sales pitches", "Video-based learning modules", "Buyer engagement tracking", "Slack and CRM integrations"],
        useCases: ["Onboarding and training new sales reps", "Preparing sellers with account-specific enablement", "Automating RFP responses and proposals", "Coaching reps with AI-powered role-play"],
        addedDate: "2026-02-26"
    },
    {
        id: "66",
        name: "2-b.ai",
        slug: "2b-ai",
        tagline: "Zero-setup AI to-do list built into your browser",
        description: "2-b.ai is a browser-based AI task management tool that combines the structure of a to-do list with LLM intelligence. With a single drag, turn any web context from Gmail, Google Docs, Notion, or articles into an AI-assisted task that breaks down automatically. The Chrome extension works across most web pages, letting you capture and organize tasks without leaving your workflow. Features AI chat for creating, deleting, and refining tasks, Google Calendar sync, and GPAI-compliant AI models for security. Launched on Product Hunt in January 2026 as 'Todoist meets ChatGPT inside your browser.'",
        categories: ["productivity"],
        website: "https://2-b.ai",
        pricing: "Free plan (50 AI calls), Pro $5.99/mo",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/2b-ai-logo.png",
        features: ["Browser extension for instant task capture", "AI-powered task breakdown", "Drag-and-drop web context to task", "AI chat for task management", "Google Calendar sync", "GPAI-compliant AI models", "Works across Gmail, Google Docs, Notion", "Priority support on Pro plan"],
        useCases: ["Capturing tasks from emails and documents without switching apps", "Breaking down complex projects into AI-generated subtasks", "Managing daily to-dos with AI assistance", "Syncing browser-based tasks with Google Calendar"],
        addedDate: "2026-02-26"
    },
    {
        id: "67",
        name: "Sonix",
        slug: "sonix",
        tagline: "99% accurate AI transcription, translation, and subtitling in 53+ languages",
        description: "Sonix is an enterprise-grade AI transcription platform that converts audio and video to text with 99% accuracy in over 53 languages. Founded in 2017, it has grown to over 6.2 million users and 21,000+ companies including Cloudflare. Every conversation becomes a structured dataset with named speakers, topics, key statements, action items, and timestamps — not just a block of text. Features include multi-transcript analysis for cross-document insights, sentiment analysis, automated summaries, and speaker diarization that tracks who said what even across interruptions and overlaps. SOC 2 Type II and HIPAA compliant, making it trusted by healthcare, legal, media, and research teams. At $5/audio hour vs $100+ for manual transcription, it delivers 95% cost savings with enterprise-grade security.",
        categories: ["transcription", "productivity"],
        website: "https://sonix.ai",
        pricing: "Free trial (30 min), Standard $10/hr, Premium $5/hr (subscription)",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/sonix-logo.png",
        features: ["99% transcription accuracy", "53+ language support", "Speaker diarization and labeling", "Multi-transcript analysis", "Sentiment analysis", "Automated summaries and chapters", "SOC 2 Type II and HIPAA compliant", "Automated subtitling and translation", "Custom vocabulary support", "Batch processing API", "SSO and granular permissions"],
        useCases: ["Transcribing medical consultations with HIPAA compliance", "Legal deposition and court proceeding transcription", "Journalist interview transcription and analysis", "Research qualitative analysis across multiple transcripts", "Filmmaker subtitle and caption generation"],
        addedDate: "2026-02-27"
    },
    {
        id: "68",
        name: "docAnalyzer",
        slug: "docanalyzer",
        tagline: "AI-powered document analysis with intelligent chat, OCR, and workflow automation",
        description: "docAnalyzer is an AI document analysis platform that lets you chat with single documents or massive multi-doc datasets to extract insights, automate repetitive tasks, and focus on what matters. Upload documents in PDF, DOCX, Excel, HTML, EPUB, and more — the AI autonomously searches, retrieves, and cross-references content to build evidence-backed answers. Features agentic workflow automation for document sorting, data extraction, and custom integrations. Offers a constantly updated selection of the best AI models from Anthropic, OpenAI, Google Gemini, DeepSeek, and xAI. Includes OCR for scanned documents, embeddable chatbots, shareable chat links, and team collaboration workspaces. Trusted by professionals who report cutting document work time by 50% or more.",
        categories: ["document-analysis", "productivity"],
        website: "https://docanalyzer.ai",
        pricing: "Free plan, Basic $5/mo, Pro $10/mo, Team $15/seat/mo, Enterprise $20/seat/mo",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/docanalyzer-logo.png",
        features: ["Intelligent multi-document chat", "Agentic workflow automation", "OCR for scanned and image-based documents", "Multiple AI model selection", "Embeddable chatbot deployment", "Shareable chat links", "Team collaboration workspaces", "API access for programmatic use", "Expert mode with BYOK", "Cross-reference and evidence-backed answers"],
        useCases: ["Analyzing large legal document collections", "Extracting structured data from scanned PDFs", "Cross-referencing research papers and reports", "Automating document sorting and classification", "Building customer-facing document chatbots"],
        addedDate: "2026-02-27"
    },
    {
        id: "69",
        name: "Krea",
        slug: "krea",
        tagline: "AI creative suite for generating, enhancing, and editing images, videos, and 3D meshes",
        description: "Krea is an AI creative suite used by over 30 million users across 191 countries to generate, enhance, and edit images, videos, and 3D objects. Features its flagship Krea 1 model for ultra-realistic image generation at native 4K resolution, along with industry-leading inference speed. Includes a real-time canvas for live AI-assisted editing, image-to-image transformation across 1000+ styles, lipsync capabilities, video upscaling, and a full asset manager. Users can fine-tune models with their own data and access the latest models on release day. The platform is designed for both professionals and beginners, with a minimalist UI and comprehensive tool suite covering the full creative pipeline from concept to final output.",
        categories: ["image-generation", "video-generation"],
        website: "https://www.krea.ai",
        pricing: "Free plan, Pro from $8/mo, teams and enterprise plans available",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/krea-logo.png",
        features: ["Krea 1 ultra-realistic flagship model", "Native 4K image generation", "Real-time canvas for live editing", "Image-to-image style transfer", "Video generation and upscaling", "3D mesh generation", "1000+ styles library", "Model fine-tuning with custom data", "Lipsync capabilities", "Full asset manager", "Bleeding-edge model access on release day"],
        useCases: ["Generating product imagery and marketing visuals", "Transforming sketches into polished artwork", "Creating video content with AI animation", "Upscaling low-resolution images and video to 4K", "Rapid prototyping of 3D assets for games and design"],
        addedDate: "2026-02-27"
    },
    {
        id: "70",
        name: "Pilot AI Accountant",
        slug: "pilot-ai-accountant",
        tagline: "Fully autonomous AI bookkeeper that runs your entire bookkeeping and financial reporting end to end",
        description: "Pilot AI Accountant is a fully autonomous virtual worker that handles the entire bookkeeping and financial reporting process with zero human intervention. It manages transaction import, reconciliation, categorization, revenue recognition, payroll, asset capitalization and depreciation, supporting schedules, and financial statement construction — all autonomously. Built on Pilot's years of professional bookkeeping expertise, the AI is trained on their specific methodology and can onboard new businesses, configure accounting systems, and complete monthly closes in hours instead of weeks. Every transaction and decision is logged for full audit transparency. When a judgment call could have material impact, it flags for human review. Includes a 24/7 AI chat advisor for real-time insights into cash flow, spending trends, and business drivers. Used by startups and growing businesses from seed stage through exit.",
        categories: ["accounting", "productivity"],
        website: "https://pilot.com",
        pricing: "Essentials $99/mo, Core custom pricing, Select custom pricing, Tax from $1,000/yr",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/pilot-ai-logo.png",
        features: ["Fully autonomous bookkeeping", "Accrual and cash-basis accounting", "Automated transaction categorization and reconciliation", "Revenue recognition and asset depreciation", "Financial statement generation", "Full audit trail and decision logging", "24/7 AI chat advisor", "Automated business onboarding", "Custom chart of accounts", "CFO advisory services"],
        useCases: ["Automating monthly bookkeeping close for startups", "Catching up on years of backlogged bookkeeping", "Getting investor-ready financial statements", "Real-time cash flow monitoring and scenario planning", "Replacing manual bookkeeping with autonomous AI"],
        addedDate: "2026-02-28"
    },
    {
        id: "71",
        name: "Ramp Accounting Agent",
        slug: "ramp-accounting-agent",
        tagline: "AI agent that automates bookkeeping and month-end close with 90%+ accuracy and real-time transaction coding",
        description: "Ramp Accounting Agent is a specialized AI agent built into Ramp's financial operations platform that automates the manual parts of bookkeeping and month-end close. Trained on millions of transactions and tailored to each business's individual coding behaviors, it auto-codes every transaction and bill across GL, department, class, location, and custom fields the moment they happen. Smart Review checks policy adherence, accuracy, and completeness for 100% of spend in the background, giving every transaction a suggested action. Customers see up to 3.5x more auto-coding than legacy tools with 90%+ accuracy. Finance teams deliver clean books 3x faster on average, saving 40+ hours per month. The agent learns automatically from feedback and corrections, improving over time. Integrates with major ERPs and 200+ apps.",
        categories: ["accounting", "automation"],
        website: "https://ramp.com",
        pricing: "Free (included with Ramp platform), Ramp Plus and Enterprise tiers available",
        paymentOptions: {
            isPaid: false,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/ramp-logo.jpg",
        features: ["AI transaction auto-coding across all fields", "Smart Review for 100% spend policy adherence", "Real-time transaction processing", "3.5x more auto-coding than legacy tools", "90%+ coding accuracy", "Learns from corrections and feedback", "Item-level invoice coding", "200+ app integrations", "ERP sync automation", "Custom approval workflows"],
        useCases: ["Automating month-end close for finance teams", "Eliminating manual transaction categorization", "Enforcing spend policies automatically", "Reducing bookkeeping hours by 40+ per month", "Scaling accounting operations without adding headcount"],
        addedDate: "2026-02-28"
    },
    {
        id: "72",
        name: "Fish Audio",
        slug: "fish-audio",
        tagline: "The most expressive AI speech platform with emotion control, voice cloning, and 2M+ community voices",
        description: "Fish Audio is an AI voice platform powering millions of creators with studio-quality text-to-speech, voice cloning, and real-time streaming capabilities. Their flagship Fish Audio S1 model delivers the most expressive AI speech with fine-grained emotion control, and Fish Speech V1.5 ranks among the top 3 open-source voice models with an ELO score of 1339 in independent TTS Arena evaluations. Clone any voice with as little as 15 seconds of audio, access over 2 million community-uploaded voices, and generate speech in 30+ languages. Features include a unified streaming API, voice activity detection, push-to-send controls, and multilingual support with any voice. Used by top creators for voiceovers, audiobooks, character voices, real-time avatars, and content production at scale.",
        categories: ["voice-audio", "productivity"],
        website: "https://fish.audio",
        pricing: "Free plan (limited monthly generations), paid plans available for commercial use",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/fish-audio-logo.png",
        features: ["Fish Audio S1 with emotion control", "Voice cloning from 15 seconds of audio", "2M+ community voice library", "30+ language support", "Unified streaming API", "Voice activity detection", "Real-time avatar voice generation", "Push-to-send audio control", "Open-source Fish Speech model", "Multilingual voice transfer"],
        useCases: ["Creating voiceovers for YouTube and social media content", "Generating audiobook narration at scale", "Building real-time voice agents and avatars", "Cloning voices for personalized content", "Multilingual content production with consistent voice identity"],
        addedDate: "2026-02-28"
    },
    {
        id: "73",
        name: "Fathom",
        slug: "fathom",
        tagline: "AI notetaker that records, transcribes, and summarizes meetings so you never take notes again",
        description: "Fathom is an AI-powered meeting assistant that joins your Zoom, Google Meet, or Microsoft Teams calls to automatically record, transcribe, and summarize everything discussed. It delivers shockingly accurate transcripts with instant AI summaries, action items, and key highlights straight to your inbox after every call. The 'Ask Fathom' feature lets you search across all your meetings and get answers from your conversation history instantly. Meeting notes, insights, and action items sync automatically with Slack, Salesforce, HubSpot, Notion, Asana, and other tools. Teams get real-time coaching metrics, AI scorecards, deal view insights, and global search across shared calls. 95% of users report staying fully present in meetings, and teams save 6+ hours per member weekly on follow-up work. Free plan includes unlimited recordings and transcriptions.",
        categories: ["transcription", "productivity"],
        website: "https://fathom.video",
        pricing: "Free forever (unlimited recordings + transcriptions), Premium $16/mo, Team $15/mo/user, Business $20/mo/user",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/fathom-logo.png",
        features: ["Unlimited free recordings and transcriptions", "Instant AI call summaries", "Action item extraction", "Ask Fathom conversational search", "Clips and playlists", "CRM sync (Salesforce, HubSpot)", "Slack, Notion, Asana integrations", "AI coaching scorecards", "Deal view insights", "Custom meeting bot and vocabulary"],
        useCases: ["Automatically transcribing and summarizing team meetings", "Searching across months of meeting history for key decisions", "Syncing meeting action items to project management tools", "Coaching sales reps with AI-powered call scorecards", "Staying fully present in meetings without manual note-taking"],
        addedDate: "2026-03-01"
    },
    {
        id: "74",
        name: "Julius AI",
        slug: "julius-ai",
        tagline: "Your personal AI data analyst — chat with your data and get instant insights, charts, and answers",
        description: "Julius AI is an AI-powered data analysis platform that lets anyone analyze data and create visualizations just by asking questions in plain English. Upload a CSV, Excel file, or connect to a live data source like Snowflake or BigQuery, then ask questions like 'What were our top-selling products last quarter?' Julius writes and runs the necessary Python or R code behind the scenes and presents clean charts, tables, and statistical analysis. It handles everything from basic exploratory analysis to advanced regression, forecasting, and machine learning workflows. Julius Teams enables real-time collaboration with shared workspaces and data connectors. Built for people who need data answers without a data science degree — business analysts, researchers, marketers, and founders all use it to turn messy spreadsheets into actionable insights in seconds.",
        categories: ["data-analysis", "productivity"],
        website: "https://julius.ai",
        pricing: "Free (limited messages), Essential $20/mo, Pro custom pricing",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/julius-ai-logo.ico",
        features: ["Natural language data querying", "Automatic Python/R code generation", "Interactive chart and visualization creation", "CSV, Excel, and database connectors", "Snowflake and BigQuery integration", "Statistical analysis and regression", "Forecasting and ML workflows", "Julius Teams collaboration", "Shared workspaces", "Export to PDF and presentations"],
        useCases: ["Analyzing sales data without writing code", "Creating investor-ready charts from raw spreadsheets", "Running statistical analysis on survey or research data", "Connecting to live databases for real-time business intelligence", "Collaborating on data analysis across teams"],
        addedDate: "2026-03-01"
    },
    {
        id: "75",
        name: "Typefully",
        slug: "typefully",
        tagline: "The best social media tool for creators and businesses to write, schedule, and grow on X and LinkedIn",
        description: "Typefully is an AI-powered social media management platform built for creators and businesses who want to grow on X (Twitter) and LinkedIn. It offers a distraction-free writing editor optimized for threads and long-form posts, AI-powered content suggestions and rewrites, smart scheduling with optimal posting times, and detailed engagement analytics. Features include cross-posting to multiple platforms, auto-retweet and auto-plug for evergreen content promotion, content inspiration feeds, and team collaboration tools. The analytics dashboard provides deep insights into follower growth, engagement rates, and best-performing content. Typefully has helped creators grow audiences from zero to hundreds of thousands of followers with its data-driven approach to social media content. Used by solo creators, marketing teams, and agencies managing multiple brand accounts.",
        categories: ["social-media", "marketing"],
        website: "https://typefully.com",
        pricing: "Free plan, Creator $11/mo, Team $29/mo, Agency custom pricing",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/typefully-logo.png",
        features: ["Distraction-free thread editor", "AI content suggestions and rewrites", "Smart scheduling with optimal times", "Cross-posting to X and LinkedIn", "Auto-retweet and auto-plug", "Detailed engagement analytics", "Follower growth tracking", "Content inspiration feeds", "Team collaboration and approvals", "Multi-account management"],
        useCases: ["Growing a personal brand on X and LinkedIn", "Scheduling and optimizing social media content", "Writing viral Twitter threads with AI assistance", "Managing multiple brand accounts for an agency", "Analyzing engagement to improve content strategy"],
        addedDate: "2026-03-01"
    },
    {
        id: "76",
        name: "Ideogram",
        slug: "ideogram",
        tagline: "AI image generation with best-in-class text rendering and photorealistic output",
        description: "Ideogram is an AI image generation platform known for its industry-leading ability to render readable text within generated images — a problem that has historically plagued other image generators. Built by a team of ex-Google Brain researchers, Ideogram produces photorealistic images, illustrations, 3D renders, and typography-heavy designs from text prompts. Its latest model, Ideogram 2.0, delivers exceptional prompt adherence and coherent compositions across styles from photorealism to anime. The platform includes features like Magic Prompt (auto-enhances your prompts), style references, negative prompts, and aspect ratio controls. The free tier offers generous daily generations, making it accessible for casual users, while paid tiers unlock higher resolution, faster generation, and private mode. Ideogram has become a go-to tool for designers, marketers, and content creators who need text-in-image capabilities that other AI generators simply can't match.",
        categories: ["image-generation", "productivity"],
        website: "https://ideogram.ai",
        pricing: "Free (10 prompts/day), Basic $8/mo, Plus $20/mo, Pro $60/mo",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/ideogram-logo.png",
        features: ["Best-in-class text rendering in images", "Photorealistic image generation", "Magic Prompt auto-enhancement", "Style references and negative prompts", "Multiple aspect ratios and resolutions", "Illustration, 3D, and anime styles", "Private generation mode", "API access for developers", "Community gallery and remix", "High prompt adherence"],
        useCases: ["Creating social media graphics with embedded text", "Generating marketing banners and ad creatives", "Designing logos and typography-heavy visuals", "Producing photorealistic product mockups", "Creating illustrations and concept art for projects"],
        addedDate: "2026-03-02"
    },
    {
        id: "77",
        name: "Kling AI",
        slug: "kling-ai",
        tagline: "Next-generation AI creative studio for video, image, and sound generation",
        description: "Kling AI is a comprehensive AI creative studio developed by Kuaishou Technology that excels at generating high-quality videos, images, and sound from text and image prompts. Its flagship video generation models (up to Kling 3.0) produce cinematic-quality clips with realistic motion, physics, and scene coherence that rival industry leaders like Runway and Sora. Kling supports text-to-video, image-to-video, video effects, motion control, and sound generation — making it a complete multimedia creation platform. Key differentiators include native scene generation capabilities, lip-sync for talking head videos, motion brush for precise animation control, and a professional-grade output quality at competitive pricing. The platform offers both a consumer app and developer API with volume-tiered pricing. Kling AI has quickly become one of the most popular AI video generators globally, particularly strong in long-form coherent video generation and creative effects.",
        categories: ["video-generation", "image-generation"],
        website: "https://klingai.com",
        pricing: "Free tier (limited credits), Pro $8/mo, Premium $28/mo, API pay-per-use",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/kling-ai-logo.ico",
        features: ["Text-to-video generation up to 1080p", "Image-to-video animation", "AI sound and music generation", "Motion brush and motion control", "Lip-sync for talking head videos", "Video effects and transitions", "Multiple model versions (V1 to V3)", "Developer API with volume pricing", "Mobile apps for iOS and Android", "Professional-grade scene coherence"],
        useCases: ["Creating short-form video content for social media", "Animating product images into dynamic video ads", "Generating cinematic B-roll footage from text descriptions", "Producing talking head videos with lip-sync", "Building creative video effects and transitions for content"],
        addedDate: "2026-03-02"
    },
    {
        id: "78",
        name: "n8n",
        slug: "n8n",
        tagline: "AI workflow automation platform that combines code flexibility with no-code speed",
        description: "n8n is an open-source workflow automation platform that uniquely combines AI capabilities with business process automation, giving technical teams the flexibility of code with the speed of no-code. With 500+ native integrations and the ability to write custom JavaScript or Python within any workflow, n8n lets you build everything from simple Zapier-style automations to complex AI agent pipelines. The platform supports self-hosting for complete data control or can run on n8n's managed cloud. Key AI features include native LLM nodes for OpenAI, Anthropic, and other providers, AI agent workflows with tool use, RAG pipelines, and vector store integrations. n8n's visual workflow editor makes it easy to design, test, and debug complex multi-step automations. Enterprise features include SSO, RBAC, audit logs, git-based version control, and isolated environments. With over 60,000 GitHub stars and a massive community, n8n has become the go-to automation platform for developers and technical teams who need more power than Zapier but less complexity than custom code.",
        categories: ["automation", "productivity"],
        website: "https://n8n.io",
        pricing: "Free (self-hosted), Pro €20/mo, Business custom, Enterprise custom",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/n8n-logo.ico",
        features: ["500+ native app integrations", "Visual workflow editor", "Custom JavaScript and Python nodes", "AI agent and LLM workflow nodes", "RAG and vector store support", "Self-hosted or cloud deployment", "Git-based version control", "SSO SAML and LDAP authentication", "Webhook and cron triggers", "White-label embedding (n8n Embed)"],
        useCases: ["Automating repetitive business processes across tools", "Building AI agent pipelines with tool use and RAG", "Syncing data between CRM, email, and project management tools", "Creating webhook-triggered workflows for real-time automation", "Self-hosting automation infrastructure for data privacy compliance"],
        addedDate: "2026-03-02"
    },
    {
        id: "79",
        name: "iFixit FixBot",
        slug: "ifixit-fixbot",
        tagline: "AI-powered repair assistant backed by 20+ years of iFixit repair knowledge",
        description: "iFixit FixBot is an AI repair assistant that helps you diagnose problems, research solutions, and repair with confidence. Powered by iFixit's massive library of 72,000+ supported products and over 100 million successful repairs, FixBot provides hands-free expert guidance using voice and visual diagnostics. Speak or type your problem, and FixBot draws from professional repair guides, schematics, and troubleshooting tips to walk you through the fix. Available on web, iOS, and Android, with an Enthusiast tier coming soon that adds OEM service manuals, advanced diagnostics, and step-by-step voice-guided repairs. Built by the team that created the world's largest repair community.",
        categories: ["home-improvement"],
        website: "https://www.ifixit.com/go/fixbot",
        pricing: "Free tier available, Enthusiast plan coming soon",
        paymentOptions: {
            isPaid: false,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/ifixit-fixbot-logo.png",
        features: ["Voice diagnostics for hands-free repair guidance", "Visual diagnostics via photo upload", "72,000+ supported products", "Professional repair guides and schematics", "Consumer electronics, smartphones, laptops, home appliances, game consoles", "Available on web, iOS, and Android", "OEM service manual access (Enthusiast tier)", "Upload your own manuals (Enthusiast tier)"],
        useCases: ["Diagnosing broken electronics and home appliances", "Getting step-by-step repair instructions for smartphones and laptops", "Hands-free troubleshooting while working on a repair", "Identifying which parts need replacement before ordering", "Learning DIY repair skills with expert-backed guidance"],
        addedDate: "2026-03-04"
    },
    {
        id: "80",
        name: "Hume AI",
        slug: "hume-ai",
        tagline: "The AI toolkit for emotionally intelligent voice and speech generation",
        description: "Hume AI builds AI that understands and responds to human emotions. Their flagship products include Octave, a frontier text-to-speech model that lets you design voices with natural language descriptions or clone any voice from seconds of audio, and EVI (Empathic Voice Interface), a speech-to-speech conversational AI that perceives and responds to emotional cues in real time. Octave supports 100+ languages with native-level pronunciation, acting instructions for directing vocal performance, and 250ms speech LLM latency. Ranked #1 in naturalness and expressivity, with 600+ emotion and voice characteristic tags detected. Built on decades of scientific research in human expression, with a strong ethical framework prioritizing beneficence and emotional well-being.",
        categories: ["voice-audio"],
        website: "https://www.hume.ai",
        pricing: "Free tier, Starter $3/mo, Creator $14/mo, Pro $70/mo, Scale $200/mo, Business $500/mo, Enterprise custom",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/hume-ai-logo.png",
        features: ["Text-to-speech with natural language voice design", "Instant voice cloning from seconds of audio", "100+ language support with native pronunciation", "Acting instructions for directing vocal delivery", "Empathic Voice Interface (EVI) for conversational AI", "600+ emotion and voice characteristic detection tags", "250ms speech LLM latency", "Voice conversion and cross-lingual synthesis", "Developer API with TypeScript, Python, React, Swift SDKs", "Expression measurement for video, audio, images, and text"],
        useCases: ["Building emotionally intelligent voice agents and chatbots", "Creating natural-sounding voiceovers and audio content", "Cloning voices for consistent brand narration across languages", "Measuring emotional response in user research and content testing", "Adding expressive speech to gaming, entertainment, and creative projects"],
        addedDate: "2026-03-04"
    },
    {
        id: "81",
        name: "Murf AI",
        slug: "murf-ai",
        tagline: "Ultra-realistic AI voice generator for voiceovers, dubbing, and voice agents",
        description: "Murf AI is a production-grade AI voice platform powering 10 million+ developers and creators worldwide, trusted by 300+ Forbes 2000 companies including Nestle, Air France, and Omnicom. Offers the fastest text-to-speech API for voice agents, a highly customizable Studio for voiceovers, and instant AI dubbing in 40+ languages. Features 120+ AI voices across 20+ languages and accents with emotional range and conversational styles. Integrates with Canva, Google Slides, and via HTML embed code. Rated 4.7/5 on G2 with 1000+ reviews. Used for e-learning, narration, advertising, and podcast production with voices so realistic that listeners can't distinguish them from human speakers.",
        categories: ["voice-audio"],
        website: "https://murf.ai",
        pricing: "Free tier available, paid plans with usage-based pricing",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/murf-ai-logo.png",
        features: ["120+ AI voices in 20+ languages and accents", "Fastest text-to-speech API for voice agents", "AI dubbing in 40+ languages", "Customizable voice studio for voiceovers", "Emotional and conversational voice styles", "Voice cloning capabilities", "Canva and Google Slides integrations", "HTML embed code for websites", "Startup incubator with 50M free API characters", "Enterprise-grade with SOC 2 compliance"],
        useCases: ["Creating e-learning course narrations with natural AI voices", "Producing podcast episodes and advertising voiceovers", "Dubbing video content into 40+ languages for global audiences", "Building voice agent applications via the text-to-speech API", "Adding audio narration to presentations and website content"],
        addedDate: "2026-03-04"
    },
    {
        id: "82",
        name: "Reducto",
        slug: "reducto",
        tagline: "AI document parsing and extraction that reads documents like a human",
        description: "Reducto is a YC-backed document intelligence platform built by a team from MIT that turns complex documents into structured, LLM-ready data. Their multi-pass system combines traditional computer vision with vision-language models for unmatched accuracy — first breaking down layout, tables, and figures, then using agentic OCR to detect and correct mistakes in real-time. Supports 30+ file types including PDFs, images, spreadsheets, slides, and scanned documents with OCR for handwritten content. Features multilingual parsing across 100+ languages, intelligent document chunking, and bounding box preservation. Trusted by leading AI teams in finance, healthcare, and legal where accuracy on sensitive documents is critical. Raised $75M Series B in October 2025. SOC 2 certified with 99.9%+ uptime and enterprise SLAs.",
        categories: ["document-analysis"],
        website: "https://reducto.ai",
        pricing: "Free tier (15K credits), then $0.015/credit. Custom enterprise pricing available.",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/reducto-logo.svg",
        features: ["Agentic OCR with real-time error correction", "30+ supported file types (PDF, images, spreadsheets, slides)", "Layout-aware parsing preserving tables, figures, and structure", "Multilingual support across 100+ languages", "Intelligent document chunking for LLM optimization", "Extract API for structured data extraction", "Bounding box preservation for precise referencing", "OCR for scanned pages, faxes, and handwritten content", "SOC 2 certified with 99.9%+ uptime", "EU/AU data residency endpoints available"],
        useCases: ["Parsing financial statements and medical records for AI pipelines", "Extracting structured data from complex tables and forms", "Building RAG systems with accurate document ingestion", "Processing legal contracts and compliance documents at scale", "Converting scanned and handwritten documents into machine-readable data"],
        addedDate: "2026-03-05"
    },
    {
        id: "83",
        name: "ThoughtSpot",
        slug: "thoughtspot",
        tagline: "Agentic analytics platform that turns data questions into instant AI-powered answers",
        description: "ThoughtSpot is an agentic analytics platform that lets anyone in an organization ask questions in natural language and get instant, governed answers on live data. Rated 4.5+ on G2 with 312+ reviews, it replaces static dashboards and request backlogs with AI-driven insights that flow directly into workflows. Features include Spotter, a conversational AI chatbot for data exploration; SpotterViz for auto-generating complete dashboards from data; SpotterModel for turning raw data into governed semantic models in minutes; and SpotterCode for AI-assisted embedded analytics development. Connects live to Snowflake, Databricks, Redshift, and more with row-level security and data encryption. Supports automated KPI monitoring, anomaly detection, alerts, and drilldowns with no pre-defined drillpath. Used by enterprise teams from sales to the C-suite to eliminate analytics bottlenecks.",
        categories: ["data-analysis"],
        website: "https://www.thoughtspot.com",
        pricing: "Custom pricing (user-based and usage-based plans available)",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/thoughtspot-logo.png",
        features: ["Natural language search across live data", "Spotter AI chatbot for conversational analytics", "SpotterViz auto-generates complete dashboards", "SpotterModel automated semantic modeling", "Automated KPI monitoring and anomaly detection", "Live connections to Snowflake, Databricks, Redshift", "Row-level security and data encryption", "Mobile apps for iOS and Android", "Embeddable analytics with developer SDK", "Model Context Protocol (MCP) server support"],
        useCases: ["Empowering business teams to self-serve analytics without SQL knowledge", "Replacing static dashboards with AI-driven real-time insights", "Monitoring KPIs and detecting anomalies automatically across departments", "Embedding interactive analytics into customer-facing products", "Accelerating data prep and semantic modeling for analytics teams"],
        addedDate: "2026-03-05"
    },
    {
        id: "84",
        name: "Handy AI",
        slug: "handy-ai",
        tagline: "Snap a photo, get a personalized DIY repair guide in seconds",
        description: "Handy AI is a mobile DIY repair assistant that uses photo-based AI diagnostics to help anyone fix things around the house. Snap a photo of a broken appliance, leaky pipe, or malfunctioning device, describe the issue, and get a custom step-by-step repair guide tailored to your situation. Each guide includes estimated time, difficulty level, safety notes, cost breakdown, tool requirements, and replacement part recommendations. Covers electronics, appliances, plumbing, furniture assembly, and everyday household maintenance. Features include appliance tracking, repair history, and saved reference photos for an organized maintenance toolkit. Designed for complete beginners with clear, jargon-free instructions. Built by EXPNT Ltd, available free on iOS and Android with in-app purchases for premium features.",
        categories: ["home-improvement"],
        website: "https://www.handyai.app",
        pricing: "Free with in-app purchases",
        paymentOptions: {
            isPaid: false,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/handy-ai-logo.png",
        features: ["Photo-based AI diagnostics for instant repair analysis", "Personalized step-by-step repair guides", "Tool and replacement part recommendations", "Difficulty level and time estimates for each repair", "Safety notes and cost breakdowns", "Appliance tracking and repair history", "Coverage for electronics, plumbing, furniture, and appliances", "Beginner-friendly jargon-free instructions", "Available on iOS and Android", "Save reference photos and organize maintenance records"],
        useCases: ["Diagnosing and fixing leaky faucets or plumbing issues at home", "Getting step-by-step guidance for assembling furniture", "Troubleshooting malfunctioning appliances like washers and dryers", "Learning what tools and parts are needed before starting a repair", "Building a maintenance log for home appliances and systems"],
        addedDate: "2026-03-05"
    },
    {
        id: "85",
        name: "Voxtral",
        slug: "voxtral",
        tagline: "Open-source speech understanding models with state-of-the-art transcription and audio intelligence",
        description: "Voxtral is Mistral AI's open-source speech understanding platform that goes far beyond simple transcription. Available in two sizes — a 24B production model and a 3B edge model — both released under Apache 2.0. Voxtral outperforms OpenAI Whisper large-v3 across all benchmarks while costing less than half the price of comparable APIs. Handles audio up to 30 minutes for transcription and 40 minutes for understanding with a 32K token context window. Features built-in Q&A and summarization directly on audio content, automatic language detection across dozens of languages, speaker diarization, and function-calling straight from voice — enabling spoken commands to trigger backend workflows without intermediate parsing. The API routes to Voxtral Mini Transcribe, optimized for cost and latency. Ideal for meeting intelligence, call center analytics, podcast processing, and voice-driven applications.",
        categories: ["transcription", "voice-audio"],
        website: "https://mistral.ai/news/voxtral",
        pricing: "API pricing: Voxtral Mini Transcribe from $0.012/min. Self-hosted free under Apache 2.0.",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/voxtral-logo.png",
        features: ["State-of-the-art transcription accuracy beating Whisper large-v3", "Two model sizes: 24B (production) and 3B (edge/local)", "32K token context — up to 30min transcription, 40min understanding", "Built-in audio Q&A and summarization without chaining models", "Automatic language detection and multilingual support", "Speaker diarization for multi-speaker audio", "Function-calling from voice for workflow automation", "Real-time streaming with sub-200ms latency", "Apache 2.0 open-source license", "Less than half the cost of comparable closed APIs"],
        useCases: ["Transcribing meetings with speaker identification and action item extraction", "Building voice-driven assistants that trigger backend workflows", "Processing podcast episodes with automated summaries and Q&A", "Call center analytics with multilingual transcription at scale", "Edge deployment of speech understanding on devices with the 3B model"],
        addedDate: "2026-03-05"
    },
    {
        id: "86",
        name: "Docsumo",
        slug: "docsumo",
        tagline: "AI document workflows that turn unstructured data into fast, accurate business decisions",
        description: "Docsumo is an intelligent document processing platform trusted by 10,000+ businesses that automates the indexing, classification, extraction, validation, and analysis of unstructured documents. Achieves ~99% data extraction accuracy compared to 60-70% with manual entry, processing documents in under 5 minutes versus 2+ hours manually. Supports unlimited pre-trained document AI models covering invoices, bank statements, tax forms, insurance claims, and more. Features AI-powered auto-classification and splitting, cross-document validation for fraud detection (64% lower fraud rates), master data lookup, and custom document pipelines. Integrates via webhooks, APIs, and pre-built connectors to CRM, ERP, and LOS systems. SOC 2 Type 2, GDPR, and HIPAA compliant with bank-grade encryption. Founded in 2019, launched on Product Hunt, backed by Techstars, and has processed over 20 million documents saving $100M+ in processing costs.",
        categories: ["document-analysis", "automation"],
        website: "https://www.docsumo.com",
        pricing: "Free tier (1,000 pages, 10 users). Business and Enterprise plans with custom pricing.",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/docsumo-logo.png",
        features: ["~99% data extraction accuracy with AI models", "Auto-classification and intelligent document splitting", "Cross-document validation and fraud detection", "30+ pre-trained document AI models", "Custom document pipelines and workflows", "AI-transform for validations, classification, categorization", "Master data lookup and database mapping", "Real-time document analytics dashboard", "SOC 2 Type 2, GDPR, and HIPAA compliant", "Pre-built integrations with CRM, ERP, and LOS systems"],
        useCases: ["Automating invoice processing and accounts payable workflows", "Extracting data from bank statements and financial documents for lending", "Processing insurance claims with cross-document fraud validation", "Digitizing logistics dispatch tickets and shipping documents", "Building touchless document workflows for enterprise compliance"],
        addedDate: "2026-03-05"
    },
    {
        id: "87",
        name: "AthenaHQ",
        slug: "athenahq",
        tagline: "Track and optimize your brand's visibility across AI search engines like ChatGPT, Perplexity, and Gemini",
        description: "AthenaHQ is a Generative Engine Optimization (GEO) and AI Engine Optimization (AEO) platform built by former Google Search and DeepMind engineers. It helps brands monitor, analyze, and improve their visibility across 8+ major AI platforms including ChatGPT, Perplexity, Google AI Overviews, Gemini, Claude, Copilot, and Grok. Features include real-time brand mention tracking, competitor share-of-voice analysis, AI content gap detection, citation source analysis, and automated content optimization recommendations. Teams report 2.5x increases in AI-driven organic traffic, 50% faster response to brand mentions, and 5x increases in AI content citations. The platform includes prompt volume estimation, brand sentiment intelligence, dynamic AI crawler management (robots.txt and llms.txt), and executive-level ROI reporting. Trusted by brands across CPG, SaaS, finance, and education verticals.",
        categories: ["seo", "marketing"],
        website: "https://athenahq.ai",
        pricing: "Self-Serve from $295/month (3,600 credits). Enterprise custom pricing.",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/athenahq-logo.png",
        features: ["Track brand visibility across 8+ AI platforms (ChatGPT, Perplexity, Gemini, Claude, etc.)", "Competitor share-of-voice monitoring and benchmarking", "AI content gap analysis and optimization recommendations", "Citation source analysis and link building insights", "Prompt volume estimation and trend analysis", "Brand sentiment intelligence across AI platforms", "Dynamic robots.txt and llms.txt management for AI crawlers", "GA4 and Google Search Console integration", "Executive ROI dashboards with BI tool support", "Multi-language and multi-region tracking"],
        useCases: ["Monitoring and improving brand mentions in ChatGPT and Perplexity responses", "Tracking competitor visibility across AI search platforms", "Optimizing content to become a primary citation source for AI answers", "Measuring ROI of AI search optimization efforts for executive reporting", "Detecting and responding to brand misinformation in AI-generated content"],
        addedDate: "2026-03-05"
    },
    {
        id: "88",
        name: "Ocoya",
        slug: "ocoya",
        tagline: "AI-powered social media management with scheduling, content creation, and automation",
        description: "Ocoya is an AI-powered social media management platform that combines content creation, scheduling, and automation in a single hub. It uses AI to generate captions, hashtags, and full social media posts tailored to your brand voice, then lets you schedule them across all major platforms including Instagram, TikTok, Facebook, LinkedIn, Twitter/X, and Pinterest. Ocoya stands out with its built-in AI copywriter that can produce posts in 26+ languages, a Canva-like graphic editor for creating visuals without leaving the platform, and automated posting workflows that can be triggered by RSS feeds, Shopify events, or custom rules. The platform also includes link shortening with tracking, team collaboration features, and analytics dashboards. Particularly strong for e-commerce brands thanks to deep Shopify and WooCommerce integrations that can auto-generate product posts from new listings.",
        categories: ["social-media", "marketing", "automation"],
        website: "https://www.ocoya.com",
        pricing: "Bronze $15/mo (1 workspace, 5 profiles), Silver $39/mo (5 workspaces, 20 profiles), Gold $79/mo (20 workspaces, 50 profiles), Diamond $159/mo (unlimited workspaces, 150 profiles). 7-day free trial. Enterprise custom pricing.",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/ocoya-logo.png",
        features: ["AI copywriter generating posts in 26+ languages", "Built-in graphic editor similar to Canva", "Multi-platform scheduling (Instagram, TikTok, Facebook, LinkedIn, Twitter/X, Pinterest)", "Automated posting workflows triggered by RSS, Shopify, or custom rules", "E-commerce integrations with Shopify and WooCommerce", "Link shortening with click tracking and analytics", "Team collaboration with workspaces and role management", "AI hashtag generator and caption optimization", "Content calendar with drag-and-drop scheduling", "Performance analytics and reporting dashboards"],
        useCases: ["Managing social media presence across multiple platforms from one dashboard", "E-commerce brands auto-generating product posts from new Shopify listings", "Marketing agencies managing multiple client accounts with team workspaces", "Creating multilingual social content for global brand campaigns", "Automating content workflows with RSS-to-social and event triggers"],
        addedDate: "2026-03-06"
    },
    {
        id: "89",
        name: "Docyt",
        slug: "docyt",
        tagline: "AI-powered full-stack bookkeeping and accounting automation for multi-entity businesses",
        description: "Docyt is an AI-driven accounting automation platform that provides end-to-end bookkeeping for multi-entity businesses, accounting firms, and hotels. Its AI agents handle transaction categorization with high precision, automated data extraction from receipts and invoices, revenue reconciliation, bill pay, expense management, and month-end closing — dramatically reducing manual bookkeeping work. Docyt features BooksGPT, a chat-based AI copilot that answers financial questions, assigns tasks, and handles exceptions in natural language. The platform consolidates all financial workflows into a single system with real-time reporting, department-level P&L, and industry-specific KPIs. Particularly strong in hospitality with specialized hotel accounting features including daily flash revenue reports, labor reporting, and multi-property consolidated financials. Trusted by accounting firms managing 100+ clients and rated 4.9/5 on G2.",
        categories: ["accounting", "automation", "document-analysis"],
        website: "https://docyt.com",
        pricing: "Plans start at $299/month. Custom pricing based on transaction volume and reporting needs. Contact sales for quotes.",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/docyt-logo.svg",
        features: ["AI-powered transaction categorization with 95%+ accuracy", "Automated receipt and invoice data extraction", "BooksGPT chat copilot for financial Q&A and task management", "Revenue reconciliation with daily flash reports", "Bill pay, expense reimbursement, and vendor 1099 management", "Real-time P&L, balance sheet, and cash flow reporting", "Multi-entity consolidated financials and reporting", "Department-level access controls and P&L breakdown", "Industry-specific KPI dashboards for hospitality", "Automated month-end close workflows"],
        useCases: ["Accounting firms automating bookkeeping for 100+ client entities", "Hotel chains managing multi-property revenue reconciliation and reporting", "CFOs getting real-time financial visibility across multiple business units", "Reducing month-end close time from weeks to days without adding headcount", "Franchise operators consolidating financials across locations with industry-specific metrics"],
        addedDate: "2026-03-06"
    },
    {
        id: "90",
        name: "Hailuo AI",
        slug: "hailuo-ai",
        tagline: "High-quality AI video and image generation from text and image prompts by MiniMax",
        description: "Hailuo AI is MiniMax's flagship AI video generation platform that turns text prompts and images into high-quality video clips. Powered by the Hailuo 2.3 model, it produces videos with remarkably fluid character motion, natural physics, and cinematic quality. The platform offers a rich ecosystem of creative tools including text-to-video, image-to-video, style transfer, ASMR generation, ad creation, and specialized modes for pet videos, baby stories, meme generation, and photo transformation. Hailuo stands out for offering a generous free tier with no login required and no watermarks, making it one of the most accessible AI video generators available. The platform also includes an AI image generator and supports both Fast and Relax generation modes. With recent updates to Hailuo 2.3, the model handles complex body movements, multi-character scenes, and precise prompt following at a level that competes directly with Runway, Sora, and Kling.",
        categories: ["video-generation", "image-generation"],
        website: "https://hailuoai.video",
        pricing: "Free plan with 200 credits. Paid plans up to Max at $199.99/mo with 20,000 credits and unlimited Relax Mode generation.",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/hailuo-ai-logo.png",
        features: ["Hailuo 2.3 model with state-of-the-art video quality", "Text-to-video and image-to-video generation", "Start and end frame control for precise video composition", "Style transfer and cinematic video modes", "Specialized creative tools: AdsFree, PetPal, BabyForm, PlayFun, SnapMorph", "AI image generation included", "ASMR audio generation", "Free tier with no login, no watermarks", "Fast and Relax generation modes", "Multi-character scenes with natural physics and motion"],
        useCases: ["Creating short-form video content for social media from text descriptions", "Generating product advertisement videos with the AdsFree tool", "Transforming static images into animated video clips", "Creating cinematic trailers and mood videos from prompts", "Producing meme and entertainment content with AI-generated video effects"],
        addedDate: "2026-03-06"
    },
    {
        id: "91",
        name: "Prophecy",
        slug: "prophecy",
        tagline: "AI-native data prep and analysis platform that turns weeks of work into minutes",
        description: "Prophecy is an AI-native data preparation and analysis platform built on Databricks that brings autonomous data engineering to business teams. Powered by specialized AI agents (including Claude Code integration in v4), Prophecy lets analysts build data pipelines, run complex queries, and generate insights without writing code or waiting on engineering teams. The visual interface combines drag-and-drop pipeline building with natural language queries — ask questions about marketing attribution, product usage, talent acquisition, or financial data and get answers in seconds. Prophecy replaces tools like Alteryx with a modern, AI-first approach that maintains enterprise governance while giving business users autonomy. Supports Spark, SQL, and Python workloads with built-in CI/CD, data quality monitoring, and team collaboration. Used by data teams at enterprises to cut data prep time from weeks to minutes while maintaining full lineage and audit trails.",
        categories: ["data-analysis", "automation"],
        website: "https://www.prophecy.ai",
        pricing: "Free tier for personal use. Professional and Enterprise plans available (contact for pricing).",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/prophecy-logo.png",
        features: ["AI agents powered by Claude Code for autonomous data analysis", "Visual drag-and-drop data pipeline builder", "Natural language querying across enterprise data sources", "Built on Databricks with Spark, SQL, and Python support", "Automated data quality monitoring and validation", "CI/CD integration for pipeline deployment", "Marketing attribution and product analytics templates", "Enterprise governance with full data lineage", "Alteryx replacement with modern AI-first workflow", "Team collaboration with role-based access controls"],
        useCases: ["Marketing ops teams analyzing Salesforce attribution without data engineering help", "FP&A analysts building financial models and reports autonomously", "Product teams analyzing usage patterns and retention metrics without SQL", "Data teams replacing Alteryx with a modern AI-native platform", "Enterprise organizations scaling data prep across business units with governance"],
        addedDate: "2026-03-06"
    },
    {
        id: "92",
        name: "Consensus",
        slug: "consensus",
        tagline: "AI-powered academic search engine that finds and synthesizes peer-reviewed research",
        description: "Consensus is an AI academic search engine purpose-built for finding and understanding peer-reviewed scientific literature. Unlike general search engines, Consensus searches across over 200 million scientific papers and uses AI to extract key findings, synthesize results across multiple studies, and present clear answers grounded in real research. The Consensus Meter shows at a glance whether studies generally support or oppose a given claim, making it easy to gauge scientific consensus on any topic. Deep Search mode provides comprehensive literature reviews with synthesized findings across dozens of papers. Every answer includes direct citations to the source papers, eliminating the hallucination problem common with general AI tools. Features include study snapshots with methodology and sample size details, advanced filters by study design and journal, and a ChatGPT plugin (ConsensusGPT) for conversational research. Used by researchers, students, clinicians, and science writers who need evidence-based answers fast.",
        categories: ["research", "document-analysis"],
        website: "https://consensus.app",
        pricing: "Free tier with limited searches. Premium at $10/month with unlimited searches, Deep Search, and advanced features.",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/consensus-logo.png",
        features: ["Search across 200M+ peer-reviewed scientific papers", "AI-synthesized answers with direct paper citations", "Consensus Meter showing scientific agreement on claims", "Deep Search for comprehensive multi-paper literature reviews", "Study snapshots with methodology, sample size, and key findings", "Advanced filters by study design, journal, and date range", "ConsensusGPT plugin for ChatGPT integration", "Research lists for organizing and saving papers", "No AI hallucinations — every claim backed by real papers", "API access for developers and research platforms"],
        useCases: ["Researchers conducting rapid literature reviews across hundreds of papers", "Medical professionals finding evidence-based answers for clinical decisions", "Students writing thesis papers with properly cited scientific evidence", "Science journalists fact-checking claims against peer-reviewed research", "Policy analysts gauging scientific consensus on contested topics"],
        addedDate: "2026-03-06"
    },
    {
        id: "93",
        name: "TurboScribe",
        slug: "turboscribe",
        tagline: "Unlimited AI transcription powered by Whisper with 98.6% accuracy across 98 languages",
        description: "TurboScribe is an AI-powered transcription service that converts audio and video files to text with exceptional accuracy. Powered by OpenAI's Whisper model along with proprietary enhancements, TurboScribe achieves 98.6% accuracy and supports 98 languages with automatic language detection. What sets it apart is the unlimited transcription model — pay a flat monthly fee and transcribe as much as you need without per-minute charges or usage caps. The free tier offers 3 transcriptions per day (up to 30 minutes each), making it accessible for light users. Features include speaker identification, automatic paragraph formatting, SRT/VTT subtitle generation, and export to multiple formats. The platform handles files up to 10 hours long and processes them quickly even on the free tier. Particularly popular with journalists, podcasters, researchers, and content creators who need reliable, high-volume transcription without unpredictable costs.",
        categories: ["transcription", "voice-audio"],
        website: "https://turboscribe.ai",
        pricing: "Free tier with 3 transcriptions/day (30 min each). Unlimited plan at $10/month. Business plans available.",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/turboscribe-logo.ico",
        features: ["98.6% transcription accuracy powered by Whisper AI", "Unlimited transcription on paid plans — no per-minute fees", "98 language support with automatic language detection", "Speaker identification and diarization", "SRT and VTT subtitle file generation", "Files up to 10 hours long supported", "Automatic paragraph formatting and punctuation", "Multiple export formats (TXT, DOCX, SRT, VTT, JSON)", "Free tier with 3 daily transcriptions up to 30 minutes", "Fast processing with batch upload support"],
        useCases: ["Journalists transcribing hours of interview recordings without usage limits", "Podcasters generating show notes and searchable transcripts for every episode", "Researchers converting qualitative interview data to analyzable text", "Content creators adding accurate subtitles to videos in multiple languages", "Legal and medical professionals transcribing depositions and consultations"],
        addedDate: "2026-03-06"
    },
    {
        id: "94",
        name: "Booke AI",
        slug: "booke-ai",
        tagline: "AI bookkeeper that works inside QuickBooks and Xero like a real team member",
        description: "Booke AI is an AI-powered bookkeeping assistant that operates directly inside QuickBooks Online and Xero — not as a separate dashboard, but as an actual user in your accounting software. You invite Booke as a team member, and every morning it opens your bank feed, categorizes transactions based on learned patterns, matches them to invoices and bills, requests missing documents, and reconciles — all automatically. Unlike API-based AI tools that can only suggest actions, Booke actually clicks buttons and does the work inside your existing platform. It uses your existing bank connections (no Plaid or extra integrations needed), follows your custom rules and thresholds (e.g., 'all transactions over $50 need receipts'), and maintains a full audit trail. Built for both individual businesses and accounting firms managing multiple clients, Booke handles the repetitive daily bookkeeping so accountants can focus on advisory work. Features include OCR for bills, invoices, and receipts, smart document matching, exception-based review workflows, and a Chrome extension for quick actions.",
        categories: ["accounting", "automation"],
        website: "https://booke.ai",
        pricing: "AI Bookkeeper for Business at $129/month per business. Accounting firm plans available with volume pricing. Annual billing discounts available.",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/booke-ai-logo.png",
        features: ["Works directly inside QuickBooks Online and Xero as a user", "Daily automatic bank feed categorization using learned patterns", "Smart document matching to invoices and bills", "Automatic missing document requests to clients", "Custom rules and thresholds for transaction handling", "Full audit trail and exception-based review workflow", "OCR for bills, invoices, and receipts", "Uses existing bank connections — no extra integrations", "Chrome extension for quick bookkeeping actions", "Bank-level encryption and annual security audits"],
        useCases: ["Accounting firms automating daily bookkeeping across multiple clients", "Small businesses replacing manual bank feed categorization in QuickBooks", "Bookkeepers reducing time spent on transaction matching and reconciliation", "Firms enforcing receipt policies with automatic document request workflows", "Solo accountants scaling their practice without hiring additional staff"],
        addedDate: "2026-03-07"
    },
    {
        id: "95",
        name: "Prism Videos",
        slug: "prism-videos",
        tagline: "All-in-one AI video platform with access to every major generation model in one workspace",
        description: "Prism Videos is a unified AI video generation platform that brings together all the leading video and image models — including Google Veo, Sora, Kling, Hailuo, Wan, SeedDream, Flux, and more — into a single workspace. Instead of juggling multiple tools and downloading files between them, creators can generate images, create videos, add lip sync, upscale, and edit with AI all in one place. The platform lets you switch between models per shot, so you can pick the best model for each scene in your project. Prism uses a simple credit system (1 credit = $0.01 of compute) with different models costing different amounts, making pricing transparent and predictable. It supports exporting in multiple resolutions up to 4K with aspect ratios optimized for YouTube, TikTok, Instagram, and other platforms. Story mode enables multi-scene narrative projects, and the platform includes early access to new models as they launch. Popular for short-form content creation, cinematic scenes, product launches, music videos, and social media content.",
        categories: ["video-generation", "image-generation"],
        website: "https://www.prismvideos.com",
        pricing: "Free tier with 100 credits/month and basic models. Pro plan with 1,000 credits/month. Scale plan with 5,000 credits/month. Enterprise with 12,000 credits/month. All paid plans include unlimited Sora 2 and GPT Image 1.5.",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/prism-videos-logo.png",
        features: ["Access to all major AI video models (Veo, Sora, Kling, Hailuo, Wan, and more)", "Unified workspace — generate, edit, upscale, and lip sync in one place", "Switch between models per shot for best results", "Story mode for multi-scene narrative video projects", "Export up to 4K resolution with platform-optimized aspect ratios", "Transparent credit-based pricing (1 credit = $0.01)", "AI image generation with SeedDream, Flux, and GPT Image 1.5", "Unlimited Sora 2 Pro access on paid plans", "Early access to new models as they launch", "Commercial usage rights on all generated content"],
        useCases: ["Content creators producing viral short-form videos for TikTok, Reels, and Shorts", "Marketers generating product launch and advertisement videos with AI", "Filmmakers creating cinematic scenes and music video concepts", "Social media managers producing platform-optimized video content at scale", "Creative professionals comparing outputs across multiple AI video models"],
        addedDate: "2026-03-07"
    },
    {
        id: "96",
        name: "HomeZada",
        slug: "homezada",
        tagline: "AI-powered digital home management platform for inventory, maintenance, and project tracking",
        description: "HomeZada is a comprehensive digital home management platform that uses AI to help homeowners organize and manage everything about their home in one place. The platform covers four key areas: home inventory with photo documentation and value tracking for insurance claims, maintenance scheduling with automated reminders to prevent costly repairs, improvement project planning with budgets and expense tracking, and home finance management including mortgage and equity tracking. AI features include smart maintenance recommendations based on your home's age, location, and systems, predictive alerts for upcoming service needs, and intelligent categorization of home assets. HomeZada generates insurance-ready inventory reports, tracks home value over time, and provides documentation for resale. Available as both a consumer product for individual homeowners and a professional platform for real estate agents, home builders, and property managers who want to provide ongoing value to clients. Based in El Dorado Hills, California.",
        categories: ["home-improvement", "productivity"],
        website: "https://www.homezada.com",
        pricing: "Free basic plan available. Premium plans with advanced features and unlimited inventory items. Professional plans for real estate and property management businesses.",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/homezada-logo.ico",
        features: ["Complete home inventory with photos, details, and value tracking", "Automated maintenance scheduling with smart reminders", "Home improvement project planning with budgets and expense tracking", "Insurance-ready inventory reports for claims documentation", "Home value and equity tracking over time", "AI-powered maintenance recommendations based on home profile", "Professional platform for real estate agents and builders", "Document storage for warranties, manuals, and receipts", "Multiple property support for landlords and investors", "Mobile app for on-the-go home management"],
        useCases: ["Homeowners creating detailed inventories for insurance documentation and claims", "Families scheduling and tracking routine home maintenance to prevent costly repairs", "Homeowners planning renovation projects with budgets and contractor coordination", "Real estate agents providing ongoing digital home management to past clients", "Property managers tracking maintenance and improvements across multiple properties"],
        addedDate: "2026-03-07"
    },
    {
        id: "97",
        name: "AIclicks",
        slug: "aiclicks",
        tagline: "AI search visibility tracking and optimization platform for ranking in ChatGPT, Perplexity, and Gemini",
        description: "AIclicks is an AI search visibility platform that helps brands track and improve how they appear in AI-powered search engines like ChatGPT, Perplexity, and Gemini. As traditional search gives way to AI-generated answers, AIclicks fills a critical gap: understanding where your brand shows up (or doesn't) when people ask AI tools for recommendations. The platform discovers real prompts your target audience asks AI tools, audits your current visibility across AI search engines, identifies keyword gaps and missed mentions compared to competitors, and generates done-for-you action plans to improve AI visibility. AIclicks combines GEO (Generative Engine Optimization) with traditional SEO optimization and Reddit growth strategies to build the kind of web presence that AI models learn from. The platform provides a full visibility map showing which AI engines mention your brand, competitor benchmarking, and ongoing monitoring of AI search mentions. Services include AI SEO optimization, Reddit growth campaigns, and content strategy specifically designed to influence how AI models perceive and recommend brands. Founded by Rokas, an SEO specialist focused on the emerging AI search landscape.",
        categories: ["seo", "marketing"],
        website: "https://aiclicks.io",
        pricing: "Custom pricing based on business needs. Services include AI SEO optimization, Reddit growth, and full-service GEO campaigns.",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/aiclicks-logo.png",
        features: ["AI search visibility tracking across ChatGPT, Perplexity, and Gemini", "Real prompt discovery — see what your audience asks AI tools", "AI visibility audit with competitor benchmarking", "Keyword gap analysis for AI search mentions", "Done-for-you content and optimization action plans", "GEO (Generative Engine Optimization) strategy and execution", "Reddit growth campaigns to build AI-visible web presence", "Ongoing AI mention monitoring and reporting", "Traditional SEO optimization alongside AI search strategy", "Case studies and ROI tracking for AI visibility campaigns"],
        useCases: ["Brands tracking whether AI search engines recommend them over competitors", "Marketing teams optimizing content strategy for AI-generated answer inclusion", "SaaS companies ensuring ChatGPT and Perplexity recommend their product", "Agencies offering AI search optimization as a new service to clients", "E-commerce brands building visibility in AI shopping recommendations"],
        addedDate: "2026-03-07"
    },
    {
        id: "98",
        name: "Publer",
        slug: "publer",
        tagline: "AI-powered social media scheduling and management platform for effortless multi-platform publishing",
        description: "Publer is a social media management platform that combines AI content generation with powerful scheduling and automation tools to help creators, businesses, and agencies manage their online presence across all major platforms. It supports Facebook, Instagram, TikTok, YouTube, LinkedIn, X (Twitter), Pinterest, Google Business, Telegram, Mastodon, Bluesky, Threads, and WordPress — making it one of the most platform-inclusive schedulers available. The AI assistant generates both text and images at no additional cost on paid plans, helping users overcome content creation bottlenecks. Key features include bulk scheduling via CSV upload for planning months of content at once, auto-scheduling that finds optimal posting times, post recycling for evergreen content, and first comment scheduling for engagement strategies. The visual calendar with drag-and-drop makes content planning intuitive, while the Link in Bio feature for Instagram drives traffic to products and services. Collaboration features include approval workflows, team roles, and workspace organization for managing multiple brands. Founded in Albania in 2012, Publer has grown from a side project into a tool used by thousands of businesses worldwide.",
        categories: ["social-media", "marketing"],
        website: "https://publer.com",
        pricing: "Free plan with 3 social accounts and 10 scheduled posts per account. Professional plan starting at $4/month (billed yearly) per social account. Business plans with team features available.",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/publer-logo.png",
        features: ["Support for 13+ social platforms including TikTok, Bluesky, and Threads", "AI content generation for text and images at no extra cost", "Bulk scheduling via CSV upload for months of content at once", "Auto-scheduling that finds optimal posting times per platform", "Post recycling for evergreen content automation", "Visual drag-and-drop calendar for content planning", "First comment scheduling for engagement strategies", "Link in Bio for Instagram traffic conversion", "Collaboration workflows with approval and team roles", "Hashtag suggestions and holiday content reminders"],
        useCases: ["Small businesses scheduling consistent posts across multiple social platforms", "Social media managers bulk-uploading monthly content calendars via CSV", "Agencies managing multiple client brands with approval workflows", "Content creators recycling evergreen posts to maintain consistent presence", "Real estate agents and local businesses managing multi-platform social presence"],
        addedDate: "2026-03-07"
    },
    {
        id: "99",
        name: "magicplan",
        slug: "magicplan",
        tagline: "AI-powered floor plans and project documentation for contractors",
        description: "magicplan is an AI-powered field documentation and floor plan creation tool designed for restoration, renovation, and home improvement professionals. Using your smartphone camera (including LiDAR on newer iOS devices), magicplan lets you scan rooms and generate accurate floor plans with measurements in real time. The platform goes beyond floor plans — it includes built-in estimating with automatic quantity calculations, professional PDF report generation, unlimited photo and video documentation with annotations, and real-time team collaboration between field and office. Everything captured on-site stays organized and synced: sketches, photos, 360° images, notes, tags, and issues are all attached to rooms or items. Teams can track progress, generate shareable project links for adjusters and clients, and maintain full job history from start to finish. Used by companies like Belfor, PROKIL, and KBAC Flooring, magicplan has 290K+ ratings at 4.7 stars. Available on iOS and Android with a cloud dashboard for office teams.",
        categories: ["home-improvement", "productivity"],
        website: "https://magicplan.app",
        pricing: "Per-project pricing, all features included, unlimited users",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/magicplan-logo.png",
        features: ["Real-time AI floor plan creation from smartphone camera or LiDAR", "Automatic measurements and quantity calculations for estimates", "Unlimited photo, video, and 360° image documentation", "Built-in estimating with personalized price lists", "Professional PDF reports and shareable project links", "Real-time sync between field crews and office teams", "Room-level annotations, tags, issues, and notes", "Full job history documented from start to finish", "Team access management with admin and member roles", "Works on iOS, Android, and cloud dashboard"],
        useCases: ["Restoration contractors documenting damage for insurance adjusters", "Renovation pros creating floor plans and estimates on-site", "Flooring companies measuring and quoting without revisiting sites", "Home improvement teams syncing field documentation with the office", "Property assessors generating professional reports with photos and plans"],
        addedDate: "2026-03-08"
    },
    {
        id: "100",
        name: "Alkemi",
        slug: "alkemi",
        tagline: "AI data teammate that brings instant insights to Slack and the web",
        description: "Alkemi is an AI-powered data analysis platform that lets business teams ask questions about their data in plain English and get instant answers, charts, and recommendations — no SQL or analyst tickets required. The core insight behind Alkemi is that decisions happen in Slack and meetings, but data lives in warehouses and dashboards that most people never touch. Alkemi bridges that gap with a Slack agent and web-based DataLab. Connect your data sources (CSV uploads, Snowflake, Databricks, BigQuery, and more) in seconds, then start querying conversationally. Alkemi generates clear visualizations, identifies trends, and can automate recurring reports. For ecommerce teams, it spots pricing opportunities and margin leaks. For marketing, it measures ROI on the fly. For customer success, it delivers faster, more accurate answers. The platform also protects IP — users query insights without ever accessing or copying raw data. DataLab is free to start with no setup required. Launched on Product Hunt in 2026.",
        categories: ["data-analysis", "productivity"],
        website: "https://www.alkemi.ai",
        pricing: "Free tier available, paid plans for advanced features",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/alkemi-logo.png",
        features: ["Ask data questions in plain English — no SQL needed", "Slack agent for instant data answers in your workspace", "Connects to CSV, Snowflake, Databricks, BigQuery, and more", "Automated charts, visualizations, and trend analysis", "Recurring report automation with secure agent integrations", "IP protection — users query insights without accessing raw data", "Ecommerce analytics for pricing and margin optimization", "Marketing ROI measurement and growth driver identification", "Web-based DataLab with free tier and no setup required", "AI recommendations alongside data answers"],
        useCases: ["Business teams getting instant data answers without waiting on analysts", "Ecommerce managers spotting pricing opportunities and margin leaks in real time", "Marketing teams measuring campaign ROI directly in Slack conversations", "Customer success teams pulling accurate metrics during client calls", "Data teams reducing ad-hoc query requests with self-serve analytics"],
        addedDate: "2026-03-08"
    },
    {
        id: "101",
        name: "Saner.AI",
        slug: "saner-ai",
        tagline: "ADHD-friendly AI personal assistant for notes, email, and calendar",
        description: "Saner.AI is the first AI personal assistant designed specifically for people with ADHD. It combines note-taking, email management, and calendar scheduling into a single conversational interface — just chat to search notes, manage emails, and schedule tasks. The app proactively plans your day, sends check-in reminders, and auto-organizes your notes with AI-powered tagging and semantic search. Instead of forcing you to switch between apps and lose focus, Saner.AI keeps everything in one place with a minimalist, distraction-free design. It features a side panel for quick capture without context switching, a personal AI that learns your patterns and gives relevant suggestions, and integration with multiple AI models alongside the note editor for summarizing, expanding, and writing faster. Available as a web app, mobile app, and Chrome extension.",
        categories: ["scheduling", "email", "productivity"],
        website: "https://www.saner.ai",
        pricing: "Free plan available, Starter $8/month, Standard $20/month",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/saner-ai-logo.ico",
        features: ["ADHD-optimized conversational interface for notes, email, and calendar", "AI-powered auto-organization with smart tagging and semantic search", "Side panel quick capture without context switching", "Proactive daily planning and check-in reminders", "Personal AI that learns your patterns and gives relevant suggestions", "Multiple AI models integrated alongside the note editor", "Minimalist, distraction-free note-taking design", "Email management and triage from within the app", "Calendar scheduling via natural language chat", "Available as web app, mobile app, and Chrome extension"],
        useCases: ["ADHD users managing daily tasks without losing focus across multiple apps", "Knowledge workers capturing and organizing notes with AI-powered search", "Professionals triaging email and scheduling meetings from a single interface", "Students taking notes and studying with AI summarization and expansion", "Anyone who struggles with task management and needs proactive reminders"],
        addedDate: "2026-03-08"
    },
    {
        id: "102",
        name: "Radiant",
        slug: "radiant",
        tagline: "Bot-free AI meeting notetaker with on-device capture for Mac",
        description: "Radiant is a completely free, bot-free AI meeting assistant that captures meeting audio directly on your device — no awkward AI bot joining your Zoom, Google Meet, Microsoft Teams, or Slack Huddles calls. Unlike traditional meeting notetakers that add a visible bot participant, Radiant runs silently in the background on your Mac, recording and transcribing without anyone knowing. After each meeting, it automatically generates summaries, action items, and follow-up drafts. Radiant pushes tasks directly to tools like Linear and Notion, turning every meeting into a completed to-do list. The on-device approach means better privacy since audio never leaves your machine during capture. Currently in free open beta for Mac users.",
        categories: ["transcription", "productivity"],
        website: "https://radiantapp.com",
        pricing: "Free (open beta)",
        paymentOptions: {
            isPaid: false,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/radiant-logo.png",
        features: ["Bot-free meeting capture — no AI participant visible to attendees", "On-device audio recording for enhanced privacy", "Works with Zoom, Google Meet, Microsoft Teams, and Slack Huddles", "Automatic meeting transcription and summarization", "AI-generated action items and follow-up email drafts", "Direct task push to Linear, Notion, and other productivity tools", "Silent background operation on Mac", "Completely free during open beta", "Instant post-meeting to-do list generation", "Privacy-first architecture with local audio processing"],
        useCases: ["Professionals who want meeting notes without the awkwardness of a bot joining the call", "Sales teams capturing call insights without alerting prospects to AI recording", "Managers turning meeting action items into Linear or Notion tasks automatically", "Remote teams needing reliable transcription across multiple meeting platforms", "Privacy-conscious users who prefer on-device audio processing over cloud recording"],
        addedDate: "2026-03-08"
    },
    {
        id: "103",
        name: "Search Atlas",
        slug: "search-atlas",
        tagline: "All-in-one AI SEO automation platform with conversational agent",
        description: "Search Atlas is a comprehensive AI-powered SEO platform that replaces an entire stack of SEO tools with one integrated solution. Its flagship feature, Atlas Brain, is the world's first conversational SEO agent — you can launch your full SEO and AI search strategy in a single conversation. Atlas Brain runs thousands of tasks across 60+ built-in tools to execute faster than manual workflows. The platform includes OTTO SEO for one-click automated optimization, Content Genius for AI content creation, topical maps, site auditing, link building, press release distribution, backlink analysis, Google Business Profile management, and white-labeled dashboards for agencies. Search Atlas also offers LLM Visibility tracking to measure and maximize brand reach in AI search results. Built by the team behind LinkGraph and Signal Genesys, it serves agencies, brands, and enterprises with plans starting at $99/month.",
        categories: ["seo", "marketing"],
        website: "https://searchatlas.com",
        pricing: "Starting at $99/month",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/search-atlas-logo.ico",
        features: ["Atlas Brain — conversational AI SEO agent across 60+ tools", "OTTO SEO for one-click automated site optimization", "Content Genius V3 for AI-powered content creation", "Topical map generation for content strategy", "Site Explorer and Site Auditor for technical SEO", "Link building and press release distribution tools", "Google Business Profile management and GBP Galactic", "LLM Visibility tracking for AI search brand monitoring", "White-labeled dashboards and reporting for agencies", "Backlink analyzer and on-page audit tools"],
        useCases: ["SEO agencies replacing multiple tool subscriptions with one platform", "Brands automating technical SEO fixes with OTTO one-click optimization", "Content teams generating SEO-optimized articles with AI assistance", "Enterprises tracking brand visibility across AI search engines and LLMs", "Local businesses managing Google Business Profiles at scale"],
        addedDate: "2026-03-08"
    },
    {
        id: "104",
        name: "Elicit",
        slug: "elicit",
        tagline: "AI research assistant for scientific literature review",
        description: "Elicit is an AI-powered research assistant that helps researchers analyze scientific papers at scale. Built for systematic reviews and evidence synthesis, Elicit searches across more than 138 million academic papers and uses language models to extract key findings, summarize results, and organize data into structured tables. Researchers can chat with papers, run automated reports that pull from hundreds of data sources, set up personalized research alerts, and import libraries from Zotero. The platform supports custom extractions from uploaded papers, figure interpretation, and real-time team collaboration. With an estimated $18M+ in annual recurring revenue, Elicit has become a go-to tool for academics, biotech firms, and policy organizations who need to process large volumes of literature without sacrificing rigor.",
        categories: ["research", "data-analysis"],
        website: "https://elicit.com",
        pricing: "Free plan available, Pro from $49/month",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/elicit-logo.png",
        features: ["Search across 138+ million academic papers", "AI-powered systematic review workflow screening up to 5,000 papers", "Automated reports extracting from up to 200 data sources", "Chat with papers using full-text access", "Custom data extraction from uploaded papers with column-based tables", "Figure interpretation from research papers", "Real-time collaboration and team editing", "Personalized research alerts and subscriptions", "Zotero library import", "API access for programmatic integration"],
        useCases: ["Researchers conducting systematic literature reviews across thousands of papers", "Biotech teams synthesizing clinical trial data and evidence", "Policy analysts extracting findings from large bodies of research", "Graduate students accelerating thesis literature reviews", "R&D teams monitoring new publications with automated alerts"],
        addedDate: "2026-03-09"
    },
    {
        id: "105",
        name: "Magic Hour",
        slug: "magic-hour",
        tagline: "All-in-one AI video and image creation suite for creators",
        description: "Magic Hour is a comprehensive AI-powered creative platform that combines over 100 video and image generation tools in one interface. Trusted by over 3 million creators, it offers text-to-video, image-to-video, face swap, lip sync, talking photos, video-to-video style transfer, AI animation, subtitle generation, video extension, audio-to-video, UGC ad generation, and upscaling — all accessible from a browser with no software installation. The platform also includes a full suite of AI image tools including face swap photos, AI image editing, headshot generation, clothes changing, background removal, and GIF creation. Magic Hour provides API access for developers who want to integrate its capabilities programmatically. Plans range from a free tier with basic credits to a Business plan supporting 4K exports and 10+ hours of video generation per year.",
        categories: ["video-generation", "image-generation"],
        website: "https://magichour.ai",
        pricing: "Free plan available, Creator from $10/month",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: false,
            hasFreeStarterPlan: true
        },
        logo: "/images/logos/magic-hour-logo.png",
        features: ["100+ AI video and image tools in one platform", "Text-to-video and image-to-video generation", "Face swap for video and photos", "AI lip sync and talking photo creation", "Video-to-video style transfer and animation", "AI subtitle generation and video extension", "UGC ad generator for marketing content", "AI image editing, headshot generation, and background removal", "Up to 4K export quality on higher plans", "API access for developer integration"],
        useCases: ["Content creators producing AI-generated videos without technical expertise", "Marketers generating UGC-style ads and promotional video content", "Social media managers creating face swap and animation content at scale", "Small business owners producing professional video content on a budget", "Developers integrating AI video generation into apps via API"],
        addedDate: "2026-03-09"
    },
    {
        id: "106",
        name: "Luma",
        slug: "luma",
        tagline: "AI agents for creative work across video, image, and audio",
        description: "Luma is an AI creative platform built by Luma Labs that provides intelligent agents to direct creative work from concept to delivery. Powered by their Unified Intelligence models including Ray3 (a state-of-the-art reasoning video model) and Nano Banana (image generation), Luma Agents coordinate and orchestrate multiple AI systems to generate end-to-end creative work spanning text, images, video, and audio. The platform integrates best-in-class models from across the industry — including Sora 2, Veo 3, Kling, ElevenLabs, and GPT Image — giving creators access to category-defining tools through a single interface. Luma offers individual plans with free trial credits, team plans with collaboration features, and enterprise options with custom fine-tuning and SSO. Their mission is to build unified general intelligence that can generate, understand, and operate in the physical world.",
        categories: ["video-generation", "image-generation", "voice-audio"],
        website: "https://lumalabs.ai",
        pricing: "Free trial credits, paid plans available",
        paymentOptions: {
            isPaid: true,
            hasFreeTrialPeriod: true,
            hasFreeStarterPlan: false
        },
        logo: "/images/logos/luma-logo.ico",
        features: ["AI agents that coordinate creative work across text, image, video, and audio", "Ray3 — state-of-the-art reasoning video model with HDR support", "Nano Banana and Nano Banana Pro image generation models", "Integration with top third-party models (Sora 2, Veo 3, Kling, ElevenLabs)", "Team collaboration with projects and organization features", "Commercial use included on all plans", "Guest collaborator access with edit permissions", "Usage analytics and user spend limits for teams", "Enterprise options with custom fine-tuning and SSO", "API access for programmatic creative workflows"],
        useCases: ["Creative teams producing multi-modal content across video, image, and audio", "Filmmakers and video producers generating concept videos and storyboards", "Marketing agencies orchestrating end-to-end campaign creative with AI", "Individual creators accessing multiple best-in-class AI models through one platform", "Enterprises needing custom fine-tuned creative AI with team management"],
        addedDate: "2026-03-09"
    }
]; 