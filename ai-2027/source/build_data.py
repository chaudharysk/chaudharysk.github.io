from pathlib import Path
import re, json, html

ROOT = Path(__file__).resolve().parent
source = (ROOT / "dist/assets/study-plan.md").read_text()

def inline(s):
    s = html.escape(s)
    s = re.sub(r'\[([^\]]+)\]\((https?://[^\s]+)\)', r'<a href="\2" target="_blank" rel="noopener noreferrer">\1<span class="external" aria-hidden="true"> ↗</span></a>', s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    return s

def markdown(text):
    lines = text.strip().splitlines()
    out = []
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue
        if line.startswith('#'):
            match = re.match(r'^(#+) (.+)', line)
            if match:
                level = max(2, min(4, len(match[1])-1))
                out.append(f'<h{level}>{inline(match[2])}</h{level}>')
                i += 1
                continue
        if line.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                cells = [x.strip() for x in lines[i].strip().strip('|').split('|')]
                if not all(re.match(r'^:?-+:?$', c) for c in cells):
                    rows.append(cells)
                i += 1
            head = ''.join('<th scope="col">'+inline(c)+'</th>' for c in rows[0])
            body = ''.join('<tr>'+''.join('<td>'+inline(c)+'</td>' for c in r)+'</tr>' for r in rows[1:])
            out.append('<div class="table-scroll" tabindex="0" aria-label="Scrollable reference table"><table><thead><tr>'+head+'</tr></thead><tbody>'+body+'</tbody></table></div>')
            continue
        if re.match(r'^(- |\d+\. )', line):
            ordered = bool(re.match(r'^\d+\.', line))
            tag = 'ol' if ordered else 'ul'
            items = []
            while i < len(lines) and re.match(r'^(- |\d+\. )', lines[i].strip()):
                item = re.sub(r'^(- |\d+\. )', '', lines[i].strip())
                items.append('<li>'+inline(item)+'</li>')
                i += 1
            out.append('<'+tag+'>'+''.join(items)+'</'+tag+'>')
            continue
        paragraph = [line]
        i += 1
        while i < len(lines) and lines[i].strip() and not re.match(r'^(#|\||- |\d+\. )', lines[i].strip()):
            paragraph.append(lines[i].strip())
            i += 1
        out.append('<p>'+inline(' '.join(paragraph))+'</p>')
    return '\n'.join(out)

sections = {}
for match in re.finditer(r'^## (\d+)\. (.+)\n([\s\S]*?)(?=^## \d+\. |\Z)', source, re.M):
    sections[int(match[1])] = {"title":match[2], "html":markdown(match[3])}

bands = [
    dict(id=1,title="Recover & orient",short="Find your footing.",hours=[20,30],intro="Bring your Python and maths back into focus while running your first model and collecting real examples.",foundations="Python, arrays, tensor shapes and a short diagnostic.",models="Tokens, messages, next-token prediction and existing models.",applications="A small document collection, literal search and a first model call.",output="A reproducible script and a record of three failures.",check=["Run your script again in a fresh session.","Explain a token, an embedding and a model's input and output.","Show three failures and identify the next small improvement."]),
    dict(id=2,title="Represent & predict",short="Give the basics a purpose.",hours=[80,110],intro="Connect probability and optimisation to language. Build simple baselines you can understand before adding complexity.",foundations="Probability, losses, gradients, train/dev/test splits, linear models and MLPs.",models="N-grams, TF-IDF, embeddings and encoder/decoder distinctions.",applications="Lexical retrieval, relevance labels and structured output.",output="A fair baseline comparison with an explained error analysis.",check=["Compare majority-class, TF-IDF and a small neural baseline on the same split.","Compute a confusion matrix and macro-F1 from saved predictions.","Explain a loss, check a gradient and deliberately overfit a tiny batch."]),
    dict(id=3,title="Understand transformers",short="Build the mechanism.",hours=[120,160],intro="Trace text through attention to a prediction. Train a tiny language model while your document assistant learns to retrieve evidence.",foundations="Chain rule, numerical stability, optimisation and batched matrix operations.",models="BPE, causal attention, decoder training, data checks and held-out loss.",applications="Dense retrieval, RAG, citations and missing-evidence handling.",output="A tiny language model and a measured grounded-QA baseline.",check=["Check causal masking and shifted labels; show training and validation curves.","Save and resume a training run and report held-out loss.","Separate retrieval failures from failures to use retrieved evidence."]),
    dict(id=4,title="Adapt & use tools",short="Make a model useful.",hours=[100,140],intro="Adapt a small existing model for a narrow task. In parallel, give your assistant a few carefully bounded tools.",foundations="Uncertainty, KL intuition, regularisation and controlled comparisons.",models="Data curation, instruction tuning, LoRA, chat templates and regressions.",applications="A Python tool loop, schema validation, state and recovery.",output="An SFT comparison and a reliable single-agent trace.",check=["Inspect the supervised token mask, count trainable parameters and reload an adapter.","Compare the starting model, prompting and SFT on the same task.","Recover from a failed tool call and stop within a defined budget."]),
    dict(id=5,title="Learn from feedback",short="Understand the reward.",hours=[100,140],intro="Study preferences and reinforcement learning through small experiments. Test whether a better reward actually means a better result.",foundations="MDPs, expected return, policy gradients and preference likelihoods.",models="A reward-model exercise, DPO, RLHF/PPO/GRPO and toy RL.",applications="Workflow versus agent comparisons, context control and reliability.",output="A preference comparison and a verifier failure analysis.",check=["Run a toy policy-gradient update and a small DPO comparison.","Work through PPO clipping and GRPO group advantages on small examples.","Try to exploit a verifier; report reward, independent task quality and regressions."]),
    dict(id=6,title="Integrate & investigate",short="Make the evidence count.",hours=[120,180],intro="Choose one question, measure one meaningful comparison and package a system that someone else can run.",foundations="Paired inference, calibration, effect size and experimental design.",models="A focused frontier question and architecture/inference trade-offs.",applications="Profiling, a small service, a regression suite and your capstone.",output="A reproducible result, honest limitations and a usable demo.",check=["State a hypothesis, baseline, primary outcome and informative ablation.","Report uncertainty, resource use and a labelled failure analysis.","Provide a runnable demo, environment, data notes and reproduction instructions."])
]
for b in bands:
    b['html'] = sections[b['id']+3]['html']

def resource(id,title,author,url,lane,kind,bands,assignment,finish):
    return dict(id=id,title=title,author=author,url=url,lane=lane,kind=kind,bands=bands,assignment=assignment,finish=finish)

resources = [
resource("pytorch","Learn the Basics","PyTorch","https://docs.pytorch.org/tutorials/beginner/basics/intro.html","foundations","Core route",[1,2],"Tensors, data loaders, model building, autograd, optimisation, saving and loading.","Write and debug a small training loop without copying the whole example."),
resource("karpathy","Neural Networks: Zero to Hero","Andrej Karpathy","https://github.com/karpathy/nn-zero-to-hero","models","Core route",[2,3],"Micrograd; initial makemore bigram and MLP lessons; Let's build GPT; tokenizer lesson for BPE.","Rebuild the central calculations and your tiny decoder. Use extra lessons for specific gaps."),
resource("slp","Speech and Language Processing","Dan Jurafsky & James H. Martin","https://web.stanford.edu/~jurafsky/slp3/","models","Core route",[1,2,3,4,5],"Selected chapters 2–8 and 11 in the August 2026 draft; chapter 9 for masked models.","Use the chapter connected to your current build. Explain the mechanism with an example."),
resource("hfllm","The LLM Course","Hugging Face","https://huggingface.co/learn/llm-course/chapter1/1","models","Core route",[1,2,3,4,5],"Chapters 1–3, 5–6; one chapter 7 classification example; selected chapters 10–11. Chapter 12 later.","Load and inspect models, datasets and tokenizers; complete a small fine-tuning experiment."),
resource("agents","AI Agents Course","Hugging Face","https://huggingface.co/learn/agents-course/en/unit0/introduction","applications","Core route",[4,5],"Unit 1, one useful framework from Unit 2, relevant RAG and evaluation material.","Build a Python loop first. Recover from errors, keep a trace and stop within budget."),
resource("rl","Spinning Up: RL Concepts","OpenAI","https://spinningup.openai.com/en/latest/spinningup/rl_intro.html","models","Core route",[5],"States, actions, rewards, policies and returns; continue to the policy-optimisation notes.","Explain and implement a small policy-gradient update. The old full software stack is unnecessary."),
resource("mml","Mathematics for Machine Learning","Deisenroth, Faisal & Ong","https://mml-book.com","foundations","Reference",[1,2,3,4],"Relevant parts of chapters 2–3 and 5–7; chapter 4 for decomposition/PCA intuition.","Trace shapes, calculate a gradient and explain cosine similarity."),
resource("stat110","Statistics 110","Harvard · Joe Blitzstein","https://stat110.hsites.harvard.edu/","foundations","Reference",[2,4,6],"Conditional probability, random variables, expectation and variance. Use practice problems.","Solve a Bayes problem, then simulate it; return only for specific weak topics."),
resource("islp","Statistical Learning with Python","James, Witten, Hastie, Tibshirani & Taylor","https://www.statlearning.com/","foundations","Reference",[2,4,6],"Chapter 2; selected chapters 3–6 for regression, classification, resampling and regularisation.","Fit a baseline, identify leakage and compare matched predictions with uncertainty."),
resource("retrieval","Retrieve & Re-Rank","Sentence Transformers","https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html","applications","Practical guide",[2,3],"Lexical and bi-encoder retrieval, then cross-encoder reranking if justified.","Compare retrievers on the same labelled queries before adding another component."),
resource("peft","Efficient adaptation & quantisation","Hugging Face · PEFT","https://huggingface.co/docs/peft/developer_guides/quantization","models","Practical guide",[4],"Frozen base weights, adapters, quantisation and the full memory budget.","Count trainable parameters and measure memory with a minimal run."),
resource("sft","SFT Trainer","Hugging Face · TRL","https://huggingface.co/docs/trl/sft_trainer","models","Practical guide",[4],"Data formats, chat templates, assistant/completion loss masking and adapter integration.","Inspect the real masks and compare task quality and regressions on held-out examples."),
resource("dpo","DPO Trainer","Hugging Face · TRL","https://huggingface.co/docs/trl/dpo_trainer","models","Practical guide",[5],"Preference pairs, completion log-probabilities, the reference policy and a bounded training run.","Compare starting, SFT and DPO checkpoints on a frozen evaluation specification."),
resource("evals","Demystifying evals for AI agents","Anthropic","https://www.anthropic.com/research/demystifying-evals-for-ai-agents","applications","Practical guide",[3,4,5,6],"Task outcomes, credible graders, repeated trials and evaluation development.","Build a small task suite with explicit rubrics and inspect grader disagreements."),
resource("vllm","Inference & serving","vLLM","https://docs.vllm.ai/en/latest/","applications","Reference",[6],"Relevant serving, profiling, caching and batching sections.","Measure quality, memory and end-to-end latency. A specific serving stack is optional."),
resource("raschka","Build an LLM from Scratch","Sebastian Raschka","https://github.com/rasbt/LLMs-from-scratch","models","Alternative",[2,3,4],"Chapters 2–5 instead of the equivalent Karpathy implementation; chapter 7 for instruction tuning.","Choose this written route when it suits you. Public code; the book is separate."),
resource("mit","Introduction to Deep Learning","MIT · 6.S191","https://introtodeeplearning.com/","foundations","Alternative",[2,3,6],"Selected neural-network, sequence, vision or generative-model lectures.","Replace an equivalent explanation rather than adding another full course."),
resource("cs224n","NLP with Deep Learning","Stanford · CS224N","https://web.stanford.edu/class/cs224n/","models","Extension",[3,6],"Selected embeddings, attention or NLP-task lectures. The page links public 2024 videos.","Use targeted depth; the 2026 recordings require enrolled-student access."),
resource("cs336","Language Modeling from Scratch","Stanford · CS336","https://cs336.stanford.edu/","models","Extension",[3,5,6],"Selected basics, data, scaling or alignment material after the corresponding competency check.","Full systems and distributed assignments are a later specialisation.")
]
data = dict(bands=bands,resources=resources,sections=sections)
(ROOT/'dist/assets/data.js').write_text('window.COURSE = '+json.dumps(data,ensure_ascii=False)+';\n')
print(json.dumps({"bands":len(bands),"resources":len(resources),"reference_sections":len(sections)}))
