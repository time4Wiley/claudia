# Stream Processing

Stream processing in [[Claudia]] handles the real-time transformation of [[Claude Code CLI]] output into GUI elements.

## Overview

The system processes JSONL (JSON Lines) format output from Claude Code and transforms it into interactive UI components.

## Message Flow

### 1. CLI Output Format

Claude Code outputs structured JSON messages:
```json
{"type":"system","subtype":"init","session_id":"...","model":"claude-3.5-sonnet"}
{"type":"user","message":{"content":[{"type":"text","text":"User prompt"}]}}
{"type":"assistant","message":{"content":[{"type":"text","text":"Response"}]}}
{"type":"assistant","message":{"content":[{"type":"tool_use","name":"bash","input":{...}}]}}
```

### 2. Event System

**Backend Event Emission** (`src-tauri/src/commands/claude.rs:1110-1173`)
- Reads stdout/stderr line by line
- Emits events via Tauri's event system
- Session-scoped events prevent cross-talk

**Frontend Event Handling** (`src/components/ClaudeCodeSession.tsx:452-575`)
```typescript
// Dynamic listener switching strategy
// Start with generic listeners
await listen<string>('claude-output', handleStreamMessage);

// Switch to session-specific once ID known
await listen<string>(`claude-output:${sessionId}`, handleStreamMessage);
```

### 3. Message Parsing

**[[StreamMessage Component]]** handles rendering:
- Parses message type and structure
- Routes to appropriate widget
- Manages tool result correlation

## Message Types

### System Messages
- `init` - Session initialization
- `info` - Status updates
- `error` - Error conditions

### Content Messages
- `text` - Markdown content
- `thinking` - Internal reasoning
- `tool_use` - Tool invocations
- `tool_result` - Tool outputs

## Widget System

Tool outputs are rendered by specialized widgets:

- **[[BashWidget]]** - Terminal commands
- **[[EditWidget]]** - File modifications
- **[[ReadWidget]]** - File content display
- **[[TodoWidget]]** - Task management
- **[[WebSearchWidget]]** - Search results

## Performance Optimizations

### Virtual Scrolling
- Uses `@tanstack/react-virtual` for message list
- Only renders visible messages
- Handles thousands of messages efficiently

### Message Filtering
- Skips redundant tool results
- Hides system metadata messages
- Collapses repetitive content

## Related Components

- [[Claude Code Interface]] - Main integration
- [[Process Management]] - Process control
- [[Tool Widgets]] - UI components