# Is Your Smart TV Listening to You? — Full Script

- **Target length:** 8:47
- **Narration:** ~1,480 words → about 169 words per minute, a normal YouTube explainer pace. Timestamps below are calculated from the word count of each section.
- **Hooks:** 23 (marked `[HOOK #]` — do not read the tag aloud)
- Lines starting with 🎬 are animation notes, not voiceover.

**Title options**
1. Your Smart TV Is Listening… Even When It's OFF
2. Is Your Smart TV Spying on You? (How It Actually Works)
3. Your TV Is Off. So Why Is the Microphone On?

**Thumbnail:** Dark room, black TV with a glowing red mic dot and a sound wave coming out of it. Text: **"IT'S LISTENING"**

---

## 0:00 – 0:40 · Cold Open

🎬 Dark living room at night. TV off. A tiny red dot pulses on the TV. Slow push-in.

[HOOK 1] Your TV is off. The screen is black. The room is silent. So why is the microphone still awake?

🎬 Calendar flips to September 2026. A lab. A TV on standby, its network cable being pulled out.

[HOOK 2] In September 2026, a team of researchers left a brand-new LG TV sitting in standby, cut off its internet, and simply talked around it. Days later, they plugged the internet back in… and watched what the TV did next.

This isn't really a story about one brand. It's about a machine we put in the most private room of our homes, and then forgot about.

[HOOK 3] And stay till the end, because I'll give you five settings every smart TV owner should switch off tonight. The last one is the one almost nobody does.

## 0:40 – 1:26 · The Investigation

🎬 Title card: "THE INVESTIGATION". Icons: magnifying glass, packets, circuit board.

On September 7th, 2026, the hardware channel Gamers Nexus published a video more than two hours long. They had teamed up with Level1Techs and a group of independent security researchers. Together, they spent more than five hundred hours and roughly seventy thousand dollars testing retail LG OLED televisions, including the 2025 LG G5.

They captured every packet the TVs sent, decompiled the firmware, and read the system logs line by line.

🎬 Three locked boxes appear, labelled 1, 2, 3.

[HOOK 4] What they say they found falls into three parts. The first is about what your TV hears. The second is about what it sees inside your house. Not on the screen. Inside your house. And the third is the scariest, because it isn't about LG at all. It's about who else could get in.

Let's open the first box.

## 1:26 – 2:35 · How a TV Hears You

🎬 Cutaway of a Magic Remote and a TV, showing tiny microphones glowing inside.

First, how does a smart TV listen? Many LG TVs have a microphone in the remote, and some have one built right into the TV. That's called far-field voice recognition, the same idea as a smart speaker. It listens for a wake word, and for LG, that's "Hi LG."

🎬 Sound wave enters mic → turns into numbers → loops around a circular "tape" → compared to a "Hi LG" pattern → no match → trash can.

Here's how it's supposed to work. A small, low-power chip keeps the last few seconds of sound in a short memory buffer, like a loop of tape that keeps recording over itself. It compares that loop to the wake word. No match? The audio is thrown away. Match? The TV wakes up and sends your command off to be understood.

[HOOK 5] Remember that loop of tape, because the whole story hangs on it. The question isn't whether your TV has a microphone. It's what really happens to that loop when it's supposed to be thrown away.

🎬 TV screen goes black, but a power meter in the corner still shows activity.

One more piece. Many LG TVs have a feature called Always Ready. When the TV looks off, it often isn't fully off. It's in a low-power mode, ready to wake instantly.

[HOOK 6] Which means that black screen in front of you might be the least honest thing in your living room.

## 2:35 – 3:49 · What They Found: The Audio

🎬 Box 1 opens. Lab view. Sound rings spread out from a TV across a floor plan; a ruler shows 12 m / 40 ft.

According to the investigation, with the screen apparently off and the TV in standby, the set kept capturing audio from its microphone. The researchers say it picked up background sound from as far as twelve metres away. That's about forty feet, roughly the length of an entire house.

Then came the test I mentioned at the start. They cut the TV off from the internet.

[HOOK 7] Think about it. If a TV only listens for a wake word and deletes everything else, cutting the internet changes nothing. There's nothing waiting to be sent. But that's not what they say happened.

🎬 Files stacking up inside the TV, labelled "audio" and "text". Cable plugs back in → files fly out to a cloud.

Audio and text files reportedly piled up in the TV's local storage while it was offline. And the moment the connection came back… they uploaded.

[HOOK 8] And there was one clip in the report that people couldn't stop sharing. The researchers had finished talking to the TV. They'd moved on to a normal conversation. And the TV, they say, kept writing down what they were saying, word for word, as text.

🎬 Stamp: "LG SAYS: NOT TRUE".

Now, LG says this is not true. We'll get to their response. [HOOK 9] And there's one word in it that most people completely missed.

[HOOK 10] But first, the TV wasn't only listening to the room. It was also looking around your house.

## 3:49 – 4:35 · What They Found: The Network Scan

🎬 Box 2 opens. Top-down house. A radar sweep comes out of the TV; device icons pop up one by one with a counter.

Your TV sits on the same Wi-Fi as everything else you own. According to the packet captures, the tested TVs repeatedly scanned that network for other devices that have nothing to do with watching TV.

[HOOK 11] In the test lab, how many devices do you think it found? Ten? Twenty? It found thirty-eight. Smartphones. Smartwatches. A 3D printer. An air purifier. Even thermostats.

🎬 Neighbour houses light up with Wi-Fi names and signal bars.

The researchers say it also collected the names of nearby Wi-Fi networks, including your neighbours', along with their signal strength and location data.

[HOOK 12] So why would a TV need to know the name of your neighbour's Wi-Fi? Hold that thought, because the answer is the reason this entire industry exists.

According to the report, some of this data went to LG Ad Solutions, which is LG's advertising business.

## 4:35 – 5:17 · The Hacking Part

🎬 Box 3 opens. Red code streams into the TV. The mic icon flips from grey to red.

Now the third finding. The researchers say they discovered remote-code-execution vulnerabilities in the TV's software. In simple words, these are bugs that could let an attacker run their own code on your TV without ever touching it.

In a proof-of-concept demo, they showed that a compromised TV could switch on its built-in microphone while sitting in standby.

[HOOK 13] So even if you trust LG completely, the real question becomes this: do you trust every hacker who finds the same bug?

The researchers reported these flaws to LG privately so they can be fixed first.

[HOOK 14] And if you think a government would never turn a TV into a spy… that already happened. Years ago. I'll show you in a moment.

## 5:17 – 6:03 · LG's Response

🎬 Split screen: left "Researchers say", right "LG says". Key words highlight as they're spoken.

LG strongly denied the claims. It says its TVs do not continuously record or transmit conversations, and that voice is only processed when you hold the remote's voice button, or say "Hi LG" after turning that feature on. If no wake word is detected, LG says the audio is not stored or sent anywhere. LG also says content recognition, voice recognition and personalised ads are optional.

🎬 The word "OPTIONAL" zooms out of the statement and fills the screen.

[HOOK 15] Did you catch the word? Optional. Not off. Optional. Critics pointed out that LG's statement didn't fully explain the network scanning, how much data is collected, or who it's shared with.

So who's right? Honestly, until regulators independently test these TVs, nobody can say for sure. [HOOK 16] But some of this isn't a claim at all. Some of it has already been proven.

## 6:03 – 7:06 · It's Happened Before

🎬 Timeline animation: 2015 → 2017 → 2019 → 2024 → 2025.

2015. Samsung's own privacy policy warned that if your spoken words included sensitive information, it could be captured and sent to a third party.

2017. The US Federal Trade Commission said Vizio had collected second-by-second viewing data from around eleven million TVs without proper consent. Vizio paid two point two million dollars.

🎬 Leaked document style. A Samsung TV goes dark, but a red "REC" dot stays on.

Also 2017. WikiLeaks published leaked CIA documents describing a tool called Weeping Angel. [HOOK 17] It could put certain Samsung TVs into a "Fake-Off" mode. The screen went black, the lights went off… and the microphone kept recording.

2019. The FBI publicly warned that hackers could take over smart TV cameras and microphones.

🎬 Camera shutter clicks rapidly over a TV screen; tiny thumbnails fly to a server.

[HOOK 18] And then there's the one your TV is probably doing right now: Automatic Content Recognition, or ACR. Your TV can take pictures of what's on your screen. Not once. Over and over. A 2024 university study found Samsung TVs capturing the screen about twice every second, and LG TVs even more often. Even when the TV was just a monitor for a game console. In 2025, Texas sued Samsung, LG, Sony, Hisense and TCL over it.

## 7:06 – 7:45 · Why? Follow the Money

🎬 Dollar signs flow from TV → ad company → phone.

Remember the question about your neighbour's Wi-Fi? Here's the answer. Location and nearby devices help advertisers figure out who you are, where you live, and which phone belongs to the person watching. That lets an ad on your TV follow you to your phone.

[HOOK 19] And here's the part that will change how you look at that cheap 65-inch TV deal. In 2021, Vizio revealed it was making more profit from ads and viewing data than from selling the TVs themselves. LG's ad business says it can reach more than three hundred and sixty million connected devices in the US alone.

[HOOK 20] So maybe the TV isn't the product. Maybe you are.

## 7:45 – 8:47 · How to Protect Yourself (+ Next Video)

🎬 Checklist, each item ticks green as it's spoken. Small note on screen: "Menu names vary by model".

Here's the fix. Menu names change by model, but on an LG TV, open Settings, then General, and look for these.

One. Turn off Always Ready and Quick Start, so off actually means off.

Two. Turn off voice recognition and the "Hi LG" wake word if you don't use them.

Three. Under User Agreements, untick viewing information, voice information, and personalised ads. On other brands, look for "viewing information" or "content recognition."

Four. Put your TV on a separate guest Wi-Fi, so it can't see your phones and laptops.

[HOOK 21] And five, the one almost nobody does: don't connect your smart TV to the internet at all. Plug in a streaming stick you trust, and let the TV just be a screen.

🎬 Phone in a pocket glows red. Then smart glasses glow red. Cut to black.

[HOOK 22] But your TV isn't the only device in your home with an always-on microphone. There's one in your pocket… [HOOK 23] and one you might soon be wearing on your face. That's what we're breaking down next. Subscribe so you don't miss it, and tell me in the comments: are you unplugging your TV tonight?

---

## Sources

- Gamers Nexus × Level1Techs investigation (Sept 7, 2026), as reported by [Notebookcheck](https://www.notebookcheck.net/LG-smart-TVs-caught-logging-audio-with-screen-off-and-snooping-on-local-devices.1391214.0.html), [TechRadar](https://techradar.com/televisions/lg-tvs-collect-far-more-data-on-you-than-youd-expect-says-new-report-including-logging-microphone-audio-while-on-standby), [Malwarebytes](https://www.malwarebytes.com/blog/privacy/2026/09/lg-tv-flaws-could-let-attackers-listen-in-even-in-standby-mode), [CyberInsider](https://cyberinsider.com/lg-smart-tvs-found-scanning-home-networks-for-nearby-devices/), [ChannelNews](https://www.channelnews.com.au/lg-smart-tvs-are-hard-core-spying-devices-both-on-off-caught-logging-data-when-switched-off-investigation-finds/)
- LG's response: [Al Jazeera](https://www.aljazeera.com/news/2026/9/10/lg-defends-smart-tv-features-amid-audio-surveillance-allegations), [Gizmodo](https://gizmodo.com/lg-denies-its-tvs-are-spying-on-you-unless-you-opted-in-2000810968), [Gadget Review](https://www.gadgetreview.com/lg-says-its-smart-tvs-arent-secretly-recording-but-researchers-say-key-questions-remain)
- ACR study (2024): [UCL](https://www.ucl.ac.uk/news/2024/nov/smart-tv-tracking-raises-privacy-concerns/), [arXiv paper](https://arxiv.org/html/2409.06203v1)
- Texas lawsuit (Dec 2025): [TechRadar](https://www.techradar.com/televisions/your-tv-is-a-mass-surveillance-system-says-texas-and-the-state-is-suing-lg-samsung-hisense-tcl-and-more-to-stop-it), [PCWorld](https://www.pcworld.com/article/3014158/texas-sues-5-tv-makers-for-spying-on-users-with-periodic-screenshots.html)
- LG Always Ready: [LG support](https://lg.com/au/support/product-help/CT20088015-20153870948644)
- Historical facts (Samsung 2015 privacy policy, Vizio FTC 2017, CIA "Weeping Angel" 2017, FBI 2019 warning, Vizio 2021 earnings) are well-documented public events; double-check exact wording before publishing if needed.
