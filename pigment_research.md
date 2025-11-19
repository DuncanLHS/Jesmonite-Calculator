# Jesmonite Pigment Research & Integration Plan

## Research Findings

### Maximum Pigment Loading
*   **Limit**: The maximum recommended pigment addition is **2% by weight** of the total mix (Base + Liquid).
*   **Consequences**: Exceeding 2% can retard the setting process, reduce durability, and cause the material to become brittle.
*   **Metric**: 20g of pigment per 1kg of total mix.

### Product Specific Variations
*   **AC100, AC200, AC300**: The **2% maximum** rule applies to all these standard composite liquids.
*   **AC730**: This is often pre-pigmented. If adding extra pigment, use **max 2% liquid** (for light shifts) or **max 5% powder**. Note that AC730 is granular so colors may be less vivid.
*   **Flex Metal**: Pigments are used sparingly (e.g., 2-4g per batch) to augment the metal color (e.g., adding black to bronze), not as a primary colorant.


### Mixing Instructions
*   **Best Practice**: Add pigment to the **Liquid** component first and mix thoroughly before adding the Base powder.
*   **Alternative**: Can be added to the final mix for effects (e.g., marbling), but less consistent for solid colors.
*   **Tools**: Requires accurate scales (1g increments or better).

### Color Intensity Guide
*   **Pastel/Light**: A few drops (significantly less than 2%).
*   **Bold/Saturated**: Up to 2%.
*   **Note**: Pigments are very strong; "less is more".

## Integration Plan

### 1. User Interface Updates
*   **New Input Field**: Add a section for "Pigment / Color".
    *   **Option A (Simple)**: A slider or number input for "Pigment Loading (%)" ranging from 0% to 2%.
    *   **Option B (Guided)**: Presets for "Pastel (0.5%)", "Medium (1%)", "Bold (2%)", and "Custom".
*   **Placement**: Place this near the "Water Weight" input or in a separate "Add-ons" section.

### 2. Logic Updates
*   **Calculation Basis**: Pigment is calculated as an **additive** to the base mix.
    *   `Total Mix Weight = Base Weight + Liquid Weight`
    *   `Pigment Weight = Total Mix Weight * (Pigment Percentage / 100)`
*   **Example**:
    *   Water Weight (Volume): 100g -> 100ml
    *   Total Wet Mix (Base + Liquid): 184.5g
    *   Pigment (2%): 184.5g * 0.02 = 3.69g

### 3. Code Structure Changes
*   **`src/utils/calculateMix.js`**:
    *   Update the function to accept an optional `pigmentRatio` parameter.
    *   Return `pigmentWeight` in the result object.
*   **`src/components/Calculator.jsx`**:
    *   Add state for `pigmentRatio`.
    *   Update the UI to display the calculated `pigmentWeight`.

### 4. Future Considerations
*   **Multiple Pigments**: Allow users to mix pigments (e.g., 50% Red, 50% Blue) to reach the total percentage.
*   **Thinner/Retarder**: Similar additive logic applies to other additives like Retarder.
