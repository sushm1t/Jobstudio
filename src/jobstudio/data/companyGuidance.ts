export interface CompanyGuidance {
  id: string;
  name: string;
  values: string[];
  guidance: string;
  sources: { label: string; url: string }[];
  checkedOn: string;
  isRoleAnchored?: boolean;
  domainContext?: string;
  interviewStrategy?: string;
  industry?: string;
}

// Editorially checked official pages for top 100 global companies and talent leaders.
export const COMPANY_GUIDANCE: CompanyGuidance[] = [
  {
    "id": "google",
    "name": "Google",
    "values": [
      "Focus on the user",
      "Fast is better than slow",
      "Democracy on the web",
      "Great just isn't good enough"
    ],
    "guidance": "Google assesses candidates across General Cognitive Ability (GCA), Role-Related Knowledge (RRK), Leadership, and Googleyness. Prepare structured behavioral and hypothetical frameworks.",
    "sources": [
      {
        "label": "Official interview tips",
        "url": "https://www.google.com/about/careers/applications/interview-tips"
      },
      {
        "label": "Career resources",
        "url": "https://buildyourfuture.withgoogle.com/resources/"
      }
    ],
    "industry": "Big Tech & Cloud Platforms",
    "domainContext": "Google operates hyperscale consumer and cloud ecosystems where algorithm efficiency, global reliability, and user trust are paramount.",
    "interviewStrategy": "Structure answers clearly, state trade-offs explicitly, and highlight measurable user or business impact.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "apple",
    "name": "Apple",
    "values": [
      "Innovation",
      "Privacy",
      "Accessibility",
      "Inclusion & Diversity",
      "Environmental Responsibility"
    ],
    "guidance": "Apple looks for deep functional craftsmanship, extreme attention to detail, and cross-functional collaboration. Prepare to explain the 'why' behind technical and product decisions.",
    "sources": [
      {
        "label": "Apple Careers",
        "url": "https://www.apple.com/careers/us/"
      }
    ],
    "industry": "Big Tech & Cloud Platforms",
    "domainContext": "Apple delivers tightly integrated hardware, software, and services prioritizing exquisite user experience and customer privacy.",
    "interviewStrategy": "Demonstrate craft, customer empathy, and deep technical or operational rigor.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "microsoft",
    "name": "Microsoft",
    "values": [
      "Growth Mindset",
      "Customer Obsession",
      "Diversity & Inclusion",
      "One Microsoft"
    ],
    "guidance": "Microsoft interviews center on Growth Mindset, learning from failure, and how you collaborate across organizational boundaries. Use STAR methodology with clear lessons learned.",
    "sources": [
      {
        "label": "Microsoft Hiring Process",
        "url": "https://careers.microsoft.com/v2/global/en/hiring-process.html"
      }
    ],
    "industry": "Big Tech & Cloud Platforms",
    "domainContext": "Microsoft powers enterprise productivity, Azure cloud infrastructure, and AI copilots across commercial and consumer sectors.",
    "interviewStrategy": "Emphasize cross-team collaboration, customer impact, and continuous learning.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "amazon",
    "name": "Amazon",
    "values": [
      "Customer Obsession",
      "Ownership",
      "Bias for Action",
      "Dive Deep",
      "Have Backbone; Disagree and Commit"
    ],
    "guidance": "Amazon recommends preparing behavioral examples using STAR and its 16 Leadership Principles. Assessment content varies by role; use numbers only when you have them.",
    "sources": [
      {
        "label": "Official interview loop",
        "url": "https://www.amazon.jobs/content/en/how-we-hire/interview-loop"
      },
      {
        "label": "Leadership Principles",
        "url": "https://www.aboutamazon.com/news/workplace/amazon-leadership-principles-interview"
      }
    ],
    "industry": "Big Tech & Cloud Platforms",
    "domainContext": "Amazon operates high-throughput retail, logistics, and AWS cloud systems governed by strict metrics and operational mechanisms.",
    "interviewStrategy": "Quantify every outcome, demonstrate customer obsession, and showcase end-to-end accountability.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "meta",
    "name": "Meta",
    "values": [
      "Move Fast",
      "Focus on Long-Term Impact",
      "Build Awesome Things",
      "Live in the Future",
      "Be Direct"
    ],
    "guidance": "Meta evaluates execution speed, ability to work with ambiguity, and engineering or operational impact at billions-of-users scale.",
    "sources": [
      {
        "label": "Meta Careers",
        "url": "https://www.metacareers.com/how-we-hire/"
      }
    ],
    "industry": "Big Tech & Cloud Platforms",
    "domainContext": "Meta connects billions through social platforms, messaging networks, and immersive computing with high-throughput infrastructure.",
    "interviewStrategy": "Highlight fast iteration, navigating ambiguity, and metric-backed impact.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "netflix",
    "name": "Netflix",
    "values": [
      "Judgment",
      "Selflessness",
      "Courage",
      "Inclusion",
      "Integrity",
      "Impact"
    ],
    "guidance": "Netflix's famous culture of 'Freedom & Responsibility' seeks stunning colleagues who exercise high judgment and candor without micromanagement.",
    "sources": [
      {
        "label": "Netflix Culture Memo",
        "url": "https://jobs.netflix.com/culture"
      }
    ],
    "industry": "Big Tech & Cloud Platforms",
    "domainContext": "Netflix streams entertainment to hundreds of millions globally with high-resilience microservices and content production workflows.",
    "interviewStrategy": "Showcase mature judgment, comfort with autonomy, and proactive communication.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "nvidia",
    "name": "Nvidia",
    "values": [
      "Innovation",
      "Speed",
      "Excellence",
      "One Team",
      "Intellectual Honesty"
    ],
    "guidance": "Nvidia looks for first-principles thinkers who solve extraordinarily difficult accelerated computing and AI hardware/software challenges.",
    "sources": [
      {
        "label": "Nvidia Careers",
        "url": "https://www.nvidia.com/en-us/about-nvidia/careers/"
      }
    ],
    "industry": "Big Tech & Cloud Platforms",
    "domainContext": "Nvidia architects full-stack accelerated computing platforms from silicon to CUDA software powering modern generative AI.",
    "interviewStrategy": "Demonstrate deep technical curiosity, first-principles reasoning, and cross-disciplinary agility.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "tesla",
    "name": "Tesla",
    "values": [
      "Do the impossible",
      "Move fast",
      "First principles thinking",
      "All in"
    ],
    "guidance": "Tesla looks for relentless problem-solvers who can work under intense pressure, challenge legacy assumptions, and iterate rapidly.",
    "sources": [
      {
        "label": "Tesla Careers",
        "url": "https://www.tesla.com/careers"
      }
    ],
    "industry": "Big Tech & Cloud Platforms",
    "domainContext": "Tesla builds electric vehicles, autonomous driving systems, and renewable energy products with intense manufacturing and engineering integration.",
    "interviewStrategy": "Break problems down to first principles and prove your capacity to execute fast under high expectations.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "oracle",
    "name": "Oracle",
    "values": [
      "Customer Focus",
      "Integrity",
      "Mutual Respect",
      "Innovation",
      "Ethics"
    ],
    "guidance": "Oracle evaluates candidates on enterprise cloud architecture, enterprise database scalability, and mission-critical customer delivery.",
    "sources": [
      {
        "label": "Oracle Careers",
        "url": "https://www.oracle.com/corporate/careers/"
      }
    ],
    "industry": "Big Tech & Cloud Platforms",
    "domainContext": "Oracle powers mission-critical enterprise databases, ERP applications, and OCI cloud infrastructure for global enterprises.",
    "interviewStrategy": "Highlight enterprise reliability, database/cloud architectural trade-offs, and SLA governance.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "ibm",
    "name": "IBM",
    "values": [
      "Dedication to every client's success",
      "Innovation that matters",
      "Trust and responsibility in all relationships"
    ],
    "guidance": "IBM seeks professionals who understand hybrid cloud (Red Hat), enterprise AI (watsonx), and large-scale transformation.",
    "sources": [
      {
        "label": "IBM Careers",
        "url": "https://www.ibm.com/careers"
      }
    ],
    "industry": "Big Tech & Cloud Platforms",
    "domainContext": "IBM delivers hybrid cloud and AI consulting and software for Fortune 500 financial, government, and industrial institutions.",
    "interviewStrategy": "Focus on enterprise client advisory, governance, and hybrid cloud integration.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "openai",
    "name": "OpenAI",
    "values": [
      "AGI Focus",
      "Intense and Scrappy",
      "Scale",
      "Make Something People Love",
      "Team Spirit"
    ],
    "guidance": "OpenAI evaluates deep technical mastery, research rigor, safety consciousness, and high execution speed in frontier AI.",
    "sources": [
      {
        "label": "OpenAI Careers",
        "url": "https://openai.com/careers"
      }
    ],
    "industry": "Frontier AI & Data",
    "domainContext": "OpenAI develops advanced multimodal models, frontier reasoning systems, and APIs transforming computing.",
    "interviewStrategy": "Emphasize high-signal problem solving, safety rigor, and experience scaling AI systems.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "anthropic",
    "name": "Anthropic",
    "values": [
      "Helpful, Harmless, Honest",
      "Research Rigor",
      "Safety-First",
      "High Agency"
    ],
    "guidance": "Anthropic values safety research, empirical thinking, thoughtful reasoning, and low ego in frontier AI engineering.",
    "sources": [
      {
        "label": "Anthropic Careers",
        "url": "https://www.anthropic.com/careers"
      }
    ],
    "industry": "Frontier AI & Data",
    "domainContext": "Anthropic builds reliable, interpretable, and steerable AI systems like Claude with constitutional AI foundations.",
    "interviewStrategy": "Demonstrate clear communication, ethical consideration, and deep empirical reasoning.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "scaleai",
    "name": "Scale AI",
    "values": [
      "Run into the Fire",
      "Speed is our Edge",
      "Intellectual Rigor",
      "Customer First"
    ],
    "guidance": "Scale AI prizes intensity, rapid shipping, data quality obsession, and the ability to operate across enterprise and frontier AI labs.",
    "sources": [
      {
        "label": "Scale AI Careers",
        "url": "https://scale.com/careers"
      }
    ],
    "industry": "Frontier AI & Data",
    "domainContext": "Scale AI provides the foundational data engine, evaluation infrastructure, and human feedback platforms powering leading LLMs.",
    "interviewStrategy": "Highlight operational tenacity, data validation discipline, and ability to thrive in high-velocity environments.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "perplexity",
    "name": "Perplexity",
    "values": [
      "Curiosity",
      "Truth-Seeking",
      "Velocity",
      "Extreme Focus"
    ],
    "guidance": "Perplexity looks for builders who can prototype fast, optimize retrieval latency, and deliver verifiable knowledge to users.",
    "sources": [
      {
        "label": "Perplexity Careers",
        "url": "https://www.perplexity.ai/careers"
      }
    ],
    "industry": "Frontier AI & Data",
    "domainContext": "Perplexity reinvents search with conversational, citation-backed conversational answer engines.",
    "interviewStrategy": "Focus on latency optimization, retrieval-augmented generation (RAG), and user experience precision.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "cohere",
    "name": "Cohere",
    "values": [
      "Impact through AI",
      "Security & Privacy",
      "Open Ecosystem",
      "Collaborative Craft"
    ],
    "guidance": "Cohere seeks candidates skilled in multilingual LLMs, enterprise data privacy, and embedding architectures.",
    "sources": [
      {
        "label": "Cohere Careers",
        "url": "https://cohere.com/careers"
      }
    ],
    "industry": "Frontier AI & Data",
    "domainContext": "Cohere delivers enterprise-grade LLMs, embeddings, and reranking models deployed across private cloud infrastructure.",
    "interviewStrategy": "Emphasize data privacy, enterprise API integration, and model evaluation metrics.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "palantir",
    "name": "Palantir",
    "values": [
      "Mission First",
      "Critical Thinking",
      "High Agency",
      "Engineering Excellence"
    ],
    "guidance": "Palantir evaluates ability to solve complex, ambiguous problems at the intersection of operational decision-making and data ontology.",
    "sources": [
      {
        "label": "Palantir Careers",
        "url": "https://www.palantir.com/careers/"
      }
    ],
    "industry": "Frontier AI & Data",
    "domainContext": "Palantir builds AIP and Foundry platforms that operationalize data and AI for defense, intelligence, and commercial enterprises.",
    "interviewStrategy": "Demonstrate high agency, systems thinking, and ability to handle high-stakes client environments.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "databricks",
    "name": "Databricks",
    "values": [
      "Customer Obsession",
      "Truth-Seeking",
      "Team First",
      "First Principles"
    ],
    "guidance": "Databricks focuses on distributed systems mastery, Apache Spark/Lakehouse data governance, and scalable ML workflows.",
    "sources": [
      {
        "label": "Databricks Careers",
        "url": "https://www.databricks.com/company/careers"
      }
    ],
    "industry": "Frontier AI & Data",
    "domainContext": "Databricks pioneered the Data Lakehouse, combining data warehousing, data engineering, and generative AI on open formats.",
    "interviewStrategy": "Highlight distributed data processing trade-offs, Lakehouse architecture, and customer business impact.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "snowflake",
    "name": "Snowflake",
    "values": [
      "Put Each Other First",
      "Get It Done",
      "Integrity Always",
      "Think Big",
      "Be An Owner"
    ],
    "guidance": "Snowflake values high performance, clean architecture, customer reliability, and SQL/data warehouse scalability.",
    "sources": [
      {
        "label": "Snowflake Careers",
        "url": "https://careers.snowflake.com/"
      }
    ],
    "industry": "Frontier AI & Data",
    "domainContext": "Snowflake enables the Data Cloud, uniting analytics, application development, and data sharing across multi-cloud environments.",
    "interviewStrategy": "Demonstrate SQL mastery, multi-cloud data architecture, and clear ROI communication.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "huggingface",
    "name": "Hugging Face",
    "values": [
      "Open Source",
      "Decentralized AI",
      "Community Collaboration",
      "Transparency"
    ],
    "guidance": "Hugging Face values open-source ethos, passion for democratic AI access, and collaborative community building.",
    "sources": [
      {
        "label": "Hugging Face Jobs",
        "url": "https://huggingface.co/join-us"
      }
    ],
    "industry": "Frontier AI & Data",
    "domainContext": "Hugging Face is the central collaboration platform and hub for machine learning models, datasets, and apps.",
    "interviewStrategy": "Showcase your open-source contributions, developer community empathy, and model packaging fluency.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "mistral",
    "name": "Mistral AI",
    "values": [
      "Open Science",
      "Efficiency",
      "Independence",
      "Scientific Rigor"
    ],
    "guidance": "Mistral values lean engineering, high parameter efficiency, and transparent European AI sovereignty.",
    "sources": [
      {
        "label": "Mistral AI Careers",
        "url": "https://mistral.ai/company/#careers"
      }
    ],
    "industry": "Frontier AI & Data",
    "domainContext": "Mistral builds state-of-the-art open-weight and commercial language models focused on parameter efficiency and speed.",
    "interviewStrategy": "Focus on model architecture trade-offs, inference efficiency, and open-source contributions.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "pinecone",
    "name": "Pinecone",
    "values": [
      "Simplicity",
      "Speed",
      "Reliability",
      "Continuous Improvement"
    ],
    "guidance": "Pinecone evaluates vector database indexing, low-latency approximate nearest neighbors search, and developer experience.",
    "sources": [
      {
        "label": "Pinecone Careers",
        "url": "https://www.pinecone.io/careers/"
      }
    ],
    "industry": "Frontier AI & Data",
    "domainContext": "Pinecone builds the leading managed vector database for semantic search, recommendation engines, and RAG pipelines.",
    "interviewStrategy": "Discuss vector indexing algorithms (HNSW), latency vs. recall trade-offs, and cloud scalability.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "dataiku",
    "name": "Dataiku",
    "values": [
      "Everyday AI",
      "Empathy",
      "Humility",
      "Inclusivity"
    ],
    "guidance": "Dataiku assesses candidates on democratizing data science, enterprise governance, and collaborative analytics workflows.",
    "sources": [
      {
        "label": "Dataiku Careers",
        "url": "https://www.dataiku.com/careers/"
      }
    ],
    "industry": "Frontier AI & Data",
    "domainContext": "Dataiku powers everyday AI platforms allowing business analysts and data scientists to collaborate on predictive pipelines.",
    "interviewStrategy": "Highlight user empathy, explainable AI, and cross-functional analytics governance.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "stripe",
    "name": "Stripe",
    "values": [
      "Users first",
      "Move with urgency and focus",
      "Think rigorously",
      "Trust and amplify",
      "Global optimism"
    ],
    "guidance": "Stripe describes rigorous thinking, decisions supported by numbers and narrative, kindness, and working with uncertainty. Expect thorough technical and domain deep dives.",
    "sources": [
      {
        "label": "Official working-style guidance",
        "url": "https://stripe.com/careers/compatibility"
      }
    ],
    "industry": "Fintech & Banking",
    "domainContext": "Stripe builds economic infrastructure for the internet, processing hundreds of billions in global payments and SaaS subscriptions.",
    "interviewStrategy": "Demonstrate exceptional precision, written communication, and customer problem-solving under edge cases.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "revolut",
    "name": "Revolut",
    "values": [
      "Get It Done",
      "Deliver WOW",
      "Dream Team",
      "Never Settle",
      "Think Deeper"
    ],
    "guidance": "Published values emphasize results, customer needs, high standards, teamwork, and deeper reasoning. Early-career interview guidance recommends examples of data-supported decisions.",
    "sources": [
      {
        "label": "Official culture",
        "url": "https://www.revolut.com/our-culture/"
      },
      {
        "label": "Early-career guidance",
        "url": "https://www.revolut.com/en-US/blog/post/10-top-tips-to-ace-your-rev-celerator-interviews/"
      }
    ],
    "industry": "Fintech & Banking",
    "domainContext": "Revolut provides super-app digital banking, multi-currency exchange, and crypto operations for millions globally.",
    "interviewStrategy": "Bring concrete data points, exhibit extreme work ethic, and demonstrate bias towards rapid execution.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "brex",
    "name": "Brex",
    "values": [
      "Dream big",
      "Seek truth",
      "Own it",
      "One team"
    ],
    "guidance": "Brex evaluates candidates on financial compliance, fast-paced corporate spend automation, and global expense management.",
    "sources": [
      {
        "label": "Brex Careers",
        "url": "https://www.brex.com/careers"
      }
    ],
    "industry": "Fintech & Banking",
    "domainContext": "Brex delivers corporate credit cards, spend management software, and banking services for high-growth tech companies.",
    "interviewStrategy": "Showcase customer empathy, financial risk awareness, and ability to automate complex enterprise workflows.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "ramp",
    "name": "Ramp",
    "values": [
      "Velocity",
      "Impact",
      "Integrity",
      "Excellence"
    ],
    "guidance": "Ramp values speed of iteration, compounding software quality, and measurable cost savings for finance teams.",
    "sources": [
      {
        "label": "Ramp Careers",
        "url": "https://ramp.com/careers"
      }
    ],
    "industry": "Fintech & Banking",
    "domainContext": "Ramp automates corporate finance, expense cards, bill pay, and procurement intelligence.",
    "interviewStrategy": "Focus on high shipping velocity, product intuition, and rigorous financial logic.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "plaid",
    "name": "Plaid",
    "values": [
      "Create together",
      "Champion the customer",
      "Think like an owner",
      "Be transparent"
    ],
    "guidance": "Plaid interviews explore financial API security, open banking protocols, and developer-first documentation.",
    "sources": [
      {
        "label": "Plaid Careers",
        "url": "https://plaid.com/careers/"
      }
    ],
    "industry": "Fintech & Banking",
    "domainContext": "Plaid provides financial data APIs connecting thousands of banks to fintech apps securely.",
    "interviewStrategy": "Emphasize developer empathy, API reliability, and bank security compliance.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "coinbase",
    "name": "Coinbase",
    "values": [
      "Clear communication",
      "Efficient execution",
      "Continuous learning",
      "Customer focus",
      "Repeatable innovation"
    ],
    "guidance": "Coinbase evaluates risk management, crypto security, regulatory compliance, and high-frequency exchange operations.",
    "sources": [
      {
        "label": "Coinbase Careers",
        "url": "https://www.coinbase.com/careers"
      }
    ],
    "industry": "Fintech & Banking",
    "domainContext": "Coinbase provides cryptocurrency trading, custody, and blockchain developer infrastructure with institutional compliance.",
    "interviewStrategy": "Demonstrate extreme security rigor, operational calm under market volatility, and structured communication.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "robinhood",
    "name": "Robinhood",
    "values": [
      "Safety first",
      "Participation is power",
      "Radical customer focus",
      "First-principles thinking"
    ],
    "guidance": "Robinhood looks for candidates who can scale consumer financial interfaces while maintaining regulatory and clearinghouse safety.",
    "sources": [
      {
        "label": "Robinhood Careers",
        "url": "https://careers.robinhood.com/"
      }
    ],
    "industry": "Fintech & Banking",
    "domainContext": "Robinhood democratizes investing with zero-commission stock, options, and crypto trading platforms.",
    "interviewStrategy": "Highlight risk controls, mobile app performance, and consumer financial protection.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "wise",
    "name": "Wise",
    "values": [
      "This isn't just a job, it's a revolution",
      "We get it done",
      "Customers > team > ego",
      "Always candid"
    ],
    "guidance": "Wise assesses autonomous problem-solving, transparency around hidden fees, and global payment routing efficiency.",
    "sources": [
      {
        "label": "Wise Careers",
        "url": "https://www.wise.jobs/"
      }
    ],
    "industry": "Fintech & Banking",
    "domainContext": "Wise powers cross-border money transfers and multi-currency accounts with transparent real-exchange rates.",
    "interviewStrategy": "Emphasize autonomy, customer fee reduction, and cross-border payment operations.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "klarna",
    "name": "Klarna",
    "values": [
      "Customer obsession",
      "High standards",
      "Deliver with speed",
      "AI-powered efficiency"
    ],
    "guidance": "Klarna focuses on consumer shopping experiences, underwriting risk models, and AI automation across operations.",
    "sources": [
      {
        "label": "Klarna Careers",
        "url": "https://www.klarna.com/careers/"
      }
    ],
    "industry": "Fintech & Banking",
    "domainContext": "Klarna provides Buy Now Pay Later (BNPL) credit, retail checkout, and AI-assisted shopping tools globally.",
    "interviewStrategy": "Demonstrate AI fluency, credit risk awareness, and friction-free consumer UX intuition.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "monzo",
    "name": "Monzo",
    "values": [
      "Help everyone make money work for them",
      "Default to transparency",
      "Care about the craft",
      "Solve the real problem"
    ],
    "guidance": "Monzo evaluates customer empathy, operational transparency, microservices engineering, and UK banking regulatory standards.",
    "sources": [
      {
        "label": "Monzo Careers",
        "url": "https://monzo.com/careers/"
      }
    ],
    "industry": "Fintech & Banking",
    "domainContext": "Monzo is one of the world's most loved digital challenger banks, pioneering mobile banking and budgeting tools.",
    "interviewStrategy": "Showcase user empathy, transparent communications, and resilient distributed microservices.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "square",
    "name": "Block (Square)",
    "values": [
      "Economic empowerment",
      "Customer empathy",
      "Inventive craft",
      "Collaboration"
    ],
    "guidance": "Block assesses candidates on omni-channel point-of-sale resilience, small-business empowerment, and developer ecosystem support.",
    "sources": [
      {
        "label": "Block Careers",
        "url": "https://block.xyz/careers"
      }
    ],
    "industry": "Fintech & Banking",
    "domainContext": "Block builds commerce tools (Square), peer-to-peer payments (Cash App), and bitcoin infrastructure.",
    "interviewStrategy": "Demonstrate merchant empathy, hardware/software integration knowledge, and cash flow understanding.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "paypal",
    "name": "PayPal",
    "values": [
      "Inclusion",
      "Innovation",
      "Collaboration",
      "Wellness"
    ],
    "guidance": "PayPal evaluates candidates on two-sided marketplace dynamics, fraud risk models, and global merchant checkout conversion.",
    "sources": [
      {
        "label": "PayPal Careers",
        "url": "https://careers.pypl.com/"
      }
    ],
    "industry": "Fintech & Banking",
    "domainContext": "PayPal operates one of the world's largest digital payments networks supporting 400M+ active accounts across Venmo and Braintree.",
    "interviewStrategy": "Focus on fraud detection, payment gateway conversion optimization, and global scale.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "adyen",
    "name": "Adyen",
    "values": [
      "The Adyen Formula: We build to benefit all",
      "We don't hide behind email",
      "Winning is more important than ego"
    ],
    "guidance": "Adyen strictly evaluates candidates against 'The Adyen Formula'. Emphasize cross-functional teamwork, direct communication, and speed.",
    "sources": [
      {
        "label": "Adyen Careers",
        "url": "https://careers.adyen.com/"
      }
    ],
    "industry": "Fintech & Banking",
    "domainContext": "Adyen provides end-to-end payment processing, gateway, and acquiring services for leading global enterprises.",
    "interviewStrategy": "Align every response with the Adyen Formula; show direct feedback habits and humble teamwork.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "affirm",
    "name": "Affirm",
    "values": [
      "People come first",
      "Simple is better than clever",
      "No fine print",
      "Push the envelope"
    ],
    "guidance": "Affirm evaluates credit underwriting ethics, honest financial products, and merchant integration engineering.",
    "sources": [
      {
        "label": "Affirm Careers",
        "url": "https://www.affirm.com/careers"
      }
    ],
    "industry": "Fintech & Banking",
    "domainContext": "Affirm offers honest financial products and transparent installment loans without late fees.",
    "interviewStrategy": "Showcase mathematical/credit rigor, commitment to transparent pricing, and merchant partnerships.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "chime",
    "name": "Chime",
    "values": [
      "Be user obsessed",
      "Make it happen",
      "Build trust",
      "Keep it simple"
    ],
    "guidance": "Chime focuses on member trust, fee-free consumer banking features, and regulatory compliance for everyday Americans.",
    "sources": [
      {
        "label": "Chime Careers",
        "url": "https://www.chime.com/careers/"
      }
    ],
    "industry": "Fintech & Banking",
    "domainContext": "Chime provides mobile banking services partnering with regional banks to deliver overdraft protection and early direct deposit.",
    "interviewStrategy": "Highlight empathy for non-prime consumers, simple UX design, and banking compliance.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "sofi",
    "name": "SoFi",
    "values": [
      "Put our members' interests first",
      "Run toward problems",
      "Iterate and adapt",
      "Make an impact"
    ],
    "guidance": "SoFi evaluates comprehensive financial product integration (lending, investing, banking) and member lifetime value.",
    "sources": [
      {
        "label": "SoFi Careers",
        "url": "https://www.sofi.com/careers/"
      }
    ],
    "industry": "Fintech & Banking",
    "domainContext": "SoFi is a digital personal finance platform offering loans, refinancing, checking, and brokerage services under a national bank charter.",
    "interviewStrategy": "Demonstrate banking knowledge, lending risk frameworks, and member relationship building.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "figma",
    "name": "Figma",
    "values": [
      "Build community",
      "Run with it",
      "Love your craft",
      "Grow as you go",
      "Play"
    ],
    "guidance": "Figma publishes these values and separates interview steps by role. Product design portfolio reviews emphasize craft, user empathy, and real-time collaboration.",
    "sources": [
      {
        "label": "Official values",
        "url": "https://www.figma.com/careers/"
      },
      {
        "label": "Interview steps by role",
        "url": "https://www.figma.com/careers/early-career/"
      }
    ],
    "industry": "Productivity & Design",
    "domainContext": "Figma is the collaborative interface design platform where product, design, and engineering teams build software together in real time.",
    "interviewStrategy": "Showcase exceptional design craft, web canvas performance, and collaborative communication.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "canva",
    "name": "Canva",
    "values": [
      "Make complex things simple",
      "Set crazy big goals",
      "Be a force for good",
      "Empower others",
      "Pursue excellence"
    ],
    "guidance": "Canva evaluates candidates on simplifying complex workflows, visual communication passion, and high team cohesion.",
    "sources": [
      {
        "label": "Canva Careers",
        "url": "https://www.canva.com/careers/"
      }
    ],
    "industry": "Productivity & Design",
    "domainContext": "Canva democratizes graphic design and visual communications with web-based templates and AI tools.",
    "interviewStrategy": "Demonstrate passion for accessible design, user empowerment, and ambitious product vision.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "notion",
    "name": "Notion",
    "values": [
      "We are all owners",
      "Be a pragmatist",
      "Make high craft fun",
      "See around corners"
    ],
    "guidance": "Notion evaluates extreme attention to product craft, modular data thinking, and love for elegant software tools.",
    "sources": [
      {
        "label": "Notion Careers",
        "url": "https://www.notion.so/careers"
      }
    ],
    "industry": "Productivity & Design",
    "domainContext": "Notion blends docs, wikis, databases, and AI into an all-in-one connected workspace.",
    "interviewStrategy": "Highlight high aesthetic standards, modular thinking, and empathy for knowledge workers.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "linear",
    "name": "Linear",
    "values": [
      "Craft over compromises",
      "Speed as a habit",
      "High agency",
      "Work in the open"
    ],
    "guidance": "Linear assesses exceptional product taste, keyboard-driven UI fluency, and autonomous execution without bureaucracy.",
    "sources": [
      {
        "label": "Linear Careers",
        "url": "https://linear.app/careers"
      }
    ],
    "industry": "Productivity & Design",
    "domainContext": "Linear builds the purpose-built tool for modern software teams to manage projects and track issues fast.",
    "interviewStrategy": "Demonstrate high agency, minimalist design sensibilities, and zero tolerance for sluggish software.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "atlassian",
    "name": "Atlassian",
    "values": [
      "Open company, no bullshit",
      "Build with heart and balance",
      "Don't #@!% the customer",
      "Play, as a team",
      "Be the change you seek"
    ],
    "guidance": "Atlassian's famous values guide their values interview. Be authentic, discuss mistakes candidly, and demonstrate team-first collaboration.",
    "sources": [
      {
        "label": "Atlassian Values",
        "url": "https://www.atlassian.com/company/careers/resources/values-interview"
      }
    ],
    "industry": "Productivity & Design",
    "domainContext": "Atlassian powers team collaboration across Jira, Confluence, Trello, and Bitbucket for software teams.",
    "interviewStrategy": "Speak candidly about failures, emphasize teamwork, and demonstrate deep customer empathy.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "slack",
    "name": "Slack (Salesforce)",
    "values": [
      "Empathy",
      "Courtesy",
      "Thriving",
      "Craftsmanship",
      "Playfulness",
      "Solidarity"
    ],
    "guidance": "Slack evaluates candidate empathy, real-time messaging resilience, and thoughtful communication design.",
    "sources": [
      {
        "label": "Slack Careers",
        "url": "https://slack.com/careers"
      }
    ],
    "industry": "Productivity & Design",
    "domainContext": "Slack is the enterprise productivity platform connecting teams, automations, and AI agents in channels.",
    "interviewStrategy": "Highlight clear asynchronous communication, user empathy, and platform integration skills.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "zoom",
    "name": "Zoom",
    "values": [
      "Care for community",
      "Care for customers",
      "Care for teammates",
      "Care for company",
      "Care for self"
    ],
    "guidance": "Zoom evaluates video and audio reliability, customer happiness, and enterprise video communications.",
    "sources": [
      {
        "label": "Zoom Careers",
        "url": "https://careers.zoom.us/"
      }
    ],
    "industry": "Productivity & Design",
    "domainContext": "Zoom provides unified video meetings, team chat, phone, and AI contact center communications globally.",
    "interviewStrategy": "Emphasize network reliability under adverse conditions and dedication to customer happiness.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "miro",
    "name": "Miro",
    "values": [
      "Play as a team to win the world",
      "Focus on impact & excellence",
      "Practice empathy",
      "Learn and grow fast"
    ],
    "guidance": "Miro explores infinite canvas performance, enterprise collaborative workshops, and team alignment.",
    "sources": [
      {
        "label": "Miro Careers",
        "url": "https://miro.com/careers/"
      }
    ],
    "industry": "Productivity & Design",
    "domainContext": "Miro is the visual workspace for innovation, enabling distributed teams to brainstorm, diagram, and build products.",
    "interviewStrategy": "Demonstrate passion for visual collaboration and scalable interactive canvas technology.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "airtable",
    "name": "Airtable",
    "values": [
      "Default to transparency",
      "Take pride in the details",
      "Inspire others",
      "Do whatever it takes"
    ],
    "guidance": "Airtable assesses relational database UX, no-code workflows, and enterprise operational transformation.",
    "sources": [
      {
        "label": "Airtable Careers",
        "url": "https://airtable.com/careers"
      }
    ],
    "industry": "Productivity & Design",
    "domainContext": "Airtable empowers anyone to build custom relational applications and connected data workflows.",
    "interviewStrategy": "Highlight data modeling intuition, UX simplification, and enterprise adoption.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "asana",
    "name": "Asana",
    "values": [
      "Mission",
      "Do great things, fast",
      "Clarity",
      "Co-creation",
      "Heartitude",
      "Mindfulness"
    ],
    "guidance": "Asana interviews focus on clarity of purpose, work management frameworks, and conscious leadership.",
    "sources": [
      {
        "label": "Asana Careers",
        "url": "https://asana.com/jobs"
      }
    ],
    "industry": "Productivity & Design",
    "domainContext": "Asana builds enterprise work management software orchestrating workflows across teams and objectives.",
    "interviewStrategy": "Demonstrate intentional communication, cross-functional alignment, and mission orientation.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "monday",
    "name": "monday.com",
    "values": [
      "Big picture",
      "Speed",
      "Data-driven",
      "Transparency",
      "Customer centricity"
    ],
    "guidance": "monday.com assesses product-led growth, data-driven optimization, and flexible work operating system components.",
    "sources": [
      {
        "label": "monday.com Careers",
        "url": "https://monday.com/careers"
      }
    ],
    "industry": "Productivity & Design",
    "domainContext": "monday.com provides a customizable work operating system for project management, CRM, and dev sprints.",
    "interviewStrategy": "Bring data-backed examples of velocity, A/B testing, and modular workflow design.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "automattic",
    "name": "Automattic",
    "values": [
      "The Automattic Creed: I will never stop learning",
      "I won't just work on things that are assigned to me",
      "Communicate as much as possible"
    ],
    "guidance": "Automattic evaluates asynchronous written communication, remote autonomy, and open-web dedication (WordPress).",
    "sources": [
      {
        "label": "Automattic Creed & Work",
        "url": "https://automattic.com/creed/"
      }
    ],
    "industry": "Productivity & Design",
    "domainContext": "Automattic powers WordPress.com, WooCommerce, and Tumblr with a 100% globally distributed workforce.",
    "interviewStrategy": "Excel in written text exercises, demonstrate open-source commitment, and prove remote autonomy.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "vercel",
    "name": "Vercel",
    "values": [
      "Make the Web Faster",
      "Build with Craft",
      "Ship Daily",
      "Customer Delight"
    ],
    "guidance": "Vercel looks for web performance obsession, edge computing fluency, Next.js expertise, and clean DX.",
    "sources": [
      {
        "label": "Vercel Careers",
        "url": "https://vercel.com/careers"
      }
    ],
    "industry": "Developer Tools & Infra",
    "domainContext": "Vercel is the frontend cloud platform for frameworks, edge functions, and generative AI apps.",
    "interviewStrategy": "Demonstrate frontend performance mastery (Core Web Vitals), edge rendering, and developer empathy.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "supabase",
    "name": "Supabase",
    "values": [
      "Open Source",
      "Postgres First",
      "Ship Fast",
      "Work in Public"
    ],
    "guidance": "Supabase evaluates PostgreSQL depth, open-source community support, distributed systems, and real-time APIs.",
    "sources": [
      {
        "label": "Supabase Careers",
        "url": "https://supabase.com/careers"
      }
    ],
    "industry": "Developer Tools & Infra",
    "domainContext": "Supabase is the open source Firebase alternative providing Postgres, Auth, Edge Functions, and Vector embeddings.",
    "interviewStrategy": "Highlight PostgreSQL features (RLS, extensions), open-source philosophy, and developer UX.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "github",
    "name": "GitHub (Microsoft)",
    "values": [
      "Customer-obsessed",
      "Ship to learn",
      "Growth mindset",
      "Own the outcome"
    ],
    "guidance": "GitHub evaluates Git internals, developer productivity tools (Copilot, Actions), and open-source security.",
    "sources": [
      {
        "label": "GitHub Careers",
        "url": "https://github.com/about/careers"
      }
    ],
    "industry": "Developer Tools & Infra",
    "domainContext": "GitHub is the home for all developers, hosting 100M+ users building and securing software with AI.",
    "interviewStrategy": "Demonstrate deep Git and CI/CD fluency, developer workflow intuition, and community empathy.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "gitlab",
    "name": "GitLab",
    "values": [
      "Collaboration",
      "Results",
      "Efficiency",
      "Diversity, Inclusion & Belonging",
      "Iteration",
      "Transparency (CREDIT)"
    ],
    "guidance": "GitLab assesses candidates strictly on their CREDIT values, extreme transparency, and all-remote asynchronous habits.",
    "sources": [
      {
        "label": "GitLab Values",
        "url": "https://handbook.gitlab.com/handbook/values/"
      }
    ],
    "industry": "Developer Tools & Infra",
    "domainContext": "GitLab delivers the comprehensive DevSecOps platform spanning source control, CI/CD, and security scanning.",
    "interviewStrategy": "Reference the public GitLab handbook, demonstrate small iterations, and communicate cleanly in writing.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "cloudflare",
    "name": "Cloudflare",
    "values": [
      "Help build a better internet",
      "Principled",
      "Curious",
      "Transparent"
    ],
    "guidance": "Cloudflare explores networking protocols (BGP, DNS, HTTP/3), edge security (DDoS, WAF), and Workers serverless compute.",
    "sources": [
      {
        "label": "Cloudflare Careers",
        "url": "https://www.cloudflare.com/careers/"
      }
    ],
    "industry": "Developer Tools & Infra",
    "domainContext": "Cloudflare operates a global connectivity cloud protecting and accelerating millions of internet properties.",
    "interviewStrategy": "Demonstrate networking fundamentals, edge computing architectures, and resilience under attack.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "datadog",
    "name": "Datadog",
    "values": [
      "Think and act globally",
      "Transparency",
      "Simplicity",
      "Humility",
      "Ownership"
    ],
    "guidance": "Datadog evaluates telemetry scalability, high-volume log and metric aggregation, and cloud observability.",
    "sources": [
      {
        "label": "Datadog Careers",
        "url": "https://www.datadoghq.com/careers/"
      }
    ],
    "industry": "Developer Tools & Infra",
    "domainContext": "Datadog provides full-stack cloud observability, infrastructure monitoring, and security for modern DevOps.",
    "interviewStrategy": "Discuss distributed tracing, time-series data challenges, and observability best practices.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "docker",
    "name": "Docker",
    "values": [
      "Developer first",
      "Build in the open",
      "Humility",
      "Velocity"
    ],
    "guidance": "Docker evaluates containerization primitives, local developer environments, and secure container image registries.",
    "sources": [
      {
        "label": "Docker Careers",
        "url": "https://www.docker.com/careers/"
      }
    ],
    "industry": "Developer Tools & Infra",
    "domainContext": "Docker provides container tools (Docker Desktop, Hub) simplifying software packaging and cloud deployment.",
    "interviewStrategy": "Showcase Linux container concepts (cgroups, namespaces), developer ergonomics, and build optimization.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "postman",
    "name": "Postman",
    "values": [
      "Make APIs easy",
      "Win together",
      "Continuously learn",
      "Be open"
    ],
    "guidance": "Postman evaluates API lifecycle design, OpenAPI specifications, collaborative testing, and developer tooling.",
    "sources": [
      {
        "label": "Postman Careers",
        "url": "https://www.postman.com/company/careers/"
      }
    ],
    "industry": "Developer Tools & Infra",
    "domainContext": "Postman is the world's leading API platform used by 30M+ developers to design, test, and mock APIs.",
    "interviewStrategy": "Demonstrate REST/GraphQL/gRPC design principles, API governance, and developer testing rigor.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "zapier",
    "name": "Zapier",
    "values": [
      "Default to action",
      "Default to transparency",
      "Grow through curiosity",
      "Empathy, no ego",
      "Don't be a robot, build the robot"
    ],
    "guidance": "Zapier evaluates remote async collaboration, workflow automation mindset, and API integration resilience.",
    "sources": [
      {
        "label": "Zapier Values",
        "url": "https://zapier.com/jobs"
      }
    ],
    "industry": "Developer Tools & Infra",
    "domainContext": "Zapier connects 6,000+ business web apps allowing anyone to automate repetitive tasks and AI actions.",
    "interviewStrategy": "Showcase systems thinking, API rate-limiting resilience, and strong remote async habits.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "retool",
    "name": "Retool",
    "values": [
      "Focus on the developer",
      "Move fast",
      "Craftsmanship",
      "High agency"
    ],
    "guidance": "Retool looks for fast-shipping builders who understand internal operational tooling and low-code UI frameworks.",
    "sources": [
      {
        "label": "Retool Careers",
        "url": "https://retool.com/careers"
      }
    ],
    "industry": "Developer Tools & Infra",
    "domainContext": "Retool provides internal development platforms for engineering teams to build custom business software fast.",
    "interviewStrategy": "Demonstrate full-stack speed, database connectivity, and internal tools operational impact.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "hashicorp",
    "name": "HashiCorp (IBM)",
    "values": [
      "The Tao of HashiCorp: Workflows not technologies",
      "Simple, modular, composable",
      "Communication",
      "Humility"
    ],
    "guidance": "HashiCorp interviews focus on Infrastructure as Code (Terraform), secrets management (Vault), and cloud automation.",
    "sources": [
      {
        "label": "HashiCorp Tao & Careers",
        "url": "https://www.hashicorp.com/tao-of-hashicorp"
      }
    ],
    "industry": "Developer Tools & Infra",
    "domainContext": "HashiCorp builds foundational multi-cloud automation and infrastructure security tools (Terraform, Vault, Consul).",
    "interviewStrategy": "Emphasize declarative infrastructure design, security posture, and workflow standardization.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "crowdstrike",
    "name": "CrowdStrike",
    "values": [
      "One Team, One Mission",
      "Never Settle",
      "Direct Communication",
      "Deliver Customer Uptime"
    ],
    "guidance": "CrowdStrike evaluates endpoint threat detection, kernel-level telemetry, zero-trust cloud security, and rapid incident response.",
    "sources": [
      {
        "label": "CrowdStrike Careers",
        "url": "https://www.crowdstrike.com/careers/"
      }
    ],
    "industry": "Developer Tools & Infra",
    "domainContext": "CrowdStrike delivers cloud-native endpoint protection, threat intelligence, and cyber response services (Falcon platform).",
    "interviewStrategy": "Demonstrate security threat modeling, kernel/low-level systems discipline, and incident triage.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "paloaltonetworks",
    "name": "Palo Alto Networks",
    "values": [
      "Disruption",
      "Execution",
      "Collaboration",
      "Integrity",
      "Inclusion"
    ],
    "guidance": "Palo Alto Networks assesses network security, SASE cloud architectures, firewall throughput, and enterprise SOC automation.",
    "sources": [
      {
        "label": "Palo Alto Networks Careers",
        "url": "https://jobs.paloaltonetworks.com/"
      }
    ],
    "industry": "Developer Tools & Infra",
    "domainContext": "Palo Alto Networks is the global cybersecurity leader delivering zero trust network, cloud, and SOC platforms.",
    "interviewStrategy": "Highlight enterprise network security architectures, threat landscape understanding, and cross-functional execution.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "mongodb",
    "name": "MongoDB",
    "values": [
      "Make It Matter",
      "Think Big, Go Far",
      "Embrace the Power of Differences",
      "Build Together",
      "Own What You Do"
    ],
    "guidance": "MongoDB explores document database modeling, distributed clustering, Atlas cloud managed services, and developer adoption.",
    "sources": [
      {
        "label": "MongoDB Careers",
        "url": "https://www.mongodb.com/company/careers"
      }
    ],
    "industry": "Developer Tools & Infra",
    "domainContext": "MongoDB provides developer data platforms based on flexible document models, search, and real-time streaming.",
    "interviewStrategy": "Discuss schema design trade-offs (normalization vs embedding), indexing strategies, and high-availability clustering.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "deel",
    "name": "Deel",
    "values": [
      "Speed and scale",
      "Ownership",
      "Genuine care",
      "Default to openness"
    ],
    "guidance": "Deel evaluates international labor law understanding, payroll compliance across 100+ countries, and intense execution speed.",
    "sources": [
      {
        "label": "Deel Careers",
        "url": "https://www.deel.com/careers"
      }
    ],
    "industry": "Global Remote & HR Tech",
    "domainContext": "Deel simplifies global hiring, payroll, compliance, and HR management for worldwide distributed teams.",
    "interviewStrategy": "Bring high operational speed, legal/compliance accuracy, and global employment solutions.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "remote",
    "name": "Remote.com",
    "values": [
      "Transparency",
      "Self-care",
      "Excellence",
      "Ambition",
      "Ownership"
    ],
    "guidance": "Remote assesses asynchronous written communication, global employer of record (EOR) infrastructure, and equity compliance.",
    "sources": [
      {
        "label": "Remote Careers",
        "url": "https://remote.com/careers"
      }
    ],
    "industry": "Global Remote & HR Tech",
    "domainContext": "Remote operates owned legal entities worldwide to provide compliant payroll, taxes, and benefits for global talent.",
    "interviewStrategy": "Demonstrate strong async written communication, empathy for distributed workers, and statutory compliance.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "gusto",
    "name": "Gusto",
    "values": [
      "Empathy in all things",
      "Be proud of the details",
      "Go the extra mile",
      "Do what's right"
    ],
    "guidance": "Gusto evaluates small-business empathy, payroll tax precision, benefits compliance, and human-centric software design.",
    "sources": [
      {
        "label": "Gusto Careers",
        "url": "https://gusto.com/about/careers"
      }
    ],
    "industry": "Global Remote & HR Tech",
    "domainContext": "Gusto provides cloud-based payroll, benefits, and human resource management for 300,000+ small businesses.",
    "interviewStrategy": "Highlight user empathy, meticulous detail with financial/tax numbers, and mission-driven focus.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "rippling",
    "name": "Rippling",
    "values": [
      "Go and see",
      "Push for high agency",
      "Care about the details",
      "Build Compound Products"
    ],
    "guidance": "Rippling evaluates candidates on 'Compound Startup' architecture\u2014building tightly integrated HR, IT, and Finance products simultaneously.",
    "sources": [
      {
        "label": "Rippling Careers",
        "url": "https://www.rippling.com/careers"
      }
    ],
    "industry": "Global Remote & HR Tech",
    "domainContext": "Rippling unifies employee records across payroll, benefits, devices, and cloud app access in a single unified graph.",
    "interviewStrategy": "Demonstrate high agency, systems integration thinking, and ability to handle multifaceted enterprise workflows.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "workday",
    "name": "Workday",
    "values": [
      "Employees",
      "Customer Service",
      "Innovation",
      "Integrity",
      "Fun",
      "Profitability"
    ],
    "guidance": "Workday assesses large-enterprise HCM architectures, financial management integrations, and high employee satisfaction.",
    "sources": [
      {
        "label": "Workday Careers",
        "url": "https://www.workday.com/en-us/company/careers.html"
      }
    ],
    "industry": "Global Remote & HR Tech",
    "domainContext": "Workday delivers cloud ERP, human capital management, and financial applications for Fortune 500 enterprises.",
    "interviewStrategy": "Emphasize enterprise governance, multi-tenant cloud scalability, and customer retention.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "bamboohr",
    "name": "BambooHR",
    "values": [
      "Enjoy quality of life",
      "Grow a growth mindset",
      "Be open",
      "Do the right thing",
      "Assume the best"
    ],
    "guidance": "BambooHR looks for candidates who foster positive work cultures, employee self-service simplicity, and small-business HR tools.",
    "sources": [
      {
        "label": "BambooHR Careers",
        "url": "https://www.bamboohr.com/careers/"
      }
    ],
    "industry": "Global Remote & HR Tech",
    "domainContext": "BambooHR provides intuitive HR software for small and medium businesses to manage hiring, onboarding, and compensation.",
    "interviewStrategy": "Showcase warmth, employee experience advocacy, and clean software ergonomics.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "airbnb",
    "name": "Airbnb",
    "values": [
      "Champion the mission",
      "Be a host",
      "Embrace the adventure",
      "Be a cereal entrepreneur"
    ],
    "guidance": "Airbnb's interview process includes dedicated core values interviews. Prepare authentic stories showing hospitality, resilience, and belonging.",
    "sources": [
      {
        "label": "Airbnb Careers",
        "url": "https://careers.airbnb.com/"
      }
    ],
    "industry": "Consumer Tech & Marketplace",
    "domainContext": "Airbnb operates a worldwide travel marketplace connecting millions of unique home hosts with travelers.",
    "interviewStrategy": "Focus on the host/guest experience, demonstrate hospitality mindset, and share stories of creative resourcefulness.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "uber",
    "name": "Uber",
    "values": [
      "Go get it",
      "Trip obsess",
      "Build with purpose",
      "Do the right thing",
      "Great minds don't think alike"
    ],
    "guidance": "Uber assesses real-time dispatch systems, marketplace equilibrium, driver/rider unit economics, and operational rigor.",
    "sources": [
      {
        "label": "Uber Careers",
        "url": "https://www.uber.com/us/en/careers/"
      }
    ],
    "industry": "Consumer Tech & Marketplace",
    "domainContext": "Uber powers mobility and delivery services across 70+ countries with dynamic pricing and dispatch algorithms.",
    "interviewStrategy": "Discuss marketplace supply/demand balance, real-time latency optimization, and localized city operations.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "doordash",
    "name": "DoorDash",
    "values": [
      "Customer-obsessed, not competitor-focused",
      "Make room at the table",
      "Bias for action",
      "Operate at the lowest level of detail"
    ],
    "guidance": "DoorDash evaluates candidates on hyper-local logistics, merchant margins, courier batching, and extreme operational detail.",
    "sources": [
      {
        "label": "DoorDash Careers",
        "url": "https://careers.doordash.com/"
      }
    ],
    "industry": "Consumer Tech & Marketplace",
    "domainContext": "DoorDash connects consumers with local merchants through on-demand delivery and logistics fulfillment platforms.",
    "interviewStrategy": "Demonstrate operating at the lowest level of detail; calculate unit economics and turnaround times cleanly.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "spotify",
    "name": "Spotify",
    "values": [
      "Innovative",
      "Collaborative",
      "Sincere",
      "Passionate",
      "Playful"
    ],
    "guidance": "Spotify values autonomous cross-functional squads, personalization algorithms, audio creator ecosystems, and user delight.",
    "sources": [
      {
        "label": "Spotify Jobs",
        "url": "https://www.lifeatspotify.com/"
      }
    ],
    "industry": "Consumer Tech & Marketplace",
    "domainContext": "Spotify delivers personalized streaming audio, podcasts, and creator tools to 600M+ global listeners.",
    "interviewStrategy": "Demonstrate passion for creator and listener communities, recommendation engines, and collaborative squads.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "reddit",
    "name": "Reddit",
    "values": [
      "Remember the human",
      "Evolve",
      "Default to open",
      "Make something people love"
    ],
    "guidance": "Reddit explores community governance, high-scale content moderation, distributed feed ranking, and advertising platforms.",
    "sources": [
      {
        "label": "Reddit Careers",
        "url": "https://www.redditinc.com/careers"
      }
    ],
    "industry": "Consumer Tech & Marketplace",
    "domainContext": "Reddit hosts thousands of active communities uniting millions in authentic conversations and shared interests.",
    "interviewStrategy": "Highlight community empathy, moderation scaling challenges, and content discovery algorithms.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "instacart",
    "name": "Instacart",
    "values": [
      "Solve for the customer",
      "Every minute counts",
      "Grow together",
      "Take ownership"
    ],
    "guidance": "Instacart assesses grocery catalog data accuracy, retail grocer partnerships, and multi-stop shopper routing.",
    "sources": [
      {
        "label": "Instacart Careers",
        "url": "https://instacart.careers/"
      }
    ],
    "industry": "Consumer Tech & Marketplace",
    "domainContext": "Instacart powers online grocery fulfillment and retail enterprise technology connecting shoppers with leading supermarkets.",
    "interviewStrategy": "Emphasize order fulfillment speed, inventory replacement accuracy, and three-sided marketplace dynamics.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "lyft",
    "name": "Lyft",
    "values": [
      "Make it happen",
      "Create fearlessly",
      "Be yourself",
      "Uplift others"
    ],
    "guidance": "Lyft evaluates community transit options, driver earnings transparency, and routing optimization.",
    "sources": [
      {
        "label": "Lyft Careers",
        "url": "https://www.lyft.com/careers"
      }
    ],
    "industry": "Consumer Tech & Marketplace",
    "domainContext": "Lyft operates multimodal transportation networks offering rideshare, bikes, and scooters across North America.",
    "interviewStrategy": "Showcase customer and driver empathy, dynamic pricing trade-offs, and urban transportation impact.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "pinterest",
    "name": "Pinterest",
    "values": [
      "Put Pinners first",
      "Win as one",
      "Care and connect",
      "Be an explorer",
      "Create great things"
    ],
    "guidance": "Pinterest looks for visual search, machine learning recommendations, positive digital well-being, and shoppable pins.",
    "sources": [
      {
        "label": "Pinterest Careers",
        "url": "https://www.pinterestcareers.com/"
      }
    ],
    "industry": "Consumer Tech & Marketplace",
    "domainContext": "Pinterest is the visual inspiration engine helping hundreds of millions plan, curate, and purchase lifestyle products.",
    "interviewStrategy": "Highlight computer vision recommendations, user positive engagement metrics, and visual search UX.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "snap",
    "name": "Snap Inc.",
    "values": [
      "Kind",
      "Smart",
      "Creative"
    ],
    "guidance": "Snap evaluates augmented reality (AR) lenses, camera-first computing, and fast ephemeral messaging architectures.",
    "sources": [
      {
        "label": "Snap Careers",
        "url": "https://careers.snap.com/"
      }
    ],
    "industry": "Consumer Tech & Marketplace",
    "domainContext": "Snap is a camera company reinventing communication through Snapchat, AR Spectacles, and creative developer lenses.",
    "interviewStrategy": "Demonstrate creative technical problem-solving, real-time video processing, and genuine kindness.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "bytedance",
    "name": "ByteDance (TikTok)",
    "values": [
      "Aim for the highest",
      "Be grounded and courageous",
      "Be open and clear",
      "Always day 1",
      "Champion diversity"
    ],
    "guidance": "ByteDance assesses machine learning feed ranking at massive scale, video content moderation, and global creator monetisation.",
    "sources": [
      {
        "label": "ByteDance Careers",
        "url": "https://jobs.bytedance.com/"
      }
    ],
    "industry": "Consumer Tech & Marketplace",
    "domainContext": "ByteDance powers TikTok, Douyin, and Lark, delivering AI-driven short video and content discovery globally.",
    "interviewStrategy": "Demonstrate deep understanding of recommendation algorithms, rapid user feedback loops, and global execution.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "salesforce",
    "name": "Salesforce",
    "values": [
      "Trust",
      "Customer Success",
      "Innovation",
      "Equality",
      "Sustainability"
    ],
    "guidance": "Salesforce evaluates enterprise cloud architecture, CRM workflows (Agentforce), partner ecosystems, and customer success.",
    "sources": [
      {
        "label": "Salesforce Careers",
        "url": "https://www.salesforce.com/company/careers/"
      }
    ],
    "industry": "Enterprise SaaS & CRM",
    "domainContext": "Salesforce is the world's leading AI CRM connecting companies with their customers across sales, service, and marketing.",
    "interviewStrategy": "Anchor answers in customer success metrics, enterprise data trust, and platform extensibility.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "servicenow",
    "name": "ServiceNow",
    "values": [
      "Wow our customers",
      "Win as a team",
      "Create what's next",
      "Live our purpose"
    ],
    "guidance": "ServiceNow assesses enterprise digital workflows, IT service management (ITSM), and automated cross-departmental operations.",
    "sources": [
      {
        "label": "ServiceNow Careers",
        "url": "https://www.servicenow.com/careers.html"
      }
    ],
    "industry": "Enterprise SaaS & CRM",
    "domainContext": "ServiceNow delivers cloud workflow software automating digital experiences across IT, employee HR, and customer service.",
    "interviewStrategy": "Demonstrate enterprise workflow orchestration, ticket deflection metrics, and cross-silo business impact.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "adobe",
    "name": "Adobe",
    "values": [
      "Create the future",
      "Own the outcome",
      "Raise the bar",
      "Be genuine"
    ],
    "guidance": "Adobe evaluates generative AI creativity (Firefly), document cloud workflows, and enterprise digital marketing analytics.",
    "sources": [
      {
        "label": "Adobe Careers",
        "url": "https://www.adobe.com/careers.html"
      }
    ],
    "industry": "Enterprise SaaS & CRM",
    "domainContext": "Adobe empowers digital creative experiences from Photoshop and Illustrator to Experience Platform marketing clouds.",
    "interviewStrategy": "Highlight creative professional empathy, ethical AI generation, and enterprise analytics adoption.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "intuit",
    "name": "Intuit",
    "values": [
      "Integrity without compromise",
      "Courage",
      "Customer obsession",
      "Stronger together",
      "We care and give back"
    ],
    "guidance": "Intuit focuses on Customer-Driven Innovation (CDI), Design for Delight (D4D), and financial algorithm precision (TurboTax, QuickBooks).",
    "sources": [
      {
        "label": "Intuit Careers",
        "url": "https://www.intuit.com/careers/"
      }
    ],
    "industry": "Enterprise SaaS & CRM",
    "domainContext": "Intuit powers prosperity around the world through financial platforms including TurboTax, QuickBooks, Credit Karma, and Mailchimp.",
    "interviewStrategy": "Structure answers using Customer-Driven Innovation and Design for Delight frameworks.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "sap",
    "name": "SAP",
    "values": [
      "Tell it like it is",
      "Stay curious",
      "Embrace differences",
      "Keep the promise",
      "Build bridges"
    ],
    "guidance": "SAP evaluates enterprise supply chain integration, cloud ERP migrations (S/4HANA), and industrial business networks.",
    "sources": [
      {
        "label": "SAP Careers",
        "url": "https://www.sap.com/about/careers.html"
      }
    ],
    "industry": "Enterprise SaaS & CRM",
    "domainContext": "SAP is the world's leading enterprise resource planning (ERP) software company, orchestrating global business commerce.",
    "interviewStrategy": "Focus on mission-critical business transactions, multi-national compliance, and cloud ERP adoption.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "cisco",
    "name": "Cisco",
    "values": [
      "Give your best",
      "Take accountability",
      "Connect everything",
      "Innovate everywhere",
      "Benefit everyone"
    ],
    "guidance": "Cisco assesses networking hardware/software resilience, enterprise zero trust security, and Webex collaboration infrastructure.",
    "sources": [
      {
        "label": "Cisco Careers",
        "url": "https://www.cisco.com/c/en/us/about/careers.html"
      }
    ],
    "industry": "Enterprise SaaS & CRM",
    "domainContext": "Cisco powers secure internet connectivity, routing, enterprise switching, and collaborative cloud security.",
    "interviewStrategy": "Demonstrate networking architecture fundamentals, hardware-software lifecycle, and security rigor.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "box",
    "name": "Box",
    "values": [
      "Blow our customers' minds",
      "10x it",
      "Be an owner",
      "Make mom proud",
      "Take risks, fail fast"
    ],
    "guidance": "Box evaluates enterprise content management, cloud document security, governance compliance (HIPAA/FINRA), and AI document extraction.",
    "sources": [
      {
        "label": "Box Careers",
        "url": "https://www.box.com/careers"
      }
    ],
    "industry": "Enterprise SaaS & CRM",
    "domainContext": "Box is the Intelligent Content Cloud enabling organizations to secure, share, and automate work with their content.",
    "interviewStrategy": "Highlight document security compliance, workflow automations, and enterprise customer success.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "hubspot",
    "name": "HubSpot",
    "values": [
      "HEART: Humble",
      "Empathetic",
      "Adaptable",
      "Remarkable",
      "Transparent"
    ],
    "guidance": "HubSpot evaluates candidates against their Culture Code and HEART values. Inbound marketing, customer empathy, and humility are essential.",
    "sources": [
      {
        "label": "HubSpot Culture Code",
        "url": "https://www.hubspot.com/careers"
      }
    ],
    "industry": "Enterprise SaaS & CRM",
    "domainContext": "HubSpot provides inbound marketing, sales, and service CRM platforms designed for scaling SMB and mid-market businesses.",
    "interviewStrategy": "Demonstrate authentic humility, customer-first problem solving, and familiarity with inbound methodology.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "goldmansachs",
    "name": "Goldman Sachs",
    "values": [
      "Partnership",
      "Client Service",
      "Integrity",
      "Excellence"
    ],
    "guidance": "Goldman Sachs evaluates financial modeling precision, macroeconomic analytical reasoning, client stewardship, and high stamina under pressure.",
    "sources": [
      {
        "label": "Goldman Sachs Careers",
        "url": "https://www.goldmansachs.com/careers/"
      }
    ],
    "industry": "Global Finance & Banking",
    "domainContext": "Goldman Sachs is a leading global investment banking, securities, and investment management firm advising top institutions.",
    "interviewStrategy": "Demonstrate absolute numerical precision, client-first professionalism, and structured financial reasoning.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "jpmorgan",
    "name": "JPMorgan Chase",
    "values": [
      "Exceptional client service",
      "Operational excellence",
      "A commitment to integrity",
      "A great team and winning culture"
    ],
    "guidance": "JPMorgan evaluates risk governance, payment infrastructure volume, capital markets advisory, and customer trust.",
    "sources": [
      {
        "label": "JPMorgan Careers",
        "url": "https://careers.jpmorgan.com/"
      }
    ],
    "industry": "Global Finance & Banking",
    "domainContext": "JPMorgan Chase is the largest bank in the United States, managing trillions in global assets, corporate banking, and retail branches.",
    "interviewStrategy": "Highlight risk mitigation, fiduciary duty, and experience scaling institutional operations.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "morganstanley",
    "name": "Morgan Stanley",
    "values": [
      "Do the right thing",
      "Put clients first",
      "Lead with exceptional ideas",
      "Commit to diversity and inclusion",
      "Give back"
    ],
    "guidance": "Morgan Stanley evaluates wealth management advisory, capital markets underwriting, and quantitative risk modeling.",
    "sources": [
      {
        "label": "Morgan Stanley Careers",
        "url": "https://www.morganstanley.com/people"
      }
    ],
    "industry": "Global Finance & Banking",
    "domainContext": "Morgan Stanley advises clients globally across investment banking, institutional securities, wealth, and asset management.",
    "interviewStrategy": "Emphasize ethical rigor, complex financial analysis, and strategic client advisory skills.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "blackrock",
    "name": "BlackRock",
    "values": [
      "We are a fiduciary to our clients",
      "We are 'One BlackRock'",
      "We are passionate about performance",
      "We innovate"
    ],
    "guidance": "BlackRock evaluates portfolio risk analytics (Aladdin), fiduciary ethics, and long-term sustainable asset allocation.",
    "sources": [
      {
        "label": "BlackRock Careers",
        "url": "https://careers.blackrock.com/"
      }
    ],
    "industry": "Global Finance & Banking",
    "domainContext": "BlackRock is the world's largest asset manager, operating the Aladdin operating system for global institutional portfolios.",
    "interviewStrategy": "Discuss portfolio risk management, fiduciary duty, and technology-driven asset optimization.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "visa",
    "name": "Visa",
    "values": [
      "Act with integrity",
      "Customer-focused",
      "Open to new ideas",
      "Collaborative",
      "Driven to deliver"
    ],
    "guidance": "Visa evaluates high-availability network throughput (VisaNet), authorization algorithms, and digital currency innovations.",
    "sources": [
      {
        "label": "Visa Careers",
        "url": "https://www.visa.com/careers"
      }
    ],
    "industry": "Global Finance & Banking",
    "domainContext": "Visa connects consumers, merchants, and financial institutions across 200+ countries with 65,000+ transaction messages per second.",
    "interviewStrategy": "Emphasize zero-downtime reliability, fraud prevention, and cross-border payment networks.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "mastercard",
    "name": "Mastercard",
    "values": [
      "Trust",
      "Partnership",
      "Agility",
      "Initiative"
    ],
    "guidance": "Mastercard explores open banking, cybersecurity tokenization, cardholder identity, and financial inclusion programs.",
    "sources": [
      {
        "label": "Mastercard Careers",
        "url": "https://www.mastercard.com/careers"
      }
    ],
    "industry": "Global Finance & Banking",
    "domainContext": "Mastercard powers global payments, connecting commercial and retail cardholders with secure digital networks.",
    "interviewStrategy": "Highlight secure payment tokenization, cyber risk prevention, and global financial connectivity.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "amex",
    "name": "American Express",
    "values": [
      "We deliver for our customers",
      "We respect people",
      "We make it great",
      "We do what's right",
      "We win as a team"
    ],
    "guidance": "American Express evaluates premium customer loyalty, credit risk underwriting, and closed-loop merchant network economics.",
    "sources": [
      {
        "label": "American Express Careers",
        "url": "https://www.americanexpress.com/en-us/careers/"
      }
    ],
    "industry": "Global Finance & Banking",
    "domainContext": "American Express provides premium consumer and business cards, merchant payment networks, and travel services.",
    "interviewStrategy": "Showcase high customer service standards, closed-loop network value, and credit risk discipline.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "capitalone",
    "name": "Capital One",
    "values": [
      "Excellence",
      "Do the right thing",
      "Customer first",
      "Lead with data"
    ],
    "guidance": "Capital One focuses heavily on case interviews, data-driven analytical problem solving, and cloud-first tech engineering (AWS).",
    "sources": [
      {
        "label": "Capital One Careers",
        "url": "https://www.capitalonecareers.com/"
      }
    ],
    "industry": "Global Finance & Banking",
    "domainContext": "Capital One is a cloud-native financial institution specializing in credit cards, consumer banking, and auto loans.",
    "interviewStrategy": "Master data case studies; practice structured quantitative estimation and tech stack modernization.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "mckinsey",
    "name": "McKinsey & Company",
    "values": [
      "Adhere to the highest professional standards",
      "Improve our clients' performance significantly",
      "Create an unrivaled environment for exceptional people"
    ],
    "guidance": "McKinsey conducts rigorous Case Interviews (Problem Solving Test/Solve game) and Personal Experience Interviews (PEI). Structure, logic, and synthesis are paramount.",
    "sources": [
      {
        "label": "McKinsey Interview Prep",
        "url": "https://www.mckinsey.com/careers/interviewing"
      }
    ],
    "industry": "Strategy Consulting",
    "domainContext": "McKinsey advises global leaders on strategic transformation, digital innovation, operations, and organizational change.",
    "interviewStrategy": "Structure problems with MECE (Mutually Exclusive, Collectively Exhaustive) frameworks and practice top-down executive synthesis.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "bcg",
    "name": "Boston Consulting Group (BCG)",
    "values": [
      "Integrity",
      "Respect for the individual",
      "Strategic perspective",
      "Value delivered",
      "Expand the art of the possible"
    ],
    "guidance": "BCG evaluates creative business problem solving, quantitative agility, and personal leadership impact in live case scenarios.",
    "sources": [
      {
        "label": "BCG Interview Process",
        "url": "https://www.bcg.com/careers/interviewing"
      }
    ],
    "industry": "Strategy Consulting",
    "domainContext": "BCG partners with business and societal leaders to tackle their most important challenges and capture their greatest opportunities.",
    "interviewStrategy": "Demonstrate hypothesis-driven problem solving, quantitative comfort, and bold strategic vision.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "bain",
    "name": "Bain & Company",
    "values": [
      "A Bainie never lets another Bainie fail",
      "Practical, results-oriented results",
      "True North ethics",
      "Diverse perspectives"
    ],
    "guidance": "Bain emphasizes pragmatic, implementable answers ('True North' values) and collaborative case interview chemistry.",
    "sources": [
      {
        "label": "Bain Interview Prep",
        "url": "https://www.bain.com/careers/interview-prep/"
      }
    ],
    "industry": "Strategy Consulting",
    "domainContext": "Bain is a top management consultancy renowned for private equity advisory, enterprise strategy, and measurable client results.",
    "interviewStrategy": "Focus on 80/20 actionable recommendations, practical implementation feasibility, and high team rapport.",
    "checkedOn": "2026-11-05"
  },
  {
    "id": "deloitte",
    "name": "Deloitte",
    "values": [
      "Lead the way",
      "Serve with integrity",
      "Take care of each other",
      "Foster inclusion",
      "Collaborate for measurable impact"
    ],
    "guidance": "Deloitte evaluates client delivery rigor, large-scale enterprise technology implementation, and commercial advisory excellence.",
    "sources": [
      {
        "label": "Deloitte Careers",
        "url": "https://www.deloitte.com/global/en/careers.html"
      }
    ],
    "industry": "Strategy Consulting",
    "domainContext": "Deloitte provides audit, consulting, tax, and advisory services to many of the world's most admired brands.",
    "interviewStrategy": "Highlight end-to-end transformation delivery, operational risk management, and stakeholder alignment.",
    "checkedOn": "2026-11-05"
  }
];

export function findCompanyGuidance(company: string) {
  if (!company) return undefined;
  const clean = company.toLowerCase().trim();
  return COMPANY_GUIDANCE.find(item =>
    item.id === clean ||
    item.name.toLowerCase() === clean ||
    new RegExp(`\\b${item.id}\\b`, 'i').test(company) ||
    new RegExp(`\\b${item.name}\\b`, 'i').test(company)
  );
}

/**
 * Synthesizes dynamic, role-anchored company guidance, culture pillars, domain context,
 * and interview strategy for any active application role.
 */
export function synthesizeCompanyGuidance(
  company: string,
  role = '',
  description = '',
  applyUrl = ''
): CompanyGuidance {
  const cleanName = company?.trim() || 'Target Employer';
  const slug = `active-${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  const combinedText = `${cleanName} ${role} ${description}`.toLowerCase();

  let industry = 'Technology & Operations';
  let domainContext = `${cleanName} operates in a metrics-driven environment prioritizing scalable execution, process efficiency, and cross-functional team coordination.`;
  let interviewStrategy = `Focus on structured STAR examples demonstrating fast ramp-up, proactive ownership, and clear stakeholder communication.`;
  let values: string[] = ['Operational Rigor', 'Collaborative Ownership', 'Continuous Learning', 'Outcome Orientation', 'Transparent Communication'];

  if (/\b(health|medical|clinic|payor|payer|provider|credentialing|patient|hospital|hipaa|doctor|pharma|biotech|care)\b/i.test(combinedText)) {
    industry = 'Healthcare Technology & Operations';
    domainContext = `${cleanName} operates in healthcare infrastructure where data precision and audit compliance directly impact provider licensing, payor enrollment timelines, and hospital network billing cycles.`;
    interviewStrategy = `Demonstrate high procedural rigor, zero-tolerance for data validation errors, and experience with audit-ready documentation and SLA tracking.`;
    values = ['Data Accuracy & Integrity', 'Regulatory & Compliance Rigor', 'SOP Adherence', 'Provider Trust', 'Operational Velocity'];
  } else if (/\b(fintech|payment|bank|card|credit|invest|crypto|trading|lending|wealth|remittance|iso 20022|swift)\b/i.test(combinedText)) {
    industry = 'Financial Technology & Payments';
    domainContext = `${cleanName} powers financial workflows where ledger accuracy, regulatory compliance, low-latency transaction processing, and fraud mitigation are mission-critical.`;
    interviewStrategy = `Highlight system reliability, risk controls, reconciliations, and how you partner across engineering and compliance stakeholders.`;
    values = ['Financial Rigor & Security', 'Risk & Fraud Mitigation', 'Transaction Precision', 'Customer Trust', 'System Reliability'];
  } else if (/\b(saas|cloud|devops|infrastructure|kubernetes|api|platform|b2b|enterprise|security|cyber)\b/i.test(combinedText)) {
    industry = 'Enterprise Cloud & Software';
    domainContext = `${cleanName} delivers B2B enterprise software where customer uptime, data security (SOC2), multi-tenant reliability, and product-led adoption drive expansion.`;
    interviewStrategy = `Emphasize understanding customer pain points, technical trade-offs, and measurable efficiency gains.`;
    values = ['Customer Empathy', 'Engineering Craft', 'High Ownership', 'Fast Iteration', 'System Reliability'];
  } else if (/\b(e-commerce|retail|marketplace|supply chain|logistics|fulfillment|warehouse|delivery|merchant)\b/i.test(combinedText)) {
    industry = 'E-Commerce & Supply Chain';
    domainContext = `${cleanName} balances physical and digital operations where margin optimization, inventory accuracy, and seamless consumer delivery drive success.`;
    interviewStrategy = `Frame answers with measurable operations metrics: turnaround times, error reductions, supplier coordination, and cost efficiency.`;
    values = ['Customer Obsession', 'Operational Excellence', 'Frugality & Speed', 'Inventory Accuracy', 'Continuous Improvement'];
  } else if (/\b(ai|llm|machine learning|ml|generative|data scien|model)\b/i.test(combinedText)) {
    industry = 'AI & Data Platforms';
    domainContext = `${cleanName} builds intelligent systems where data quality, evaluation metrics, pipeline reliability, and ethical safety determine platform adoption.`;
    interviewStrategy = `Discuss model evaluation, handling unstructured data, minimizing hallucinations/errors, and production monitoring.`;
    values = ['Algorithmic Rigor', 'Model Safety & Quality', 'Scalable Systems', 'User Empathy', 'Data Discipline'];
  }

  // Extract explicit culture/value keywords from JD if present
  const explicitValues: string[] = [];
  const matches = description.matchAll(/(?:ownership|integrity|customer obsession|craft|empathy|excellence|transparency|curiosity|grit|collaboration|accountability|velocity|bias for action)/gi);
  for (const match of matches) {
    const word = match[0].charAt(0).toUpperCase() + match[0].slice(1).toLowerCase();
    if (!explicitValues.includes(word) && explicitValues.length < 3) {
      explicitValues.push(word);
    }
  }

  const finalValues = explicitValues.length > 0 
    ? Array.from(new Set([...explicitValues, ...values])).slice(0, 5)
    : values;

  return {
    id: slug,
    name: cleanName,
    values: finalValues,
    guidance: `Role-anchored guidance dynamically synthesized for ${cleanName} in ${industry}. Synthesized from active role specifications, operating domain expectations, and core evaluation criteria.`,
    sources: applyUrl ? [{ label: `${cleanName} Job Listing`, url: applyUrl }] : [],
    checkedOn: new Date().toISOString().slice(0, 10),
    isRoleAnchored: true,
    domainContext,
    interviewStrategy,
    industry,
  };
}
