# Claudia CLI Tools Extraction Plan

## Executive Summary

This document outlines a comprehensive plan to extract CLI tools from the Claudia GUI application for everyday Claude Code usage. These tools will provide direct terminal access to Claudia's powerful features, enabling automation, scripting, and integration with existing developer workflows.

## Core Philosophy

The extracted CLI tools should:
- Be modular and focused on specific functionality
- Leverage existing Rust backend commands with minimal modifications
- Provide intuitive command structures following Unix conventions
- Support both interactive and scriptable usage
- Maintain compatibility with the GUI application's data structures

## Proposed CLI Tools Suite

### 1. `claudia` - Main CLI Entry Point

**Purpose**: Unified entry point for all Claudia functionality, similar to `git` or `docker`

**Why**: Provides a consistent interface and reduces namespace pollution

```bash
claudia session      # Session management
claudia agent        # Agent operations
claudia mcp          # MCP server management
claudia usage        # Usage analytics
claudia checkpoint   # Timeline/checkpoint management
claudia config       # Configuration management
claudia db           # Database operations
claudia cmd          # Slash command management
```

### 2. `claudia session` - Claude Code Session Manager

**Purpose**: Manage Claude Code sessions directly from the terminal

**Why**: Enables quick task execution without GUI, supports automation of repetitive tasks

**Key Commands**:
```bash
claudia session list                                    # List all projects
claudia session list-sessions <project-path>            # List sessions for a project
claudia session execute -p <path> -t "implement X"      # Start new session
claudia session continue -s <session-id> -m "fix Y"     # Continue session
claudia session resume <session-id>                     # Resume specific session
claudia session cancel <session-id>                     # Cancel running session
claudia session output <session-id> [--follow]          # Get session output
claudia session recent-files <path> [-n 20]             # List recently modified files
```

**Implementation Notes**:
- Wraps existing `execute_claude_code`, `continue_claude_code`, `resume_claude_code` commands
- Adds real-time output streaming support with `--follow` flag
- Integrates with process registry for session tracking

### 3. `claudia agent` - Intelligent Agent Management

**Purpose**: Create, manage, and execute specialized AI agents

**Why**: Enables creation of reusable, task-specific AI assistants for common workflows

**Key Commands**:
```bash
claudia agent list                                      # List all agents
claudia agent create -n "Code Reviewer" -i "🔍"        # Create agent interactively
claudia agent show <id>                                 # Show agent details
claudia agent run <id> -t "review PR #123" -p <path>   # Execute agent
claudia agent export <id> -o agent.json                 # Export agent
claudia agent import -f agent.json                      # Import agent
claudia agent import-github <url>                       # Import from GitHub
claudia agent stats <id> [--from DATE --to DATE]       # Get agent metrics
claudia agent sessions <id>                             # List agent sessions
claudia agent kill <run-id>                             # Kill running agent
```

**Implementation Notes**:
- Leverages SQLite database for agent storage
- Supports both local file and GitHub imports
- Includes comprehensive metrics tracking

### 4. `claudia mcp` - Model Context Protocol Server Manager

**Purpose**: Manage MCP servers for enhanced Claude capabilities

**Why**: Simplifies MCP server setup and management, crucial for extending Claude's abilities

**Key Commands**:
```bash
claudia mcp list [--scope local|project|user]           # List MCP servers
claudia mcp add -n "my-server" -c "node server.js"     # Add new server
claudia mcp test <name>                                 # Test server connection
claudia mcp remove <name>                               # Remove server
claudia mcp status [<name>]                             # Check server status
claudia mcp import --claude-desktop                     # Import from Claude Desktop
claudia mcp import -f servers.json                      # Import from JSON
claudia mcp serve -p <project>                          # Serve project config
```

**Implementation Notes**:
- Supports stdio and SSE transports
- Integrates with Claude's native MCP functionality
- Project-specific configurations via `.mcp.json`

### 5. `claudia usage` - Usage Analytics & Cost Tracking

**Purpose**: Track Claude usage, costs, and performance metrics

**Why**: Essential for monitoring API costs and optimizing usage patterns

**Key Commands**:
```bash
claudia usage summary [--from DATE --to DATE]           # Usage summary
claudia usage cost [--model opus-4|sonnet-4]           # Cost breakdown
claudia usage by-project [--top 10]                    # Project-wise usage
claudia usage by-model                                  # Model-wise breakdown
claudia usage sessions <project>                        # Project sessions
claudia usage export --format csv|json                  # Export usage data
claudia usage monitor --threshold 50                    # Real-time monitoring
```

**Implementation Notes**:
- Real-time cost calculation based on model pricing
- Supports multiple export formats for reporting
- Threshold alerts for budget management

### 6. `claudia checkpoint` - Timeline & Version Control

**Purpose**: Manage conversation checkpoints and code evolution

**Why**: Enables experimentation with rollback capabilities, crucial for exploratory development

**Key Commands**:
```bash
claudia checkpoint create -m "Before refactoring"       # Create checkpoint
claudia checkpoint list [-p <project>]                  # List checkpoints
claudia checkpoint show <id>                            # Show checkpoint details
claudia checkpoint restore <id>                         # Restore to checkpoint
claudia checkpoint diff <from-id> <to-id>              # Compare checkpoints
claudia checkpoint fork <id> -m "Alternative approach"  # Fork from checkpoint
claudia checkpoint clean --older-than 30d               # Cleanup old checkpoints
claudia checkpoint auto --enable|disable                # Toggle auto-checkpoint
```

**Implementation Notes**:
- File-level snapshots for each checkpoint
- Supports branching timeline (fork functionality)
- Configurable auto-checkpoint strategies

### 7. `claudia config` - Configuration Management

**Purpose**: Manage Claudia and Claude settings from terminal

**Why**: Enables consistent configuration across environments, supports automation

**Key Commands**:
```bash
claudia config get [<key>]                              # Get configuration
claudia config set <key> <value>                        # Set configuration
claudia config claude-settings                          # Show Claude settings
claudia config set-binary <path>                        # Set Claude binary path
claudia config list-binaries                            # List Claude installations
claudia config hooks list                               # List hooks
claudia config hooks add <name> <command>               # Add hook
claudia config hooks validate                           # Validate hooks
claudia config prompt [--edit]                          # View/edit CLAUDE.md
```

**Implementation Notes**:
- Manages both Claudia-specific and Claude settings
- Hook validation ensures security
- CLAUDE.md management for system prompts

### 8. `claudia cmd` - Slash Command Manager

**Purpose**: Create and manage custom slash commands

**Why**: Enables creation of reusable prompts and workflows

**Key Commands**:
```bash
claudia cmd list [--scope user|project]                 # List commands
claudia cmd create <name> --scope project               # Create command
claudia cmd show <id>                                   # Show command details
claudia cmd edit <id>                                   # Edit command
claudia cmd delete <id>                                 # Delete command
claudia cmd run <command> [args...]                     # Execute command
```

**Implementation Notes**:
- Supports namespaced commands (e.g., `/project:frontend:component`)
- YAML frontmatter for metadata
- Argument substitution with `$ARGUMENTS`

### 9. `claudia db` - Database Management Utility

**Purpose**: Direct database access for advanced users

**Why**: Enables custom queries, data export, and troubleshooting

**Key Commands**:
```bash
claudia db tables                                       # List all tables
claudia db schema <table>                               # Show table schema
claudia db query "SELECT * FROM agents"                 # Execute SQL query
claudia db export <table> --format csv|json|sql        # Export table data
claudia db import <table> -f data.csv                   # Import data
claudia db backup -o backup.db                          # Backup database
claudia db reset --confirm                              # Reset database
```

**Implementation Notes**:
- Safe SQL execution with parameter binding
- Multiple export formats for interoperability
- Backup/restore functionality

## Implementation Strategy

### Phase 1: Core Infrastructure (Week 1-2)
1. Create `claudia` binary with subcommand routing
2. Set up argument parsing framework (clap)
3. Implement shared utilities (config loading, output formatting)
4. Create installation/distribution mechanism

### Phase 2: Essential Tools (Week 3-4)
1. Implement `claudia session` for basic Claude interaction
2. Implement `claudia config` for configuration management
3. Add basic `claudia usage` for cost tracking
4. Ensure compatibility with existing Rust backend

### Phase 3: Advanced Features (Week 5-6)
1. Implement `claudia agent` with full CRUD operations
2. Add `claudia mcp` for server management
3. Implement `claudia checkpoint` for timeline control
4. Add comprehensive error handling and logging

### Phase 4: Polish & Integration (Week 7-8)
1. Implement remaining tools (`claudia cmd`, `claudia db`)
2. Add shell completion support
3. Create comprehensive documentation
4. Add integration tests

## Technical Considerations

### Code Reuse Strategy
- Extract command handlers from Tauri commands into shared library
- Create thin CLI wrappers around existing business logic
- Maintain single source of truth for data structures

### Error Handling
- Consistent error messages with actionable information
- Exit codes following Unix conventions
- JSON output mode for scripting (`--json` flag)

### Configuration
- Respect existing `~/.claude/` directory structure
- Support environment variables for common settings
- Configuration file precedence: CLI args > env vars > config file

### Output Formatting
- Human-readable output by default
- Machine-readable formats (JSON, CSV) with flags
- Progress indicators for long-running operations
- Quiet mode for scripting (`-q` flag)

## Benefits of CLI Tools

### For Developers
- **Automation**: Script repetitive tasks
- **Integration**: Integrate with existing tools and workflows
- **Speed**: Faster than GUI for experienced users
- **Remote Access**: Use over SSH without GUI

### For Teams
- **CI/CD Integration**: Automate code reviews, testing
- **Standardization**: Share agents and configurations
- **Documentation**: Commands are self-documenting
- **Version Control**: Track agent definitions and configs

### For Power Users
- **Batch Operations**: Process multiple projects/sessions
- **Custom Workflows**: Build complex automation
- **Data Analysis**: Export and analyze usage data
- **Debugging**: Direct access to internals

## Success Metrics

1. **Adoption Rate**: Number of CLI downloads/installs
2. **Usage Frequency**: Daily active CLI users
3. **Feature Coverage**: Percentage of GUI features available in CLI
4. **Performance**: CLI command execution time vs GUI operations
5. **Community Feedback**: GitHub issues, feature requests

## Conclusion

The proposed CLI tools will transform Claudia from a GUI-only application into a comprehensive Claude Code toolkit. By providing programmatic access to all features, we enable developers to integrate Claude into their existing workflows, automate repetitive tasks, and build powerful custom solutions.

The modular design ensures each tool can evolve independently while maintaining consistency through the unified `claudia` command. This approach balances ease of use for beginners with power and flexibility for advanced users.