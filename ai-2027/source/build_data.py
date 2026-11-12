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

bands = [{'id': 1,
  'title': 'Python and maths refresher',
  'short': 'Python and maths',
  'hours': [20, 30],
  'intro': 'Check what you remember from Python and maths. Set up PyTorch, run a model and look at its '
           'inputs and outputs.',
  'foundations': 'Python, arrays, tensor shapes and a few maths exercises.',
  'models': 'Tokens, messages and next-token prediction. Run an existing model.',
  'applications': 'Collect a few documents, search them and make a model call.',
  'output': 'A script you can run again, with notes on three things it gets wrong.',
  'check': ['Run your script in a fresh session.',
            'Explain what a token and an embedding are. Show the model input and output.',
            'Show three things that went wrong and explain what you would try next.']},
 {'id': 2,
  'title': 'Machine learning and NLP basics',
  'short': 'ML and NLP basics',
  'hours': [80, 110],
  'intro': 'Learn how a model makes predictions and how training changes them. Start with simple text '
           'classifiers and compare their mistakes.',
  'foundations': 'Probability, gradients, loss functions, data splits, linear models and neural networks.',
  'models': 'N-grams, TF-IDF, embeddings, encoders and decoders.',
  'applications': 'Search documents by keyword, label relevant results and define an output format.',
  'output': 'A comparison of simple text classifiers, with an explanation of their errors.',
  'check': ['Compare a majority-class predictor, TF-IDF and a small neural model on the same data split.',
            'Calculate a confusion matrix and macro-F1 from saved predictions.',
            'Explain the loss, check a gradient and make a model overfit a tiny batch.']},
 {'id': 3,
  'title': 'Build a language model',
  'short': 'Build a language model',
  'hours': [120, 160],
  'intro': 'Write a small transformer and train it to predict the next token. At the same time, add document '
           'retrieval to your assistant.',
  'foundations': 'The chain rule, matrix operations, optimisation and numerical stability.',
  'models': 'BPE tokenisation, causal attention, decoder training and validation loss.',
  'applications': 'Embedding search, RAG, source citations and handling missing information.',
  'output': 'A small trained language model and a document assistant with measured results.',
  'check': ['Check the causal mask and shifted labels. Plot training and validation loss.',
            'Save a checkpoint, resume training and measure loss on held-out data.',
            'For wrong answers, check whether retrieval failed or the model misused a retrieved source.']},
 {'id': 4,
  'title': 'Fine-tuning and agents',
  'short': 'Fine-tuning and agents',
  'hours': [100, 140],
  'intro': 'Fine-tune a small model on one task. Give your assistant a few tools, then test what happens '
           'when a tool fails.',
  'foundations': 'KL divergence, regularisation, confidence intervals and fair comparisons.',
  'models': 'Training data, SFT, LoRA, chat templates and checks for worse performance.',
  'applications': 'A Python tool loop, argument validation, saved state and error handling.',
  'output': 'An SFT experiment and an agent that handles failed tool calls.',
  'check': ['Inspect which tokens contribute to the loss. Count trainable parameters and reload an adapter.',
            'Compare the starting model, a prompt-only version and SFT on the same task.',
            'Handle a failed tool call and stop at the step or cost limit you set.']},
 {'id': 5,
  'title': 'RLHF and reinforcement learning',
  'short': 'RLHF and RL',
  'hours': [100, 140],
  'intro': 'Start with a small reinforcement-learning problem. Then train on response preferences and check '
           'whether a higher reward means better answers.',
  'foundations': 'States, actions, rewards, expected return, policy gradients and preference likelihoods.',
  'models': 'Reward models, DPO, RLHF, and small PPO and GRPO calculations.',
  'applications': 'Compare a fixed workflow with an agent. Test memory and repeated tool failures.',
  'output': 'A DPO comparison, a toy RL run and examples of a reward checker getting things wrong.',
  'check': ['Run a toy policy-gradient experiment and a small DPO experiment.',
            'Calculate PPO clipping and GRPO advantages on small examples.',
            'Try to fool a reward checker. Compare the reward with independently checked task success.']},
 {'id': 6,
  'title': 'Evaluation and a final project',
  'short': 'Evaluation and final project',
  'hours': [120, 180],
  'intro': 'Choose one question from your earlier work. Run a fair comparison, write up the results and make '
           'the code easy for someone else to run.',
  'foundations': 'Paired comparisons, calibration, effect size and experimental design.',
  'models': 'One research question, model design choices and inference costs.',
  'applications': 'Measure speed and memory, serve a small system and finish your project.',
  'output': 'Working code, a results table, an error analysis and instructions for running it.',
  'check': ['Write down your question, baseline and main metric. Change one component to see what it adds.',
            'Report uncertainty, resource use and the kinds of errors you found.',
            'Provide the code, environment, data notes and commands needed to reproduce the result.']}]
for b in bands:
    b['html'] = sections[b['id']+3]['html']

def resource(id,title,author,url,lane,kind,bands,assignment,finish):
    return dict(id=id,title=title,author=author,url=url,lane=lane,kind=kind,bands=bands,assignment=assignment,finish=finish)

resources = [
resource("pytorch","Learn the Basics","PyTorch","https://docs.pytorch.org/tutorials/beginner/basics/intro.html","foundations","Main material",[1,2],"Tensors, data loaders, model building, autograd, optimisation, saving and loading.","Write and debug a small training loop without copying the whole example."),
resource("karpathy","Neural Networks: Zero to Hero","Andrej Karpathy","https://github.com/karpathy/nn-zero-to-hero","models","Main material",[2,3],"Micrograd; initial makemore bigram and MLP lessons; Let's build GPT; tokenizer lesson for BPE.","Write the calculations yourself, then build the small decoder. Use extra lessons when something is unclear."),
resource("slp","Speech and Language Processing","Dan Jurafsky & James H. Martin","https://web.stanford.edu/~jurafsky/slp3/","models","Main material",[1,2,3,4,5],"Selected chapters 2–8 and 11 in the August 2026 draft; chapter 9 for masked models.","Read the chapter for the topic you are working on. Explain it with a small example."),
resource("hfllm","The LLM Course","Hugging Face","https://huggingface.co/learn/llm-course/chapter1/1","models","Main material",[1,2,3,4,5],"Chapters 1–3, 5–6; one chapter 7 classification example; selected chapters 10–11. Chapter 12 later.","Load and inspect models, datasets and tokenizers; complete a small fine-tuning experiment."),
resource("agents","AI Agents Course","Hugging Face","https://huggingface.co/learn/agents-course/en/unit0/introduction","applications","Main material",[4,5],"Unit 1, one useful framework from Unit 2, relevant RAG and evaluation material.","Write the loop in Python first. Log tool calls, handle errors and set a step limit."),
resource("rl","Spinning Up: RL Concepts","OpenAI","https://spinningup.openai.com/en/latest/spinningup/rl_intro.html","models","Main material",[5],"States, actions, rewards, policies and returns; continue to the policy-optimisation notes.","Calculate a policy-gradient update, then implement it. You do not need to install the old software stack."),
resource("mml","Mathematics for Machine Learning","Deisenroth, Faisal & Ong","https://mml-book.com","foundations","Reference",[1,2,3,4],"Relevant parts of chapters 2–3 and 5–7; chapter 4 for decomposition/PCA intuition.","Work out matrix shapes, calculate a gradient and explain cosine similarity."),
resource("stat110","Statistics 110","Harvard · Joe Blitzstein","https://stat110.hsites.harvard.edu/","foundations","Reference",[2,4,6],"Conditional probability, random variables, expectation and variance. Use practice problems.","Solve a Bayes problem, then check it with a simulation. Read more when you need it."),
resource("islp","Statistical Learning with Python","James, Witten, Hastie, Tibshirani & Taylor","https://www.statlearning.com/","foundations","Reference",[2,4,6],"Chapter 2; selected chapters 3–6 for regression, classification, resampling and regularisation.","Train a baseline, check for data leakage and estimate uncertainty when comparing predictions."),
resource("retrieval","Retrieve & Re-Rank","Sentence Transformers","https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html","applications","Practical guide",[2,3],"Lexical and bi-encoder retrieval, then cross-encoder reranking if justified.","Compare retrievers on the same labelled queries before adding another component."),
resource("peft","Efficient adaptation & quantisation","Hugging Face · PEFT","https://huggingface.co/docs/peft/developer_guides/quantization","models","Practical guide",[4],"Frozen base weights, adapters, quantisation and the full memory budget.","Count trainable parameters and measure memory with a minimal run."),
resource("sft","SFT Trainer","Hugging Face · TRL","https://huggingface.co/docs/trl/sft_trainer","models","Practical guide",[4],"Data formats, chat templates, assistant/completion loss masking and adapter integration.","Inspect the loss masks. Test on held-out examples and check which tasks got better or worse."),
resource("dpo","DPO Trainer","Hugging Face · TRL","https://huggingface.co/docs/trl/dpo_trainer","models","Practical guide",[5],"Preference pairs, completion log-probabilities, the reference policy and one small training run.","Compare the starting, SFT and DPO models on the same test cases, with the same grading rules."),
resource("evals","Demystifying evals for AI agents","Anthropic","https://www.anthropic.com/research/demystifying-evals-for-ai-agents","applications","Practical guide",[3,4,5,6],"Task success, grading rules, repeated trials and test cases.","Write a small set of tasks with clear grading rules. Check cases where graders disagree."),
resource("vllm","Inference & serving","vLLM","https://docs.vllm.ai/en/latest/","applications","Reference",[6],"Relevant serving, profiling, caching and batching sections.","Measure quality, memory and end-to-end latency. A specific serving stack is optional."),
resource("raschka","Build an LLM from Scratch","Sebastian Raschka","https://github.com/rasbt/LLMs-from-scratch","models","Alternative",[2,3,4],"Chapters 2–5 instead of the equivalent Karpathy implementation; chapter 7 for instruction tuning.","Choose this written route when it suits you. Public code; the book is separate."),
resource("mit","Introduction to Deep Learning","MIT · 6.S191","https://introtodeeplearning.com/","foundations","Alternative",[2,3,6],"Selected neural-network, sequence, vision or generative-model lectures.","Replace an equivalent explanation rather than adding another full course."),
resource("cs224n","NLP with Deep Learning","Stanford · CS224N","https://web.stanford.edu/class/cs224n/","models","Extension",[3,6],"Selected embeddings, attention or NLP-task lectures. The page links public 2024 videos.","Pick the lectures you need. The 2026 recordings require enrolled-student access."),
resource("cs336","Language Modeling from Scratch","Stanford · CS336","https://cs336.stanford.edu/","models","Extension",[3,5,6],"Selected basics, data, scaling or alignment lessons after you can do the exercises for that topic.","Leave the full systems and distributed-training assignments until after the main course.")
]
data = dict(bands=bands,resources=resources,sections=sections)
(ROOT/'dist/assets/data.js').write_text('window.COURSE = '+json.dumps(data,ensure_ascii=False)+';\n')
print(json.dumps({"bands":len(bands),"resources":len(resources),"reference_sections":len(sections)}))
