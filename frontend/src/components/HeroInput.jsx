import { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  InputBase,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80';

const HeroInput = ({ onSubmit, isLoading, query, setQuery, error }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // -------------------------
  // TEXT + AUDIO SUBMIT (ONE ONLY)
  // -------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    submitQuery(query, null);
  };

const submitQuery = async (textOverride = null, audioOverride = null) => {
  try {
    // 🎤 AUDIO FLOW
    if (audioOverride) {
      const formData = new FormData();
      formData.append("file", audioOverride, "recording.webm");

      const res = await fetch("http://localhost:8000/recommend-audio", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      const newQuery = data.query || "";

      if (newQuery) {
        setQuery(newQuery);
        onSubmit(newQuery);
      }

      return;
    }

    // ✍️ TEXT FLOW
    const finalQuery = textOverride ?? query;

    if (finalQuery && finalQuery.trim().length > 0) {
      onSubmit(finalQuery); // 🔥 ALWAYS pass query up
    }
  } catch (err) {
    console.error(err);
  }
};

  // -------------------------
  // MIC LOGIC
  // -------------------------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });

        setAudioBlob(blob);

        // 🔥 DIRECT SUBMIT (no waiting for React state)
        submitQuery(null, blob);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error('Mic error:', err);
      alert('Microphone access denied or not supported.');
    }
  };

  const stopRecording = () => {
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  }
};

  const handleMicClick = () => {
  if (isRecording) stopRecording();
  else startRecording();
};

  return (
    <Box
      sx={{
        minHeight: { xs: '70vh', md: '85vh' },
        display: 'flex',
        alignItems: 'center',
        color: '#ffffff',
        backgroundImage:
          'linear-gradient(135deg, rgba(15,23,42,0.65) 0%, rgba(37,99,235,0.35) 100%), url(' +
          HERO_IMAGE +
          ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h1" sx={{ mb: 2 }}>
            Your Dream Trip Starts Here
          </Typography>

          <Typography variant="h5" sx={{ mb: 4 }}>
            Tell us what you love — we&apos;ll find the perfect escape.
          </Typography>

          {/* FORM */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              gap: 1.5,
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: '999px',
              p: 1,
            }}
          >
            <InputBase
              fullWidth
              placeholder="Describe your dream trip..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                borderRadius: '999px',
                px: 4,
                background: 'linear-gradient(135deg, #60a5fa, #2563eb)',
              }}
            >
              Find
            </Button>
          </Box>

          {/* MIC BUTTON (NOT SUBMIT) */}
          <Button
            onClick={handleMicClick}
            sx={{
              mt: 3,
              width: 55,
              height: 55,
              borderRadius: '50%',
              background: isRecording
                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                : 'linear-gradient(135deg, #00D4FF, #3B82F6)',
              color: '#fff',
            }}
          >
            <MicIcon />
          </Button>

          {/* STATES */}
          {isRecording && (
            <Typography sx={{ mt: 2, color: '#00D4FF' }}>
              🎤 Recording...
            </Typography>
          )}

          {error && (
            <Typography sx={{ mt: 2, color: '#f87171' }}>
              {error}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HeroInput;