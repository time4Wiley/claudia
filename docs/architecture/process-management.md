# Process Management

The process management system in [[Claudia]] handles spawning, tracking, and controlling external processes, particularly [[Claude Code CLI]] sessions.

## Architecture

### ProcessRegistry (`src-tauri/src/process/registry.rs`)

Central registry for all running processes in the application.

**Key Features:**
- Tracks both agent processes and Claude sessions
- Maintains process metadata (PID, start time, project path)
- Provides graceful shutdown mechanisms
- Handles orphaned process cleanup

**Process Types:**
```rust
pub enum ProcessType {
    AgentRun {
        agent_id: i64,
        agent_name: String,
    },
    ClaudeSession {
        session_id: String,
    },
}
```

### Process Lifecycle

1. **Registration**
   - Process spawned via tokio::process::Command
   - Assigned unique run_id
   - Registered with metadata

2. **Monitoring**
   - Live output buffering
   - Status checking
   - Resource tracking

3. **Termination**
   - Graceful shutdown (SIGTERM)
   - Forced termination (SIGKILL)
   - Registry cleanup

## Integration with Claude Code

The [[Claude Code Interface]] uses ProcessRegistry for:

- **Session Tracking**: Each Claude session gets a registry entry
- **Output Streaming**: Live output buffered in registry
- **Cancellation**: Clean process termination on user request
- **Multi-Session Support**: Concurrent session management

## Related Systems

- [[ClaudeProcessState]] - Legacy single-process state
- [[Agent Execution]] - Agent process management
- [[Session Management]] - Higher-level session abstractions