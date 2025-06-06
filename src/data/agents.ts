export interface Agent {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    description: string;
    categories: Array<'writing' | 'coding' | 'sales' | 'customer-support' | 'data-analysis' | 'research' | 'marketing' | 'productivity' | 'email' | 'transcription' | 'document-analysis' | 'scheduling' | 'seo' | 'social-media' | 'accounting'>;
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
        logo: "/images/logos/copyai-logo.svg",
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
        logo: "/images/logos/intercom-bot-logo.svg",
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
        pricing: "Basic: $59/month (400 leads), Popular: $149/month (1,200 leads), Pro: $359/month (3,500 leads)",
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
        pricing: "$249+/month",
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
    }
]; 