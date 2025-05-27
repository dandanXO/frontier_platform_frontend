// =============================================================================
// composables/useCustomerFieldForm.ts
// 提供 useForm；依 section Key 建立獨立 useFieldArray 以分開資料
// =============================================================================
import { reactive, inject, provide } from 'vue'
import { useForm, useFieldArray } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import i18n from '@frontier/i18n'
import { isValidString } from '@/utils/customField'

const t = i18n.global.t
const customFieldOptionSchema = z.object({
  customFieldOptionId: z.number().nullable(),
  text: z.string().min(1, t('WW0002')),
  sort: z.number(),
})

export const customFieldSchema = (
  fieldNames: { customFieldId: number; name: string }[],
  customFieldId: number | null
) => {
  return z.object({
    name: z
      .string()
      .min(1, t('WW0002'))
      .max(80, {
        message: t('WW0003'),
      })
      .refine((name) => {
        return !fieldNames.some(
          (fieldName) =>
            fieldName.name === name && fieldName.customFieldId !== customFieldId
        )
      }, t('WW0001'))
      .refine((name) => {
        return isValidString(name)
      }, t('RR0531', { characters: '|\\":;' })),
    fieldType: z
      .number()
      .nullable()
      .refine((val) => val !== null, {
        message: t('WW0002'),
      }),
    applyTo: z
      .array(z.number())
      .min(1, { message: 't-At least one item is required' }),
    isPublic: z.boolean().default(false),
    customFieldOptionList: z
      .array(customFieldOptionSchema)
      .optional()
      .nullable()
      .superRefine((arr, ctx) => {
        const seen = new Map<string, number>()

        if (arr) {
          for (let i = 0; i < arr.length; i++) {
            const item = arr[i].text
            if (seen.has(item)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t('RR0530'),
                path: [i, 'text'],
              })
            }
            seen.set(item, i)
          }
        }
      }),
  })
}
export type CustomField = z.infer<typeof customFieldSchema>

export const customFieldSection = z.object({
  sections: z.record(z.array(customFieldSchema)),
})

// ===== symbol keys =====
export const CustomerFieldFormKey = Symbol('CustomerFieldForm')
export const SectionRegistryKey = Symbol('SectionRegistry')

// ===== create / provide form (空 sections 物件) =====
function createCustomerFieldForm(onSubmit?: (v: unknown) => void) {
  const { handleSubmit } = useForm({
    validationSchema: toTypedSchema(customFieldSection),
    initialValues: { sections: {} },
  })
  const submit = handleSubmit((v) => {
    return onSubmit?.(v)
  })
  return { submit }
}

export function provideCustomerFieldForm(onSubmit?: (v: unknown) => void) {
  const form = createCustomerFieldForm(onSubmit)
  provide(CustomerFieldFormKey, form)
  // reactive Set 紀錄已註冊 section key，避免重複 useFieldArray 衝突
  provide(SectionRegistryKey, reactive(new Set<string>()))
  return form
}

export function useCustomerFieldForm() {
  const form =
    inject<ReturnType<typeof createCustomerFieldForm>>(CustomerFieldFormKey)
  if (!form) throw new Error('useCustomerFieldForm 必須在 provider 範圍內')
  return form
}

// ===== 每個 Section 內部呼叫，獲得獨立欄位陣列 =====
export function useSectionFields(sectionKey: string) {
  const registry = inject<Set<string>>(SectionRegistryKey)
  if (!registry) throw new Error('useSectionFields 必須在 provider 範圍內')

  // register once to avoid vee-validate key collision
  if (!registry.has(sectionKey)) registry.add(sectionKey)

  const { fields, push, remove, move, update } = useFieldArray<CustomField>(
    `sections.${sectionKey}`
  )
  const addField = (data: {
    isPublic: boolean
    name: string
    fieldType: number
    applyTo: any
    customFieldOptionList?: any
  }) => {
    push({
      isPublic: data.isPublic,
      name: data.name,
      fieldType: data.fieldType,
      applyTo: data.applyTo,
      customFieldOptionList: data.customFieldOptionList,
    })
  }
  const removeField = (idx: number) => {
    remove(idx)
  }
  const swapField = (oldIdx: number, newIdx: number) => {
    return move(oldIdx, newIdx)
  }
  const editField = (idx: number, data: Partial<CustomField>) => {
    update(idx, { ...fields.value[idx], ...data })
  }
  return { fields, addField, removeField, swapField, editField }
}
