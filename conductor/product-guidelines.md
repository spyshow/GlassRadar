# GlassRadar Product Guidelines

## Tone & Voice: Technical & Precise
Communication within GlassRadar—both in-app text and documentation—must be concise, accurate, and direct.
- **Accuracy First:** Use exact terminology for machine states, defect types, and mold components.
- **Clarity over Chitchat:** Avoid conversational filler. Ensure operators can grasp instructions or status updates without ambiguity.
- **Standardization:** Maintain consistent naming conventions across all modules (e.g., 'IS Machine,' 'Mold Set,' 'Critical Defect').

## Visual Identity: Clean Industrial Dark Mode
The interface is designed for high-availability environments where reduced eye strain and professional clarity are paramount.
- **Theming:** A refined **Dark Mode** is the primary theme, optimized for low-light facility conditions.
- **Aesthetic:** A 'Clean & Modern' approach that avoids clutter while maintaining a professional, industrial feel.
- **Color Logic:** Use clear, bold semantic colors (e.g., Green for Running, Red for Stopped, Amber for Warning) to distinguish machine statuses instantly.
- **User Role Tags:** Each user level has a distinct color for rapid identification in management views:
    - **Admin:** `red` (High Authority)
    - **IS Operator:** `cyan`
    - **QC:** `blue`
    - **QA:** `geekblue`
    - **Mold Tech:** `orange`
    - **Mold HoS:** `volcano`
    - **Production HoS:** `purple`
    - **QA Manager:** `magenta`

## UX Principles
### 1. Glanceability
Critical production metrics and machine statuses must be readable from a distance. The layout should prioritize high-level summaries that can be understood in seconds.

### 2. Multi-Device Optimization
- **Large Screen Optimization:** The primary dashboard is tailored for desktop and large-format wall monitors common in control rooms and production offices.
- **Mobile Accessibility:** Chat functionality, alert notifications, and basic tracking inputs must be fully accessible and easy to use on handheld mobile devices for staff on the move.

### 3. Rapid Information Entry
Minimize the number of clicks required for common tasks, such as logging a defect or responding to a chat, to ensure the system complements rather than hinders the production workflow.

## UI Design System: Refine Standard
To ensure rapid development and a reliable user experience, GlassRadar utilizes the **Refine Standard** design patterns.
- **Consistency:** Leverage Refine’s built-in hooks and components for data fetching and display.
- **Layouts:** Use standard Refine dashboard layouts, customized only where necessary to enhance industrial glanceability.
- **Extensibility:** Follow Refine’s architectural best practices to allow for the incremental addition of new modules (e.g., mold life tracking) without disrupting the core UI.