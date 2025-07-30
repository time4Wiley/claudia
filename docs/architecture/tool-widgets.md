# Tool Widgets

Tool widgets are specialized React components that render [[Claude Code CLI]] tool invocations and their results in the GUI.

## Overview

When Claude uses a tool (like reading a file or running a command), [[Claudia]] renders it with a purpose-built widget instead of plain text output.

## Widget Architecture

### Base Pattern

All tool widgets follow a consistent pattern:
1. Display tool invocation with parameters
2. Show loading state during execution
3. Render results in appropriate format
4. Provide interaction options (copy, expand/collapse)

### Component Structure
```typescript
interface ToolWidgetProps {
  // Tool input parameters
  input: ToolInput;
  // Result from tool execution
  result?: ToolResult;
  // Additional UI callbacks
  onAction?: () => void;
}
```

## Core Widgets

### BashWidget
**Purpose**: Display shell command execution
**Features**:
- Syntax-highlighted commands
- Collapsible output
- Exit code indicators
- URL detection for preview integration

### EditWidget
**Purpose**: Show file modifications
**Features**:
- Diff visualization
- Line number display
- Syntax highlighting
- Before/after comparison

### ReadWidget
**Purpose**: Display file contents
**Features**:
- Syntax highlighting by file type
- Line numbers
- Truncation for large files
- Copy functionality

### TodoWidget
**Purpose**: Task management display
**Features**:
- Interactive checkboxes
- Status indicators
- Priority levels
- Progress tracking

### MCPWidget
**Purpose**: Generic MCP tool rendering
**Features**:
- Dynamic tool name display
- JSON parameter formatting
- Result visualization
- Error handling

## Widget Integration

### Message Correlation

Widgets correlate tool invocations with results:
1. Tool use has unique `tool_use_id`
2. Tool result references same ID
3. Widget displays both together

Example flow in [[StreamMessage]]:
```typescript
// Extract tool results
const toolResults = new Map();
messages.forEach(msg => {
  if (msg.type === "tool_result") {
    toolResults.set(msg.tool_use_id, msg);
  }
});

// Render tool with result
<EditWidget input={toolUse.input} result={toolResults.get(toolUse.id)} />
```

### Custom Rendering

Widgets provide rich displays:
- **Code**: Syntax highlighting via Prism
- **Diffs**: Side-by-side or unified views
- **Trees**: Hierarchical file browsers
- **Tables**: Structured data display

## Performance Considerations

### Lazy Loading
- Large outputs rendered on demand
- Virtual scrolling for long lists
- Progressive enhancement

### Memoization
- Widget outputs cached
- Expensive computations memoized
- Re-renders minimized

## Creating New Widgets

To add a new tool widget:

1. Create component in `src/components/ToolWidgets/`
2. Define props interface with tool inputs
3. Handle loading and result states
4. Add to widget registry in StreamMessage
5. Export from ToolWidgets index

## Related Systems

- [[Stream Processing]] - Message handling
- [[Claude Code Interface]] - Integration layer
- [[StreamMessage]] - Parent component