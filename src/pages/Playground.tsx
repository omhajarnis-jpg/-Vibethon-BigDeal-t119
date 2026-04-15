import { useState } from "react";
import { Code2, Play, RotateCcw, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import CharacterFeedback from "@/components/CharacterFeedback";

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
      content = content.replace(/f"([^"]*)"/, (_, inner) => {
        return '"' + inner.replace(/\{([^}]+)\}/g, (__, expr) => String(evalExpr(expr))) + '"';
      });
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
    <div className="min-h-screen py-10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <h1 className="font-heading text-4xl mb-3 font-black text-center text-primary drop-shadow-sm">
          <Code2 className="inline mr-3 -translate-y-1" size={40} />
          Coding Playground
        </h1>
        <p className="text-center text-primary/70 mb-10 font-bold text-lg">Write and run Python code instantly!</p>

        <div className="mb-8 flex justify-center">
          <CharacterFeedback character="doraemon" message="Try modifying the code and hit Run! Experimenting is the best way to learn! 🚀" />
        </div>

        {/* Sample scripts */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 justify-center">
          {sampleScripts.map((s) => (
            <button
              key={s.label}
              onClick={() => { setCode(s.code); setOutput(""); }}
              className={`px-5 py-2.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all border-4 shadow-sm hover:-translate-y-0.5 ${
                code === s.code ? "bg-primary border-primary text-white scale-[1.02] ring-2 ring-primary ring-offset-2" : "bg-white border-primary/20 text-primary hover:border-primary/50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Editor */}
          <motion.div
            className="bg-[#1E1E2E] rounded-3xl border-4 border-primary/20 shadow-xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center justify-between bg-[#11111B] px-5 py-3 border-b-2 border-white/10">
              <span className="text-xs font-black text-secondary tracking-wider uppercase">📝 Editor — Python</span>
              <div className="flex gap-4">
                <button onClick={handleCopy} className="text-white/50 hover:text-white transition-colors" title="Copy code">
                  {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                </button>
                <button onClick={() => { setCode(""); setOutput(""); }} className="text-white/50 hover:text-destructive transition-colors" title="Clear code">
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full flex-1 bg-transparent text-[#cdd6f4] font-mono text-sm sm:text-base p-6 resize-none focus:outline-none leading-relaxed"
              placeholder="# Write your Python code here..."
              style={{ minHeight: "350px" }}
            />
          </motion.div>

          {/* Output */}
          <motion.div
            className="bg-[#1E1E2E] rounded-3xl border-4 border-primary/20 shadow-xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center justify-between bg-[#11111B] px-5 py-3 border-b-2 border-white/10">
              <span className="text-xs font-black text-secondary tracking-wider uppercase">📤 Output</span>
              {isRunning && <span className="text-xs font-black text-secondary animate-pulse">Running...</span>}
            </div>
            <pre className="w-full flex-1 bg-transparent text-[#a6e3a1] font-mono text-sm sm:text-base p-6 overflow-auto whitespace-pre-wrap" style={{ minHeight: "350px" }}>
              {output || "Click 'Run Code' to see the output here..."}
            </pre>
          </motion.div>
        </div>

        {/* Run button */}
        <div className="mt-8 text-center pt-4">
          <button
            onClick={handleRun}
            disabled={isRunning || !code.trim()}
            className="inline-flex items-center justify-center gap-2 bg-success text-white px-10 py-4 rounded-3xl font-black text-xl hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 outline outline-2 outline-offset-2 outline-transparent hover:outline-success/50"
          >
            <Play size={24} />
            {isRunning ? "Executing..." : "Run Code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Playground;
