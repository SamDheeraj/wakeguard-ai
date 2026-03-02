export const generateResearchTitle = (id: number) => {
    const prefixes = ["Neural", "Synaptic", "Chronobiological", "Cognitive", "Sensory", "Autonomous", "Predictive"];
    const subjects = ["Fatigue", "Vigilance", "Response Latency", "Micro-expression", "Ocular Stability", "Circadian Drift"];
    const suffixes = ["Analysis", "Quantification", "Modeling", "Optimization", "Detection", "Synthesis"];

    const p = prefixes[id % prefixes.length];
    const s = subjects[(id * 2) % subjects.length];
    const suf = suffixes[(id * 3) % suffixes.length];

    return `${p} ${s} ${suf}: Protocol ${id + 2000}`;
};

export const generateAbstract = (id: number) => {
    const templates = [
        "This study explores the correlation between {A} and {B} in high-stress environments.",
        "We present a novel algorithm for real-time detection of {A} using {B}.",
        "Analysis of {B} reveals significant anomalies in {A} patterns during extended wakefulness.",
        "Our findings suggest that {A} is a leading indicator of {B} failure."
    ];

    const termsA = ["ocular micro-tremors", "alpha wave suppression", "saccadic velocity", "pupillary unrest"];
    const termsB = ["neural network latency", "cognitive load", "systematic fatigue", "alertness decay"];

    let text = templates[id % templates.length];
    text = text.replace("{A}", termsA[id % termsA.length]);
    text = text.replace("{B}", termsB[(id + 1) % termsB.length]);

    return text;
};
