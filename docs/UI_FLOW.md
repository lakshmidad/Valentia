# HeartLink User Interface Flow
> **Premium Experience Design (Glassmorphism & Soft Gradients)**

## 1. Landing Page (Home)
**Goal**: Captivate the user immediately and guide them to "Create".
*   **Hero Section**:
    *   **Background**: Soft animated gradient mesh (Pink/Peach/Lavender) or floating 3D hearts.
    *   **Headline**: "Send More Than a Text. Send a Heartbeat." (Animated typing effect).
    *   **Subtext**: "Create a magical, timed digital surprise for your Valentine today."
    *   **CTAs**:
        *   Primary Button (Big, Glowing): "Create a HeartLink 💘"
        *   Secondary Button (Outline): "See an Example" (Opens a demo modal).
*   **Features Strip**: 3 simple icons showing "Write -> Customize -> Share".

## 2. The Creator Studio (Single Page App Feel)
**Goal**: Smooth, frictionless creation process. Use a "Step Wizard" approach but keep it all on one fluid screen if possible.

### Step 1: The Basics (Input)
*   *Floating Glass Card centered on screen.*
*   **Input Fields**:
    *   "Who is this for?" (Recipient Name)
    *   "From?" (Sender Name)
    *   "Your Heartfelt Message" (Text Area with character counter).
    *   **Action**: "AI Cupid" Button (small robot icon) next to text area.
        *   *On Click*: Opens dropdown -> "Generate: Funny, Romantic, Poetry".

### Step 2: Set the Vibe (Customization)
*   **Theme Carousel**:
    *   Cards showing "Cute", "Romantic", "Dark Mode/Neon".
    *   *Interaction*: Clicking a theme instantly updates the background of the Creator Studio to preview it.
*   **Media**:
    *   **Upload Photo**: Drag & Drop zone (styled like a polaroid frame).
    *   **Background Music**: Toggle Switch "Add Meaningful Tune".
        *   Dropdown: "Piano Love", "Upbeat Pop", "Lofi Chill", OR "Paste YouTube Link".

### Step 3: The Unlock (Settings)
*   **Reveal Method**:
    *   Radio Buttons: "Countdown Timer" vs "Scratch-to-Reveal" vs "Geofenced Location".
*   **Timer Settings**:
    *   "Unlock on Feb 14th at [Time]" OR "Unlock in [X] Minutes".

### Step 4: Preview & Ignite
*   **Live Preview Button**: Opens a full-screen overlay showing exactly what Recipient sees.
*   **Main Action**: "Generate HeartLink 🚀" (Pulsing button).

## 3. The "Link Ready" Success Page
**Goal**: Make sharing easy and exciting.
*   **Visual**: A sealed envelope animation pop-up.
*   **The Link**:
    *   Input box with the URL (`heartlink.com/m/lovenote1`) + "Copy" button.
*   **Share Options**:
    *   Direct WhatsApp / Telegram / Messenger buttons.
    *   "Email this link to [Recipient Email]".

## 4. The Recipient Experience (The "View" Page)
**Goal**: Suspense -> Reveal -> Emotion.

### Phase 1: The Lock Screen
*   **Context**: Recipient clicks link -> Lands here.
*   **Visual**:
    *   Big throbbing Heart or a Locked Envelope in center.
    *   **Text**: "A special message from [Sender] is waiting for you..."
*   **Interaction**:
    *   **If Timer**: Shows Countdown "00:04:32".
    *   **If Location**: "Go to [Location] to unlock!"
    *   **If Ready**: "Tap to Open".

### Phase 2: The Reveal Animation
*   *User taps "Open".*
*   **Animation**:
    *   Screen floods with confetti/hearts (Canvas API).
    *   Music starts fading in.
    *   Envelope "tears" open or Heart expands to fill screen.

### Phase 3: The Message Card
*   **Layout**:
    *   **Header**: "Happy Valentine's, [Name]!" (In 'Great Vibes' font).
    *   **Photo**: The uploaded user photo (with subtle tilt animation).
    *   **Body**: The text message (scrollable if long).
    *   **Footer**:
        *   "Replay Music" / "Replay Animation".
        *   "Download Memory" (Canvas to Image).
        *   "Reply to [Sender]" (Opens WhatsApp with pre-filled "I love it!").

## 5. UI/UX Micro-Interactions
*   **Hover**: Buttons lift up and glow.
*   **Inputs**: Focus state adds a pink glow border.
*   **Loading**: A heart filling up with liquid color.
