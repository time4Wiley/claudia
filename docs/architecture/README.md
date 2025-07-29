# Claudia Architecture Documentation

This directory contains foam-style cross-referenced documentation about Claudia's architecture, focusing on how it interfaces with Claude Code CLI.

## Core Documentation

### [[Claude Code Interface]]
The main integration between Claudia's GUI and Claude Code's CLI. This document explains:
- How terminal commands are transformed into GUI interactions
- The event-based streaming architecture
- Message parsing and widget rendering

### [[Process Management]]
Details the system for spawning and managing external processes:
- ProcessRegistry for tracking active sessions
- Graceful shutdown mechanisms
- Multi-session support

### [[Stream Processing]]
Explains the real-time message processing pipeline:
- JSONL parsing
- Event routing
- Message type handling

### [[Tool Widgets]]
Documents the specialized UI components for tool outputs:
- Widget architecture
- Core widget types
- Creating custom widgets

### [[Session Management]]
Covers session persistence and lifecycle:
- Storage format and structure
- Session resumption
- History tracking

## Key Concepts

### Terminal to GUI Transformation

Claudia transforms Claude Code's terminal interface into a rich GUI experience:

1. **Command Execution**: User prompts → CLI commands with JSON output
2. **Stream Processing**: JSONL output → Structured messages
3. **Event System**: Backend events → Frontend listeners
4. **Widget Rendering**: Tool invocations → Interactive UI components

### Architecture Principles

- **Process Isolation**: Each session runs in its own process
- **Event-Driven**: Asynchronous message streaming
- **Component-Based**: Modular widget system
- **Session-Scoped**: Isolated event channels prevent cross-talk

## Navigation

Use your editor's wiki-link navigation to explore the interconnected documentation. Each `[[link]]` connects to related concepts and implementation details.

## Quick Links

- Source: [ClaudeCodeSession.tsx](../../src/components/ClaudeCodeSession.tsx)
- Backend: [claude.rs](../../src-tauri/src/commands/claude.rs)
- Process: [registry.rs](../../src-tauri/src/process/registry.rs)
- Widgets: [ToolWidgets/](../../src/components/ToolWidgets/)