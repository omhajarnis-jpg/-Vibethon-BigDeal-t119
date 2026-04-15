import { useState } from "react";
import { Code2, Play, RotateCcw, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import MentorBubble from "@/components/MentorBubble";

const sampleScripts = [
  {
    label: "Hello ML",
    code: `print("Hello Machine Learning")`,
  },
  {
    label: "List Operations",
    code: `data = [10, 20, 30, 40, 50]
total = sum(data)
average = total / len(data)
print("Data:", data)
print("Sum:", total)
print("Average:", average)`,
  },
  {
    label: "Simple Classifier",
    code: `# Simple rule-based classifier
def classify_fruit(color, size):
    if color == "red" and size == "small":
        return "Cherry"
    elif color == "red" and size == "large":
        return "Apple"
    elif color == "yellow":
        return "Banana"
    else:
        return "Unknown"

fruits = [
    ("red", "large"),
    ("yellow", "medium"),
    ("red", "small"),
    ("green", "large"),
]

for color, size in fruits:
    result = classify_fruit(color, size)
    print(f"Color={color}, Size={size} => {result}")`,
  },
  {
    label: "Train/Test Split",
    code: `import random

# Simulated dataset
dataset = list(range(1, 101))
random.shuffle(dataset)

split = int(len(dataset) * 0.8)
train = dataset[:split]
test = dataset[split:]

print(f"Total samples: {len(dataset)}")
print(f"Training set: {len(train)} samples")
print(f"Test set: {len(test)} samples")
print(f"Train[:5]: {sorted(train[:5])}")
print(f"Test[:5]: {sorted(test[:5])}")`,
  },
];

// Simple Python interpreter simulation
function simulatePython(code: string): string {
  const lines = code.split("\n");
  const output: string[] = [];
  const vars: Record<string, unknown> = {};

  function evalExpr(expr: string): unknown {
    expr = expr.trim();
    // Replace variable references
    for (const [k, v] of Object.entries(vars)) {
      const regex = new RegExp(`\\b${k}\\b`, "g");
      if (typeof v === "string") {
        expr = expr.replace(regex, `"${v}"`);
      } else if (Array.isArray(v)) {
        expr = expr.replace(regex, JSON.stringify(v));
      } else {
        expr = expr.replace(regex, String(v));
      }
    }
    try {
      // eslint-disable-next-line no-eval
      return eval(expr);
    } catch {
      return expr.replace(/^["']|["']$/g, "");
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || line.startsWith("import ") || line.startsWith("from ")) continue;
    if (line.startsWith("def ") || line.startsWith("for ") || line.startsWith("if ") || line.startsWith("elif ") || line.startsWith("else") || line.startsWith("return ")) continue;

    // Handle print statements
    const printMatch = line.match(/^print\s*\((.*)\)\s*$/);
    if (printMatch) {
      let content = printMatch[1];
      // Handle f-strings simply
      content = content.replace(/f"([^"]*)"/, (_, inner) => {
        return '"' + inner.replace(/\{([^}]+)\}/g, (__, expr) => String(evalExpr(expr))) + '"';
      });
      // Handle multiple arguments
      const parts = [];
      let current = "";
      let depth = 0;
      let inStr = false;
      let strChar = "";
      for (let i = 0; i < content.length; i++) {
        const ch = content[i];
        if (inStr) {
          current += ch;
          if (ch === strChar) inStr = false;
        } else if (ch === '"' || ch === "'") {
          inStr = true;
          strChar = ch;
          current += ch;
        } else if (ch === "(" || ch === "[") {
          depth++;
          current += ch;
        } else if (ch === ")" || ch === "]") {
          depth--;
          current += ch;
        } else if (ch === "," && depth === 0) {
          parts.push(current.trim());
          current = "";
        } else {
          current += ch;
        }
      }
      if (current.trim()) parts.push(current.trim());

      const resolved = parts.map((p) => {
        const val = evalExpr(p);
        if (typeof val === "string" && (p.startsWith('"') || p.startsWith("'"))) return val;
        if (Array.isArray(val)) return JSON.stringify(val).replace(/,/g, ", ");
        return String(val);
      });
      output.push(resolved.join(" "));
      continue;
    }

    // Handle assignment
    const assignMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
    if (assignMatch) {
      const [, varName, valExpr] = assignMatch;
      // Handle list literal
      if (valExpr.trim().startsWith("[")) {
        try {
          vars[varName] = evalExpr(valExpr);
        } catch {
          vars[varName] = valExpr;
        }
      } else {
        vars[varName] = evalExpr(valExpr);
      }
    }
  }

  if (output.length === 0) {
    return "✅ Code executed successfully (no output)";
  }
  return output.join("\n");
}

const Playground = () => {
  const [code, setCode] = useState(sampleScripts[0].code);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setOutput("");
    // Simulate execution delay
    setTimeout(() => {
      try {
        const result = simulatePython(code);
        setOutput(result);
      } catch (err) {
        setOutput(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
      setIsRunning(false);
    }, 500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="font-heading text-3xl font-black text-center mb-2">
          <Code2 className="inline mr-2 text-primary" size={28} />
          Coding Playground
        </h1>
        <p className="text-center text-muted-foreground mb-6 font-semibold">Write and run Python code</p>

        <MentorBubble message="Try modifying the code and hit Run! Experiment to learn faster. 🚀" className="mb-6" />

        {/* Sample scripts */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {sampleScripts.map((s) => (
            <button
              key={s.label}
              onClick={() => { setCode(s.code); setOutput(""); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border border-border ${
                code === s.code ? "bg-primary text-primary-foreground" : "bg-card hover:bg-doraemon-light-blue text-muted-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Editor */}
          <motion.div
            className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center justify-between bg-muted px-4 py-2 border-b border-border">
              <span className="text-xs font-bold text-muted-foreground">📝 Editor — Python</span>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="text-muted-foreground hover:text-primary transition-colors">
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
                <button onClick={() => { setCode(""); setOutput(""); }} className="text-muted-foreground hover:text-accent transition-colors">
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-72 bg-[#1e1e2e] text-[#cdd6f4] font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
              placeholder="# Write your Python code here..."
            />
          </motion.div>

          {/* Output */}
          <motion.div
            className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center justify-between bg-muted px-4 py-2 border-b border-border">
              <span className="text-xs font-bold text-muted-foreground">📤 Output</span>
              {isRunning && <span className="text-xs font-bold text-primary animate-pulse">Running...</span>}
            </div>
            <pre className="w-full h-72 bg-[#1e1e2e] text-[#a6e3a1] font-mono text-sm p-4 overflow-auto whitespace-pre-wrap">
              {output || "Click 'Run' to execute your code..."}
            </pre>
          </motion.div>
        </div>

        {/* Run button */}
        <div className="mt-4 text-center">
          <button
            onClick={handleRun}
            disabled={isRunning || !code.trim()}
            className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:hover:translate-y-0"
          >
            <Play size={16} />
            {isRunning ? "Running..." : "Run Code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Playground;
