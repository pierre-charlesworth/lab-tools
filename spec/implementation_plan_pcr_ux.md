# Implementation Plan - PCR UI Refactor (Task 16)

## Goal
Refine the PCR module UI based on user feedback (Audio) to improve usability, reduce visual clutter, and prepare for Library integration.

## Proposed Changes

### 1. Primer Analyst Refactor
*   **Consolidation**: Merge the input section and the results section (melting temps, warnings) into a **Single Card** unified view.
*   **Behavior**: As user types primers, the card itself updates (no separate "Results" box).
*   **Features**:
    *   Add "Save" and "Recall" buttons (interfaces with future Library module).

### 2. Thermocycler Visualizer Refactor
*   **Header Cleanup**: Remove the external "Temperature Profile" header. Move the title *inside* the card.
*   **Protocol Selector**:
    *   Add a **Dropdown** at the top of the card.
    *   Options: Standard presets (NEB, etc.) and Saved Protocols (from Library).
*   **Layout Reorganization**:
    *   **Graph First**: displaying the visualization is the priority.
    *   **Parameters Bottom**: Move the table/inputs for temperature/time to the **bottom** of the card.
*   **Collapsible Editor**:
    *   Implement an "Expand/Collapse" button for the parameters section.
    *   *Collapsed*: Shows only the Visualizer graph + Dropdown.
    *   *Expanded*: Reveals the inputs to edit the specific plateau details.

## Dependencies
*   **Task 11 (Library)**: The "Save/Restore" and "Saved Protocols" dropdown features depend on the Library service being built. 
*   **Strategy**: We can implement the UI changes (Layout, Collapsing, Dropdown UI) first, using hardcoded/mock data for the dropdown, then connect the real Library service in Task 11.

## User Review Required
> [!NOTE]
> **Order of Operations**:
> I recommend executing this UI Refactor (Task 16) *before* the deep Library integration, or we can treat the "Save" buttons as placeholders until Task 11 is complete.

## Verification Plan
1.  **Primer Card**: Verify inputs and results are in one seamless container.
2.  **Visualizer**:
    *   Check Dropdown appears.
    *   Verify Graph is consistent.
    *   Click "Expand/Collapse" to toggle the parameter table at the bottom.
