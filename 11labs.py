import os
from elevenlabs.client import ElevenLabs

class VoiceService:
    def __init__(self, api_key):
        self.client = ElevenLabs(api_key=api_key)
        self.output_dir = "./static/audio"
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

        # Map frontend language strings to specific ElevenLabs voice IDs
        self.voice_map = {
            "English": "DODLEQrClDo8wCz460ld", # Lauren, English voice
            "Español": "qvN99qHpu3uqmqBD6pEt", # Jay Y Perez, Spanish voice
            "Français": "zPy2sgLU4pZ7Xrjh87uz" # Justine, French voice
        }

    def generate_audio(self, text, language, filename="bill_summary.mp3"):
        """Converts RAG output into an MP3 using a language-specific voice."""
        try:
            # Fallback to English voice if language not found
            selected_voice = self.voice_map.get(language, self.voice_map["English"])
            
            audio_gen = self.client.text_to_speech.convert(
                text=text,
                voice_id=selected_voice,
                model_id="eleven_multilingual_v2",
                output_format="mp3_44100_128",
            )

            file_path = os.path.join(self.output_dir, filename)
            with open(file_path, "wb") as f:
                for chunk in audio_gen:
                    if chunk:
                        f.write(chunk)
            
            return f"/static/audio/{filename}"
        except Exception as e:
            print(f"ElevenLabs Error: {e}")
            return None