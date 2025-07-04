<template>
  <f-accordion title="TextileCloud Input" class="bg-white w-[744px]">
    <!-- Showcase for TCInput states -->
    <div class="flex flex-col gap-6 mt-6 p-4 border border-grey-200 rounded">
      <h3 class="text-lg font-semibold">TCInput States Showcase</h3>
      <TCInput
        title="1. Enabled (Base)"
        v-model="showcaseState1"
        placeholder="Input Text"
        description="Standard enabled input."
      ></TCInput>
      <TCInput
        title="2. Hover Demo (Hover me)"
        v-model="showcaseState2"
        placeholder="Input Text"
        description="Hover over this input to see the hover effect."
      ></TCInput>
      <TCInput
        title="3. Focus Demo (Click me)"
        v-model="showcaseState3"
        placeholder="Input Text"
        description="Click into this input to see the focus effect."
      ></TCInput>
      <TCInput
        title="4. Filled"
        v-model="showcaseState4"
        placeholder="Input Text"
        description="Enabled input that has been filled."
      ></TCInput>
      <TCInput
        title="5. Negative (Empty)"
        v-model="showcaseState5"
        negative
        placeholder="Input Text"
        description="Represents an error on an empty field."
      ></TCInput>
      <TCInput
        title="6. Negative (Filled)"
        v-model="showcaseState6"
        negative
        placeholder="Input Text"
        description="Represents an error on a filled field."
      ></TCInput>
      <TCInput
        title="7. Disabled (Empty)"
        v-model="showcaseState7"
        disabled
        placeholder="Input Text"
        description="A disabled input field, empty."
      ></TCInput>
      <TCInput
        title="8. Disabled (Filled)"
        v-model="showcaseState8"
        disabled
        placeholder="Input Text"
        description="A disabled input field, filled."
      ></TCInput>
    </div>

    <!-- Showcase for TCInput Variants -->
    <div class="flex flex-col gap-6 mt-8 p-4 border border-grey-200 rounded">
      <h3 class="text-lg font-semibold">TCInput Variants Showcase</h3>

      <!-- Default Variant -->
      <TCInput
        title="Variant: Default"
        v-model="variantShowcaseDefault"
        placeholder="Default input"
        description="This is the standard input."
      ></TCInput>

      <!-- Default Left Icon Variant -->
      <TCInput
        title="Variant: Default Left Icon"
        variant="default-left-icon"
        iconLeft="visibility"
        v-model="variantShowcaseLeftIcon"
        placeholder="Input with left icon"
        description="This input has an icon on the left."
      ></TCInput>

      <!-- Default Right Icon Variant -->
      <TCInput
        title="Variant: Default Right Icon"
        variant="default-right-icon"
        iconRight="visibility_off"
        v-model="variantShowcaseRightIcon"
        placeholder="Input with right icon"
        description="This input has an icon on the right."
      ></TCInput>

      <!-- Default Button Variant -->
      <TCInput
        title="Variant: Default Button"
        variant="default-button"
        v-model="variantShowcaseButton"
        buttonText="Submit"
        placeholder="Input with button"
        description="This input has a button on the right."
      ></TCInput>

      <!-- Label Left Variant -->
      <TCInput
        title="Variant: Label Left"
        variant="Label Left"
        labelLeft="USD"
        v-model="variantShowcaseLabelLeft"
        :menuTree="labelLeftMenuTree"
        :initialSelectedValue="selectedCurrency"
        placeholder="Select currency"
        description="Input with a label on the left and a dropdown."
      ></TCInput>

      <!-- Label Right Variant -->
      <TCInput
        title="Variant: Label Right"
        variant="Label Right"
        labelRight="pcs"
        v-model="variantShowcaseLabelRight"
        :menuTree="labelRightMenuTree"
        :initialSelectedValue="selectedUnit"
        placeholder="Enter quantity"
        description="Input with a label on the right and a dropdown."
      ></TCInput>

      <!-- Phone Number Variant -->
      <TCInput
        title="Variant: Phone Number"
        variant="phone-number"
        v-model="variantShowcasePhoneNumber"
        :menuTree="phoneMenuTree"
        :initialSelectedValue="selectedPhoneCountry"
        placeholder="Enter phone number"
        description="Input with a country code selector."
      ></TCInput>
    </div>
  </f-accordion>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TCInput from '@/components/TCInput/TCInput.vue'

// State showcase data
const showcaseState1 = ref('')
const showcaseState2 = ref('')
const showcaseState3 = ref('')
const showcaseState4 = ref('Some pre-filled text')
const showcaseState5 = ref('')
const showcaseState6 = ref('Incorrect value')
const showcaseState7 = ref('')
const showcaseState8 = ref('Value cannot be changed')

// Variant showcase data
const variantShowcaseDefault = ref('')
const variantShowcaseLeftIcon = ref('Some text for left icon input')
const variantShowcaseRightIcon = ref('Some text for right icon input')
const variantShowcaseButton = ref('Input with button')
const variantShowcaseLabelLeft = ref('')
const variantShowcaseLabelRight = ref('')
const variantShowcasePhoneNumber = ref('')
const selectedPhoneCountry = ref('TW')
const selectedCurrency = ref('USD')
const selectedUnit = ref('pcs')

// Menu tree data
const labelLeftMenuTree = {
  blockList: [
    {
      menuList: [
        { title: 'USD', selectValue: 'USD' },
        { title: 'EUR', selectValue: 'EUR' },
        { title: 'GBP', selectValue: 'GBP' },
      ],
    },
  ],
}

const labelRightMenuTree = {
  blockList: [
    {
      menuList: [
        { title: 'pieces', selectValue: 'pcs' },
        { title: 'meters', selectValue: 'm' },
        { title: 'kilograms', selectValue: 'kg' },
      ],
    },
  ],
}

const phoneMenuTree = {
  blockList: [
    {
      menuList: [
        {
          title: 'United States (+1)',
          selectValue: 'US',
          flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg',
          callingCode: '+1',
        },
        {
          title: 'Canada (+1)',
          selectValue: 'CA',
          flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/CA.svg',
          callingCode: '+1',
        },
        {
          title: 'United Kingdom (+44)',
          selectValue: 'GB',
          flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/GB.svg',
          callingCode: '+44',
        },
        {
          title: 'Taiwan (+886)',
          selectValue: 'TW',
          flag: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/TW.svg',
          callingCode: '+886',
        },
      ],
    },
  ],
}
</script>
