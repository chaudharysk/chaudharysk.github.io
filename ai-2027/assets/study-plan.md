# Learn AI in 2027: A Parallel Path toward Expertise

2027 starting edition. Curriculum reviewed 11 November 2026; learning-path framing updated 12 November 2026.

For students who have studied engineering mathematics and used Python, but need to recover fluency. Study the foundations, language models and practical systems together, with statistics, evaluation and research woven through the work.

The core is a 540–760 active-hour route to solid implementation and evaluation skills. Then choose one specialisation and build depth through independent experiments, replication and feedback. Expertise is demonstrated through repeated good work and develops beyond a single course or calendar year.

Use the six learning bands below as the core curriculum. Section 17 explains how to start in 2027, extend the core and assess your progress toward independent expertise. The emphasis remains on course structure and materials; hours help control scope.

## 1. What parallel learning means here

Work on these three lanes together. Progress within a lane depends on understanding, while progress in another lane can continue independently.

| Parallel lane | What belongs here | Typical connection to the other lanes |
| --- | --- | --- |
| Foundations | Python, PyTorch, mathematics, probability, statistics, classical ML and optimisation | Learn a derivative while implementing a loss; learn sampling uncertainty while comparing systems. |
| Language models and training | NLP, tokens, embeddings, transformers, pretraining, SFT, preferences and RL | Explain mechanisms, implement small examples and adapt an existing model. |
| Applications and systems | Retrieval, RAG, tools, agents, inference, state and deployment | Build a useful system early, then measure whether added components help. |

Evaluation belongs in every lane. Research reading also runs throughout, initially as short guided reading and later as a small replication or critique. They remain essential subjects without becoming two more weekly course schedules.

**Parallel does not mean that every topic starts at full depth immediately.** You can build document search before deriving attention. You can use an existing model before training one. Policy optimisation needs gradients and probabilities; sophisticated agent orchestration needs a working single-agent baseline.

At any time, keep one main implementation task and one smaller exercise active. For example, while the main task is building a tiny transformer, the application lane might only compare two retrieval settings. This keeps all lanes moving without maintaining three demanding builds simultaneously.

### The expected depth

| Depth | Required topics |
| --- | --- |
| Implement and explain | Tensor operations; a small loss and gradient; classical text baseline; causal attention; a tiny decoder and training loop; a toy BPE tokenizer; evaluation metrics; a basic tool loop; a toy policy-gradient update. |
| Use, inspect and evaluate | Pretrained tokenizers and encoders; a small SFT/LoRA run; a small DPO run; retrieval and reranking libraries; structured outputs; checkpointing; a simple service. |
| Explain with a worked example | RLHF pipeline; reward modelling; PPO clipping; GRPO group advantages; KL regularisation; scaling trade-offs; KV cache; quantisation; distributed-training concepts; multimodal representations. |
| Optional implementation depth | Full LLM PPO/GRPO, large reward models, multiple agents, learned long-term memory, custom GPU kernels, distributed training, full benchmark suites and large-scale multimodal training. |

Using a mature library is appropriate for engineering tasks. For the mechanisms in the first row, reproduce the central calculation and explain it independently of a tutorial or coding assistant.

## 2. The teaching materials to actually follow

These are selected sections, not a list of entire courses to finish. The named assignment and its completion check determine when to stop reading.

### Default teaching route

| Resource | Assigned material | Use and stopping point |
| --- | --- | --- |
| [PyTorch: Learn the Basics](https://docs.pytorch.org/tutorials/beginner/basics/intro.html) | Tensors, datasets/data loaders, model building, autograd, optimisation, saving and loading. | The initial framework route. Stop when you can write and debug a small training loop without copying the complete example. |
| [Karpathy: Neural Networks — Zero to Hero](https://github.com/karpathy/nn-zero-to-hero) | Micrograd; initial makemore bigram and MLP lessons; later “Let's build GPT”. Use the tokenizer lesson for the BPE exercise. | The default implementation route. Rebuild small sections and do exercises. Additional makemore lessons are targeted help when gradients or training behaviour remain unclear. |
| [Jurafsky and Martin: Speech and Language Processing](https://web.stanford.edu/~jurafsky/slp3/) | Selected material from chapters 2–8 and 11 in the 19 August 2026 draft; chapter 9 for the masked-LM/encoder comparison. | The main NLP explanation. Use the chapter corresponding to the current build, rather than reading the book first. |
| [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/chapter1/1) | Chapters 1–3 and 5–6; one classification example from chapter 7; selected data curation and fine-tuning material from chapters 10–11. | The practical bridge to existing models and datasets. Chapter 12 is later reinforcement-learning support. Publishing and demo chapters are optional. |
| [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/en/unit0/introduction) | Unit 1; then one framework section from Unit 2 if useful; relevant agentic-RAG and evaluation material. | Start after basic Python and LLM messages make sense. First build the loop in Python. Completing every framework or certification challenge is unnecessary. |
| [Spinning Up: RL concepts](https://spinningup.openai.com/en/latest/spinningup/rl_intro.html) and [policy optimisation](https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html) | States/actions/rewards, policies, returns, policy gradients and baselines. | The conceptual RL route. Reimplement the small calculation in the current environment; installing the old full software stack is unnecessary. |

The SLP draft currently labels chapter 2 “Words and Tokens”, 3 “N-gram Language Models”, 4 “Logistic Regression and Text Classification”, 5 “Embeddings”, 6 “Neural Networks”, 7 “Transformers and Pretraining”, 8 “Post-training” and 11 “Information Retrieval and RAG”. Its agents chapter is not yet written, which is why a separate agent resource is used.

### References to open only when needed

| Need | Resource and selected material | Practical exercise |
| --- | --- | --- |
| Linear algebra, calculus and optimisation recovery | [Mathematics for Machine Learning](https://mml-book.com): relevant parts of chapters 2–3 and 5–7; chapter 4 only for decomposition/PCA intuition. | Trace matrix shapes, calculate a gradient, explain cosine similarity and run a simple optimiser. |
| Probability recovery | [Harvard Stat 110](https://stat110.hsites.harvard.edu/): conditional probability, random variables, expectation and variance; use the practice problems and solutions. | Solve a short Bayes problem, then simulate it. Use this when the mathematics reference alone is insufficient. |
| Statistical ML and inference | [An Introduction to Statistical Learning with Python](https://www.statlearning.com/): chapter 2; selected regression/classification, resampling and regularisation material in chapters 3–6. Later consult multiple testing. | Fit a baseline, identify leakage, compare matched predictions and explain the uncertainty. Trees/PCA are short breadth exercises. |
| Retrieval | [Sentence Transformers: Retrieve & Re-Rank](https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html) | Compare lexical retrieval, a bi-encoder and optional cross-encoder reranking on the same labelled queries. |
| Adaptation | [PEFT quantisation guide](https://huggingface.co/docs/peft/developer_guides/quantization), [TRL SFT](https://huggingface.co/docs/trl/sft_trainer) and [TRL DPO](https://huggingface.co/docs/trl/dpo_trainer) | Inspect the data format, masks, trainable parameters and reference policy; run one bounded experiment per method. |
| Agent design and evaluation | [Building effective agents](https://www.anthropic.com/research/building-effective-agents) and [Demystifying evals for AI agents](https://www.anthropic.com/research/demystifying-evals-for-ai-agents) | Choose a workflow or agent deliberately, then define observable task outcomes and credible graders. These are engineering reports, not course textbooks. |
| Inference and tool interoperability | [vLLM documentation](https://docs.vllm.ai/en/latest/) and [MCP introduction](https://modelcontextprotocol.io/docs/getting-started/intro) | Read the relevant serving or interface section after the basic system works. A particular server or protocol is not required for core completion. |

### Alternatives and later depth

Use [Raschka's LLMs-from-scratch repository](https://github.com/rasbt/LLMs-from-scratch), chapters 2–5, **instead of** the corresponding Karpathy tokenizer/transformer implementation route if you prefer written notebooks. Chapter 7 can support instruction tuning. The code is public; the accompanying book is separate. Do not complete both implementations unless repetition is addressing a specific weakness.

[MIT 6.S191](https://introtodeeplearning.com/) provides concise introductory and broader AI lectures. Use a selected explanation in place of an equivalent reading, especially for neural-network, vision or generative-model intuition.

[CS224N](https://web.stanford.edu/class/cs224n/) is a deeper NLP reference. Its official page links the public 2024 lecture videos; the 2026 recordings require enrolled-student access. Select an embeddings, attention or NLP-task lecture when needed.

[CS336](https://cs336.stanford.edu/) is the advanced continuation. Its full assignments are substantial work in their own right. During this core plan, consult selected basics, data, scaling or alignment material after the corresponding implementation gate. Full systems and distributed assignments belong in a later specialisation.

## 3. The parallel curriculum map

Each row is a learning band, not a fixed month or a requirement to stop every lane until the others catch up.

| Learning band | Foundations lane | Language-model lane | Applications lane | Evidence of progress |
| --- | --- | --- | --- | --- |
| 1. Recover and orient | Python, arrays, shapes, diagnostic problems | Tokens, messages, next-token prediction; run an existing model | Small document collection and a simple baseline | Reproducible script and clearly recorded failures |
| 2. Represent and predict | Probability, losses, train/dev/test, linear models and MLPs | N-grams, TF-IDF, embeddings, encoder/decoder distinctions | Lexical retrieval, relevance labels and structured output | Baseline comparison and an explained error analysis |
| 3. Understand transformers | Gradients, optimisation, tensor operations and numerical stability | BPE, causal attention, decoder training, data splits and held-out loss | Dense retrieval, RAG, citations and missing-evidence handling | Tiny LM plus a measured grounded-QA baseline |
| 4. Adapt and use tools | Uncertainty, KL intuition, regularisation and controlled comparisons | Data curation, instruction tuning, LoRA and behavioural regressions | A bounded tool loop, schema validation, state and recovery | SFT comparison and reliable single-agent trace |
| 5. Learn from feedback | MDPs, expected return, policy gradients, preference likelihoods | Reward-model exercise, DPO, RLHF/PPO/GRPO mechanisms and toy RL | Workflow versus agent comparison; budget and context control | Preference comparison and a verifier failure analysis |
| 6. Integrate and investigate | Paired inference, calibration, experimental design | A selected frontier question; inference and architecture trade-offs | Profiling, service, regression suite and capstone | Reproducible result, limitations and usable demonstration |

Research reading accompanies the current band. A newcomer can discuss what a paper claims before being able to derive every equation. Detailed replication waits until the underlying mechanism is understood.

### Dependencies that matter

| Before this work | Demonstrate this first | Work that can continue in parallel |
| --- | --- | --- |
| Training a transformer | Understand batched tensor shapes, shifted labels, cross-entropy and autograd; overfit a tiny batch. | Retrieval, dataset inspection and evaluation design |
| Fine-tuning a model | Understand the pretrained model's tokenizer/template and inspect the exact supervised tokens. | Tool design and statistical exercises |
| DPO training | Have a stable starting checkpoint and usable preference pairs; calculate completion log-probabilities correctly. | RAG improvements and RL concepts |
| Online LLM RL | Understand policy gradients; test the verifier; measure initial success and rollout cost. | Toy RL and critique of published experiments |
| Multiple agents or learned memory | Have a working single-agent baseline and tasks that require the extra component. | Reliability, deployment and capstone analysis |

A stable SFT checkpoint before DPO is the default teaching route here, not a claim that every DPO research setup must train a new SFT model first.

## 4. Learning band 1: Recover and orient

**Purpose:** make the first real experiment possible while identifying prerequisite gaps.

Begin with a roughly two-hour diagnostic. Multiply compatible matrices and state the output shape; differentiate a small scalar expression; solve a conditional-probability question; explain why test data cannot select hyperparameters; write a function that batches records and handles malformed input.

This is a placement exercise, not a score to optimise. Recover a weak topic through a short explanation, a worked example and an unfamiliar problem the next session. If Python functions, arrays or basic algebra are largely new, use a separate preparatory block; the time estimates later in this plan assume prior exposure.

| Lane | Study and do |
| --- | --- |
| Foundations | Use the PyTorch tensor and autograd basics. Recover Python functions, indexing, loops, files, JSON, exceptions, environments and basic Git use through the project. |
| Language models | Use SLP chapter 2 and HF introductory model/tokenizer material. Trace text to token IDs, embeddings, logits, probabilities and generated tokens at an introductory level. Distinguish a base model from an instruction-tuned model. |
| Applications | Choose a small collection of public technical documents. Run one model call and a simple literal-search baseline. Write 10–20 development questions with source IDs. |

**Completion check:** rerun the script in a fresh session, explain a token versus an embedding, show the model input/output and name three observed failures. No fine-tuning or agent framework is required yet.

Keep the document collection small enough to inspect manually. Use stable source versions and record permission/licence information. A local program can simulate tool calls while external model access is being set up.

## 5. Learning band 2: Represent and predict

**Purpose:** connect probability and optimisation to practical NLP before the transformer becomes a black box.

### Concepts to learn

- Linear/logistic regression, regularisation, bias/variance, supervised versus unsupervised learning, class imbalance and train/dev/test separation.
- Conditional probability, expectation, variance, likelihood, maximum likelihood and the intuition of Bayesian priors.
- Softmax, cross-entropy, minibatches, activations, embeddings and basic backpropagation.
- Unicode and bytes; words versus subword tokens; vocabulary and token IDs; padding and truncation.
- N-grams and smoothing intuition; bag-of-words, TF-IDF, BM25 and static versus contextual representations.
- What classification, NER, QA, summarisation and translation ask a model to predict. Recognise RNN/LSTM, encoder, decoder and encoder–decoder designs without implementing every family.

**Materials:** SLP chapters 3–6; Karpathy's micrograd and initial makemore/MLP lessons; PyTorch training-loop material; the relevant ISLP and mathematics exercises.

### Practical work

Choose one documented public text-classification dataset with a clear licence and a stable split. Begin with a modest subset for debugging. Keep the same split as models change; group by source/entity where examples are related.

Compare a majority-class predictor, TF-IDF with logistic regression and a small neural baseline. An embedding-plus-MLP classifier is sufficient; a large encoder is not necessary yet. Later, use one pretrained encoder example to understand transfer learning.

Implement stable softmax and cross-entropy on a small input. Check a gradient numerically, then compare it with autograd. Train a bigram model as a short language-modelling exercise; it need not become another polished portfolio project.

In the application lane, build lexical retrieval and label relevant sources for development queries. Define the output schema and record incorrect or unsupported answers.

For breadth, learn what tree models, k-means and PCA are good for. Inspect one short example if unfamiliar. Comprehensive classical ML is a separate course.

**Completion check:** explain why the baseline is fair, why a split is appropriate, what the loss optimises and which errors remain. From saved predictions, compute a confusion matrix and macro-F1. Overfit a tiny neural batch deliberately and explain why that is a debugging check, not evidence of generalisation.

## 6. Learning band 3: Understand transformers and grounded generation

**Purpose:** build the model mechanism while developing a useful application independently.

### Foundations and model work

Study the chain rule, matrix derivatives as needed, gradient flow, initialisation, residual paths, normalisation, Adam and learning-rate schedules. Learn enough numerical stability to recognise overflow, vanishing gradients and incorrect masking.

Follow the chosen implementation route through scaled dot-product attention, causal masking, multi-head attention, positional information, feed-forward layers and the decoder. Understand how modern choices such as RoPE, RMSNorm, gated MLPs and grouped-query attention differ from a basic teaching implementation; implementing all of them is optional.

Use a tiny BPE example to learn how merge rules are trained. Inspect English, Hindi, numbers and code. Explain why the same text can have different token counts under different tokenizers.

Train a **roughly 1–10 million parameter decoder** on a documented text subset. Start even smaller for debugging. These are suggested teaching scales, not guarantees of memory use or useful generation quality. A character tokenizer is acceptable for the first correct training run; the BPE exercise can remain separate.

**Materials:** SLP chapter 7; Karpathy “Let's build GPT”, or Raschka chapters 2–5; HF tokenizer/dataset sections. Read the mechanism sections of [Attention Is All You Need](https://arxiv.org/abs/1706.03762) alongside your implementation.

### Data and training checks

1. Inspect token IDs, labels, padding and loss masks directly.
2. Verify that the model cannot use future tokens to predict the current target.
3. Group exact and near-duplicate documents before assigning train/validation/test partitions; train a new tokenizer on training data only.
4. Keep final data out of tokenizer fitting, filter selection and hyperparameter selection. A fixed pretrained tokenizer is a different, recorded setup.
5. Save configuration, dataset version, model state, optimiser state and the information needed to resume training.
6. Compare one data or training choice while controlling the relevant budget. For a tokenizer comparison, token counts change: report raw text exposure and compute as well.

Inspect [FineWeb](https://arxiv.org/abs/2406.17557) for a data-filtering example and [Chinchilla](https://arxiv.org/abs/2203.15556) for compute/data/model trade-offs. The task is to explain the assumption behind an ablation, not recreate a web-scale dataset or fit a reliable scaling law from two tiny runs.

### Parallel application work

Use SLP chapter 11 and the Sentence Transformers retrieval guide to add a dense retriever. Compare it with the lexical baseline before assuming it is better. Then build retrieve-then-generate QA with source references and an explicit missing-evidence response.

Add a reranker only after measuring the simpler retrieval pipeline. Keep context length and query sets controlled when comparing systems.

**Completion check:** show training and validation curves; explain next-token label alignment; resume a run; report held-out token loss. For RAG, distinguish “the source was not retrieved” from “the model ignored or misused a retrieved source”. The tiny language model and the useful assistant can use different models.

## 7. Learning band 4: Adapt models and build a tool loop

**Purpose:** understand when changing weights helps, while learning how a model interacts with a system.

### Adaptation work

Choose a narrow, checkable task: structured extraction, response formatting, or a well-defined instruction task. Create or select a modest training dataset and inspect examples before increasing its size. A pilot of hundreds of examples can teach the pipeline; the amount needed for a useful improvement depends on the task and model.

Start from a small existing pretrained or instruction-tuned model suitable for the task. Record which kind it is. Your tiny decoder from the previous band is a mechanism exercise and may not be capable enough for useful instruction-following comparisons.

Study instruction data, chat templates, special tokens, sequence packing, assistant/completion loss masking, full fine-tuning versus adapters, LoRA, and the idea of a quantised frozen base. Use the [LoRA paper](https://arxiv.org/abs/2106.09685), selected SLP chapter 8 material, HF fine-tuning lessons and the PEFT/TRL guides.

Run one small SFT/LoRA experiment. Compare the starting checkpoint, a reasonable prompt-only baseline and the adapted checkpoint on the same task. Inspect unrelated-task regressions and output length. Do not interpret training-loss reduction as task improvement.

**Required checks:** inspect a token-level training example and its mask; count trainable parameters; save and reload the adapter; verify identical evaluation formatting. Current TRL's assistant-only loss relies on compatible chat-template support, so check the installed version and actual masks rather than assuming a flag is sufficient.

In the foundations lane, learn entropy, cross-entropy, KL divergence, confidence intervals and the difference between a measured effect and sampling noise. Apply them to an experiment you already ran.

Connect sampling variability to the intuition behind the law of large numbers and the central limit theorem. For the classifier, plot a reliability diagram and try temperature scaling only if probability estimates matter; fit the calibration step on development data and assess it on held-out data.

### Parallel agent work

Start with an explicit workflow: retrieve evidence, run a calculation when needed, then produce an answer. Next implement a plain-Python loop in which the model can choose a tool and react to its result.

Use only a few tools, such as document search, a calculator and a sandboxed file operation. Validate arguments, define timeouts and step limits, handle an empty result, and record tool calls and outcomes. Test whether a retried operation could accidentally repeat a state change.

Study the difference between fixed workflows and model-directed agents. Learn message roles, tool schemas, context selection, transient state and persistent storage. MCP is an interface topic; it is not an agent training method.

**Completion check:** the system handles a failed tool call, stops within its budget and reports what actually happened. An instruction embedded in retrieved content must not silently become permission to use a tool.

Include public or synthetic examples involving conflicting evidence, unsupported answers, malicious retrieved instructions and invalid tool arguments. Learn basic data privacy, secret handling and least-privilege tool design. Inspect relevant language or user-group slices and inappropriate refusals; a small teaching evaluation cannot establish universal fairness or safety.

Adding a framework is optional. If one helps, port the existing small loop to one framework and compare behaviour. Do not build three implementations merely to collect framework names.

## 8. Learning band 5: Preferences, RLHF and reliable agents

**Purpose:** understand feedback optimisation through manageable experiments.

### Reinforcement-learning foundations

Use Spinning Up to learn states, observations, actions, rewards, policies, returns, value functions, exploration, on-policy data and the policy-gradient idea. Implement REINFORCE on a tiny bandit or short decision task. Explain a baseline and how a reward changes an action's probability.

Add a small search/planning exercise or worked example to distinguish choosing actions with search from learning a policy. A full robotics or game-playing RL course is outside this core route.

### Preferences and reward

Inspect chosen/rejected response pairs. Decide what “preferred” means, check disagreement and examine whether length alone predicts the label. Separate prompt families across training, development and final testing.

Fit a small Bradley–Terry-style preference model using simple features or frozen representations. This teaches the likelihood and failure modes without requiring a second large trainable language model.

Read the pipeline and experimental setup in [InstructGPT](https://arxiv.org/abs/2203.02155). Trace demonstrations, preference labels, a learned reward model, policy optimisation and evaluation. Distinguish human feedback from AI-generated feedback and objective correctness checks.

### DPO

Work through the objective in the [DPO paper](https://arxiv.org/abs/2305.18290) and calculate a loss on a tiny pair by hand or in a short function. Understand why completion log-probabilities, the reference policy and the preference coefficient matter.

Run one bounded DPO experiment from the stable starting checkpoint, normally your SFT model. Reuse the same final evaluation specification and compare the starting, SFT and DPO variants where applicable. Record preference fit, task quality, response length and regressions. An apparent preference gain caused by longer answers is a result to investigate.

### PPO, GRPO and verifiable reward

Read [PPO's key equations and pseudocode](https://spinningup.openai.com/en/latest/algorithms/ppo.html). Compute a few clipped objective values for positive and negative advantages. Understand the role of the previous policy versus a separate reference policy; these are not interchangeable.

Study group-relative advantages in [DeepSeekMath](https://arxiv.org/abs/2402.03300), then selected training-recipe sections of [DeepSeek-R1](https://arxiv.org/abs/2501.12948). Use [TRL's GRPO guide](https://huggingface.co/docs/trl/grpo_trainer) as an implementation reference. Current trainer defaults and loss variants can differ from the original paper; record the actual settings.

Build a toy verifier for a narrow task with an unambiguous answer, and deliberately try malformed answers, correct formatting with wrong content and repeated guesses. Explain how a policy could optimise the checker while missing the intended task.

**Core completion:** a toy policy-gradient run, a preference/reward exercise, a small DPO run, worked PPO/GRPO calculations and a verifier audit. A full LLM PPO run and an online LLM GRPO training run are extensions. The original brief's RLHF and reasoning-training topics are still covered.

An optional LLM GRPO pilot needs a model that sometimes succeeds on the chosen task, a nontrivial reward signal and measured rollout costs. Groups with identical rewards can provide no useful within-group learning signal; scaling up a broken or all-zero-reward experiment is not a solution.

### Parallel agent work

Compare the fixed workflow with the single-agent loop. Use the same model and task suite and record total budgets. Test interruption, checkpoint/resume, stale context and repeated tool errors.

Introduce memory only for tasks where past interactions should help. Reset it between independent evaluation runs, or define a chronological evaluation protocol. Prevent evaluation answers from accumulating in memory across supposedly independent variants.

The two-agent extension requires a concrete hypothesis, such as independent evidence checking. Count both agents' tokens and time. Improvement should justify the coordination overhead.

## 9. Learning band 6: Systems, research and the final project

**Purpose:** turn the work into a usable, defensible result.

### Systems essentials

Learn the difference between prefill and decoding, weights and KV cache, latency and throughput, and active versus total MoE parameters. Explain mixed precision, quantisation, batching, activation checkpointing and gradient accumulation.

Profile one practical setting change, such as context length, batch size or quantisation. Measure quality as well as memory and time. Report input/output lengths, warm versus cold execution and the number of requests behind percentile estimates.

Understand data parallelism, parameter sharding and tensor/pipeline parallelism conceptually. Multi-GPU execution and custom FlashAttention kernels are optional. Use vLLM if it fits the environment; installing a large serving stack is not the learning objective.

Expose the assistant through a small local service or demonstration. Include input validation, bounded requests, reproducible configuration, useful error reporting and a regression check. A polished frontend is optional.

### Choose one capstone question

| Option | Main comparison | What must stay comparable |
| --- | --- | --- |
| Recommended: RAG versus a bounded tool-using assistant | Does a tool loop improve tasks requiring evidence and calculation? | Model version, question set, accessible sources and total resource ceiling |
| Adaptation | Does SFT or DPO improve a narrow behaviour over a well-designed prompt? | Starting model family, held-out task families, grading and generation settings |
| Test-time computation | Does extra sampling with a specified verifier improve the selected final answer? | Total sampling budget, task set and actual selection procedure |
| Memory extension | Does useful past experience help later tasks? | Chronological task stream, starting memory, memory-construction cost and evaluation protocol |

Use the existing project rather than starting a new application. State one hypothesis, one primary outcome, a credible baseline and one informative ablation. Register these in your project notes before the final comparison.

**Submission:** a runnable demo or command; a results table; uncertainty where justified; failure analysis; a short explanation of the mechanism; resource costs; and clear reproduction instructions. Inspect all failures if there are fewer than 20, otherwise a representative labelled sample of at least 20.

A negative result is acceptable when the implementation and comparison are sound. A working demo without a valid comparison is incomplete.

## 10. Keep these concepts separate

| Method | Main signal | What changes? | What the student should understand |
| --- | --- | --- | --- |
| Pretraining | Self-supervised prediction on a corpus | Model weights | Data, objective and compute jointly shape the resulting model. |
| Continued pretraining | Further corpus data | Model weights | Domain adaptation can also cause forgetting or regressions. |
| SFT | Demonstrated responses | Weights or adapters | The supervised target and masking matter. |
| RLHF | Human feedback, often converted into a reward signal | Depends on the recipe; commonly a reward model and then policy | Feedback provenance, reward quality and optimisation are separate design choices. |
| DPO | Preferred/rejected pairs | Policy weights or adapters | Standard offline DPO avoids a separately trained reward model and an online rollout loop. |
| RLAIF | AI feedback | Depends on the optimisation method | This describes feedback origin, not a single optimiser. |
| RLVR | Automatically verified outcomes | Policy weights | Verification defines the reward source; it can still be flawed. |
| GRPO | Groups of sampled responses and rewards | Policy weights | This is an optimisation approach, not a synonym for RLVR or all reasoning training. |
| Distillation | Teacher outputs, probabilities or trajectories | Student weights | A student can inherit teacher errors as well as useful behaviour. |
| RAG or external memory | Retrieved documents or stored information | Context and external storage | Knowledge access changes without necessarily changing weights. |
| Agent execution | Tool observations, state and model decisions | Context and possibly the environment | Running a tool loop is not automatically reinforcement learning. |
| Test-time computation | Additional sampling, search or verification | Usually computation and context | More work helps only if the task and selection method benefit. |

## 11. Statistics and scoring metrics

Learn a metric when it answers a question in the current project. Implement the small ones; use established implementations for complex metrics and understand their settings.

| Task | Core metrics | Interpretation to demonstrate |
| --- | --- | --- |
| Classification | Confusion matrix, accuracy, precision/recall and macro-F1 | Show class support and compare with the majority baseline. Choose a threshold on development data. |
| Ranking under imbalance | Precision–recall curve/average precision; ROC-AUC as a comparison | Prevalence and the cost of errors affect interpretation. State the precise score used. |
| Regression exercises | MAE and RMSE; R-squared awareness | Report units and a simple predictor. An R-squared value can be negative. |
| Language modelling | Token negative log-likelihood and perplexity | For mean natural-log loss L, perplexity is exp(L). Compare with compatible tokenizers, data, masking and context policies. |
| Retrieval | Recall@k; MRR or nDCG when relevant | Define relevance, document versus chunk units and treatment of unjudged items. |
| Grounded answers | Correctness, evidence support, citation correctness and abstention | A correct-looking answer with unrelated citations can still fail. Separate retrieval from synthesis. |
| Preference learning | Held-out preference accuracy, task quality, length and regressions | Preference fit does not establish general usefulness or safety. |
| RL/verifier work | Reward, independently checked success, output length and learning curves | Reward improvement can come from exploiting the checker. |
| Agents | Task completion, final-state correctness, repeatability, tool failures and boundary violations | A claimed success in the final message is insufficient if the action failed. |
| Confidence | Brier score or log loss, reliability diagram; calibration-error awareness | Token probability and verbal confidence are not automatically probabilities of answer correctness. |
| Systems | End-to-end latency, TTFT, throughput, peak memory, tokens and cost per successful task | Include failed attempts and retries. Distinguish GPU runtime from study time. |

BLEU, ROUGE, BERTScore and extractive-QA exact match/token F1 are awareness topics unless the chosen project uses those tasks. Avoid turning every metric into a mandatory implementation.

### A practical evaluation protocol

1. **Write the task and rubric first.** State what counts as correct, supported, incomplete or an inappropriate action. Use deterministic or final-state checks where possible.
2. **Start small.** Use 10–20 development cases for debugging. Later aim for roughly 40–60 development cases and 40–60 separate final cases if annotation time permits. These are teaching-scale targets, not sample-size guarantees.
3. **Keep final cases genuinely unseen by the tuning process.** Reserve them early where possible. Do not relabel already-debugged questions as a final test set. If you inspect a final failure and tune for it, that case has become development data.
4. **Split at the right unit.** Keep related prompts, source examples or task templates together when testing generalisation. For RAG, source documents may legitimately be in the retrieval index at test time; the held-out queries, labels and tuning process must still be controlled.
5. **Use matched comparisons.** Run variants on the same task IDs. Bootstrap task-level paired differences when appropriate; cluster repeated trials by original task.
6. **Inspect stochastic variation.** Repeat a diagnostic subset of about 20 tasks three times when feasible. This is an initial consistency check, not evidence about rare failures.
7. **Check the grader.** If using an LLM judge, independently score approximately 20–30 outputs, randomise comparison order and inspect disagreements. The small calibration sample is exploratory; record its limitations.
8. **Report effects and limitations.** Include raw counts, uncertainty, failure categories and resource use. A few additional successes on a small test set are weak evidence without the paired outcomes.

For a binary success rate, 80 successes in 100 independent tasks has a Wilson 95% interval of approximately 71%–87%. A small evaluation can still guide debugging even when it cannot resolve a two-percentage-point gain.

Learn sampling distributions, bootstrap assumptions, confidence intervals, effect size and the intuition of power here. Multiple comparisons matter when trying many prompts or hyperparameters: select on development data and disclose the search rather than reporting only the best run.

For repeated generation, “at least one of k attempts succeeded” is different from “the system selected a correct final answer”, and different again from “all k attempts succeeded”. Record the selection process. Do not present oracle pass@k as an achievable user-facing score without a suitable selector.

Cost per successful task is total cost of all attempts divided by successful tasks; with zero successes it is undefined. Citation support also needs a published annotation rule rather than an unexplained score.

## 12. Frontier research without overwhelming the core

The frontier component is a recurring part of the course. In the opening bands, a short guided discussion is enough. Later, choose material that answers a question raised by your own model or assistant.

**Core research output:** three short notes across different themes, plus one deeper critique with a small experiment where feasible. The capstone can supply that experiment. Allow roughly 25–40 active hours across the whole plan for this frontier work, already included in the learning-band estimates. Foundational paper reading is included in its corresponding technical work.

### A current reading menu

Verified during the review on 11 November 2026. Choose from this table; completing every row is unnecessary.

| Theme | Primary material | Question to investigate |
| --- | --- | --- |
| Long-running agents | [Anthropic: Harness design for long-running application development](https://www.anthropic.com/research/harness-design-long-running-apps), 24 March 2026; engineering report | What does checkpointing, decomposition or an evaluator add beyond the model itself? |
| External memory | [Anthropic: The components of agent memory](https://www.anthropic.com/research/components-of-agent-memory), 6 November 2026; [ReasoningBank](https://arxiv.org/abs/2509.25140), research paper revised March 2026 | When do searchable logs or selected notes help? What is the cost of creating and maintaining them? |
| Reasoning and test-time computation | [DeepSeek-R1](https://arxiv.org/abs/2501.12948), revised January 2026; the HF reasoning material | Separate learning during training from sampling, search and selection during inference. Which part explains a gain? |
| Continual parameter learning | [Google Research: The sleep framework](https://research.google/blog/the-sleep-framework-a-new-way-for-llms-to-retain-knowledge-in-continual-learning/), 27 October 2026; research explainer linking its paper | How does learning new information in weights differ from saving external notes? How is retention of earlier knowledge measured? |
| Multimodal knowledge work | [Google DeepMind: MKA technical report](https://storage.googleapis.com/deepmind-media/papers/mka_tech_paper.pdf), 10 November 2026 | How do visual evidence, multiple files and grading the produced artifact change evaluation? |
| Architecture and inference | [DeepSeek-V4.1-Flash release](https://www.deepseek.com/en/news/deepseek-v4-1-flash/), 10 September 2026; [DiffusionGemma model card](https://ai.google.dev/gemma/docs/diffusiongemma/model_card) | Compare asymmetric/MoE computation and block denoising with the basic decoder. Separate architectural ideas from reported benchmark or speed claims. |
| Evaluation validity and oversight | [OpenAI: Eval-production behaviour gaps](https://alignment.openai.com/eval-production-behavior-gap/), 3 November 2026; [CoT monitorability across the model lifecycle](https://alignment.openai.com/cot-monitorability-model-lifecycle/), 10 November 2026 | What can a benchmark result or observed trace establish, and what remains unmeasured? |

These are a dated educational selection, not an exhaustive list of current research or a ranking of labs. Release reports and engineering accounts have a different evidential role from controlled research papers. Open the linked technical paper when assessing a release's scientific claim; unavailable methods limit what can be assessed.

### Multimodal and architecture literacy

Everyone should understand the idea of image patches/vision encoders, joint text–image representations and why OCR alone can miss layout or chart information. A short MIT vision/generative lecture or the chosen multimodal report can support this. Training a vision-language model is optional.

Likewise, learn the purpose of sparse expert routing, long-context methods, recurrent/hybrid alternatives, speculative decoding and text diffusion at an explanatory level. Select one for depth; do not create a second full architecture course inside the core plan.

### Read actively

For a first pass, identify the question, central claim, comparison and limitation. For a deeper pass, trace the data, objective, baseline, evaluation and compute. For the chosen experiment, change one relevant factor and write down what a small-scale result cannot establish.

Use a one-page note with: claim; mechanism; evidence; confounders; relevance to the project; and the cheapest useful next experiment. Revisit the frontier menu after each substantial project milestone. A new release should replace an older reading when it teaches the same idea better, rather than continually increasing the workload.

## 13. Three continuing work products

| Work product | Develop it through | Final evidence |
| --- | --- | --- |
| Text baseline and evaluation notebook | Bands 1–2, with an optional encoder comparison later | Fixed splits, classical/neural baselines, metric calculations, a small error taxonomy and reproducible results |
| Model-training laboratory | Bands 2–5 | Tiny decoder, tokenizer exercise, data/training ablation, SFT comparison, DPO comparison and toy preference/RL exercises |
| Grounded document assistant | Bands 1–6 | Lexical/dense retrieval, RAG, a bounded tool loop, evaluation cases, traces, profiling and the final capstone |

Small exercises belong inside these work products. They do not all need separate repositories, demos or reports. Use the same environment, experiment log and evaluation conventions where practical, but allow different datasets and models when the task requires them.

Each substantial milestone should include a brief explanation without notes, an unfamiliar problem, and one modification made independently. Return to a central mechanism after a gap and reconstruct it. Watching a video or successfully running a provided notebook alone is insufficient evidence of understanding.

## 14. Hardware and realistic scope

| Available resources | Practical approach |
| --- | --- |
| CPU/laptop only | Complete foundations, classical ML, retrieval, toy transformers and toy RL locally. Use very small pretrained models or measured remote access for heavier inference. Large adaptation runs are unnecessary. |
| Approximately 8–12 GB GPU memory | Begin with a tiny decoder and small pretrained models; roughly 0.5–1B parameters is a sensible pilot range for adaptation, subject to measurement. Use short sequences and small batches. |
| Approximately 16–24 GB GPU memory | More flexibility for small-model adaptation and selected rollout experiments. Still start with a minimal measured run. |
| Multiple GPUs | Optional training/systems specialisation. Not assumed by the core curriculum. |

Parameter counts are starting points, not fit guarantees. At 16 bits, one billion raw weights occupy roughly 2 GB in decimal units, before activations, gradients, optimiser states, KV cache and runtime overhead. Quantisation and LoRA change parts of this budget, not all of it.

Run a short pilot before choosing the final model or dataset size. Measure peak memory, time per step, generation length and total expected cost. Use package versions compatible with the hardware and examples; save the exact environment. Current documentation may describe newer APIs than an older notebook.

A CPU-only student may use smaller adaptation tasks or arrange brief GPU access. Analysing supplied training logs is useful conceptual work, but it does not replace actually running SFT and DPO if claiming practical competence in those methods.

Avoid making a large model, a full benchmark leaderboard run or an expensive cloud setup a condition of learning the mechanism. Financial cost is separate from active study hours and should be estimated from a measured pilot and current provider rates.

## 15. Workload estimates and pacing

The structure, materials and completion checks above take priority. Use the estimates to reserve time and limit scope.

These are curriculum-design estimates for selected lessons and small experiments, **not published course workloads or measured learning-time guarantees**. The ranges include reading, exercises, setup, normal debugging, annotation, evaluation, revision and concise write-ups.

| Learning band | Estimated active hours | Main work consuming the time |
| --- | --- | --- |
| 1. Recover and orient | 20–30 | Diagnostic, environment, targeted recovery and a first working baseline |
| 2. Represent and predict | 80–110 | ML/probability practice, NLP representations, gradients and baseline comparison |
| 3. Understand transformers | 120–160 | Tokenizer and attention work, decoder training, data checks, RAG and evaluation |
| 4. Adapt and use tools | 100–140 | Data preparation, SFT/LoRA, statistical comparison and a reliable tool loop |
| 5. Learn from feedback | 100–140 | RL foundations, preference/reward exercise, DPO, verifier work and agent reliability |
| 6. Integrate and investigate | 120–180 | Systems work, targeted frontier reading, final evaluation, capstone and reproduction |
| **Core total** | **540–760** | All three lanes, research and their shared projects |

Time is counted once. Projects, frontier notes and evaluation are already included; do not add the section-specific activities to this total again. Unattended GPU runtime and waiting are not active study, although diagnosing a failed run is.

The lower end assumes retained fundamentals, limited environment friction and tightly scoped projects. The upper end allows more practice and iteration. Substantial relearning, ambitious extensions or a broad change of project require a new estimate.

| Sustainable pace | Active study weeks for the core | Calendar illustration with about 20% extra weeks for breaks/disruption |
| --- | --- | --- |
| 10 hours/week | 54–76 | About 65–92 weeks |
| 15 hours/week | 36–51 | About 44–61 weeks |
| 20 hours/week | 27–38 | About 33–46 weeks |

The calendar margin is time for availability, not another 20% of required coursework. It is optional planning slack. At 15 active hours per week, the illustrated calendar is roughly 10–14 months.

An example 15-hour week is eight hours of building/debugging, four hours of concepts and worked problems, two hours of evaluation/write-up and one hour of research reading. Shift the balance when a concept is blocking the build. Those are activity categories within the same three lanes, not extra tasks.

Re-estimate after the first 25–30 active hours and after each major working result. If progress is slow, reduce model size, dataset size, framework migration or optional features before removing the evaluation and understanding checks.

### Optional depth after the core

Choose one direction initially. The ranges below are additional planning allowances, not completion guarantees.

| Direction | Additional active hours | Suggested work |
| --- | --- | --- |
| Model training/research | 120–200 | Selected full CS336 assignments, stronger optimisation/statistics, a careful replication and a narrower research question |
| Agent engineering | 80–140 | Larger real-task evaluations, durable state, operational monitoring and justified memory or multi-agent experiments |
| RL and reasoning | 100–180 | More complete RL foundations, a small online LLM RL experiment, verifier analysis and training/inference comparisons |
| NLP or multimodal depth | 100–180 | Selected CS224N work, sequence labelling or retrieval training, or a carefully evaluated multimodal task |

## 16. The first actions

1. Complete the diagnostic and record the specific gaps.
2. Open PyTorch Basics, the first relevant SLP chapter and the chosen implementation resource. Keep other courses closed until needed.
3. Create the text-baseline notebook and the document-assistant baseline.
4. Write the initial development cases and keep an experiment log from the first run.
5. At the first checkpoint, demonstrate the completed work and adjust the workload estimate.

Completion of this plan should leave a student able to explain central language-model mechanisms, run small training/adaptation experiments, build a grounded tool-using system and judge evidence critically. It provides a practical base for further engineering or research; specialist depth comes from the chosen continuation.




## 17. Starting in 2027 and building toward expertise

### Your starting point and destination

Start with rusty engineering maths and some Python experience. Aim to become someone who can explain the mechanism, implement a small version, evaluate it fairly and decide what to investigate next. This curriculum focuses on machine learning, language models and AI systems; advanced vision, robotics and other fields are further specialisations.

The six core bands build a shared foundation. A focused specialisation follows. Research reading, evaluation and clear writing continue throughout both. Choose depth in one area while maintaining working knowledge of the others.

### Three levels of progress

| Level | Work to do | Evidence that you are ready for more |
| --- | --- | --- |
| Core practitioner: six parallel learning bands | 540–760 active hours across Python/maths recovery, statistical ML, NLP, transformers, pretraining, SFT, preference learning, RAG, agents and evaluation. | Rebuild the central calculations, debug a training run, compare systems on unseen cases and deliver a reproducible capstone. |
| Focused specialist: one chosen route | Plan a further 200–400 active hours for selected advanced material, one bounded replication and controlled extensions. | Explain a paper's method, reproduce a meaningful baseline and show what an ablation changes under a matched budget. |
| Independent expertise: sustained practice | Repeat the research and engineering cycle on harder questions, with external review and real constraints. | Solve unfamiliar failures, defend experimental choices, make useful contributions and help other people understand or reproduce the work. |

These hours are independent planning estimates. Completing the estimated hours does not confer an expert title. New domains and unfamiliar systems will continue to require learning.

### Pick one specialisation after the core

| Route | Material to use | Bounded project and completion evidence |
| --- | --- | --- |
| Language-model training and post-training | [Stanford CS336](https://cs336.stanford.edu/): selected basics, data, systems or alignment assignments after the relevant prerequisites. Use [TRL documentation](https://huggingface.co/docs/trl/index) for the chosen post-training method. | Reproduce a small-model result, change one data or objective choice, and report quality, uncertainty, resource use and regressions. Full multi-GPU assignments are optional and require a separate compute plan. |
| Reliable AI systems and agents | Revisit the core [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/en/unit0/introduction), selected [Full Stack LLM Bootcamp](https://fullstackdeeplearning.com/llm-bootcamp/) design/LLMOps lectures, and current documentation for the serving/tool stack you actually use. | Compare a fixed workflow with a bounded agent on held-out tasks. Measure repeated-trial success, latency, cost and recovery from tool failures. Add memory or multiple agents only to test a specific hypothesis. |
| Statistical machine learning | [Stanford CS229 public materials](https://see.stanford.edu/Course/CS229): selected model-selection, learning-theory and unsupervised-learning notes. Use [ISLP](https://www.statlearning.com/) for complementary exercises. | Study one real dataset with leakage checks, strong classical baselines, calibration and subgroup/error analysis. Explain when an LLM adds value and when a simpler method is sufficient. |

CS336 expects strong Python, PyTorch, ML and systems preparation. Use the core checkpoints to establish that preparation. The Full Stack bootcamp is from 2023: use its engineering ideas and check current APIs separately. The CS229 public archive is foundational material, rather than a source of current model releases. Select the work needed for your question; the 200–400-hour block does not assume finishing all of these courses.

A possible specialisation budget is 40–80 hours of targeted study, 80–160 hours of replication, 60–120 hours of controlled extensions and evaluation, and 20–40 hours of documentation and review. Reduce the experiment scale before removing the evaluation.

### What expertise should look like in your work

- Explain tokenisation, attention, learning objectives and evaluation choices from a blank page, with a small numerical example.
- Implement an unfamiliar variant from its specification and diagnose a failed run using evidence.
- Keep a simple baseline, frozen evaluation cases, meaningful metrics and a record of data and resource choices.
- Separate a paper's claims from what your reproduction actually establishes. Report negative and inconclusive results clearly.
- Release code that another person can run, write a concise technical report and respond constructively to review.
- Contribute a useful replication, bug fix, dataset analysis, benchmark improvement or documented engineering result.

Review these abilities after each substantial project. Ask a peer or mentor to inspect the code, reproduce one result and challenge the interpretation. A polished demo and course completion are useful milestones; repeated independent work supplies stronger evidence of expertise.

### A realistic 2027 start

Begin with band 1's diagnostic and all three lanes. Keep one main build and one smaller exercise active. Follow the assigned core material, use references to repair gaps, and move on when you can demonstrate the checkpoint. The start year gives the plan context; it does not turn each band into a fixed month.

| Active study per week | Core study time | Calendar illustration with 20% extra weeks for breaks |
| --- | --- | --- |
| 10 hours | 54–76 weeks | 65–92 weeks |
| 15 hours | 36–51 weeks | 44–61 weeks |
| 20 hours | 27–38 weeks | 33–46 weeks |

A learner starting in 2027 may continue the core into 2028, especially alongside work or university. The specialisation comes after its prerequisite skills and adds further time. Use your actual pace and debugging experience to revise the estimate.

### Keep the frontier current

This is a 2027 starting edition built from materials available in November 2026. Its research page is a dated selection, not a prediction of 2027's frontier. Before a new experiment, check the official course or project page, pin software/model versions and read a recent original paper connected to your question. Replace an older reading when a newer one teaches the same mechanism better; preserve foundational explanations that remain useful.
