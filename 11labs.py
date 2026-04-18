# import packages for 11labs
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play

# API key
client = ElevenLabs(
    api_key="6d0863dcbe40ba46e40e18b6bb52dcb9a7e2275ea1c405ef1c6e97e28428eeb0"
)

audio = client.text_to_speech.convert(
    text="The first move is what sets everything in motion.",
    voice_id="JBFqnCBsd6RMkjVDRZzb",
    model_id="eleven_multilingual_v2",
    output_format="mp3_44100_128",
)

play(audio)