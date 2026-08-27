import fs from "fs"
import path from "path"

const DIR1 = path.resolve("../temp/leetcode-company-wise-problems-main")
const DIR2 = path.resolve("../temp/leetcode-companywise-interview-questions-master")

function extractSlug(link) {
  if (!link) return ""
  const match = link.trim().match(/\/problems\/([^/?#]+)/)
  return match ? match[1].toLowerCase() : ""
}

function parseCsvLine(text) {
  const result = []
  let cur = ""
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c === '"') {
      inQuotes = !inQuotes
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim())
      cur = ""
    } else {
      cur += c
    }
  }
  result.push(cur.trim())
  return result
}

function categorizeCompany(name) {
  const n = name.toLowerCase()
  if (["google", "meta", "amazon", "microsoft", "apple", "netflix"].includes(n)) return "big-tech"
  if (["citadel", "jane street", "two sigma", "de shaw", "goldman sachs", "bloomberg", "j.p. morgan", "morgan stanley", "optiver", "jump trading", "hudson river trading", "blackrock", "barclays", "bank of america", "drw", "worldquant", "tower research capital", "point72", "fidelity", "cme group", "sig", "squarepoint capital", "imc", "akuna capital", "virtu financial", "millennium", "bridgewater associates", "aqr capital management"].includes(n)) return "quant-finance"
  if (["stripe", "uber", "airbnb", "bytedance", "tiktok", "doordash", "snap", "pinterest", "palantir technologies", "coinbase", "robinhood", "snowflake", "databricks", "roblox", "figma", "notion", "brex", "instacart", "openai", "scale ai", "anthropic", "anduril", "rippling", "revolut", "chime", "bolt", "grab", "gojek", "swiggy", "zomato", "flipkart", "razorpay", "cred", "phonepe", "paytm", "meesho", "zepto", "blinkit"].includes(n)) return "unicorns"
  if (["salesforce", "oracle", "cisco", "adobe", "atlassian", "vmware", "intuit", "ibm", "servicenow", "sap", "paypal", "ebay", "x", "linkedin", "spotify", "twitter", "zoom", "twilio", "workday", "splunk", "intel", "amd", "nvidia", "qualcomm", "broadcom", "sony", "samsung", "siemens", "dell", "hp", "hpe", "walmart labs", "target", "shopify", "dropbox", "box", "reddit", "datadog", "cloudflare", "mongodb", "crowdstrike", "okta", "elastic", "hashicorp", "unity", "epic games", "electronic arts", "activision", "riot games", "infosys", "tcs", "wipro", "hcl", "cognizant", "accenture", "capgemini", "deloitte", "ey", "pwc", "kpmg", "mckinsey"].includes(n)) return "enterprise"
  return "other"
}

const DOMAIN_MAP = {
  "google": "google.com",
  "meta": "meta.com",
  "amazon": "amazon.com",
  "microsoft": "microsoft.com",
  "apple": "apple.com",
  "netflix": "netflix.com",
  "citadel": "citadel.com",
  "jane street": "janestreet.com",
  "two sigma": "twosigma.com",
  "de shaw": "deshaw.com",
  "goldman sachs": "goldmansachs.com",
  "bloomberg": "bloomberg.com",
  "j.p. morgan": "jpmorgan.com",
  "morgan stanley": "morganstanley.com",
  "stripe": "stripe.com",
  "uber": "uber.com",
  "airbnb": "airbnb.com",
  "bytedance": "bytedance.com",
  "tiktok": "tiktok.com",
  "openai": "openai.com",
  "anthropic": "anthropic.com",
  "databricks": "databricks.com",
  "snowflake": "snowflake.com",
  "palantir technologies": "palantir.com",
  "coinbase": "coinbase.com",
  "spotify": "spotify.com",
  "nvidia": "nvidia.com",
  "salesforce": "salesforce.com",
  "adobe": "adobe.com",
  "oracle": "oracle.com",
  "cisco": "cisco.com",
  "atlassian": "atlassian.com",
  "linkedin": "linkedin.com",
  "intel": "intel.com",
  "amd": "amd.com",
  "qualcomm": "qualcomm.com",
  "robinhood": "robinhood.com",
  "doordash": "doordash.com",
  "snap": "snap.com",
  "pinterest": "pinterest.com",
  "reddit": "reddit.com",
  "dropbox": "dropbox.com",
  "shopify": "shopify.com",
  "datadog": "datadoghq.com",
  "cloudflare": "cloudflare.com",
  "mongodb": "mongodb.com",
  "crowdstrike": "crowdstrike.com",
  "instacart": "instacart.com",
  "roblox": "roblox.com",
  "figma": "figma.com",
  "notion": "notion.so",
  "brex": "brex.com",
  "anduril": "anduril.com",
  "rippling": "rippling.com",
  "revolut": "revolut.com",
  "chime": "chime.com",
  "blackrock": "blackrock.com",
  "barclays": "barclays.com",
  "bank of america": "bankofamerica.com",
  "optiver": "optiver.com",
  "jump trading": "jumptrading.com",
  "hudson river trading": "hudsonrivertrading.com",
  "point72": "point72.com",
  "drw": "drw.com",
  "worldquant": "worldquant.com",
  "tower research capital": "tower-research.com",
  "fidelity": "fidelity.com",
  "cme group": "cmegroup.com",
  "sig": "sig.com",
  "squarepoint capital": "squarepoint-capital.com",
  "imc": "imc.com",
  "akuna capital": "akunacapital.com",
  "virtu financial": "virtu.com",
  "millennium": "mlp.com",
  "bridgewater associates": "bridgewater.com",
  "aqr capital management": "aqr.com"
}

function getDomain(name) {
  const n = name.toLowerCase().trim()
  for (const [key, d] of Object.entries(DOMAIN_MAP)) {
    if (n === key || n.includes(key)) return d
  }
  const clean = n.replace(/[^a-z0-9]/g, "")
  return `${clean}.com`
}

const companyMap = new Map()

function getOrCreateCompany(rawName) {
  const slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  if (!companyMap.has(slug)) {
    companyMap.set(slug, {
      name: rawName,
      slug,
      problems: new Map()
    })
  }
  return companyMap.get(slug)
}

// 1. Process Dir 1 (leetcode-company-wise-problems-main)
if (fs.existsSync(DIR1)) {
  for (const entry of fs.readdirSync(DIR1)) {
    const cdir = path.join(DIR1, entry)
    if (!fs.statSync(cdir).isDirectory()) continue
    const comp = getOrCreateCompany(entry)
    const files = [
      { file: "1. Thirty Days.csv", window: "30d" },
      { file: "2. Three Months.csv", window: "3m" },
      { file: "3. Six Months.csv", window: "6m" },
      { file: "4. More Than Six Months.csv", window: "1y" },
      { file: "5. All.csv", window: "all" }
    ]
    for (const { file, window } of files) {
      const fp = path.join(cdir, file)
      if (!fs.existsSync(fp)) continue
      const lines = fs.readFileSync(fp, "utf-8").split(/\r?\n/).filter(l => l.trim())
      for (let i = 1; i < lines.length; i++) {
        const parts = parseCsvLine(lines[i])
        if (parts.length < 5) continue
        const diffRaw = parts[0]?.toUpperCase() || "MEDIUM"
        const diff = diffRaw.includes("EASY") ? "Easy" : diffRaw.includes("HARD") ? "Hard" : "Medium"
        const title = parts[1] || ""
        const freq = parseFloat(parts[2]) || 50.0
        const acc = parts[3] || ""
        const link = parts[4] || ""
        const topicStr = parts[5] || "Algorithms"
        const primaryTopic = topicStr.split(",")[0].trim() || "Algorithms"
        const pSlug = extractSlug(link)
        if (!pSlug || !title) continue

        if (comp.problems.has(pSlug)) {
          const ex = comp.problems.get(pSlug)
          if (!ex.windows.includes(window)) ex.windows.push(window)
          if (freq > ex.frequencyScore) ex.frequencyScore = freq
        } else {
          comp.problems.set(pSlug, {
            problemId: 0,
            title,
            slug: pSlug,
            difficulty: diff,
            frequencyScore: freq,
            windows: [window],
            topic: primaryTopic,
            acceptanceRate: acc
          })
        }
      }
    }
  }
}

// 2. Process Dir 2 (leetcode-companywise-interview-questions-master)
if (fs.existsSync(DIR2)) {
  for (const entry of fs.readdirSync(DIR2)) {
    const cdir = path.join(DIR2, entry)
    if (!fs.statSync(cdir).isDirectory()) continue
    const formattedName = entry.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    const comp = getOrCreateCompany(formattedName)
    const files = [
      { file: "thirty-days.csv", window: "30d" },
      { file: "three-months.csv", window: "3m" },
      { file: "six-months.csv", window: "6m" },
      { file: "more-than-six-months.csv", window: "1y" },
      { file: "all.csv", window: "all" }
    ]
    for (const { file, window } of files) {
      const fp = path.join(cdir, file)
      if (!fs.existsSync(fp)) continue
      const lines = fs.readFileSync(fp, "utf-8").split(/\r?\n/).filter(l => l.trim())
      for (let i = 1; i < lines.length; i++) {
        const parts = parseCsvLine(lines[i])
        if (parts.length < 4) continue
        const pid = parseInt(parts[0]) || 0
        const link = parts[1] || ""
        const title = parts[2] || ""
        const diffRaw = parts[3]?.toUpperCase() || "MEDIUM"
        const diff = diffRaw.includes("EASY") ? "Easy" : diffRaw.includes("HARD") ? "Hard" : "Medium"
        const acc = parts[4] || ""
        const freqRaw = parts[5] || "50.0"
        const freq = parseFloat(freqRaw.replace("%", "")) || 50.0
        const pSlug = extractSlug(link)
        if (!pSlug || !title) continue

        if (comp.problems.has(pSlug)) {
          const ex = comp.problems.get(pSlug)
          if (pid > 0 && ex.problemId === 0) ex.problemId = pid
          if (!ex.windows.includes(window)) ex.windows.push(window)
          if (freq > ex.frequencyScore) ex.frequencyScore = freq
        } else {
          comp.problems.set(pSlug, {
            problemId: pid,
            title,
            slug: pSlug,
            difficulty: diff,
            frequencyScore: freq,
            windows: [window],
            topic: "Algorithms",
            acceptanceRate: acc
          })
        }
      }
    }
  }
}

// Build Normalized High-Performance Schema
const globalProblemMap = {} // slug -> [title, difficultyCode, topic, acceptanceRate, problemId]
const companyList = []

for (const comp of companyMap.values()) {
  const problems = Array.from(comp.problems.values()).sort((a, b) => b.frequencyScore - a.frequencyScore)
  if (problems.length === 0) continue

  const compProbs = []
  const topicCounts = new Map()

  for (const p of problems) {
    if (!globalProblemMap[p.slug]) {
      globalProblemMap[p.slug] = [
        p.title,
        p.difficulty === "Easy" ? "E" : p.difficulty === "Hard" ? "H" : "M",
        p.topic || "Algorithms",
        p.acceptanceRate || "",
        p.problemId || 0
      ]
    } else {
      if (p.problemId > 0 && globalProblemMap[p.slug][4] === 0) {
        globalProblemMap[p.slug][4] = p.problemId
      }
    }

    topicCounts.set(p.topic, (topicCounts.get(p.topic) || 0) + 1)
    compProbs.push([
      p.slug,
      Math.round(p.frequencyScore * 10) / 10,
      p.windows
    ])
  }

  const mostFrequentTopics = Array.from(topicCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(e => e[0])

  const category = categorizeCompany(comp.name)
  companyList.push({
    i: comp.slug,
    n: comp.name,
    s: comp.slug,
    c: category,
    d: getDomain(comp.name),
    t: mostFrequentTopics,
    p: compProbs
  })
}

companyList.sort((a, b) => {
  const catRank = { "big-tech": 4, "quant-finance": 3, "unicorns": 2, "enterprise": 1, "other": 0 }
  const rankDiff = (catRank[b.c] || 0) - (catRank[a.c] || 0)
  if (rankDiff !== 0) return rankDiff
  return b.p.length - a.p.length
})

const compactPayload = {
  p: globalProblemMap,
  c: companyList
}

const outDir = path.resolve("./lib")
fs.writeFileSync(path.join(outDir, "companies-dataset.json"), JSON.stringify(compactPayload))
console.log(`Successfully compiled compact dataset with ${companyList.length} companies and ${Object.keys(globalProblemMap).length} unique problems!`)
console.log("Wrote compact companies-dataset.json to", path.join(outDir, "companies-dataset.json"))
