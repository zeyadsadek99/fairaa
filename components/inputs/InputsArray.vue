<script setup lang="ts">
import { IconsPlus } from "#build/components";
</script>

<template>
  <VeeForm v-slot="{ values }">
    <FieldArray name="features" v-slot="{ fields, push, remove }">
      <fieldset
        v-for="(field, idx) in fields"
        :key="field.key"
        class="border-b border-border pb-3 mb-3"
      >
        <div class="flex flex-wrap justify-end gap-3">
          <button
            v-if="fields.length > 1"
            type="button"
            class="text-sub"
            @click="remove(idx)"
          >
            <span class="flex flex-wrap gap-1 capitalize">
              <svg-icon name="trash" />
              {{ $t("BUTTONS.delete") }}
            </span>
          </button>
        </div>

        <div class="mb-5 grid md:grid-cols-4 gap-4">
          <base-input
            :label="`${$t('LABELS.Name', { name: $t('LABELS.Feature') })} ${$t(
              'inArabic'
            )}`"
            :id="`features_${idx}_nameAr`"
            :name="`features.${idx}.nameAr`"
            :placeholder="`${$t('LABELS.Name', {
              name: $t('LABELS.Feature'),
            })} ${$t('inArabic')}`"
            type="text"
          />
          <base-input
            :label="`${$t('LABELS.Name', { name: $t('LABELS.Feature') })} ${$t(
              'inEnglish'
            )}`"
            :id="`features_${idx}_nameEn`"
            :name="`features.${idx}.nameEn`"
            :placeholder="`${$t('LABELS.Name', {
              name: $t('LABELS.Feature'),
            })} ${$t('inEnglish')}`"
            type="text"
          />
          <base-input
            :label="`${$t('LABELS.Value')} ${$t('inArabic')}`"
            :id="`features_${idx}_valueAr`"
            :name="`features.${idx}.valueAr`"
            :placeholder="`${$t('LABELS.Name')} ${$t('inArabic')}`"
            type="text"
          />
          <base-input
            :label="`${$t('LABELS.Value')} ${$t('inEnglish')}`"
            :id="`features_${idx}_valueEn`"
            :name="`features.${idx}.valueEn`"
            :placeholder="`${$t('LABELS.Name')} ${$t('inEnglish')}`"
            type="text"
          />
        </div>
      </fieldset>

      <div class="flex flex-wrap justify-end">
        <button
          type="button"
          class="base-btn rounded-md py-3 w-full max-w-[220px] bg-primary/10 border-primary text-primary"
          @click="push({ nameAr: '', nameEn: '', valueAr: '', valueEn: '' })"
        >
          <IconsPlus />
          {{ $t("BUTTONS.Add", { name: $t("LABELS.Feature") }) }}
        </button>
      </div>
    </FieldArray>
  </VeeForm>
</template>
