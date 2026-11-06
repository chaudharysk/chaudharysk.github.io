# Portfolio voice assets

Three original greeting WAVs and 75 prepared MP3 narrations cover the 24 reviewed public portfolio topics plus one outside-scope response for each guide. Topic filenames match assets/portfolio-knowledge.json. Audio contains only the curated public facts and the fixed scope response.

Rendered locally with installed Windows System.Speech voices: JARVIS = Microsoft David Desktop, low pitch, 92% rate; FRIDAY = Microsoft Hazel Desktop, high pitch, 101% rate; EDITH = Hazel, medium pitch, 96% rate. Original public text was used; no film recordings or actor voice cloning. The existing imageio-ffmpeg binary compressed topic files to 48kbps mono MP3. The three original greeting WAVs are retained. User volume and stop controls are in the interface. Files load only when requested.

Prepared narration is the default. The optional browser/device voice selector uses available English voices and marks online ones. If a selected device voice fails, known portfolio topics can fall back to these files. There is no audio autoplay or microphone input.
