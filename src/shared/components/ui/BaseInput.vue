<template>
  <div :class="['form-field', { 'has-error': !!error, 'is-disabled': disabled }]">
    <!-- Field Label -->
    <label v-if="label" :for="inputId" class="field-label">
      {{ label }}
      <span v-if="required" class="required-mark" aria-hidden="true">*</span>
    </label>

    <!-- Input Box Wrapper -->
    <div :class="['input-wrapper', { 'is-focused': isFocused }]">
      <!-- Leading Icon / Prefix -->
      <span v-if="$slots.prefix" class="input-prefix">
        <slot name="prefix" />
      </span>

      <!-- Native Input -->
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        class="native-input"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />

      <!-- Clear Button (when value exists and clearable) -->
      <button
        v-if="clearable && modelValue && !disabled && !readonly"
        type="button"
        class="clear-btn"
        aria-label="Bersihkan input"
        @click="clearValue"
      >
        <AppIcon name="x" :size="14" />
      </button>

      <!-- Trailing Icon / Suffix -->
      <span v-if="$slots.suffix" class="input-suffix">
        <slot name="suffix" />
      </span>
    </div>

    <!-- Error Message or Help Text -->
    <div class="field-footer">
      <Transition name="fade-slide">
        <span v-if="error" class="error-text">
          <AppIcon name="alert-circle" :size="12" />
          {{ error }}
        </span>
        <span v-else-if="helpText" class="help-text">
          {{ helpText }}
        </span>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppIcon from '../icons/AppIcon.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: ''
  },
  autocomplete: {
    type: String,
    default: 'off'
  }
})

const emit = defineEmits(['update:modelValue', 'clear'])
const isFocused = ref(false)
const inputId = `input-${Math.random().toString(36).substring(2, 9)}`

const handleInput = (e) => {
  emit('update:modelValue', e.target.value)
}

const clearValue = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.field-label {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.required-mark {
  color: var(--danger-500);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 42px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-app);
  border-radius: var(--radius-md);
  padding: 0 12px;
  transition: all var(--duration-fast) var(--ease-spring);
}

.input-wrapper:hover:not(.is-disabled) {
  border-color: var(--primary-300);
}

.input-wrapper.is-focused {
  border-color: var(--primary-600);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.native-input {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: var(--text-main);
}

.native-input::placeholder {
  color: var(--slate-400);
}

.input-prefix {
  margin-right: 8px;
  color: var(--slate-400);
  display: flex;
  align-items: center;
}

.input-suffix {
  margin-left: 8px;
  color: var(--slate-400);
  display: flex;
  align-items: center;
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  background-color: var(--slate-100);
  color: var(--slate-500);
  margin-left: 6px;
  transition: all var(--duration-fast) ease;
}

.clear-btn:hover {
  background-color: var(--slate-200);
  color: var(--slate-800);
}

/* Error State */
.has-error .input-wrapper {
  border-color: var(--danger-500);
  background-color: #fffafb;
}

.has-error .input-wrapper.is-focused {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.field-footer {
  min-height: 20px;
  margin-top: 4px;
}

.error-text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: var(--danger-600);
}

.help-text {
  font-size: 12px;
  color: var(--text-muted);
}

/* Disabled State */
.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.is-disabled .native-input {
  cursor: not-allowed;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 180ms ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
