# Figma Document - Undo/Redo System

Low-level design implementation of a document system with undo/redo functionality, similar to design tools like Figma and Photoshop.

## Overview

This implementation demonstrates the **Command Pattern** for building undo/redo functionality. The system uses two stacks (undo and redo) to track operations, allowing users to revert and replay changes to document layers and properties.

**Key Design Choices:**
- **Stack** data structure for LIFO undo/redo behavior
- **Map** for O(1) layer and property lookups
- **Command Pattern** to encapsulate operations as objects

## Structure

- `Document.ts` - Main class with undo/redo stacks and layer management
- `Layer.ts` - Layer class with properties map
- `Property.ts` - Simple key-value property object
- `test.ts` - Test suite covering core functionality and edge cases

## Running Tests

```bash
npx ts-node test.ts
```

