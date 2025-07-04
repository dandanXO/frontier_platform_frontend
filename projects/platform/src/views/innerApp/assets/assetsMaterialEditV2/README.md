# Assets Material Edit V2 Components

This directory contains independent components extracted from the main `AssetsMaterialEditV2.vue` file to improve code organization and maintainability.

## Components

### HeaderSection.vue

The header section component for the material edit page.

### MaterialU3mSection.vue

An independent component that handles all 3D Material (U3M) functionality, including:

- Frontier 3D Material viewer and management
- Customer uploaded 3D Material handling
- U3M status display and warnings
- 3D viewer functionality with react and legacy button components
- Upload and feedback handling

**Props:**

- `material: Material` - The material object containing U3M data
- `formFieldsMeta: FormFieldsMeta` - Form field metadata for tracking dirty states

**Key Features:**

- ✅ Self-contained U3M logic with proper reactivity
- ✅ Supports both new React-based and legacy 3D viewers
- ✅ Automatic 3D viewer availability checking
- ✅ Form change detection for U3M regeneration warnings
- ✅ Proper error handling and user feedback integration

**Dependencies:**

- Uses various U3M-related components (`MaterialU3mViewerReactButton`, `MaterialU3mViewerButton`, etc.)
- Integrates with material form validation to show warnings when fields are dirty
- Connects to asset management composables for U3M creation
- Utilizes Vuex store for permissions and modal management

### MaterialPricingForm.vue

An independent component that handles the complete Material Pricing form functionality, including:

- Public and private pricing tabs with separate pricing information
- Country of origin selection with dropdown menu
- Currency and unit selection for pricing
- Price input with big number support
- Minimum order quantity and unit configuration
- Minimum color quantity and unit configuration
- Production lead time in days
- Sample lead time in days
- Custom fields section for additional pricing metadata
- Form validation and error display for all pricing fields

### MaterialAttachmentsForm.vue

An independent component that handles the complete Material Attachments form functionality, including:

- Public and private attachment tabs with separate file management
- Drag and drop file upload support
- File type and size validation
- Public multimedia file management (images, videos, etc.)
- Private attachment file management (PDFs, documents, etc.)
- File preview and menu operations
- Cover image selection for multimedia files
- File cropping and editing capabilities
- Error handling and user feedback for upload operations
- Integration with S3 file upload service

**Props:**

- `material: Material` - The material object containing attachment and multimedia data

**Emits:**

- `selectCover: [coverId: number]` - Emitted when a multimedia file is selected as cover

**Key Features:**

- ✅ Self-contained attachment and multimedia management
- ✅ Supports both public multimedia and private attachment workflows
- ✅ Drag and drop file upload with validation
- ✅ File preview and management operations
- ✅ Cover image selection and cropping functionality
- ✅ Proper error handling and user feedback integration
- ✅ S3 file upload integration with progress tracking

**Dependencies:**

- Utilizes material form, multimedia update, and attachment update services
- Integrates with file upload utilities and S3 upload service
- Connects to Vuex store for permissions and modal management
- Uses draggable functionality for file organization

**Key Features:**

- ✅ Self-contained pricing logic with proper form binding
- ✅ Supports both public and private pricing information
- ✅ Tab-based interface for organizing pricing data
- ✅ Comprehensive validation with error display
- ✅ Integrates with material form service for consistent state management
- ✅ Uses standard UI components for consistent styling

**Dependencies:**

- Injects `MaterialFormService` for form state management and validation
- Uses Vuex store for country dropdown data
- Integrates with i18n for localized text
- Utilizes various UI components (FAccordion, FSelectDropdown, FInputText, TCTabs)

### MaterialSpecificationForm.vue

An independent component that handles the complete Material Specification form functionality, including:

- Shared specification fields (width, weight, season, remarks)
- Side-based material specification (Face Side, Middle Side, Back Side)
- Material type and construction type selection
- Content composition with dynamic field arrays
- Yarn specifications for woven materials
- Finish and feature selections
- Pantone color management
- Custom fields section

**Props:**

- `material: Material` - The material object containing specification data
- `pantoneList: PantoneColor[]` - List of available Pantone colors for color selection

**Key Features:**

- ✅ Complete material specification form in a single component
- ✅ Dynamic side tabs (Face/Middle/Back) based on material configuration
- ✅ Expandable sections for advanced fields
- ✅ Real-time form validation with error display
- ✅ Dynamic content field arrays with percentage management
- ✅ Pantone color picker and display
- ✅ Material type conditional field rendering
- ✅ Integration with material form service for unified validation

**Dependencies:**

- Uses MaterialSpecificationSharedFields for common fields
- Uses SidesTabs for tab navigation
- Integrates with MaterialFormService for form state management
- Uses various UI components for inputs and validation

## Types

### types.ts

Contains shared TypeScript interfaces:

- `FormFieldsMeta` - Interface for form field metadata used by components that need to track form state

## Usage

These components are designed to be used within the main `AssetsMaterialEditV2.vue` file but are extracted for better separation of concerns and reusability.

```vue
<template>
  <header-section
    :material-item-no="material?.itemNo"
    :material-id="materialId"
  />
  <material-u3m-section :material="material" :formFieldsMeta="formFieldsMeta" />
</template>
```
