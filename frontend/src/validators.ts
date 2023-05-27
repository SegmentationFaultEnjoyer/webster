import {
  required as _required,
  requiredIf as _requiredIf,
  email as _email,
  minLength as _minLength,
  maxLength as _maxLength,
  minValue as _minValue,
  maxValue as _maxValue,
  sameAs as _sameAs,
} from '@vuelidate/validators'
import { ValidationRule } from '@vuelidate/core'
import { Ref } from 'vue'
import { createI18nMessage, MessageProps } from '@vuelidate/validators'
import { get } from 'lodash-es'
import { i18n } from '@/localization'
import { ethers } from 'ethers'

const { t } = i18n.global || i18n

const UrlSymbolsRegex = new RegExp(/^[\w-.~]+$/i)

const messagePath = ({ $validator }: MessageProps) =>
  `validations.field-error_${$validator}`

const withI18nMessage = createI18nMessage({ t, messagePath })

export const required = <ValidationRule>withI18nMessage(_required)

export const requiredIf = (prop: boolean | Ref<boolean>): ValidationRule =>
  <ValidationRule>withI18nMessage(_requiredIf(prop))

export const email = <ValidationRule>withI18nMessage(_email)

export const minLength = (length: number): ValidationRule =>
  <ValidationRule>withI18nMessage(_minLength(length))

export const maxLength = (length: number): ValidationRule =>
  <ValidationRule>withI18nMessage(_maxLength(length))

export const minValue = (
  minValue: number | Ref<number> | string | Ref<string>,
): ValidationRule => {
  return <ValidationRule>withI18nMessage(_minValue(minValue))
}

export const maxValue = (
  maxValue: number | Ref<number> | string | Ref<string>,
): ValidationRule => {
  return <ValidationRule>withI18nMessage(_maxValue(maxValue))
}

export const sameAs = (field: Ref): ValidationRule => {
  return <ValidationRule>withI18nMessage(_sameAs(field, get(field, '_key')))
}

export const urlSymbols = <ValidationRule>withI18nMessage((value: string) => {
  return !value ? true : UrlSymbolsRegex.test(value)
})

export const address = <ValidationRule>withI18nMessage({
  $validator: (address: string) =>
    !address ? true : ethers.utils.isAddress(address),
  $params: {
    type: 'address',
  },
})
