# Learn AI in 2027

A study plan for language models and agents. Updated 12 November 2026. Course and research links checked 11 November 2026.

This plan assumes you have used Python and studied engineering maths before. If you have forgotten some of it, start with the refresher.

Study maths and code, language models, and applications at the same time. Start with small examples, train models, look at their mistakes and test your changes. The main course takes an estimated 540–760 hours, including reading, coding and debugging.

After the course, choose one subject to study in more detail. Getting good at this takes practice on problems you have not seen before, plus feedback from other people.

## 1. How to study these topics together

Study these three tracks at the same time. You can make progress in one while practising something in another.

| Parallel track | What belongs here | Example |
| --- | --- | --- |
| Foundations | Python, PyTorch, mathematics, probability, statistics, classical ML and optimisation | Learn a derivative while implementing a loss; learn sampling uncertainty while comparing systems. |
| Language models and training | NLP, tokens, embeddings, transformers, pretraining, SFT, preferences and RL | Explain mechanisms, implement small examples and adapt an existing model. |
| Applications and systems | Retrieval, RAG, tools, agents, inference, state and deployment | Build a useful system early, then measure whether added components help. |

Test your work in all three tracks. Read papers alongside the coding exercises. Start with a short discussion of a paper; later, try to reproduce one result.

Some tasks can start early. You can build document search before learning attention, and use an existing model before training one. Other tasks have prerequisites: learn gradients and probabilities before policy optimisation, and get one agent working before trying several.

Work on one main coding task and one smaller exercise at a time. For example, while training a small transformer, you might compare two retrieval settings in the application track. Three tracks do not need to mean three large projects at once.

### What to implement and what to understand

| Depth | Required topics |
| --- | --- |
| Implement and explain | Tensor operations; a small loss and gradient; classical text baseline; causal attention; a tiny decoder and training loop; a toy BPE tokenizer; evaluation metrics; a basic tool loop; a toy policy-gradient update. |
| Use, inspect and evaluate | Pretrained tokenizers and encoders; a small SFT/LoRA run; a small DPO run; retrieval and reranking libraries; structured outputs; checkpointing; a simple service. |
| Explain with a worked example | RLHF pipeline; reward modelling; PPO clipping; GRPO group advantages; KL regularisation; scaling trade-offs; KV cache; quantisation; distributed-training concepts; multimodal representations. |
| Optional projects | Full LLM PPO/GRPO, large reward models, multiple agents, learned long-term memory, custom GPU kernels, distributed training, full benchmark suites and large-scale multimodal training. |

Use libraries where they help. For the topics in the first row, write the main calculation yourself and explain it without reading the tutorial.

## 2. Courses, books and tutorials

Read the assigned sections and do the exercises. You do not need to finish every linked course. Move on when you can do the check for that topic.

### Main materials

| Resource | Assigned material | What to do |
| --- | --- | --- |
| [PyTorch: Learn the Basics](https://docs.pytorch.org/tutorials/beginner/basics/intro.html) | Tensors, datasets/data loaders, model building, autograd, optimisation, saving and loading. | Write and debug a small training loop without copying the full example. |
| [Karpathy: Neural Networks — Zero to Hero](https://github.com/karpathy/nn-zero-to-hero) | Micrograd; initial makemore bigram and MLP lessons; later “Let's build GPT”. Use the tokenizer lesson for the BPE exercise. | Code along, then write the important parts again yourself. Use the extra makemore lessons if gradients or training are still unclear. |
| [Jurafsky and Martin: Speech and Language Processing](https://web.stanford.edu/~jurafsky/slp3/) | Selected material from chapters 2–8 and 11 in the 19 August 2026 draft; chapter 9 for the masked-LM/encoder comparison. | Read the chapter for your current topic. You can look up the rest later. |
| [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/chapter1/1) | Chapters 1–3 and 5–6; one classification example from chapter 7; selected data curation and fine-tuning material from chapters 10–11. | Practise loading models, tokenizers and datasets. Use chapter 12 later for RL. Publishing and demo chapters are optional. |
| [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/en/unit0/introduction) | Unit 1; then one framework section from Unit 2 if useful; relevant agentic-RAG and evaluation material. | Start after basic Python and LLM messages make sense. First build the loop in Python. Completing every framework or certification challenge is unnecessary. |
| [Spinning Up: RL concepts](https://spinningup.openai.com/en/latest/spinningup/rl_intro.html) and [policy optimisation](https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html) | States/actions/rewards, policies, returns, policy gradients and baselines. | Learn the ideas and implement a small policy-gradient calculation. You do not need the old software stack. |

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

### Other materials

Use [Raschka's LLMs-from-scratch repository](https://github.com/rasbt/LLMs-from-scratch), chapters 2–5, **instead of** the corresponding Karpathy tokenizer/transformer coding exercises if you prefer written notebooks. Chapter 7 can support instruction tuning. The code is public; the accompanying book is separate. Do not complete both implementations unless repetition is addressing a specific weakness.

[MIT 6.S191](https://introtodeeplearning.com/) provides concise introductory and broader AI lectures. Use a selected explanation in place of an equivalent reading, especially for neural-network, vision or generative-model intuition.

[CS224N](https://web.stanford.edu/class/cs224n/) is a deeper NLP reference. Its official page links the public 2024 lecture videos; the 2026 recordings require enrolled-student access. Select an embeddings, attention or NLP-task lecture when needed.

[CS336](https://cs336.stanford.edu/) is the advanced continuation. Its full assignments are substantial work in their own right. During this core plan, consult selected basics, data, scaling or alignment material after the corresponding prerequisite exercises. Full systems and distributed assignments belong in a later specialisation.

## 3. The study plan

Each row groups topics you can study together. The rows are not fixed months. Spend more time on a topic when you need to.

| Part | Foundations track | Language-model track | Applications track | What you will make |
| --- | --- | --- | --- | --- |
| 1. Python and maths refresher | Python, arrays, shapes, diagnostic problems | Tokens, messages, next-token prediction; run an existing model | Small document collection and a simple baseline | A script you can rerun, with notes on its mistakes |
| 2. Machine learning and NLP basics | Probability, losses, train/dev/test, linear models and MLPs | N-grams, TF-IDF, embeddings, encoder/decoder distinctions | Lexical retrieval, relevance labels and structured output | Classifier results and an explanation of the errors |
| 3. Build a language model | Gradients, optimisation, tensor operations and numerical stability | BPE, causal attention, decoder training, data splits and held-out loss | Dense retrieval, RAG, citations and missing-evidence handling | A small language model and tested document QA |
| 4. Fine-tuning and agents | Uncertainty, KL intuition, regularisation and controlled comparisons | Data curation, instruction tuning, LoRA and behavioural regressions | A bounded tool loop, schema validation, state and recovery | An SFT comparison and logs from a working agent |
| 5. RLHF and reinforcement learning | MDPs, expected return, policy gradients, preference likelihoods | Reward-model exercise, DPO, RLHF/PPO/GRPO mechanisms and toy RL | Workflow versus agent comparison; budget and context control | DPO results and mistakes made by a reward checker |
| 6. Evaluation and a final project | Paired inference, calibration, experimental design | A selected frontier question; inference and architecture trade-offs | Profiling, service, regression suite and final project | Code, results, limitations and running instructions |

Research reading accompanies the current part. A newcomer can discuss what a paper claims before being able to derive every equation. Detailed replication waits until the underlying mechanism is understood.

### What you need to know first

| Before this work | Demonstrate this first | Work that can continue in parallel |
| --- | --- | --- |
| Training a transformer | Understand batched tensor shapes, shifted labels, cross-entropy and autograd; overfit a tiny batch. | Retrieval, dataset inspection and evaluation design |
| Fine-tuning a model | Understand the pretrained model's tokenizer/template and inspect the exact supervised tokens. | Tool design and statistical exercises |
| DPO training | Have a stable starting checkpoint and usable preference pairs; calculate completion log-probabilities correctly. | RAG improvements and RL concepts |
| Online LLM RL | Understand policy gradients; test the verifier; measure initial success and rollout cost. | Toy RL and critique of published experiments |
| Multiple agents or learned memory | Have a working single-agent baseline and tasks that require the extra component. | Reliability, deployment and final project analysis |

A stable SFT checkpoint before DPO is the default teaching route here, not a claim that every DPO research setup must train a new SFT model first.

## 4. Part 1: Python and maths refresher

Set up your tools, run a model and check what you need to revise.

Start with a short self-check, about two hours. Multiply compatible matrices and state the output shape; differentiate a small scalar expression; solve a conditional-probability question; explain why test data cannot select hyperparameters; write a function that batches records and handles malformed input.

Use the self-check to find what you have forgotten. For each weak topic, read a short explanation, work through an example and try a different problem the next day. If Python functions, arrays or basic algebra are new to you, learn them first. The hour estimates assume you have seen them before.

| Track | Study and do |
| --- | --- |
| Foundations | Use the PyTorch tensor and autograd basics. Revise Python functions, indexing, loops, files, JSON, exceptions, environments and basic Git use through the project. |
| Language models | Use SLP chapter 2 and HF introductory model/tokenizer material. Trace text to token IDs, embeddings, logits, probabilities and generated tokens at an introductory level. Distinguish a base model from an instruction-tuned model. |
| Applications | Choose a small collection of public technical documents. Run one model call and a simple literal-search baseline. Write 10–20 development questions with source IDs. |

**Completion check:** rerun the script in a fresh session, explain a token versus an embedding, show the model input/output and name three observed failures. No fine-tuning or agent framework is required yet.

Keep the document collection small enough to inspect manually. Use stable source versions and record permission/licence information. A local program can simulate tool calls while external model access is being set up.

## 5. Part 2: Machine learning and NLP basics

Train a few simple models on text. Use them to learn probability, gradients and evaluation before adding a transformer.

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

In the application track, build lexical retrieval and label relevant sources for development queries. Define the output schema and record incorrect or unsupported answers.

For breadth, learn what tree models, k-means and PCA are good for. Inspect one short example if unfamiliar. Comprehensive classical ML is a separate course.

**Completion check:** explain why the baseline is fair, why a split is appropriate, what the loss optimises and which errors remain. From saved predictions, compute a confusion matrix and macro-F1. Overfit a tiny neural batch deliberately and explain why that is a debugging check, not evidence of generalisation.

## 6. Part 3: Build a language model

Write and train a small transformer. In the application track, add retrieval to your document assistant.

### Maths and model code

Study the chain rule, matrix derivatives as needed, gradient flow, initialisation, residual paths, normalisation, Adam and learning-rate schedules. Learn enough numerical stability to recognise overflow, vanishing gradients and incorrect masking.

Follow the chosen coding exercises through scaled dot-product attention, causal masking, multi-head attention, positional information, feed-forward layers and the decoder. Understand how modern choices such as RoPE, RMSNorm, gated MLPs and grouped-query attention differ from a basic teaching implementation; implementing all of them is optional.

Use a tiny BPE example to learn how merge rules are trained. Inspect English, Hindi, numbers and code. Explain why the same text can have different token counts under different tokenizers.

Train a **roughly 1–10 million parameter decoder** on a documented text subset. Start even smaller for debugging. Check memory use with a small run first. A model this size is for learning and may generate poor text. A character tokenizer is acceptable for the first correct training run; the BPE exercise can remain separate.

**Materials:** SLP chapter 7; Karpathy “Let's build GPT”, or Raschka chapters 2–5; HF tokenizer/dataset sections. Read the mechanism sections of [Attention Is All You Need](https://arxiv.org/abs/1706.03762) alongside your implementation.

### Data and training checks

1. Inspect token IDs, labels, padding and loss masks directly.
2. Verify that the model cannot use future tokens to predict the current target.
3. Group exact and near-duplicate documents before assigning train/validation/test partitions; train a new tokenizer on training data only.
4. Keep final data out of tokenizer fitting, filter selection and hyperparameter selection. A fixed pretrained tokenizer is a different, recorded setup.
5. Save configuration, dataset version, model state, optimiser state and the information needed to resume training.
6. Compare one data or training choice while controlling the relevant budget. For a tokenizer comparison, token counts change: report raw text exposure and compute as well.

Inspect [FineWeb](https://arxiv.org/abs/2406.17557) for a data-filtering example and [Chinchilla](https://arxiv.org/abs/2203.15556) for compute/data/model trade-offs. The task is to explain the assumption behind an ablation, not recreate a web-scale dataset or fit a reliable scaling law from two tiny runs.

### Work on the document assistant

Use SLP chapter 11 and the Sentence Transformers retrieval guide to add a dense retriever. Compare it with the lexical baseline before assuming it is better. Then build retrieve-then-generate QA with source references and an explicit missing-evidence response.

Add a reranker only after measuring the simpler retrieval pipeline. Keep context length and query sets controlled when comparing systems.

**Completion check:** show training and validation curves; explain next-token label alignment; resume a run; report held-out token loss. For RAG, distinguish “the source was not retrieved” from “the model ignored or misused a retrieved source”. The tiny language model and the useful assistant can use different models.

## 7. Part 4: Fine-tuning and agents

Fine-tune a small model on one task. Separately, let your assistant call tools and test the results.

### Fine-tuning

Choose a narrow, checkable task: structured extraction, response formatting, or a well-defined instruction task. Create or select a modest training dataset and inspect examples before increasing its size. A pilot of hundreds of examples can teach the pipeline; the amount needed for a useful improvement depends on the task and model.

Start from a small existing pretrained or instruction-tuned model suitable for the task. Record which kind it is. The small decoder from the previous part teaches you how training works. Use a stronger pretrained model for the instruction-following experiment.

Study instruction data, chat templates, special tokens, sequence packing, assistant/completion loss masking, full fine-tuning versus adapters, LoRA, and the idea of a quantised frozen base. Use the [LoRA paper](https://arxiv.org/abs/2106.09685), selected SLP chapter 8 material, HF fine-tuning lessons and the PEFT/TRL guides.

Run one small SFT/LoRA experiment. Compare the starting checkpoint, a reasonable prompt-only baseline and the adapted checkpoint on the same task. Inspect unrelated-task regressions and output length. Do not interpret training-loss reduction as task improvement.

**Required checks:** inspect a token-level training example and its mask; count trainable parameters; save and reload the adapter; verify identical evaluation formatting. Current TRL's assistant-only loss relies on compatible chat-template support, so check the installed version and actual masks rather than assuming a flag is sufficient.

In the foundations track, learn entropy, cross-entropy, KL divergence, confidence intervals and the difference between a measured effect and sampling noise. Apply them to an experiment you already ran.

Connect sampling variability to the intuition behind the law of large numbers and the central limit theorem. For the classifier, plot a reliability diagram and try temperature scaling only if probability estimates matter; fit the calibration step on development data and assess it on held-out data.

### Work on the agent

Start with an explicit workflow: retrieve evidence, run a calculation when needed, then produce an answer. Next implement a plain-Python loop in which the model can choose a tool and react to its result.

Use only a few tools, such as document search, a calculator and a sandboxed file operation. Validate arguments, define timeouts and step limits, handle an empty result, and record tool calls and outcomes. Test whether a retried operation could accidentally repeat a state change.

Study the difference between fixed workflows and model-directed agents. Learn message roles, tool schemas, context selection, transient state and persistent storage. MCP is an interface topic; it is not an agent training method.

**Completion check:** the system handles a failed tool call, stops within its budget and reports what actually happened. An instruction embedded in retrieved content must not silently become permission to use a tool.

Include public or synthetic examples involving conflicting evidence, unsupported answers, malicious retrieved instructions and invalid tool arguments. Learn basic data privacy, secret handling and least-privilege tool design. Inspect relevant language or user-group slices and inappropriate refusals; a small teaching evaluation cannot establish universal fairness or safety.

Adding a framework is optional. If one helps, port the existing small loop to one framework and compare behaviour. Do not build three implementations merely to collect framework names.

## 8. Part 5: RLHF and reinforcement learning

Run small experiments with rewards and response preferences.

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

**Before moving on:** a toy policy-gradient run, a preference/reward exercise, a small DPO run, worked PPO/GRPO calculations and a verifier audit. A full LLM PPO run and an online LLM GRPO training run are extensions. 

An optional LLM GRPO pilot needs a model that sometimes succeeds on the chosen task, a nontrivial reward signal and measured rollout costs. Groups with identical rewards can provide no useful within-group learning signal; scaling up a broken or all-zero-reward experiment is not a solution.

### Work on the agent

Compare the fixed workflow with the single-agent loop. Use the same model and task suite and record total budgets. Test interruption, checkpoint/resume, stale context and repeated tool errors.

Introduce memory only for tasks where past interactions should help. Reset it between independent evaluation runs, or define a chronological evaluation protocol. Prevent evaluation answers from accumulating in memory across supposedly independent variants.

The two-agent extension requires a concrete hypothesis, such as independent evidence checking. Count both agents' tokens and time. Improvement should justify the coordination overhead.

## 9. Part 6: Evaluation and a final project

Choose one question, run a comparison and write up what happened.

### Running and serving models

Learn the difference between prefill and decoding, weights and KV cache, latency and throughput, and active versus total MoE parameters. Explain mixed precision, quantisation, batching, activation checkpointing and gradient accumulation.

Profile one practical setting change, such as context length, batch size or quantisation. Measure quality as well as memory and time. Report input/output lengths, warm versus cold execution and the number of requests behind percentile estimates.

Understand data parallelism, parameter sharding and tensor/pipeline parallelism conceptually. Multi-GPU execution and custom FlashAttention kernels are optional. Use vLLM if it fits the environment; installing a large serving stack is not the learning objective.

Expose the assistant through a small local service or demonstration. Include input validation, bounded requests, reproducible configuration, useful error reporting and a regression check. A polished frontend is optional.

### Choose one final project question

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

## 12. Reading recent research

Read a little research as you go. At first, explain the main question and result. Later, choose a paper that helps with a problem in your own code.

Write three short paper notes on different topics. Pick one paper to examine in more detail and, if possible, try a small experiment. This can be part of the final project. The plan already includes about 25–40 hours for this work; do not add those hours again.

### Papers and reports to choose from

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

This list was checked in November 2026. It is a starting point for reading. For a product release, read the technical paper too and check whether its methods are available. A reported benchmark score alone tells you little about how the result was obtained.

### Images and other model designs

Everyone should understand the idea of image patches/vision encoders, joint text–image representations and why OCR alone can miss layout or chart information. A short MIT vision/generative lecture or the chosen multimodal report can support this. Training a vision-language model is optional.

Likewise, learn the purpose of sparse expert routing, long-context methods, recurrent/hybrid alternatives, speculative decoding and text diffusion at an explanatory level. Select one for depth; do not create a second full architecture course inside the core plan.

### How to read a paper

For a first pass, identify the question, central claim, comparison and limitation. For a deeper pass, trace the data, objective, baseline, evaluation and compute. For the chosen experiment, change one relevant factor and write down what a small-scale result cannot establish.

Use a one-page note with: claim; mechanism; evidence; confounders; relevance to the project; and the cheapest useful next experiment. Revisit the frontier menu after each substantial project milestone. A new release should replace an older reading when it teaches the same idea better, rather than continually increasing the workload.

## 13. Three projects to keep working on

| Project | Develop it through | What to include |
| --- | --- | --- |
| Text baseline and evaluation notebook | Parts 1–2, with an optional encoder comparison later | Fixed splits, classical/neural baselines, metric calculations, a small error taxonomy and reproducible results |
| Model-training laboratory | Parts 2–5 | Tiny decoder, tokenizer exercise, data/training ablation, SFT comparison, DPO comparison and toy preference/RL exercises |
| Grounded document assistant | Parts 1–6 | Lexical/dense retrieval, RAG, a bounded tool loop, evaluation cases, traces, profiling and the final final project |

Keep the small exercises in these projects. They do not each need a separate repository or demo. Reuse your environment and experiment log where possible. Use different data or models when the task needs them.

After each large exercise, explain it without notes, try a new problem and change something yourself. Come back a few days later and write the main calculation again. This will tell you more than getting a provided notebook to run.

## 14. Hardware and model sizes

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

## 15. How much time to allow

Use the topics, materials and exercises to decide what to study. Use the hours to plan how much you can take on.

These are estimates for the lessons and small experiments in this plan. They include reading, exercises, setup, debugging, labelling data, testing, revision and short write-ups. They are not official course workloads.

| Part | Estimated active hours | Main work consuming the time |
| --- | --- | --- |
| 1. Python and maths refresher | 20–30 | Diagnostic, environment, targeted recovery and a first working baseline |
| 2. Machine learning and NLP basics | 80–110 | ML/probability practice, NLP representations, gradients and baseline comparison |
| 3. Build a language model | 120–160 | Tokenizer and attention work, decoder training, data checks, RAG and evaluation |
| 4. Fine-tuning and agents | 100–140 | Data preparation, SFT/LoRA, statistical comparison and a reliable tool loop |
| 5. RLHF and reinforcement learning | 100–140 | RL foundations, preference/reward exercise, DPO, verifier work and agent reliability |
| 6. Evaluation and a final project | 120–180 | Systems work, targeted frontier reading, final evaluation, final project and reproduction |
| **Core total** | **540–760** | All three tracks, research and their shared projects |

Time is counted once. Projects, frontier notes and evaluation are already included; do not add the section-specific activities to this total again. Unattended GPU runtime and waiting are not active study, although diagnosing a failed run is.

Use the lower end if you remember the basics and keep the projects small. Allow more time if you need extra practice, have setup problems or change the project.

| Sustainable pace | Active study weeks for the core | Calendar illustration with about 20% extra weeks for breaks/disruption |
| --- | --- | --- |
| 10 hours/week | 54–76 | About 65–92 weeks |
| 15 hours/week | 36–51 | About 44–61 weeks |
| 20 hours/week | 27–38 | About 33–46 weeks |

The calendar margin is time for availability, not another 20% of required coursework. It is optional planning slack. At 15 active hours per week, the illustrated calendar is roughly 10–14 months.

An example 15-hour week is eight hours of building/debugging, four hours of concepts and worked problems, two hours of evaluation/write-up and one hour of research reading. Shift the balance when a concept is blocking the build. Those are activity categories within the same three tracks, not extra tasks.

Re-estimate after the first 25–30 active hours and after each major working result. If progress is slow, reduce model size, dataset size, framework migration or optional features before removing the evaluation and understanding checks.

### Optional work after the course

Choose one direction initially. The ranges below are additional planning allowances, not completion guarantees.

| Direction | Additional active hours | Suggested work |
| --- | --- | --- |
| Model training/research | 120–200 | Selected full CS336 assignments, stronger optimisation/statistics, a careful replication and a narrower research question |
| Agent engineering | 80–140 | Larger real-task evaluations, durable state, operational monitoring and justified memory or multi-agent experiments |
| RL and reasoning | 100–180 | More complete RL foundations, a small online LLM RL experiment, verifier analysis and training/inference comparisons |
| NLP or multimodal depth | 100–180 | Selected CS224N work, sequence labelling or retrieval training, or a carefully evaluated multimodal task |

## 16. What to do first

1. Do the self-check and list the topics you need to revise.
2. Open PyTorch Basics, the first relevant SLP chapter and the chosen implementation resource. Keep other courses closed until needed.
3. Create the text-baseline notebook and the document-assistant baseline.
4. Write the initial development cases and keep an experiment log from the first run.
5. After part 1, check the exercises and update your time estimate.

By the end, you should be able to explain the main parts of a language model, run small training and fine-tuning experiments, build a document assistant with tools and test whether it works. Then pick a subject and study it in more detail.




## 17. What to study after this course

### Who this is for

You have some Python and engineering maths experience and want to learn how language models and agents work. This course also covers the machine learning and statistics needed to train and test them. Vision, robotics and other areas need further study.

Start with the six parts of the course. After that, choose one subject and spend more time on it. Keep reading papers, running experiments and writing down what you find.

### What you should be able to do

| Work | Approximate time | Check your understanding |
| --- | --- | --- |
| Complete the main course | 540–760 hours | Explain the main calculations, debug a training run, compare models on unseen data and finish a project that someone else can run. |
| Study one subject in more detail | A further 200–400 hours for a small project and selected advanced lessons | Reproduce a result from a paper. Change one thing and test whether it helps. Keep the data and compute budget comparable. |
| Work on harder problems yourself | Ongoing | Diagnose unfamiliar errors, explain your decisions, write useful code or reports and respond to review. |

These hours are estimates. Finishing a course is a start. You get better by using what you learned on new problems and finding out where your understanding breaks down.

### Choose a subject

| Subject | What to read | What to build and test |
| --- | --- | --- |
| Language-model training | Selected [CS336](https://cs336.stanford.edu/) assignments on model code, data, systems or alignment. Use [TRL](https://huggingface.co/docs/trl/index) for the post-training method you choose. | Reproduce a small-model result. Change one data or training choice. Report quality, uncertainty, cost and tasks that got worse. |
| AI systems and agents | The relevant [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/en/unit0/introduction) sections, [Full Stack LLM Bootcamp](https://fullstackdeeplearning.com/llm-bootcamp/) design and LLMOps lectures, and the documentation for your tools. | Compare a fixed workflow with an agent on held-out tasks. Measure success over repeated runs, time, cost and tool errors. Add memory or multiple agents only when you have a reason to test them. |
| Statistical machine learning | Selected [CS229 notes](https://see.stanford.edu/Course/CS229) on model selection, learning theory and unsupervised learning, with [ISLP](https://www.statlearning.com/) exercises. | Study a real dataset. Check for leakage, compare simple models, measure calibration and inspect errors across groups. Test whether an LLM adds anything useful. |

CS336 assumes strong Python, PyTorch, ML and systems skills. Work through the main course exercises first. The Full Stack bootcamp is from 2023, so check current APIs when using its examples. The CS229 archive is useful for the basic ideas. The 200–400 hours are for selected lessons and one project, not all three routes or every assignment.

For one project, you might allow 40–80 hours for reading and exercises, 80–160 for reproducing a result, 60–120 for changes and evaluation, and 20–40 for writing and review. If it is too much work, reduce the model or dataset size and keep the comparison.

### How to tell whether you are improving

- Explain tokenisation, attention, losses and metrics with a small example, without reading your notes.
- Implement a method from its description and work out why a run failed.
- Compare with a simple baseline on data you did not use for tuning.
- Describe what your experiment shows, what it does not show and what you would test next.
- Give someone the code and instructions, and see whether they can run it.
- Ask for review. Fix a bug, improve a test or reproduce a result that someone else can use.

After each project, ask a peer or mentor to check the code and question the results. A demo is useful, but the interesting part is whether the system works on new cases and whether your explanation holds up.

### Starting in 2027

Start with the self-check in part 1. Work on all three tracks, with one main coding task and one smaller exercise at a time. Use extra readings when a topic is unclear. Move on when you can do the exercises and explain the result.

| Study time each week | Main course, in study weeks | With about 20% extra weeks for breaks |
| --- | --- | --- |
| 10 hours | 54–76 weeks | 65–92 weeks |
| 15 hours | 36–51 weeks | 44–61 weeks |
| 20 hours | 27–38 weeks | 33–46 weeks |

If you start in 2027 alongside work or university, the course may continue into 2028. Further study adds more time. Update the estimate after you have done some of the work.

### Updating the reading list

The course uses materials available in November 2026. The research page is dated; it does not claim to describe the 2027 frontier. Before an experiment, check the official documentation, record your software and model versions, and read a recent paper on your question. Keep older explanations when they still teach the topic well.
