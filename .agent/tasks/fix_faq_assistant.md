# Implementation Plan - Fix AI FAQ Assistant

The FAQ Assistant is currently failing with a "Failed to parse response" error. This plan outlines the steps to diagnose and fix the issue, ensuring the AI-powered support assistant functions correctly.

## Problem Analysis
- **Symptom**: The FAQ chat interface shows "Support Error: Failed to parse response".
- **Evidence**: Browser console logs show that the `interview-ai` edge function is returning `{error: "Failed to parse response"}`.
- **Hypothesis**: 
    1. The AI model is returning content that is not valid JSON or does not contain a JSON block.
    2. The JSON cleaning logic in `callAIWithValidation` is too strict or failing on edge cases.
    3. The `LOVABLE_API_KEY` is not correctly configured, causing the gateway to fail with a response that isn't handled gracefully.
    4. "Failed to parse response" might be a default error from a library or the gateway itself.

## Steps to Fix

### 1. Enhance Backend Logging
- Update `supabase/functions/interview-ai/index.ts` to log the raw response from the AI gateway before any processing.
- Log specific errors during JSON extraction and cleaning.

### 2. Refine JSON Extraction
- Improve the regex and logic for finding JSON blocks.
- Ensure it handles potential prefixes or suffixes often added by LLMs (like "Here is the answer:").

### 3. Verify API Configuration
- Check if `LOVABLE_API_KEY` or `OPENAI_API_KEY` are being correctly retrieved from `Deno.env`.
- Add more fallback logic if the gateway returns non-content data.

### 4. Improve Frontend UI Feedback
- Display more descriptive error messages if the backend provides them.

### 5. Deployment and Verification
- Deploy the updated edge function (if necessary, or assume local dev handles it).
- Re-run the browser subagent test to verify the fix.

## Success Criteria
- The FAQ Assistant successfully answers questions like "What is InterviewPrep?" with a relevant response.
- No "Failed to parse response" errors appear in the chat.
