# Voiceover timing guide

The animation is timed to these marks (about 169 words per minute). Read each paragraph so it starts near its time. Small drift is fine; if a paragraph runs long, speed up slightly in the next one.

## 0:00.0 – 0:40.0 · Cold Open

| Start | End | Line |
|---|---|---|
| 0:00.0 | 0:06.8 | **[HOOK 1]** Your TV is off. The screen is black. The room is silent. So why is the microphone still awake? |
| 0:06.8 | 0:20.7 | **[HOOK 2]** In September 2026, a team of researchers left a brand-new LG TV sitting in standby, cut off its internet, and simply talked around it. Days later, they plugged the internet back in… and watched what the TV did next. |
| 0:20.7 | 0:30.0 | This isn't really a story about one brand. It's about a machine we put in the most private room of our homes, and then forgot about. |
| 0:30.0 | 0:40.0 | **[HOOK 3]** And stay till the end, because I'll give you five settings every smart TV owner should switch off tonight. The last one is the one almost nobody does. |

## 0:40.0 – 1:26.0 · The Investigation

| Start | End | Line |
|---|---|---|
| 0:40.0 | 0:58.8 | On September 7th, 2026, the hardware channel Gamers Nexus published a video more than two hours long. They had teamed up with Level1Techs and a group of independent security researchers. Together, they spent more than five hundred hours and roughly seventy thousand dollars testing retail LG OLED televisions, including the 2025 LG G5. |
| 0:58.8 | 1:05.1 | They captured every packet the TVs sent, decompiled the firmware, and read the system logs line by line. |
| 1:05.1 | 1:24.2 | **[HOOK 4]** What they say they found falls into three parts. The first is about what your TV hears. The second is about what it sees inside your house. Not on the screen. Inside your house. And the third is the scariest, because it isn't about LG at all. It's about who else could get in. |
| 1:24.2 | 1:26.0 | Let's open the first box. |

## 1:26.0 – 2:35.0 · How a TV Hears You

| Start | End | Line |
|---|---|---|
| 1:26.0 | 1:43.4 | First, how does a smart TV listen? Many LG TVs have a microphone in the remote, and some have one built right into the TV. That's called far-field voice recognition, the same idea as a smart speaker. It listens for a wake word, and for LG, that's "Hi LG." |
| 1:43.4 | 2:04.8 | Here's how it's supposed to work. A small, low-power chip keeps the last few seconds of sound in a short memory buffer, like a loop of tape that keeps recording over itself. It compares that loop to the wake word. No match? The audio is thrown away. Match? The TV wakes up and sends your command off to be understood. |
| 2:04.8 | 2:17.2 | **[HOOK 5]** Remember that loop of tape, because the whole story hangs on it. The question isn't whether your TV has a microphone. It's what really happens to that loop when it's supposed to be thrown away. |
| 2:17.2 | 2:28.2 | One more piece. Many LG TVs have a feature called Always Ready. When the TV looks off, it often isn't fully off. It's in a low-power mode, ready to wake instantly. |
| 2:28.2 | 2:35.0 | **[HOOK 6]** Which means that black screen in front of you might be the least honest thing in your living room. |

## 2:35.0 – 3:49.0 · What They Found: The Audio

| Start | End | Line |
|---|---|---|
| 2:35.0 | 2:52.0 | According to the investigation, with the screen apparently off and the TV in standby, the set kept capturing audio from its microphone. The researchers say it picked up background sound from as far as twelve metres away. That's about forty feet, roughly the length of an entire house. |
| 2:52.0 | 2:58.0 | Then came the test I mentioned at the start. They cut the TV off from the internet. |
| 2:58.0 | 3:10.1 | **[HOOK 7]** Think about it. If a TV only listens for a wake word and deletes everything else, cutting the internet changes nothing. There's nothing waiting to be sent. But that's not what they say happened. |
| 3:10.1 | 3:18.9 | Audio and text files reportedly piled up in the TV's local storage while it was offline. And the moment the connection came back… they uploaded. |
| 3:18.9 | 3:34.8 | **[HOOK 8]** And there was one clip in the report that people couldn't stop sharing. The researchers had finished talking to the TV. They'd moved on to a normal conversation. And the TV, they say, kept writing down what they were saying, word for word, as text. |
| 3:34.8 | 3:43.0 | **[HOOK 9]** Now, LG says this is not true. We'll get to their response. And there's one word in it that most people completely missed. |
| 3:43.0 | 3:49.0 | **[HOOK 10]** But first, the TV wasn't only listening to the room. It was also looking around your house. |

## 3:49.0 – 4:35.0 · What They Found: The Network Scan

| Start | End | Line |
|---|---|---|
| 3:49.0 | 4:01.4 | Your TV sits on the same Wi-Fi as everything else you own. According to the packet captures, the tested TVs repeatedly scanned that network for other devices that have nothing to do with watching TV. |
| 4:01.4 | 4:10.9 | **[HOOK 11]** In the test lab, how many devices do you think it found? Ten? Twenty? It found thirty-eight. Smartphones. Smartwatches. A 3D printer. An air purifier. Even thermostats. |
| 4:10.9 | 4:19.1 | The researchers say it also collected the names of nearby Wi-Fi networks, including your neighbours', along with their signal strength and location data. |
| 4:19.1 | 4:28.6 | **[HOOK 12]** So why would a TV need to know the name of your neighbour's Wi-Fi? Hold that thought, because the answer is the reason this entire industry exists. |
| 4:28.6 | 4:35.0 | According to the report, some of this data went to LG Ad Solutions, which is LG's advertising business. |

## 4:35.0 – 5:17.0 · The Hacking Part

| Start | End | Line |
|---|---|---|
| 4:35.0 | 4:48.2 | Now the third finding. The researchers say they discovered remote-code-execution vulnerabilities in the TV's software. In simple words, these are bugs that could let an attacker run their own code on your TV without ever touching it. |
| 4:48.2 | 4:55.3 | In a proof-of-concept demo, they showed that a compromised TV could switch on its built-in microphone while sitting in standby. |
| 4:55.3 | 5:03.1 | **[HOOK 13]** So even if you trust LG completely, the real question becomes this: do you trust every hacker who finds the same bug? |
| 5:03.1 | 5:08.1 | The researchers reported these flaws to LG privately so they can be fixed first. |
| 5:08.1 | 5:17.0 | **[HOOK 14]** And if you think a government would never turn a TV into a spy… that already happened. Years ago. I'll show you in a moment. |

## 5:17.0 – 6:03.0 · LG's Response

| Start | End | Line |
|---|---|---|
| 5:17.0 | 5:40.7 | LG strongly denied the claims. It says its TVs do not continuously record or transmit conversations, and that voice is only processed when you hold the remote's voice button, or say "Hi LG" after turning that feature on. If no wake word is detected, LG says the audio is not stored or sent anywhere. LG also says content recognition, voice recognition and personalised ads are optional. |
| 5:40.7 | 5:51.9 | **[HOOK 15]** Did you catch the word? Optional. Not off. Optional. Critics pointed out that LG's statement didn't fully explain the network scanning, how much data is collected, or who it's shared with. |
| 5:51.9 | 6:03.0 | **[HOOK 16]** So who's right? Honestly, until regulators independently test these TVs, nobody can say for sure. But some of this isn't a claim at all. Some of it has already been proven. |

## 6:03.0 – 7:06.0 · It's Happened Before

| Start | End | Line |
|---|---|---|
| 6:03.0 | 6:11.4 | 2015. Samsung's own privacy policy warned that if your spoken words included sensitive information, it could be captured and sent to a third party. |
| 6:11.4 | 6:21.3 | 2017. The US Federal Trade Commission said Vizio had collected second-by-second viewing data from around eleven million TVs without proper consent. Vizio paid two point two million dollars. |
| 6:21.3 | 6:34.0 | **[HOOK 17]** Also 2017. WikiLeaks published leaked CIA documents describing a tool called Weeping Angel. It could put certain Samsung TVs into a "Fake-Off" mode. The screen went black, the lights went off… and the microphone kept recording. |
| 6:34.0 | 6:39.3 | 2019. The FBI publicly warned that hackers could take over smart TV cameras and microphones. |
| 6:39.3 | 7:06.0 | **[HOOK 18]** And then there's the one your TV is probably doing right now: Automatic Content Recognition, or ACR. Your TV can take pictures of what's on your screen. Not once. Over and over. A 2024 university study found Samsung TVs capturing the screen about twice every second, and LG TVs even more often. Even when the TV was just a monitor for a game console. In 2025, Texas sued Samsung, LG, Sony, Hisense and TCL over it. |

## 7:06.0 – 7:45.0 · Why? Follow the Money

| Start | End | Line |
|---|---|---|
| 7:06.0 | 7:21.6 | Remember the question about your neighbour's Wi-Fi? Here's the answer. Location and nearby devices help advertisers figure out who you are, where you live, and which phone belongs to the person watching. That lets an ad on your TV follow you to your phone. |
| 7:21.6 | 7:41.4 | **[HOOK 19]** And here's the part that will change how you look at that cheap 65-inch TV deal. In 2021, Vizio revealed it was making more profit from ads and viewing data than from selling the TVs themselves. LG's ad business says it can reach more than three hundred and sixty million connected devices in the US alone. |
| 7:41.4 | 7:45.0 | **[HOOK 20]** So maybe the TV isn't the product. Maybe you are. |

## 7:45.0 – 8:47.0 · How to Protect Yourself (+ Next Video)

| Start | End | Line |
|---|---|---|
| 7:45.0 | 7:52.5 | Here's the fix. Menu names change by model, but on an LG TV, open Settings, then General, and look for these. |
| 7:52.5 | 7:57.1 | One. Turn off Always Ready and Quick Start, so off actually means off. |
| 7:57.1 | 8:02.8 | Two. Turn off voice recognition and the "Hi LG" wake word if you don't use them. |
| 8:02.8 | 8:10.7 | Three. Under User Agreements, untick viewing information, voice information, and personalised ads. On other brands, look for "viewing information" or "content recognition." |
| 8:10.7 | 8:16.7 | Four. Put your TV on a separate guest Wi-Fi, so it can't see your phones and laptops. |
| 8:16.7 | 8:28.1 | **[HOOK 21]** And five, the one almost nobody does: don't connect your smart TV to the internet at all. Plug in a streaming stick you trust, and let the TV just be a screen. |
| 8:28.1 | 8:47.0 | **[HOOK 22, 23]** But your TV isn't the only device in your home with an always-on microphone. There's one in your pocket… and one you might soon be wearing on your face. That's what we're breaking down next. Subscribe so you don't miss it, and tell me in the comments: are you unplugging your TV tonight? |

